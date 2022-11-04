<template>
  <div class="container paper-material s-m" :style="{ width: '240px' }">
    <!-- 标注类 -->
    <!-- 标记点 -->
    <div class="icon-wrapper" @click="markerIconEvent">
      <div class="icon">
        <svg
          viewBox="0 0 24 24"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <g viewBox="0 0 24 24">
            <path
              fill-rule="nonzero"
              d="M12 2a8 8 0 0 1 8 8.2c0 3.3-2.7 7.3-8 11.8-5.3-4.5-8-8.5-8-11.8A8 8 0 0 1 12 2zm6 8.2A6 6 0 0 0 12 4a6 6 0 0 0-6 6.2c0 2.3 2 5.4 6 9.1 4-3.7 6-6.8 6-9.1zM12 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
            ></path>
          </g>
        </svg>
      </div>
    </div>
    <a-divider
      type="vertical"
      style="
        background-color: #fff;
        margin-top: auto;
        margin-bottom: auto;
        height: 20px;
      "
    />
    <!-- 测量类 -->
    <!-- 直线距离 -->
    <div class="icon-wrapper" @click="lineIconEvent">
      <div class="icon">
        <svg
          viewBox="0 0 24 24"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <g viewBox="0 0 24 24">
            <path
              fill-rule="nonzero"
              d="M4.3 10.7l2 2a3 3 0 0 1 1.4-1.4l-2-2a3 3 0 0 1-1.4 1.4zm7.4 2l1-1a3 3 0 0 1-1.4-1.4l-1 1a3 3 0 0 1 1.4 1.4zm3.6-1l3 3a3 3 0 0 1 1.4-1.4l-3-3a3 3 0 0 1-1.4 1.4zM21 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-7-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-5 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-6-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
            ></path>
          </g>
        </svg>
      </div>
    </div>
    <!-- 高度差 -->
    <div class="icon-wrapper" @click="heightIconEvent">
      <div class="icon">
        <svg
          t="1652939343527"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="9743"
          width="16"
          height="16"
        >
          <path
            d="M480 128h-96V96h96v32z m192-32v32h-96V96h96z m192 0v32h-96V96h96z m-192 800v32h-96v-32h96z m192 0v32h-96v-32h96z"
            fill="#ffffff"
            p-id="9744"
          ></path>
          <path
            d="M336 112h-224v800h480v-224h-256v-576z"
            fill="#ffffff"
            p-id="9745"
          ></path>
          <path
            d="M352 672h256v256H96V96h256v576z m224 32h-256V128H128v768h448v-192z"
            fill="#ffffff"
            p-id="9746"
          ></path>
          <path
            d="M320 704h32v96h-32v-96z m128 0h32v96h-32v-96z m-224-32h96v32H224v-32z m0-128h96v32H224v-32z m0-128h96v32H224v-32z m0-128h96v32H224V288z m672-192h32v832h-32V96z"
            fill="#ffffff"
            p-id="9747"
          ></path>
        </svg>
      </div>
    </div>
    <!-- 面积 -->
    <div class="icon-wrapper" @click="drawAreaEvent">
      <div class="icon">
        <svg
          t="1652793587226"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2903"
        >
          <path
            d="M846.2 873.8H163.4c-10.2 0-18.6-8.3-18.6-18.6V172.4c0-10.2 8.3-18.6 18.6-18.6h682.8c10.2 0 18.6 8.3 18.6 18.6v682.8c0 10.3-8.3 18.6-18.6 18.6z m-664.3-37.1h645.7V191H181.9v645.7z"
            p-id="2904"
            fill="#ffffff"
          ></path>
          <path
            d="M200.5 246.7h-74.2c-20.5 0-37.1-16.6-37.1-37.1v-74.2c0-20.5 16.6-37.1 37.1-37.1h74.2c20.5 0 37.1 16.6 37.1 37.1v74.2c0 20.5-16.6 37.1-37.1 37.1zM883.3 246.7h-74.2c-20.5 0-37.1-16.6-37.1-37.1v-74.2c0-20.5 16.6-37.1 37.1-37.1h74.2c20.5 0 37.1 16.6 37.1 37.1v74.2c0 20.5-16.6 37.1-37.1 37.1zM883.3 929.5h-74.2c-20.5 0-37.1-16.6-37.1-37.1v-74.2c0-20.5 16.6-37.1 37.1-37.1h74.2c20.5 0 37.1 16.6 37.1 37.1v74.2c0 20.5-16.6 37.1-37.1 37.1zM200.5 929.5h-74.2c-20.5 0-37.1-16.6-37.1-37.1v-74.2c0-20.5 16.6-37.1 37.1-37.1h74.2c20.5 0 37.1 16.6 37.1 37.1v74.2c0 20.5-16.6 37.1-37.1 37.1zM678.4 707.3H562V539.8c0-12.9-1.4-21.8-4-26.8-2.7-5-7.6-7.5-14.6-7.5-13.1 0-19.6 11.5-19.6 34.6v167.2H407.3V539.8c0-12.9-1.4-21.8-4.2-26.8-2.8-5-7.7-7.5-14.8-7.5-12.9 0-19.3 11.5-19.3 34.6v167.2H252.6V516.2c0-34.9 11.7-64.5 35.2-88.9 23.4-24.4 51.9-36.6 85.3-36.6 34.4 0 65.4 14.5 92.8 43.6 30.5-29 61-43.6 91.5-43.6 38.8 0 69.9 14.1 93.4 42.3 18.5 22 27.7 54.1 27.7 96.2v178.1zM725.9 406.4h54.4c5.4 0 9.5 1.1 12.4 3.3 2.8 2.2 4.3 5.2 4.3 9.1 0 3.4-1.1 6.3-3.4 8.6-2.3 2.4-5.7 3.5-10.3 3.5h-76.6c-5.2 0-9.3-1.4-12.2-4.3-2.9-2.9-4.4-6.3-4.4-10.2 0-2.5 0.9-5.8 2.8-9.9 1.9-4.1 3.9-7.4 6.1-9.7 9.2-9.6 17.6-17.8 25-24.6 7.4-6.8 12.7-11.3 15.9-13.5 5.7-4 10.4-8.1 14.2-12.1s6.7-8.2 8.6-12.5 3-8.5 3-12.5c0-4.4-1.1-8.4-3.2-11.9s-5-6.2-8.6-8.2c-3.6-1.9-7.6-2.9-11.9-2.9-9.1 0-16.2 4-21.5 12-0.7 1-1.9 3.9-3.5 8.5-1.6 4.7-3.5 8.2-5.5 10.7s-5 3.7-9 3.7c-3.5 0-6.4-1.1-8.6-3.4s-3.4-5.4-3.4-9.4c0-4.8 1.1-9.8 3.2-15 2.1-5.2 5.4-9.9 9.6-14.2 4.3-4.2 9.7-7.7 16.2-10.3 6.6-2.6 14.2-3.9 23.1-3.9 10.6 0 19.7 1.7 27.2 5 4.9 2.2 9.1 5.3 12.8 9.2 3.7 3.9 6.5 8.4 8.6 13.5 2 5.1 3.1 10.4 3.1 15.9 0 8.6-2.1 16.4-6.4 23.5-4.3 7-8.6 12.6-13.1 16.6-4.4 4-11.9 10.3-22.3 18.8-10.5 8.5-17.6 15.2-21.5 19.9-1.7 1.8-3.4 4-5.1 6.7z"
            p-id="2905"
            fill="#ffffff"
          ></path>
        </svg>
      </div>
    </div>
    <a-divider
      type="vertical"
      style="
        background-color: #fff;
        margin-top: auto;
        margin-bottom: auto;
        height: 20px;
      "
    />

    <!-- 清除类 -->
    <!-- 点击清除 -->
    <div class="icon-wrapper" @click="removeIconEvent">
      <div class="icon">
        <svg
          t="1652203779533"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3207"
          style="pointer-events: none; display: block; width: 80%; height: 80%"
        >
          <path
            d="M987.428571 268.190476h-950.857142a36.571429 36.571429 0 0 1 0-73.142857H243.809524V73.142857a73.142857 73.142857 0 0 1 73.142857-73.142857h390.095238a73.142857 73.142857 0 0 1 73.142857 73.142857v121.904762h207.238095a36.571429 36.571429 0 0 1 0 73.142857zM707.047619 121.904762a48.761905 48.761905 0 0 0-48.761905-48.761905H365.714286a48.761905 48.761905 0 0 0-48.761905 48.761905v73.142857h390.095238V121.904762zM341.333333 816.761905v-390.095238a36.571429 36.571429 0 0 1 73.142857 0v390.095238a36.571429 36.571429 0 0 1-73.142857 0z m268.190477 0v-390.095238a36.571429 36.571429 0 0 1 73.142857 0v390.095238a36.571429 36.571429 0 0 1-73.142857 0zM158.47619 316.952381a36.254476 36.254476 0 0 1 34.133334 24.380952H195.047619v560.761905a48.761905 48.761905 0 0 0 48.761905 48.761905h536.380952a48.761905 48.761905 0 0 0 48.761905-48.761905V341.333333h2.438095a36.059429 36.059429 0 0 1 68.266667 0h2.438095v609.52381a73.142857 73.142857 0 0 1-73.142857 73.142857H195.047619a73.142857 73.142857 0 0 1-73.142857-73.142857V341.333333h2.438095a36.254476 36.254476 0 0 1 34.133333-24.380952z"
            p-id="3208"
            data-spm-anchor-id="a313x.7781069.0.i13"
          ></path>
        </svg>
      </div>
    </div>
    <!-- 清除所有 -->
    <div class="icon-wrapper" @click="clearIconEvent">
      <div class="icon">
        <svg
          t="1652203671565"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2880"
          style="pointer-events: none; display: block; width: 80%; height: 80%"
        >
          <path
            d="M916.138667 198.4 919.296 195.242667 828.757333 104.704 825.6 107.861333C738.901333 40.533333 630.272 0 512 0 229.205333 0 0 229.290667 0 512 0 630.272 40.448 738.901333 107.861333 825.6L104.704 828.757333 195.157333 919.296 198.4 916.053333C285.013333 983.466667 393.642667 1024 512 1024 794.709333 1024 1024 794.709333 1024 512 1024 393.728 983.466667 285.098667 916.138667 198.4ZM73.130667 512C73.130667 269.994667 269.994667 73.130667 512 73.130667 606.634667 73.130667 721.578667 112.725333 793.344 163.84L177.493333 779.52C126.378667 707.84 73.130667 606.634667 73.130667 512ZM512 950.869333C417.365333 950.869333 307.029333 897.536 235.178667 846.421333L855.637333 226.133333C906.666667 297.898667 950.869333 417.365333 950.869333 512 950.869333 754.005333 754.005333 950.869333 512 950.869333Z"
            p-id="2881"
            data-spm-anchor-id="a313x.7781069.0.i6"
            class="selected"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, defineComponent, watch } from "vue";
