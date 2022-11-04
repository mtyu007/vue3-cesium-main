import { createRouter, createWebHashHistory } from "vue-router";
import VueCookies from "vue-cookie";
import { userLoginState } from "../assets/js/api_v2";
import { message } from "ant-design-vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: "Main",
      path: "/",
      component: () => import("../views/MapPage.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  // 检查登录状态
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log("to", to);
  console.log("from", from);
  if (null == userInfo) {
    if (to.name == "Login") {
      next();
    } else {
      if (to.query.info != undefined) {
        localStorage.setItem("queryInfo", to.query.info);
      }
      next({ name: "Login" });
    }
  }
  // 获取cookie中的token，保证cesium前端登录和这里登录一致
  let token = VueCookies.get("token");
  // 获取cookie中的登录状态
  // 解决了cesium端与后台管理端的一致性
  // 前提是cookie得同源
  if (token != userInfo.token) {
    userLoginState().then((res) => {
      if (res.data.code == 200 && res.data.data.role != 1) {
        userInfo = res.data.data;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } else {
        localStorage.removeItem("userInfo");
        VueCookies.remove("token");
        // 这里写死了跳转地址
        window.location = "/#/login";
      }
    })
  }

  // 已经登录了禁止重复登录
  if (to.name == "Login" && null != userInfo) {
    message.error(`您的账号 ${userInfo.username} 已登录系统,将禁止您重复登录`)
    if (from != null) {
      next({ name: from.name });
    } else {
      next({ name: "Main" });
    }
  }

  if (to.query.info == undefined) {
    to.query.info = localStorage.getItem("queryInfo");
    next();
  } else {
    localStorage.setItem("queryInfo", to.query.info);
  }
  next();
});


export default router;
