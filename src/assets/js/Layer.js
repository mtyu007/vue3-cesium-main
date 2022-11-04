// /**
//  * 抽象接口
//  */
// class Interface {
//   constructor(name, methods) {
//     // 判断接口的参数个数
//     if (arguments.length != 2) {
//       throw new Error('this instance interface constructor axguments must be 2 length!');
//     }
//     this.name = name;
//     this.methods = []; //定义一个内置的空数组对象等待接受methods里的元素(方法名字)
//     for (var i = 0, len = methods.length; i < len; i++) {
//       if (typeof methods[i] !== 'string') {
//         throw new Error('the Interface method name is error! ');
//       }
//       this.methods.push(methods[i]);
//     }
//   }
// }


// var LocatableInterface =  new Interface("LayerInterface", ["show"]);

// import { hideTerrain, loadTerrain, showTerrain } from "./cesium_work";
import * as CesiumWork from "./cesium_work";
import { notification } from "ant-design-vue";

const notify = (msg, des) => {
  notification.open({
    message: msg,
    description: des,
    placement: "bottomRight",
    duration: 3
  });
};

export class Layer {
  constructor(showEvent, hideEvent) {
    this.dataRef = null;
    this.layerObject = null;
    this._hidden = null;
    this.showEvent = showEvent;
    this.hideEvent = hideEvent;
  }

  get hidden() {
    return this._hidden;
  }

  /**
   * @param {boolean} value
   */
  set hidden(value) {
    if (value) {
      if (this.hideEvent != null) {
        this.hideEvent(this.dataRef.key);
      }
    } else {
      if (this.showEvent != null) {
        this.showEvent(this.dataRef.key);
      }
    }
  }

  /**
   * 图层展示函数
   */
  show() { }
  /**
   * 图层隐藏函数
   */
  hide() { }
  /**
   * 定位
   */
  locate() { }

  loadError() {
    console.log("资源的路径:"+this.dataRef.url);
    console.log(this.dataRef.name);
    this.layerObject = null;
    notify("error", `${this.dataRef.name} 加载失败`);
  }

  loadSuccess() {
    console.log(this.dataRef.name);
    notify("Success", `${this.dataRef.name} 加载成功`);
  }
}

export class KmlLayer extends Layer {
  show() {
    if (this.hidden == false) { return; }
    if (this.layerObject != null) {
      CesiumWork.show(this.layerObject);
      this.hidden = false;
    } else {
      CesiumWork.loadKml(this.dataRef.url)
        .then((layerObject) => {
          this.hidden = false;
          this.layerObject = layerObject;
          this.loadSuccess();
        })
        .catch(() => {
          console.log('url:'+this.dataRef.url);
          this.loadError();
        })
    }
  }

  hide() {
    if (this.hidden == true) { return; }
    if (this.layerObject != null) {
      console.log("why not?????")
      CesiumWork.hide(this.layerObject);
      this.hidden = true;
    }
  }

  locate() {
    if (this.layerObject != null) {
      CesiumWork.locate(this.layerObject);
    }
  }
}

export class PanoramaLayer extends Layer {
  show() {
    if (this.hidden == false) { return; }
    if (this.layerObject != null) {
      CesiumWork.show(this.layerObject);
      this.hidden = false;
      this.loadSuccess();
    } else {
      CesiumWork.loadPanorama(this.dataRef.url)
        .then((layerObject) => {
          this.layerObject = layerObject;
          this.hidden = false;
        })
        .catch(() => {
          this.loadError();
        });
    }
  }

  hide() {
    if (this.hidden == true) { return; }
    if (this.layerObject != null) {
      CesiumWork.hide(this.layerObject);
      this.hidden = true;
    }
  }

  locate() {
    if (this.layerObject != null) {
      CesiumWork.locate(this.layerObject);
    }
  }
}

export class TilesetLayer extends Layer {
  show() {
    if (this.hidden == false) { return; }
    if (this.layerObject != null) {
      CesiumWork.show(this.layerObject);
      this.hidden = false;
      this.loadSuccess();
    } else {
      CesiumWork.loadTilesets(this.dataRef.url)
        .then((layerObject) => {
          this.layerObject = layerObject;
          this.hidden = false;
        })
        .catch(() => {
          this.loadError();
        });
    }
  }

  hide() {
    if (this.hidden == true) { return; }
    if (this.layerObject != null) {
      CesiumWork.hide(this.layerObject);
      this.hidden = true;
    }
  }

  locate() {
    if (this.layerObject != null) {
      CesiumWork.locate(this.layerObject);
    }
  }
}

// export class OsgbLayer extends TilesetLayer {

// }

export class TerrainLayer extends Layer {
  show() {
    if (this.hidden == false) { return; }
    if (this.layerObject != null) {
      CesiumWork.showTerrain(this.layerObject);
      this.hidden = false;
      this.loadSuccess();
    } else {
      this.layerObject = CesiumWork.loadTerrain(this.dataRef.url);
      this.hidden = false;
    }
  }

  hide() {
    if (this.hidden == true) { return; }
    if (this.layerObject != null) {
      CesiumWork.hideTerrain();
      this.hidden = true;
    }
  }

  locate() {
    throw new Error("Unsupported method");
  }

}

export class TiffLayer extends Layer {
  show() {
    if (this.hidden == false) { return; }
    if (this.layerObject != null) {
      CesiumWork.show(this.layerObject);
      this.hidden = false;
      this.loadSuccess();
    } else {
      // 加载tiff
      CesiumWork.loadTiff(this.dataRef.url)
        .then((layerObject) => {
          this.layerObject = layerObject;
          this.hidden = false;
        })
        .catch(() => {
          this.loadError();
        });
    }
  }

  hide() {
    if (this.hidden == true) { return; }
    if (this.layerObject != null) {
      CesiumWork.hide(this.layerObject);
      this.hidden = true;
    }
  }

  locate() {
    // if (this.layerObject != null) {
    //   CesiumWork.locate(this.layerObject);
    // }
    throw new Error("Unsupported method");
  }
}

export class LayerFactory {
  getLayer(type, showEvent, hideEvent) {
    switch (type) {
      case "kml": return new KmlLayer(showEvent, hideEvent);
      case "tileset": return new TilesetLayer(showEvent, hideEvent);
      case "panorama": return new PanoramaLayer(showEvent, hideEvent);
      case "tiff": return new TiffLayer(showEvent, hideEvent);
      case "terrain": return new TerrainLayer(showEvent, hideEvent);
      default: return null;
    }
  }
}