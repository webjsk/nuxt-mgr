<template>
  <div class="relative w-full">
    <!-- 主图 + 缺口 -->
    <div
      v-if="type === '2'"
      :style="{ height: parseInt(setSize.imgHeight) + vSpace + 'px' }"
      class="w-full overflow-hidden"
    >
      <div
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight,
          maxWidth: '100%',
        }"
        class="relative m-0 border-t border-b border-gray-200 rounded-t box-border w-full"
      >
        <img
          :src="'data:image/png;base64,' + backImgBase"
          alt=""
          class="block w-full h-full"
        />
        <div
          v-show="showRefresh"
          class="absolute top-0 right-0 z-[2] w-8 h-8 flex items-center justify-center cursor-pointer text-white hover:opacity-80"
          @click="refresh"
        >
          <el-icon :size="18"><RefreshRight /></el-icon>
        </div>
        <transition name="tips">
          <span
            v-if="tipWords"
            :class="passFlag ? 'bg-green-500/50' : 'bg-red-500/50'"
            class="absolute bottom-0 left-0 w-full h-[30px] leading-[30px] text-white indent-2 text-sm"
          >
            {{ tipWords }}
          </span>
        </transition>
      </div>
    </div>
    <!-- 滑块条 -->
    <div
      :style="{
        width: setSize.imgWidth,
        height: barSize.height,
        lineHeight: barSize.height,
        maxWidth: '100%',
      }"
      class="verify-bar-area relative w-full text-center bg-white border border-gray-200 rounded-lg box-content mt-1"
    >
      <span class="relative z-[3] verify-msg" v-text="text" />
      <div
        :style="{
          width: leftBarWidth !== undefined ? leftBarWidth : barSize.height,
          height: barSize.height,
          borderColor: leftBarBorderColor,
          transition: transitionWidth,
        }"
        class="verify-left-bar absolute top-0 left-0 cursor-pointer border border-gray-200 rounded-lg box-content overflow-visible"
      >
        <span class="relative z-[3] verify-msg" v-text="finishText" />
        <div
          :style="{
            width: barSize.height,
            height: barSize.height,
            backgroundColor: moveBlockBackgroundColor,
            left: moveBlockLeft,
            transition: transitionLeft,
          }"
          class="verify-move-block absolute top-[-1px] left-[-2px] flex cursor-pointer items-center justify-center bg-white rounded-lg shadow-sm box-content"
          @mousedown="start"
          @touchstart="start"
        >
          <el-icon
            class="verify-icon shrink-0 pointer-events-none"
            :size="18"
            :style="{ color: iconColor }"
          >
            <ArrowRight v-if="iconClass === 'icon-right'" />
            <Check v-else-if="iconClass === 'icon-check'" />
            <Close v-else />
          </el-icon>
          <div
            v-if="type === '2'"
            :style="{
              width: Math.floor((parseInt(setSize.imgWidth) * 47) / 310) + 'px',
              height: setSize.imgHeight,
              top: '-' + (parseInt(setSize.imgHeight) + vSpace + 6) + 'px',
              left: '0',
              backgroundSize: setSize.imgWidth + ' ' + setSize.imgHeight,
            }"
            class="verify-sub-block absolute z-[3] text-center"
          >
            <img
              :src="'data:image/png;base64,' + blockBackImgBase"
              alt=""
              class="block w-full h-full select-none"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup type="text/babel">
/**
 * VerifySlide
 * @description 滑块
 * */
import {
  RefreshRight,
  ArrowRight,
  Check,
  Close,
} from "@element-plus/icons-vue";
import { aesEncrypt } from "./ase";
import { resetSize } from "./util";
import { GetCode, ReqCheck } from "@/api/login";

const props = defineProps({
  /** 预加载的验证码数据（repData），有则 init 时直接使用不请求 */
  initialCaptcha: {
    type: Object,
    default: null,
  },
  captchaType: {
    type: String,
  },
  type: {
    type: String,
    default: "1",
  },
  //弹出式pop，固定fixed
  mode: {
    type: String,
    default: "fixed",
  },
  vSpace: {
    type: Number,
    default: 5,
  },
  explain: {
    type: String,
    default: "",
  },
  imgSize: {
    type: Object,
    default() {
      return {
        width: "100%",
        height: "155px",
      };
    },
  },
  blockSize: {
    type: Object,
    default() {
      return {
        width: "50px",
        height: "50px",
      };
    },
  },
  barSize: {
    type: Object,
    default() {
      return {
        width: "100%",
        height: "30px",
      };
    },
  },
});

