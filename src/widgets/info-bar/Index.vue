<template>
  <div class="location-info">
    <div class=""></div>
    <div class="content-box">
      <div class="info">纬度: {{ newCameraInfo.longitude }}</div>
      <div class="info">经度: {{ newCameraInfo.latitude }}</div>
      <div class="info">相机高度: {{ newCameraInfo.height }} 米</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      newCameraInfo: {
        latitude: "none",
        longitude: "none",
        height: "none"
      },
    };
  },
  name: "InfoBar",
  mounted() {},
  props: ["cameraInfo"],
  watch: {
    cameraInfo(oval, nval) {
      this.$data.newCameraInfo = nval;
    },
  },
});
</script>

<style scoped>
.location-info {
  position: absolute;
  z-index: 991;
  font-size: 13px;
  color: #e9e9e9;
  text-shadow: 2px 2px 2px #000;
  background-color: rgba(0, 0, 0, 0.4);
  min-height: 26px;
  pointer-events: none;
  left: 0px;
  bottom: 0px;
  width: 100%;
}

.info {
  font-size: 13px;
  color: #e9e9e9;
  text-shadow: 2px 2px 2px #000;
  pointer-events: none;
  float: right;
  margin-right: 20px;
}
</style>
