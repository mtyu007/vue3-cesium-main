import * as Cesium from "cesium/Cesium";
var data;
const moveToEnvent = function moveToEnvent(viewer, getinfo) {
  viewer.camera.moveEnd.addEventListener(() => {
    // console.log(viewer.camera)
    let latitude = viewer.camera._positionCartographic.latitude
    let longitude = viewer.camera._positionCartographic.longitude
    let height = viewer.camera.positionCartographic.height
    data = { height: height, latitude: latitude, longitude: longitude }
    getinfo(data)
  })
};

const addMouseEnvent = function mouseEnvent(viewer, getinfo) {
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  handler.setInputAction(function (movement) {
    var cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
    var ellipsoid = viewer.scene.globe.ellipsoid;
    if (cartesian) { //能获取，显示坐标
      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      let latitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8)
      let longitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8)
      let height = Math.ceil(viewer.camera.positionCartographic.height)
      data = { height: height, latitude: latitude, longitude: longitude }
      getinfo(data)
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

}


export {
  moveToEnvent, addMouseEnvent
}