const { t } = useI18n();
const { mode, captchaType, type, blockSize, explain } = toRefs(props);
const { proxy } = getCurrentInstance();
let secretKey = ref(""), //后端返回的ase加密秘钥
  passFlag = ref(""), //是否通过的标识
  backImgBase = ref(""), //验证码背景图片
  blockBackImgBase = ref(""), //验证滑块的背景图片
  backToken = ref(""), //后端返回的唯一token值
  startMoveTime = ref(""), //移动开始的时间
  endMovetime = ref(""), //移动结束的时间
  tipWords = ref(""),
  text = ref(""),
  finishText = ref(""),
  setSize = reactive({
    imgHeight: 0,
    imgWidth: 0,
    barHeight: 0,
    barWidth: 0,
  }),
  moveBlockLeft = ref(undefined),
  leftBarWidth = ref(undefined),
  // 移动中样式
  moveBlockBackgroundColor = ref(undefined),
  leftBarBorderColor = ref("#ddd"),
  iconColor = ref(undefined),
  iconClass = ref("icon-right"),
  status = ref(false), //鼠标状态
  isEnd = ref(false), //是够验证完成
  showRefresh = ref(true),
  transitionLeft = ref(""),
  transitionWidth = ref(""),
  startLeft = ref(0),
  /** 缺口在图片中的 y 坐标，用于拼图块垂直对齐 */
  gapY = ref(5);

const barArea = computed(() => {
  return proxy.$el.querySelector(".verify-bar-area");
});
const init = () => {
  if (explain.value === "") {
    text.value = t("captcha.slide");
  } else {
    text.value = explain.value;
  }
  const data = props.initialCaptcha;
  if (data && data.originalImageBase64 && data.jigsawImageBase64) {
    backImgBase.value = data.originalImageBase64;
    blockBackImgBase.value = data.jigsawImageBase64;
    backToken.value = data.token;
    secretKey.value = data.secretKey;
    gapY.value = data.jigsawY ?? 5;
    moveBlockLeft.value = 0;
    leftBarWidth.value = undefined;
  } else {
    getPictrue();
  }
  nextTick(() => {
    let { imgHeight, imgWidth, barHeight, barWidth } = resetSize(proxy);
    setSize.imgHeight = imgHeight;
    setSize.imgWidth = imgWidth;
    setSize.barHeight = barHeight;
    setSize.barWidth = barWidth;
    proxy.$parent.$emit("ready", proxy);
  });

  window.removeEventListener("touchmove", function (e) {
    move(e);
  });
  window.removeEventListener("mousemove", function (e) {
    move(e);
  });

  //鼠标松开
  window.removeEventListener("touchend", function () {
    end();
  });
  window.removeEventListener("mouseup", function () {
    end();
  });

  window.addEventListener("touchmove", function (e) {
    move(e);
  });
  window.addEventListener("mousemove", function (e) {
    move(e);
  });

  //鼠标松开
  window.addEventListener("touchend", function () {
    end();
  });
  window.addEventListener("mouseup", function () {
    end();
  });
};
watch(type, () => {
  init();
});
onMounted(() => {
  // 禁止拖拽
  init();
  proxy.$el.onselectstart = function () {
    return false;
  };
});
//鼠标按下
const start = (e) => {
  e = e || window.event;
  if (!e.touches) {
    //兼容PC端
    var x = e.clientX;
  } else {
    //兼容移动端
    var x = e.touches[0].pageX;
  }
  startLeft.value = Math.floor(x - barArea.value.getBoundingClientRect().left);
  startMoveTime.value = +new Date(); //开始滑动的时间
  if (isEnd.value == false) {
    text.value = "";
    moveBlockBackgroundColor.value = "#337ab7";
    leftBarBorderColor.value = "#337AB7";
    iconColor.value = "#fff";
    e.stopPropagation();
    status.value = true;
  }
};
// 鼠标移动：限制滑块块左边缘在 [0, 条宽-块宽]，既能滑到最右又不影响拖动
const move = (e) => {
  e = e || window.event;
  if (status.value && isEnd.value == false) {
    if (!e.touches) {
      var x = e.clientX;
    } else {
      var x = e.touches[0].pageX;
    }
    var bar_area_left = barArea.value.getBoundingClientRect().left;
    var move_block_left = x - bar_area_left;
    var barWidth = barArea.value.offsetWidth;
    var blockW =
      parseInt(String(blockSize.value.width || barSize.value.height), 10) || 30;
    var halfBlock = Math.floor(blockW / 2);
    if (move_block_left <= halfBlock) {
      move_block_left = halfBlock;
    }
    if (move_block_left >= barWidth - blockW + startLeft.value) {
      move_block_left = barWidth - blockW + startLeft.value;
    }
    var blockLeft = move_block_left - startLeft.value;
    moveBlockLeft.value = blockLeft + "px";
    leftBarWidth.value = blockLeft + "px";
  }
};

