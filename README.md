# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

---

## 环境变量说明

以下变量可通过 `.env`、`.env.development`、`.env.production` 等按环境配置，由 Nuxt 的 `runtimeConfig` 统一注入（见 `nuxt.config.ts`）。

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NUXT_PUBLIC_API_BASE` | 接口基础地址 | `https://api-test.xxxx.mx` |
| `NUXT_PUBLIC_TENANT_ENABLE` | 是否启用租户模式（请求头携带 tenant-id） | `true` |
| `NUXT_PUBLIC_APP_TIMEZONE` | 展示与转换用的默认时区（IANA 如 `America/New_York` 或 `Etc/GMT+8`），用于 `app/utils/formatTime.ts` 中的日期格式化 | `Etc/GMT+6` |

不同环境可配置不同 `.env.*`，构建/运行时会自动按环境加载并覆盖默认值。

---

## Icon 组件使用说明

项目内统一通过 **Icon** 组件展示图标，支持多套图标库，避免各处直接引用不同来源的图标。

- **路径**：`app/components/Icon/Icon.vue`
- **用法**：`<Icon icon="ep:home-filled" />`，可选 `size`、`color`、`svgClass` 等 props
- **前缀约定**：
  - `ep:` — Element Plus 图标（如 `ep:setting`、`ep:user`）
  - `fa:` / `fa-solid:` — Font Awesome（通过 Iconify 渲染）
- **图标来源与维护**：可选图标列表在 `app/components/Icon/data.ts` 中维护（用于 IconSelect 等选择器）；新增展示用图标时在该文件中对应前缀下补充名称即可。

---

## 数据字典（DICT_TYPE）与 @/utils/dict

业务中用于「展示与枚举」的字典（如性别、启用/停用、角色类型等）由接口返回，前端通过 **字典 Store + 工具方法** 统一使用。

- **工具路径**：`@/utils/dict`
- **作用**：根据 `dictType` 从字典 Store 中取选项列表，用于表单选项、表格展示、筛选等。
- **常用方法**：
  - `getDictOptions(dictType)` — 返回通用字典项数组（`label` / `value` 等）
  - `getIntDictOptions(dictType)` — 返回 `value` 为数字类型的字典项，便于与后端 number 枚举对接
- **DICT_TYPE 枚举**：在 `@/utils/dict` 中维护 `DICT_TYPE` 枚举，与后端字典类型保持一致，便于类型提示和可持续维护（如 `common_status`、`system_menu_type`、`system_role_type` 等）。新增业务字典时在此枚举中补充对应常量即可。


