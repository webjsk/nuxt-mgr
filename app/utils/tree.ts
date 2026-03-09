/** 树节点（用于 el-tree-select 等） */
export interface Tree {
  id: number
  name: string
  children?: Tree[]
  [key: string]: any
}


export const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export const handleTree = (data: any[], id?: string, parentId?: string, children?: string) => {
    if (!Array.isArray(data)) {
      console.warn('data must be an array')
      return []
    }
    const config = {
      id: id || 'id',
      parentId: parentId || 'parentId',
      childrenList: children || 'children'
    }
  
    const childrenListMap: Record<string, any[]> = {}
    const nodeIds: Record<string, any> = {}
    const tree: any[] = []
  
    for (const d of data) {
      const parentId = d[config.parentId]
      if (childrenListMap[parentId] == null) {
        childrenListMap[parentId] = []
      }
      nodeIds[d[config.id]] = d
      childrenListMap[parentId].push(d)
    }
  
    for (const d of data) {
      const parentId = d[config.parentId]
      if (nodeIds[parentId] == null) {
        tree.push(d)
      }
    }
  
    for (const t of tree) {
      adaptToChildrenList(t)
    }
  
    function adaptToChildrenList(o: any) {
      if (childrenListMap[o[config.id]] !== null) {
        o[config.childrenList] = childrenListMap[o[config.id]]
      }
      if (o[config.childrenList]) {
        for (const c of o[config.childrenList]) {
          adaptToChildrenList(c)
        }
      }
    }
  
    return tree
  }