"use strict";

import * as Cesium from "cesium/Cesium";
import { fromBlob } from "geotiff";

let _viewer = null;
/**
 * 相机初始化
 * @param {*} viewer
 */
export const initViwer = (viewer) => {
  // 相机定位到home
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      117.7524285281567,
      28.21002342682702,
      4000.0
    ),
  });

  // 设置home button位置
  viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (
    e
  ) {
    e.cancel = true;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        117.7524285281567,
        28.21002342682702,
        4000.0
      ),
    });
  });
  //显示帧率和刷新率
  viewer.scene.debugShowFramesPerSecond = false;

  viewer.scene.globe.depthTestAgainstTerrain = true;
  //相机的高度的最小值
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
  //相机高度的最大值
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000;
  // 设置相机缩小时的速率
  viewer.scene.screenSpaceCameraController._minimumZoomRate = 120;
  //设置相机放大时的速率
  // viewer.scene.screenSpaceCameraController._maximumZoomRate = 5906370;
  //关闭光照
  viewer.scene.globe.enableLighting = false;
  //关闭阴影
  viewer.shadows = false;

  _viewer = viewer;

  // 注册地图点击事件
  clickEvent();

  // 默认地形
  _viewer.terrainProvider = new Cesium.createWorldTerrain({
    requestWaterMask: true,
  });

  _viewer.scene.globe.depthTestAgainstTerrain = true;

};

/**
 * 点击隐藏地球事件
 */
 export const hideEarth = () => {
  _viewer.scene.globe.show = false;
};

/**
 * 重新显示地球事件
 */
 export const appearEarth = () => {
  _viewer.scene.globe.show = true;
};

/**
 * 加载kml资源
 * @param {*} url
 * @returns {Promise}
 */
export const loadKml = (url) => {
  return new Promise((resolve, reject) => {
    let options = {
      camera: _viewer.scene.camera,
      canvas: _viewer.scene.canvas,
      clampToGround: true, //开启贴地
    };
    console.log("贴地成功");
    Cesium.KmlDataSource.load(url, options)
      .then((dataSource) => {
        _viewer.dataSources.add(dataSource);
        resolve(dataSource);
      })
      .otherwise(() => {
        reject(`${url} 资源加载失败`);
      });
  });
};

/**
 * 加载tilesets资源
 * @param {*} url
 * @returns { Promise }
 */
export const loadTilesets = (url) => {
  return new Promise((resolve, reject) => {
    let tileSet = new Cesium.Cesium3DTileset({
      url: url,
    });
    tileSet.readyPromise
      .then((tileset) => {
        _viewer.scene.primitives.add(tileset);
        // tileset预加载
        tileset.preloadWhenHidden = true;
        resolve(tileset);
      })
      .otherwise(() => {
        reject(`${url} 资源加载失败`);
      });
  });
};

/**
 * 加载全景图资源
 * @param {String} name
 */
export const loadPanorama = (name, longitude, latitude, altitude) => {
  return new Promise((resolve) => {
    let entity = _viewer.entities.add({
      name: name,
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
      billboard: {
        image: require("@/assets/image/全景图.png"),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scale: 1,
      },
    });
    resolve(entity);
  });
};

/**
 * 隐藏图层
 * @param {*} entity
 */
export const hide = (entity) => {
  entity.show = false;
};

export const show = (entity) => {
  entity.show = true;
};

/**
 * 显示目标地形
 * @param {*} ter
 */
export const showTerrain = (ter) => {
  ter.readyPromise.then((ready) => {
    if (ready) _viewer.terrainProvider = ter;
  });
};

/**
 * 隐藏加载的地形
 * 恢复成默认地形
 */
export const hideTerrain = () => {
  _viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
  // _viewer.terrainProvider = new Cesium.createWorldTerrain({
  //   requestWaterMask: true,
  // });
};

/**
 * 相机定位到目标
 * @param {*} target
 */
export const locate = (target) => {
  _viewer.flyTo(target, {
    offset: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-45),
    },
  });
};

