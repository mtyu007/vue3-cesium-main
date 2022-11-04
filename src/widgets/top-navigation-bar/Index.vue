<template>
  <!-- <div class="toolbar-container">
    <div class="toolbar-left">
      <div class="toolbar-logo">
        <img src="@/assets/image/logo_ruilin.png" />
      </div>
      <div class="title">
        <h4>{{ title }}</h4>
      </div>
    </div>
    <div class="toolbar-right">
      <div class="islogin" v-if="islogin">
        <img src="../../assets/image/login.png" />
      </div>
      <div class="wait-login" v-else>
        <button type="primary" @click="loginIn">登录</button>
      </div>
    </div>
  </div> -->
  <div class="layout">
    <a-typography-title :level="2" class="title">
      <img src="../../assets/image/logo.png" alt="" class="logo" />
      {{ title }}</a-typography-title
    >
    <div class="right" direction="vertical">
      <a-typography-text style="color: white; white-space: nowrap">
        {{ nowTime }}</a-typography-text
      >
      <div class="user">
        <h3 class="user-name" style="display: flex; align-items: center">
          <svg
            t="1652437817160"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1907"
            width="16"
            height="16"
          >
            <path
              d="M283.083845 290.799062c0 126.207423 102.313224 228.5186 228.511437 228.5186 126.2064 0 228.514507-102.311177 228.514507-228.5186 0-126.202307-102.308107-228.51553-228.514507-228.51553C385.390929 62.283532 283.083845 164.596755 283.083845 290.799062L283.083845 290.799062zM647.796314 519.854898c-39.302121 25.200962-86.044702 39.814798-136.202055 39.814798-50.154283 0-96.894817-14.613836-136.197962-39.814798-171.106006 56.998155-294.485011 218.435964-294.485011 408.697239 0 11.157107 0.422625 22.218024 1.254573 33.164331l858.852706 0c0.831948-10.946306 1.255597-22.007223 1.255597-33.164331 0-190.261275-123.372865-351.698061-294.483988-408.697239L647.796314 519.854898zM647.796314 519.854898"
              p-id="1908"
              data-spm-anchor-id="a313x.7781069.0.i1"
              fill="#02b6d4"
              class="selected"
            ></path>
          </svg>
          <span style="margin-left: 3px">{{ userName }}</span>
        </h3>
        <a href="" class="signout" @click="logout">退出</a>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import Base64 from "@/assets/js/Base64";
import VueCookies from "vue-cookie";
import router from "@/router";
export default defineComponent({
  name: "TopBar",

  setup() {
    const route = useRoute();
    const project = Base64.decode(route.query.info);
    const title = ref("瑞林环境科技工程实景展示平台");
    const userName = ref("邱嘉华");
    const islogin = ref(false);
    const loginIn = () => {
      islogin.value = true;
    };

    const nowTime = ref("");

    const timeFormate = (timeStamp) => {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      nowTime.value =
        year + "-" + month + "-" + date + " " + hh + ":" + mm + ":" + ss;
    };

    const logout = () => {
      localStorage.removeItem("userInfo");
      VueCookies.delete("token");
      router.push({ name: "Login" });
    };

    let nowTimes = () => {
      timeFormate(new Date());
      setInterval(nowTimes, 1000);
      clear();
    };
    const clear = () => {
      clearInterval(nowTimes);
      nowTimes = null;
    };
    onBeforeMount(() => {});
    onMounted(() => {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      userName.value = userInfo.username;
      // title.value = `${project.name}`;
      nowTimes();
    });

    return {
      title,
      islogin,
      nowTime,
      userName,
      loginIn,
      logout,
    };
  },
});
</script>

<style scoped>
/* .toolbar-container {
  position: absolute;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 48px;
  line-height: 48px;
  display: flex;
}

.toolbar-left {
  display: flex;
  margin-left: 20px;
  color: #369;
}

.toolbar-right {
  position: absolute;
  display: flex;
  right: 20px;
}
.toolbar-logo > img {
  display: block;
  width: 50px;
  min-width: 45px;
  height: 44px;
  margin-top: calc((48px - 44px) / 2);
}

.title {
  height: 100%;
  padding-left: 24px;
}

.title > h4 {
  color: #1890ff;
  font-weight: 700;
  font-size: large;
  user-select: none;
}

.islogin > img {
  display: block;
  width: 50px;
  min-width: 45px;
  height: 44px;
  margin-top: calc((48px - 44px) / 2);
}

button {
  margin-right: 10px;
  color: #1890ff;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: large;
} */

.layout {
  position: absolute;
  z-index: 1000;
  border-bottom: solid 1px #4db3ff;
  background: rgba(0, 0, 0, 0);
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  background-color: #14141480;
}

.logo {
  background: linear-gradient(0deg, #0095d6, #46daff);
  width: 36px;
  height: 36px;
}

.title {
  user-select: none;
  margin: auto;
  width: 100%;
  align-items: center;
  /* color: #18ace4; */
  background: linear-gradient(0deg, #0095d6, #46daff);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  margin-left: 2%;
}

.right {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-right: 4%;
  justify-content: flex-end;
}

.user {
  display: flex;
  align-content: center;
  justify-content: space-evenly;
}

.user-name {
  height: 22px;
  line-height: 22px;
  font-size: 14px;
  color: #02b6d4;
  cursor: pointer;
}

.signout {
  height: 16px;
  padding: 0 8px;
  border: 1px solid #02b6d4;
  border-radius: 9px;
  line-height: 16px;
  margin-left: 12px;
  margin-top: 3px;
  font-size: 12px;
}
</style>
