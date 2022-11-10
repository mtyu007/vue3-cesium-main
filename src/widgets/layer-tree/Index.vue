<template>
  <div class="sider-show-tree" v-if="!show" @click="changeStatus">
    <svg
      t="1647574279598"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2182"
      width="16"
      height="16"
    >
      <path
        d="M671.968176 911.99957c-12.287381 0-24.576482-4.67206-33.951566-14.047144L286.048434 545.984249c-18.751888-18.719204-18.751888-49.12028 0-67.872168L638.016611 126.111222c18.751888-18.751888 49.12028-18.751888 67.872168 0 18.751888 18.719204 18.751888 49.12028 0 67.872168l-318.016611 318.047574L705.888778 830.047574c18.751888 18.751888 18.751888 49.12028 0 67.872168C696.544658 907.32751 684.255557 911.99957 671.968176 911.99957z"
        p-id="2183"
        fill="#ffffff"
      ></path>
    </svg>
    <span>图层</span>
  </div>
  <div class="header" v-if="show">
    <span class="title">图层</span>
    <svg
      t="1647571572827"
      class="icon-title"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2188"
      width="24"
      height="24"
      @click="changeStatus"
    >
      <path
        d="M761.055557 532.128047c0.512619-0.992555 1.343475-1.823411 1.792447-2.848649 8.800538-18.304636 5.919204-40.703346-9.664077-55.424808L399.935923 139.743798c-19.264507-18.208305-49.631179-17.344765-67.872168 1.888778-18.208305 19.264507-17.375729 49.631179 1.888778 67.872168l316.960409 299.839269L335.199677 813.631716c-19.071845 18.399247-19.648112 48.767639-1.247144 67.872168 9.407768 9.791372 21.984142 14.688778 34.560516 14.688778 12.000108 0 24.000215-4.479398 33.311652-13.439914l350.048434-337.375729c0.672598-0.672598 0.927187-1.599785 1.599785-2.303346 0.512619-0.479935 1.056202-0.832576 1.567101-1.343475C757.759656 538.879828 759.199462 535.391265 761.055557 532.128047z"
        p-id="2189"
        fill="#4db3ff"
      ></path>
    </svg>
  </div>
  <div class="tree-container" v-if="show">
    <!-- 图层下面的内容 如果现实出来的情况 -->
    <div class="content">
      <a-tree
        v-model:checkedKeys="checkedKeys"
        defaultExpandAll
        @select="onNodeSelect"
        @check="lockFunc"
        :tree-data="treeData"
        checkable
        show-line
        show-icon
      >
        <template #folder>
          <!-- 如果隐藏的情况 -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            class="iconify iconify--ph"
            width="14"
            height="14"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 256 256"
            style="color: rgb(219, 152, 41)"
          >
            <path
              fill="currentColor"
              d="M224 64h-69.3l-27.8-20.8a15.6 15.6 0 0 0-9.6-3.2H72a16 16 0 0 0-16 16v16H40a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h152.9a15.2 15.2 0 0 0 15.1-15.1V184h16.9a15.2 15.2 0 0 0 15.1-15.1V80a16 16 0 0 0-16-16Zm0 104h-16v-56a16 16 0 0 0-16-16h-69.3L94.9 75.2a15.6 15.6 0 0 0-9.6-3.2H72V56h45.3l27.8 20.8a15.6 15.6 0 0 0 9.6 3.2H224Z"
            ></path>
          </svg>
        </template>
        <template #layer>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            class="iconify iconify--ph"
            width="14"
            height="14"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 256 256"
            style="color: rgb(121, 193, 248)"
          >
            <path
              fill="currentColor"
              d="M216 40H72a16 16 0 0 0-16 16v16H40a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16v-16h16a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm-32 48v16H40V88Zm32 80h-16V88a16 16 0 0 0-16-16H72V56h144Z"
            ></path>
          </svg>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script>