const tiffToImage = async (blob) => {
  const tiff = await fromBlob(blob);

  let image = await tiff.getImage();

  let [west, south, east, north] = image.getBoundingBox();

  // 读取像素信息
  const [red = [], green = [], blue = []] = await image.readRasters();

  // 将像素信息写入canvas
  const canvas = document.createElement("canvas");
  let width = image.getWidth();
  let height = image.getHeight();
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext("2d");
  let imageData = ctx.createImageData(width, height);

  for (let i = 0; i < imageData.data.length / 4; i++) {
    imageData.data[i * 4 + 0] = red[i];
    imageData.data[i * 4 + 1] = green[i] || 0;
    imageData.data[i * 4 + 2] = blue[i] || 0;
    imageData.data[i * 4 + 3] = red[i] === 0 ? 0 : 255;
  }

  ctx.putImageData(imageData, 0, 0);

  let rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
  let du = canvas.toDataURL();

  let layer = new Cesium.SingleTileImageryProvider({
    url: du,
    rectangle,
  });

  // _viewer.camera.setView({
  //   destination: rectangle,
  // });

  return _viewer.imageryLayers.addImageryProvider(layer);
};

/**
 * 加载tiff类型数据
 * @param {*} url
 */
export const loadTiff = (url, start, end) => {
  return new Promise((resolve, reject) => {
    let layer = new Cesium.TileMapServiceImageryProvider({
      url: url,
    });
    layer.readyPromise
      .then((isReady) => {
        if (isReady) {
          resolve(_viewer.imageryLayers.addImageryProvider(layer));
        }
      })
      .otherwise(() => {
        reject(`${url} 资源加载失败`);
      });
  });
};

/**
 * 加载地形
 * @param {*} url
 * @returns
 */
export const loadTerrain = (url) => {
  let ter = new Cesium.CesiumTerrainProvider({
    url: url,
  });
  showTerrain(ter);
  return ter;
};

/**
 * 对应模型为全景图的双击事件
 */