//鼠标松开
const end = () => {
  endMovetime.value = +new Date();
  //判断是否重合
  if (status.value && isEnd.value == false) {
    var moveLeftDistance = parseInt(
      (moveBlockLeft.value || "0").replace("px", ""),
    );
    moveLeftDistance = (moveLeftDistance * 310) / parseInt(setSize.imgWidth);
    let data = {
      captchaType: captchaType.value,
      pointJson: secretKey.value
        ? aesEncrypt(
            JSON.stringify({ x: moveLeftDistance, y: gapY.value }),
            secretKey.value,
          )
        : JSON.stringify({ x: moveLeftDistance, y: gapY.value }),
      token: backToken.value,
    };
    ReqCheck(data).then((res) => {
      if (res.repCode == "0000") {
        moveBlockBackgroundColor.value = "#5cb85c";
        leftBarBorderColor.value = "#5cb85c";
        iconColor.value = "#fff";
        iconClass.value = "icon-check";
        showRefresh.value = false;
        isEnd.value = true;
        if (mode.value == "pop") {
          setTimeout(() => {
            proxy.$parent.clickShow = false;
            refresh();
          }, 1500);
        }
        passFlag.value = true;
        tipWords.value = `${((endMovetime.value - startMoveTime.value) / 1000).toFixed(2)}s
              ${t("captcha.success")}`;
        var captchaVerification = secretKey.value
          ? aesEncrypt(
              backToken.value +
                "---" +
                JSON.stringify({ x: moveLeftDistance, y: gapY.value }),
              secretKey.value,
            )
          : backToken.value +
            "---" +
            JSON.stringify({ x: moveLeftDistance, y: gapY.value });
        setTimeout(() => {
          tipWords.value = "";
          proxy.$parent.closeBox();
          proxy.$parent.$emit("success", { captchaVerification });
        }, 1000);
      } else {
        moveBlockBackgroundColor.value = "#d9534f";
        leftBarBorderColor.value = "#d9534f";
        iconColor.value = "#fff";
        iconClass.value = "icon-close";
        passFlag.value = false;
        setTimeout(function () {
          refresh();
        }, 1000);
        proxy.$parent.$emit("error", proxy);
        tipWords.value = t("captcha.fail");
        setTimeout(() => {
          tipWords.value = "";
        }, 1000);
      }
    });
    status.value = false;
  }
};

const refresh = async () => {
  showRefresh.value = true;
  finishText.value = "";

  transitionLeft.value = "left .3s";
  moveBlockLeft.value = 0;

  leftBarWidth.value = undefined;
  transitionWidth.value = "width .3s";

  leftBarBorderColor.value = "#ddd";
  moveBlockBackgroundColor.value = "#fff";
  iconColor.value = "#000";
  iconClass.value = "icon-right";
  isEnd.value = false;

  await getPictrue();
  setTimeout(() => {
    transitionWidth.value = "";
    transitionLeft.value = "";
    text.value = explain.value;
  }, 300);
};

// 请求背景图片和验证图片
const getPictrue = async () => {
  let data = {
    captchaType: captchaType.value,
  };
  const res = await GetCode(data);

  if (res.repCode == "0000") {
    backImgBase.value = res.repData.originalImageBase64;
    blockBackImgBase.value = res.repData.jigsawImageBase64;
    backToken.value = res.repData.token;
    secretKey.value = res.repData.secretKey;
    gapY.value = res.repData.jigsawY ?? 5;
    moveBlockLeft.value = 0;
    leftBarWidth.value = undefined;
  } else {
    tipWords.value = res.repMsg;
  }
};
</script>

<style scoped>
/* 滑块块需作为定位上下文，使拼图块相对其定位并随其移动 */
.verify-move-block {
  position: relative;
}
.verify-msg {
  z-index: 3;
}
.verify-icon {
  font-size: 18px;
}
.tips-enter-from,
.tips-leave-to {
  bottom: -30px;
}
.tips-enter-active,
.tips-leave-active {
  transition: bottom 0.3s ease;
}
</style>