import {
  registAddPointClickEvent,
  clearAll,
  registDrawPolygon,
  registDrawLineEvent,
  registclearOnceDraw,
  registMessureHeight,
} from "@/assets/js/cesium_work";
export default defineComponent({
  setup() {
    // 用于标记是否有自定义图层可以移除
    const removable = ref(false);

    //标点事件
    const markerIconEvent = () => {
      registAddPointClickEvent();
    };

    //画线事件
    const lineIconEvent = () => {
      registDrawLineEvent();
    };

    // 高度
    const heightIconEvent = () => {
      registMessureHeight();
    };

    // 绘制面事件
    const drawAreaEvent = () => {
      registDrawPolygon();
    };

    //移除单次操作添加的线或者点
    const removeIconEvent = () => {
      registclearOnceDraw();
    };

    //清除所有绘制的点和线
    const clearIconEvent = () => {
      clearAll();
      removable.value = false;
    };

    return {
      removable,
      markerIconEvent,
      lineIconEvent,
      heightIconEvent,
      drawAreaEvent,
      removeIconEvent,
      clearIconEvent,
    };
  },
});
</script>
<style scoped>
.container {
  display: flex;
  background-color: #2a2b2e;
  z-index: 999;
}
.paper-material {
  border-radius: 8px;
  padding: 0 8px;
}
svg {
  fill: var(--iron-icon-fill-color, currentcolor);
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: block;
}

.icon {
  display: inline-block;
  position: relative;
  padding: 4px;
  color: #e8eaed;
  outline: none;
  border: 1px solid transparent;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  z-index: 0;
  width: 32px;
  height: 32px;
  line-height: 1;
  border-radius: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
  transition: all 0.15s var(--gm2-easing-standard);
  pointer-events: auto;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.s-m .icon {
  display: inline-flex;
  color: white;
  justify-content: center;
  align-items: center;
  transition: 0.4s;
}

.s-m .icon:hover {
  background: #1890ff;
}

.s-m .icon i {
  transition: 0.4s all;
}
</style>