export const clickEvent = () => {
  var handler3D = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
  handler3D.setInputAction(function (click) {
    var pick = _viewer.scene.pick(click.position);
    if (pick) {
      if (pick.id.type == "panorama") {
        window.open(pick.id.url);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};

class Shape {
  constructor(points, lines, lables, polygons) {
    //每一次绘制中线段的实体集合
    this.lines = lines;
    //每一次绘制中点的实体集合
    this.points = points;
    //显示距离的标签集合
    this.lables = lables;
    //显示平面实体集合
    this.polygons = polygons;
  }
  //添加一个点
  addPoint(point) {
    this.points.push(point);
  }
  //添加一条线段
  addLine(line) {
    this.lines.push(line);
  }
  //添加一条距离标签
  addLable(lable) {
    this.lables.push(lable);
  }

  //添加一条距离标签
  addPolygon(polygon) {
    this.polygons.push(polygon);
  }

  isInlines(entity) {
    for (let index = 0; index < this.lines.length; index++) {
      const element = this.lines[index];
      if (entity.id._id == element._id) {
        return true;
      }
    }
    return false;
  }


  isInPolygon(entity) {
    for (let index = 0; index < this.polygons.length; index++) {
      const element = this.polygons[index];
      if (entity.id._id == element._id) {
        return true;
      }
    }
    return false;
  }


  //移除本次绘制的所有点和线
  clear(viewer) {
    this.points.forEach((element) => {
      viewer.entities.remove(element);
    });
    this.lines.forEach((element) => {
      viewer.entities.remove(element);
    });
    this.lables.forEach((element) => {
      viewer.entities.remove(element);
    });
    this.polygons.forEach((element) => {
      viewer.entities.remove(element);
    });
  }
}

var clampConfig = [{
  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
}, {
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
}, {
  heightReference: Cesium.HeightReference.NONE,
}];

var clampChoice = 2;


//画线所需的临时点集合
var activeShapePoints = [];

//实时绘制的临时点或线或面
var activeShape;

//当前鼠标位置的点
var floatingPoint;

//绘制类形分为line线和polygon平面
var drawingMode = "line";
//每一次绘制的临时图形（点、线或面的集合）
var tempShape = new Shape(new Array(), new Array(), new Array(), new Array());

//最终所有绘制图形的集合
var tempDrawList = [];

//临时标注点实体集合
var points = [];

//事件处理器
var handler = null;
var activeLable;


function clearAllHandler(handler) {
  handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/*
 * 清除所有绘制的临时点和线
 */
export const clearAll = () => {
  clearAllHandler(handler);
  points.forEach(element => {
    _viewer.entities.remove(element)
  });
  tempDrawList.forEach(element => {
    element.clear(_viewer);
  });
  tempDrawList = [];
}


/**
 * 注册添加标注点的左键点击事件
 */
export const registAddPointClickEvent = () => {
  $(".cesium-widget").css("cursor", "pointer");
  if (handler == null) {
    handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
  }
  clearAllHandler(handler);
  terminateShape();
  handler.setInputAction(function (e) {
    let info = prompt(
      "请输入标注信息: ",
      ""
    ); /*第一个变量为提示语，第二个变量为默认初始值*/
    if (info != null && info != "") {
      createPointWithInfo(transform(e.position), info);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(function (e) {
    $(".cesium-widget").css("cursor", "default");
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

/**
 * 注册绘制线段事件
 */
export const registDrawLineEvent = () => {
  if (handler == null) {
    handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
  }
  clearAllHandler(handler);
  $(".cesium-widget").css("cursor", "crosshair");
  drawingMode = "line";
  handler.setInputAction(function (event) {
    const earthPosition = _viewer.scene.pickPosition(event.position);
    if (Cesium.defined(earthPosition)) {
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition);
        activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          return activeShapePoints;
        }, false);
        activeShape = drawShape(dynamicPositions);
      }
      activeShapePoints.push(earthPosition);
      createPoint(earthPosition);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  //注册鼠标移动事件
  handler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint)) {
      const newPosition = _viewer.scene.pickPosition(event.endPosition);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
        if (activeShapePoints.length >= 2) {
          activeLable = showLengthLable();
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  //右键停止画线
  handler.setInputAction(function (event) {
    terminateShape();
    // 修改指针样式
    $(".cesium-widget").css("cursor", "default");
    clearAllHandler(handler);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

/**
 * 注册清除一次绘制事件
 */
export const registclearOnceDraw = () => {
  $(".cesium-widget").css("cursor", "-webkit-grab");
  if (handler == null) {
    handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
  }
  clearAllHandler(handler);
  terminateShape();
  handler.setInputAction(function (event) {
    const pick = _viewer.scene.pick(event.position);
    if (Cesium.defined(pick)) {
      if (pick.id.shapeType == "tempPoint") {
        _viewer.entities.remove(
          _viewer.entities.getById(pick.id._id)
        );
      }
      if (pick.id.shapeType == "tempLine") {
        tempDrawList.forEach(element => {
          if (element.isInlines(pick) == true) {
            element.clear(_viewer);
          }
        });
      }
      if (pick.id.shapeType == "tempPolygon") {
        tempDrawList.forEach(element => {
          if (element.isInPolygon(pick) == true) {
            element.clear(_viewer);
          }
        });
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(function (e) {
    $(".cesium-widget").css("cursor", "default");
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

/**
 * 注册绘制平面事件
 */
export const registDrawPolygon = () => {
  if (handler == null) {
    handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
  }
  $(".cesium-widget").css("cursor", "crosshair");
  clearAllHandler(handler);
  drawingMode = "polygon";
  handler.setInputAction(function (event) {
    const earthPosition = _viewer.scene.pickPosition(event.position);
    if (Cesium.defined(earthPosition)) {
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition);
        activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          if (drawingMode === "polygon") {
            return new Cesium.PolygonHierarchy(activeShapePoints);
          }
          return activeShapePoints;
        }, false);
        activeShape = drawShape(dynamicPositions);
      }
      activeShapePoints.push(earthPosition);
      createPoint(earthPosition);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  //注册鼠标移动事件
  handler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint)) {
      const newPosition = _viewer.scene.pickPosition(event.endPosition);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  //右键停止画面
  handler.setInputAction(function (event) {
    terminateShape();
    // 修改指针样式
    $(".cesium-widget").css("cursor", "default");
    clearAllHandler(handler);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

//注册测量高度差事件
export const registMessureHeight = () => {
  if (handler == null) {
    handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
  }
  clearAllHandler(handler);
  $(".cesium-widget").css("cursor", "crosshair");
  drawingMode = "messureHeight";
  let count = 0;
  handler.setInputAction(function (event) {
    const earthPosition = _viewer.scene.pickPosition(event.position);
    if (Cesium.defined(earthPosition)) {
      count++;
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition);
        activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          return activeShapePoints;
        }, false);
        activeShape = drawShape(dynamicPositions);
      }
      activeShapePoints.push(earthPosition);
      createPoint(earthPosition);
    }
    if (count == 2) {
      terminateShape();
      // 修改指针样式
      $(".cesium-widget").css("cursor", "default");
      clearAllHandler(handler);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  //注册鼠标移动事件
  handler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint)) {
      const newPosition = _viewer.scene.pickPosition(event.endPosition);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
        if (activeShapePoints.length >= 2) {
          activeLable = showHeightDifference()
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  //右键停止画线
  handler.setInputAction(function (event) {
    terminateShape();
    // 修改指针样式
    $(".cesium-widget").css("cursor", "default");
    clearAllHandler(handler);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

//将一次绘制的临时存储复原
function recovery() {
  _viewer.entities.remove(floatingPoint);
  _viewer.entities.remove(activeShape);
  _viewer.entities.remove(activeLable);
  floatingPoint = undefined;
  activeShape = undefined;
  activeShapePoints = [];
  activeLable = undefined;
  tempShape = new Shape(new Array(), new Array(), new Array(), new Array());
}

/**
 * 在右键点击后将最后没有确定的点去除，并且绘制经过所有确定的点线，并重置绘制点
 */
function terminateShape() {
  if (drawingMode == "line") {
    if (tempShape.points.length > 2) {
      addLengthLable();
      activeShapePoints.pop();
      tempShape.addLine(drawShape(activeShapePoints))
      tempDrawList.push(tempShape);
    } else {
      tempShape.clear(_viewer)
    }
  }
  if (drawingMode == "polygon") {
    if (tempShape.points.length > 3) {
      activeShapePoints.pop();
      tempShape.addPolygon(drawShape(activeShapePoints))
      tempShape.addLable(showArea());
      tempDrawList.push(tempShape);
    } else {
      tempShape.clear(_viewer)
    }
  }
  if (drawingMode == "messureHeight") {
    if (tempShape.points.length > 2) {
      addHeightDifference();
      activeShapePoints.pop();
      tempShape.addLine(drawShape(activeShapePoints))
      tempDrawList.push(tempShape);
    }
    else {
      tempShape.clear(_viewer)
    }
  }
  //将数据复原
  recovery();
}

/**
 * 根据两个点坐标在鼠标移动时展示高度差
 * @param {起点坐标} start 
 * @param {终点坐标} end 
 */
function showHeightDifference() {
  _viewer.entities.remove(activeLable);
  const label = _viewer.entities.add({
    name: "高度差",
    position: new Cesium.CallbackProperty(getMidpoint, false),
    label: {
      text: new Cesium.CallbackProperty(calculateHeightDifference, false),
      font: "18px sans-serif",
      fillColor: Cesium.Color.GOLD,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(20, -40),
      disableDepthTestDistance: 50000,
      heightReference: clampConfig[clampChoice].heightReference,
    },
  });
  return label;
}


/**
 * 根据两个点坐标在鼠标移动时展示高度差
 * @param {起点坐标} start 
 * @param {终点坐标} end 
 */
function addHeightDifference() {
  for (let index = 0; index < activeShapePoints.length - 2; index++) {
    const start = activeShapePoints[index];
    const end = activeShapePoints[index + 1]
    const label = _viewer.entities.add({
      name: "高度差",
      position: end,
      label: {
        text: calculateHeightDifference(start, end, 1),
        font: "18px sans-serif",
        fillColor: Cesium.Color.GOLD,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        disableDepthTestDistance: 50000,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(20, -40),
        heightReference: clampConfig[clampChoice].heightReference,
      },
    });
    tempShape.addLable(label);
  }
}

/**
 * 根据两个点坐标计算高度差
 * @param {起点坐标} start 
 * @param {终点坐标} end 
 */
function calculateHeightDifference(start, end, type) {
  let len = activeShapePoints.length;
  if (len < 2) {
    return;
  }
  let cartographic;
  let cartographic1;
  cartographic = Cesium.Cartographic.fromCartesian(activeShapePoints[len - 2]);
  cartographic1 = Cesium.Cartographic.fromCartesian(activeShapePoints[len - 1]);
  if (type == 1) {
    cartographic = Cesium.Cartographic.fromCartesian(start);
    cartographic1 = Cesium.Cartographic.fromCartesian(end);
  }
  let height = cartographic1.height - cartographic.height;
  return `高度差:${height.toFixed(2)}米`
}




//根据坐标集合绘制线
function drawShape(positionData) {
  let shape;
  _viewer.entities.remove(activeShape)

  if (drawingMode === "line" || drawingMode === "messureHeight") {
    shape = _viewer.entities.add({
      polyline: {
        positions: positionData,
        material: Cesium.Color.YELLOW,
        width: 3,
      },
    });
    shape['shapeType'] = "tempLine";
  }
  else if (drawingMode === "polygon") {
    shape = _viewer.entities.add({
      polygon: {
        hierarchy: positionData,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.WHITE.withAlpha(0.7)
        ),
      },
    });
    console.log(shape)
    shape['shapeType'] = "tempPolygon";
  }
  return shape;
}

/**
 * 将点击事件获取到的坐标进行转换,转换为绘制点或线所需要的坐标
 * @param {点击事件获取的坐标} position 
 * @returns 经过转换后的坐标
 */
const transform = (position) => {
  let scene = _viewer.scene;
  let cartesian = null;
  let pickedObject = scene.pick(position); //判断是否拾取到模型
  if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
    //如果点击的地方是模型，其坐标无需进行转换
    cartesian = _viewer.scene.pickPosition(position);
  } else {
    //不是模型，进行坐标转换
    cartesian = _viewer.scene.camera.pickEllipsoid(
      position,
      _viewer.scene.globe.ellipsoid
    );
  }
  return cartesian;
};

/**
 * 根据坐标在地图上绘制点
 * @param {所要添加标注点的坐标} position 
 * @returns 添加的标注点实体对象
 */
const createPoint = (position) => {
  let entity = new Cesium.Entity({
    position: position,
    point: {
      color: Cesium.Color.RED,
      pixelSize: 10,
      heightReference: clampConfig[clampChoice].heightReference,
    },
  });
  _viewer.entities.add(entity);
  tempShape.addPoint(entity);
  return entity;
};

/**
 *  创建带有lable信息的标注点
 * @param {所要添加标注点的坐标} position 
 * @param {添加标注点的信息} info 
 */
const createPointWithInfo = (position, info) => {
  let entity = new Cesium.Entity({
    position: position,
    point: {
      color: Cesium.Color.SKYBLUE,
      pixelSize: 10,
      outlineColor: Cesium.Color.YELLOW,
      outlineWidth: 3,
      disableDepthTestDistance: 50000,
      heightReference: clampConfig[clampChoice].heightReference,
    },
    label: {
      text: info,
      font: "9pt Source Han Sans CN", //字体样式
      fillColor: Cesium.Color.BLACK, //字体颜色
      backgroundColor: Cesium.Color.AQUA, //背景颜色
      showBackground: true, //是否显示背景颜色
      style: Cesium.LabelStyle.FILL, //label样式
      outlineWidth: 2,
      heightReference: clampConfig[clampChoice].heightReference,
      disableDepthTestDistance: 50000,
      pixelOffset: new Cesium.Cartesian2(30, 0),
      eyeOffset: new Cesium.Cartesian3(0.0, 0.0, -100.0)
    },
  });
  entity["shapeType"] = "tempPoint";  //在绘制的点的实体中添加属性标记其为临时点
  _viewer.entities.add(entity);
  points.push(entity);
};




/**
 * @returns 返回带有两点之间公里数的html
 */
function getLength(start, end, type) {
  // Get the end position from the polyLine's callback.
  if (activeShapePoints.length < 2) { return; }
  let startPoint = activeShapePoints[activeShapePoints.length - 2];
  let endPoint = activeShapePoints[activeShapePoints.length - 1];
  if (type == 1) {
    startPoint = start;
    endPoint = end;
  }
  const geodesic = new Cesium.EllipsoidGeodesic();
  const startCartographic = Cesium.Cartographic.fromCartesian(startPoint);
  const endCartographic = Cesium.Cartographic.fromCartesian(endPoint);

  geodesic.setEndPoints(startCartographic, endCartographic);
  const lengthInMeters = Math.round(geodesic.surfaceDistance);
  if (lengthInMeters < 1000) {
    return `${lengthInMeters} m`;
  } else {
    return `${(lengthInMeters / 1000).toFixed(3)} km`;
  }
}


/**
 * 
 * @param {*} start 起点坐标 
 * @param {*} end 终点坐标
 * @param {*} type 决定是回调临时绘制还是type==1右键确认后最终绘制
 * @returns 
 */
function getMidpoint(start, end, type) {
  if (activeShapePoints.length < 2) { return; }
  let startPoint = activeShapePoints[activeShapePoints.length - 2];
  let endPoint = activeShapePoints[activeShapePoints.length - 1];
  if (type == 1) {
    startPoint = start;
    endPoint = end;
  }
  const scratch = new Cesium.Cartographic();
  const geodesic = new Cesium.EllipsoidGeodesic();
  const startCartographic = Cesium.Cartographic.fromCartesian(startPoint);
  const endCartographic = Cesium.Cartographic.fromCartesian(endPoint);

  geodesic.setEndPoints(startCartographic, endCartographic);
  const midpointCartographic = geodesic.interpolateUsingFraction(
    0.5,
    scratch
  );
  return Cesium.Cartesian3.fromRadians(
    midpointCartographic.longitude,
    midpointCartographic.latitude
  );
}




function showLengthLable() {
  _viewer.entities.remove(activeLable);
  const label = _viewer.entities.add({
    position: new Cesium.CallbackProperty(getMidpoint, false),
    label: {
      text: new Cesium.CallbackProperty(getLength, false),
      font: "20px sans-serif",
      heightReference: clampConfig[clampChoice].heightReference,
      pixelOffset: new Cesium.Cartesian2(0.0, 20),
      eyeOffset: new Cesium.Cartesian3(0, 0, -100),
      disableDepthTestDistance: 50000,
    },
  });
  return label;
}


function addLengthLable() {
  for (let index = 0; index < activeShapePoints.length - 2; index++) {
    const start = activeShapePoints[index];
    const end = activeShapePoints[index + 1]
    const label = _viewer.entities.add({
      position: end,
      label: {
        text: getLength(start, end, 1),
        font: "20px sans-serif",
        heightReference: clampConfig[clampChoice].heightReference,
        pixelOffset: new Cesium.Cartesian2(0.0, -30),
        eyeOffset: new Cesium.Cartesian3(0, 0, -100),
        disableDepthTestDistance: 50000
      },
    });
    tempShape.addLable(label);
  }
}


//计算多边形面积
function getArea(points) {
  var res = 0;
  //拆分三角曲面
  for (var i = 0; i < points.length - 2; i++) {
    var j = (i + 1) % points.length;
    var k = (i + 2) % points.length;
    var totalAngle = Angle(points[i], points[j], points[k]);
    var dis_temp1 = distance(activeShapePoints[i], activeShapePoints[j]);
    var dis_temp2 = distance(activeShapePoints[j], activeShapePoints[k]);
    res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
  }
  return (res / 1000000.0).toFixed(4);
}

/*角度*/
function Angle(p1, p2, p3) {
  var bearing21 = Bearing(p2, p1);
  var bearing23 = Bearing(p2, p3);
  var angle = bearing21 - bearing23;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}
/*方向*/
var radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度
function Bearing(from, to) {
  var lat1 = from.lat * radiansPerDegree;
  var lon1 = from.lon * radiansPerDegree;
  var lat2 = to.lat * radiansPerDegree;
  var lon2 = to.lon * radiansPerDegree;
  var angle = -Math.atan2(
    Math.sin(lon1 - lon2) * Math.cos(lat2),
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
  );
  if (angle < 0) {
    angle += Math.PI * 2.0;
  }
  angle = angle * degreesPerRadian; //角度
  return angle;
}

function distance(point1, point2) {
  var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
  var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
  /**根据经纬度计算出距离**/
  var geodesic = new Cesium.EllipsoidGeodesic();
  geodesic.setEndPoints(point1cartographic, point2cartographic);
  var s = geodesic.surfaceDistance;
  //返回两点之间的距离
  s = Math.sqrt(
    Math.pow(s, 2) +
    Math.pow(point2cartographic.height - point1cartographic.height, 2)
  );
  return s;
}

function showArea() {
  let transformPositions = [];
  for (let index = 0; index < activeShapePoints.length; index++) {
    const element = activeShapePoints[index];
    let cartographic = Cesium.Cartographic.fromCartesian(element);
    let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
    let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
    let heightString = cartographic.height;
    transformPositions.push({
      lon: longitudeString,
      lat: latitudeString,
      hei: heightString,
    });
  }
  let textArea = getArea(transformPositions) + "平方公里";
  const label = _viewer.entities.add({
    name: "多边形面积",
    position: activeShapePoints[activeShapePoints.length - 1],
    label: {
      text: textArea,
      font: "18px sans-serif",
      fillColor: Cesium.Color.GOLD,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0.0, -40),
      eyeOffset: new Cesium.Cartesian3(0, 0, -100),
      disableDepthTestDistance: 50000,
      heightReference: clampConfig[clampChoice].heightReference,
    },
  });
  return label;
}