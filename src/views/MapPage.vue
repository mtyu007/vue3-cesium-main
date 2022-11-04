<template>
  <div id="container">
    <top-bar></top-bar>
    <div id="cesiumContainer"></div>
    <layer-tree></layer-tree>
    <div><info-bar :cameraInfo="cameraInfo"></info-bar></div>
    <tool-bar class="tool-bar"></tool-bar>
  </div>
</template>
<script>
import * as Cesium from "cesium/Cesium";
import LayerTree from "@/widgets/layer-tree/Index.vue";
import TopBar from "@/widgets/top-navigation-bar/Index.vue";
import InfoBar from "@/widgets/info-bar/Index.vue";
import ToolBar from "@/widgets/tool-bar/Index.vue";
import { initViwer } from "@/assets/js/cesium_work";
import { addMouseEnvent } from "@/assets/js/infodisplay";
export default {
  name: "MapPage",
  components: {
    LayerTree,
    InfoBar,
    TopBar,
    ToolBar,
  },
  data() {
    return {
      cameraInfo: "",
    };
  },

  setup() {
    return {
      cesiumConfig: require("../../public/config/cesium_config.json"),
    };
  },

  mounted() {
    Cesium.Ion.defaultAccessToken = this.cesiumConfig.token;

    const viewer = new Cesium.Viewer("container", this.cesiumConfig.viewer);
    console.log("loaded ", viewer);
    initViwer(viewer);

    // moveToEnvent(viewer,this.getInfo);
    addMouseEnvent(viewer, this.getInfo);
    viewer.scene.debugShowFramesPerSecond = true;
    //隐藏cesium图标
    document.getElementsByClassName("cesium-viewer-bottom")[0].style.display =
      "none";
    // this.addClassName();
    this.moveHtml();
  },
  methods: {
    getInfo(data) {
      this.$data.cameraInfo = data;
    },

    //给按钮添加类名以实现样式修改
    // addClassName() {
    //   let buttonList = document.getElementsByClassName(
    //     "cesium-sceneModePicker-wrapper cesium-toolbar-button"
    //   )[0];
    //   for (let i = 0; i < buttonList.childNodes.length; i++) {
    //     buttonList.childNodes[i].className += " modify";
    //   }
    // },
    moveHtml() {
      let fulScreen = document.getElementsByClassName(
        "cesium-viewer-fullscreenContainer"
      )[0];
      let bar = document.getElementsByClassName("cesium-viewer-toolbar")[0];
      bar.appendChild(fulScreen);
    },
  },
  watch: {
    info(val, newval) {
      console.log(val);
      console.log(newval);
    },
  },
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}

@import url("@/assets/css/ratedisplay.css");

.tool-bar {
  position: fixed;
  top: 100px;
  left: 40px;
}
</style>