import {defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import Base64 from "@/assets/js/Base64";
import * as Layer from "../../assets/js/Layer";
import {react} from "@babel/types";
import {hideEarth} from "@/assets/js/cesium_work";
import {appearEarth} from "@/assets/js/cesium_work";


export default defineComponent({
  name: "LayerTree",

  setup() {
    const route = useRoute();

    const project = Base64.decode(route.query.info);

    const treeData = ref([
      {
        title: "底层",
        key: "0",
        slots: {
          icon: "folder",
        },
      },
      {
        title: "倾斜摄影",
        key: "1",
        slots: {
          icon: "folder",
        },
        children: [],
      },
      {
        title: "KML数据",
        key: "2",
        slots: {
          icon: "folder",
        },
        children: [],
      },
      {
        title: "人工建模",
        key: "3",
        slots: {
          icon: "folder",
        },
        children: [],
      },
      {
        title: "全景图",
        key: "4",
        slots: {
          icon: "folder",
        },
        children: [],
      },
      {
        title: "卫星影像",
        key: "5",
        slots: {
          icon: "folder",
        },
        children: [],
      },
      {
        title: "地形",
        key: "6",
        slots: {
          icon: "folder",
        },
        children: [],
      },
    ]);

    const show = ref(true);

    const nodeClickCount = ref([0]);

    const changeStatus = () => {
      show.value = !show.value;
    };

    // key-node映射
    const nodeMap = new Map();

    function lockFunc(checkedKeys, e) {
      console.log("locked")
      e.node.dataRef.loading = true;
      e.node.dataRef.disableCheckbox = true;

      setTimeout(nodeCheck, 100, checkedKeys, e)
    }

    function unlockFunc(e) {
      console.log("unlocked")
      e.node.dataRef.loading = false;
      e.node.dataRef.disableCheckbox = false;
    }

    /**
     * 节点选中
     * @param {*} checkedKeys
     * @param {*} e
     */
    const nodeCheck = (checkedKeys, e) => {
      const key = e.node.eventKey;
      const layer = nodeMap.get(key);

      // 如果底层没有被选中，则隐藏地球
      if (key == '0' && checkedKeys.indexOf('0') == '-1') {
        hideEarth();
      } else if (key == '0' && checkedKeys.indexOf('0') != '-1') {
        // 如果底层被选中了，则显示地球
        appearEarth();
      }

      // 父级节点处理
      if (typeof layer == "undefined") {
        if (e.checked) {
          e.node.children.forEach((c) => {
            let cLayer = nodeMap.get(c.key);
            cLayer.show();
            // 处理关联
            if (cLayer.dataRef.associatedLayer != null) {
              cLayer.dataRef.associatedLayer.show();
            }
          });
        } else {
          e.node.children.forEach((c) => {
            let cLayer = nodeMap.get(c.key);
            cLayer.hide();
            // 处理关联
            if (cLayer.dataRef.associatedLayer != null) {
              cLayer.dataRef.associatedLayer.hide();
            }
          });
        }
      } else {
        // 普通节点处理
        if (e.checked) {
          layer.show();
          // 处理关联
          if (layer.dataRef.associatedLayer != null) {
            layer.dataRef.associatedLayer.show();
          }
        } else {
          layer.hide();
          // 处理关联
          if (layer.dataRef.associatedLayer != null) {
            layer.dataRef.associatedLayer.hide();
          }
        }
      }

      setTimeout(unlockFunc, 1000, e)
    };

    /**
     * 节点点击
     * @param {*} selectedKeys
     * @param {*} e
     */
    const onNodeSelect = (selectedKeys, e) => {
      nodeClickCount.value++;
      //单次点击次数超过2次不作处理,直接返回
      if (nodeClickCount.value >= 2) {
        return;
      }
      // 计时器
      let timer = window.setTimeout(() => {
        if (nodeClickCount.value == 1) {
          // 单击，计数器归零
          nodeClickCount.value = 0;
        } else if (nodeClickCount.value > 1) {
          // 双击，计数器归零
          nodeClickCount.value = 0;
          // 执行定位事件
          nodeMap.get(e.node.eventKey).locate();
        }
      }, 300);
    };

    // 默认选中的key 底层默认选择
    const checkedKeys = ref(['0']);

    /**
     * 处理 osgb 和 terrain 关联
     */
    const handleAssociatedOsgbTerrain = () => {
      nodeMap.forEach((layer) => {
        if (layer instanceof Layer.TerrainLayer) {
          let osgbLayer = nodeMap.get(`0-${layer.dataRef.associatedOsgbId}`);
          if (typeof osgbLayer !== "undefined") {
            osgbLayer.dataRef.associatedLayer = layer;
            layer.dataRef.associatedLayer = osgbLayer;
          }
        }
      });
    };

    /**
     * 默认加载
     */
    const loadDefault = () => {
      // 浏览器获取
      let defaultCheckedKeys = getDefaultCheckedKeysFromLocalStorage();
      if (defaultCheckedKeys != null) {
        defaultCheckedKeys.forEach((key) => {
          let layer = nodeMap.get(key);
          if (typeof layer != "undefined") {
            layer.show();
          }
        });
      } else {
        // 若无缓存，则加载服务器的默认勾选涂层
        nodeMap.forEach((layer) => {
          // 筛选默认加载
          if (layer.dataRef.isChecked == 1) {
            layer.show();
            // 找到关联的对象
            let associatedLayer = layer.dataRef.associatedLayer;
            // show 关联对象
            if (typeof associatedLayer !== "undefined") {
              associatedLayer.show();
            }
          }
        });
      }
    };

    /**
     * 刷新树形结构数据
     */
    const updateTreeData = () => {
      nodeMap.forEach((layer, key) => {
        treeData.value[key.split("-")[0]].children.push(layer.dataRef);
      });
    };

    const removeCheckedKey = (key) => {
      const index = checkedKeys.value.indexOf(key);
      if (index != -1) {
        checkedKeys.value.splice(index, 1);
      }
    };

    const addCheckedKey = (key) => {
      if (!checkedKeys.value.includes(key)) {
        checkedKeys.value.push(key);
      }
    };

    /**
     * 获取图层信息
     * @param {String} url api
     * @param {String} key treeData父节点的key
     * @param {String} dataType 数据类型，kml|tileset|panorama
     */
    const fetchLayerData = (url, key, dataType) => {
      return axios.post(url).then((res) => {
        let data = res.data.data;
        // 包装每一个结点
        data.forEach((d) => {
          d.title = d.name;
          d.key = `${key}-${d.id}`;
          d.slots = { icon: "layer" };
          d.dataType = dataType;
          let layer = Layer.LayerFactory.prototype.getLayer(
            dataType,
            addCheckedKey,
            removeCheckedKey
          );
          // 填充数据
          layer.dataRef = d;
          nodeMap.set(d.key, layer);
        });
      });
    };

    /**
     * 获取默认勾选
     */
    const getDefaultCheckedKeysFromLocalStorage = () => {
      let keys = window.localStorage.getItem("defaultCheckedKeys");

      if (keys != null) {
        return JSON.parse(keys)._value;
      }

      return [];
    };

    /**
     * 定时更新默认勾选
     */
    const defaultCheckedKeysPeriodicUpdate = () => {
      setInterval(() => {
        window.localStorage.setItem(
          "defaultCheckedKeys",
          JSON.stringify(checkedKeys)
        );
      }, 10000);
    };

    const OSGB_DATA_API = "api/v2/osgb/list";
    const KML_DATA_API = "api/v2/kml/list";
    const ARTIFICIAL_DATA_API = "api/v2/artificial/list";
    const PANORAMA_DATA_API = "api/v2/panorama/list";
    const TIFF_DATA_API = "api/v2/tiff/list";
    const TERRAIN_DATA_API = "api/v2/terrain/list";

    onMounted(() => {
      console.log(route);
      // 获取数据
      Promise.all([
        fetchLayerData(
          `${OSGB_DATA_API}/project?projectId=${project.id}`,
          "1",
          "tileset"
        ),
        fetchLayerData(
          `${KML_DATA_API}/project?projectId=${project.id}`,
          "2",
          "kml"
        ),
        fetchLayerData(
          `${ARTIFICIAL_DATA_API}/project?projectId=${project.id}`,
          "3",
          "tileset"
        ),
        fetchLayerData(
          `${PANORAMA_DATA_API}/project?projectId=${project.id}`,
          "4",
          "panorama"
        ),
        fetchLayerData(
          `${TIFF_DATA_API}/project?projectId=${project.id}`,
          "5",
          "tiff"
        ),
        fetchLayerData(
          `${TERRAIN_DATA_API}/project?projectId=${project.id}`,
          "6",
          "terrain"
        ),
      ])
        .then(() => {
          console.log("fetch completed");
        })
        .finally(() => {
          handleAssociatedOsgbTerrain();
          loadDefault();
          // 省事，取巧
          // todo 同步问题待解决
          setTimeout(() => {
            updateTreeData();
          }, 1000);

          defaultCheckedKeysPeriodicUpdate();
        });
    });
    return {
      treeData,
      checkedKeys,
      show,

      changeStatus,
      nodeCheck,
      onNodeSelect,
      lockFunc,
      unlockFunc,
    };
  },
});
</script>

<style scoped>
svg {
  align-self: center;
}
.sider-show-tree {
  position: fixed;
  right: 0;
  top: 120px;
  z-index: 800;
  border: 1px solid #152b51;
  border-radius: 5px 0 0 5px;
  background-color: #4db3ff70;
  color: #fff;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  cursor: pointer;
  user-select: none;
  padding: 5px;
}

.tree-container {
  overflow: hidden;
  width: 275px;
  z-index: 900;
  right: 10px;
  left: initial;
  top: 125px;
  bottom: 60px;
  position: fixed;

  padding: 0;
  border-radius: 4px;
  border: 1px solid #152b51;
  background: linear-gradient(to left, #4db3ff, #4db3ff) left top no-repeat,
  linear-gradient(to bottom, #4db3ff, #4db3ff) left top no-repeat,
  linear-gradient(to left, #4db3ff, #4db3ff) right top no-repeat,
  linear-gradient(to bottom, #4db3ff, #4db3ff) right top no-repeat,
  linear-gradient(to left, #4db3ff, #4db3ff) left bottom no-repeat,
  linear-gradient(to bottom, #4db3ff, #4db3ff) left bottom no-repeat,
  linear-gradient(to left, #4db3ff, #4db3ff) right bottom no-repeat,
  linear-gradient(to left, #4db3ff, #4db3ff) right bottom no-repeat;

  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  background-color: #14141480;

  color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #4db3ff70;
  width: 275px;
  z-index: 999;
  right: 10px;
  left: initial;
  top: 80px;
  position: fixed;

  border: 1px solid #152b51;
  background: linear-gradient(to left, #4db3ff, #4db3ff) left top no-repeat,
  linear-gradient(to bottom, #4db3ff, #4db3ff) left top no-repeat,
  linear-gradient(to left, #4db3ff, #4db3ff) right top no-repeat,
  linear-gradient(to bottom, #4db3ff, #4db3ff) right top no-repeat,
  linear-gradient(to left, #4db3ff, #4db3ff) left bottom no-repeat,
  linear-gradient(to bottom, #4db3ff, #4db3ff) left bottom no-repeat,
  linear-gradient(to left, #4db3ff, #4db3ff) right bottom no-repeat,
  linear-gradient(to left, #4db3ff, #4db3ff) right bottom no-repeat;

  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  background-color: #14141480;

  color: #fff;
}

.icon-title {
  cursor: pointer;
  padding-right: 4px;
}

.title {
  padding-left: 5px;
  user-select: none;
}

.content {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  overflow: hidden;
  display: flex;
  overflow-y: auto;
}
.content::-webkit-scrollbar {
  width: 0;
}
</style>
