<template>
  <div class="wrapper"></div>
  <div class="particles-js-box">
    <div id="particles-js"></div>
  </div>
  <a-form class="login-form" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
    <a-row class="logo-info">
      <a-col :span="4">
        <img src="../../public/image/logo.png" alt="logo" class="logo-img" />
      </a-col>
      <a-col :span="20">
        <div style="color: rgb(255, 255, 255); font-size: 25px; text-align: center; margin: 10px 0px 0px 0px;overflow: hidden;">
          瑞林科技实景展示平台
        </div>
      </a-col>
    </a-row>
    <a-form-item>
      <a-row>
        <a-col :span="24">
          <a-input v-model:value="formState.username" placeholder="请输入用户名">
            <template #prefix><UserOutlined style="color: white" /></template>
          </a-input>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item>
      <a-row>
        <a-col :span="24">
          <a-input-password v-model:value="formState.password" type="password" placeholder="请输入密码">
            <template #prefix><LockOutlined style="color: white" /></template>
          </a-input-password>
        </a-col>
      </a-row>
    </a-form-item>
    <!-- <a-form-item>
      <a-row>
        <a-col :span="16">
          <a-input
            class="verifyCodeInput"
            v-model:value="formState.verifyCode"
            placeholder="请填入验证码(不区分大小写)"
          >
            <template #prefix><VerifiedOutlined style="color: white" /></template>
          </a-input>
        </a-col>
        <a-col :span="8">
          <img class="verifyCode" :src="verifyCode.image" @click="refreshVerifyCode" title="点击切换验证码" />
        </a-col>
      </a-row>
    </a-form-item> -->
    <a-form-item>
      <a-row>
        <a-col :span="1" title="忘记密码，请询问超级管理员重置密码。">
          <QuestionCircleOutlined class="question" />
        </a-col>
        <a-col :span="23">
          <a-button
            class="login-button"
            shape="round"
            type="primary"
            html-type="submit"
            :disabled="formState.user === '' || formState.password === ''"
          >
            登录
          </a-button>
        </a-col>
      </a-row>
    </a-form-item>
  </a-form>
</template>

<script>
import { UserOutlined, LockOutlined, VerifiedOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { defineComponent, onMounted, reactive } from "vue";
import { login, getVerifyCode, CLIENT_NAME } from "../assets/js/api_v2";
import particlesJs from "particles.js";
import particlesConfig from "../assets/json/particles.json";

export default defineComponent({
  setup() {
    const formState = reactive({
      username: "",
      password: "",
      verifyCode: "",
    });

    const verifyCode = reactive({
      image: "",
    });

    const refreshVerifyCode = () => {
      return "no verifyCode needed";
      getVerifyCode().then((res) => {
        if (res.data.code == 200) {
          verifyCode.image = res.data.data;
        }
      });
    };

    const handleFinish = (values) => {
      console.log(values, formState);
      login(formState)
        .then((res) => {
          if (res.data.code == 200) {
            message.success("登录成功");
            localStorage.setItem("userInfo", JSON.stringify(res.data.data));
            window.location = `${CLIENT_NAME}/`;
          } else if (res.data.code == 201) {
            if (res.data.message.indexOf("fail") != -1) {
              message.error("登录失败，账号密码错误");
              formState.password = null;
            } else {
              message.error(res.data.message);
              formState.verifyCode = null;
            }
            refreshVerifyCode();
          }
        })
        .catch(() => {
          message.error("登录失败，服务器错误");
          refreshVerifyCode();
        })
        .finally(() => {});
    };

    const handleFinishFailed = (errors) => {
      console.log(errors);
    };

    const loadJs = (src) => {
      return new Promise((resolve, reject) => {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        document.body.appendChild(script);

        script.onload = () => {
          resolve();
        };
        script.onerror = () => {
          reject();
        };
      });
    };

    onMounted(() => {
      particlesJS("particles-js", particlesConfig);
      refreshVerifyCode();
    });

    return {
      formState,
      verifyCode,
      handleFinish,
      handleFinishFailed,
      refreshVerifyCode,
      particlesJs,
    };
  },

  components: {
    UserOutlined,
    LockOutlined,
    VerifiedOutlined,
    QuestionCircleOutlined,
  },
});
</script>

<style>
.wrapper {
  z-index: -1;
  position: fixed;
  background-image: url("../../public/image/loginBg.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

.login-form {
  text-align: center;
  width: 18%;
  height: 30%;
  backdrop-filter: blur(10px);
  box-shadow:rgba(0,0,0,.3) 0px 0px 25px;
  border-radius: 12px;
  padding: 10px;
  margin-top: 15%;
  margin-left: 40%;
  position: absolute;
  min-width: 345px;
  min-height: 280px;
  background-color: transparent;
  opacity: 0.97;
}

.ant-input-affix-wrapper {
  border-radius: 25px;
  background-color: #2a658a;
  border: none;
  padding: 10px 5px 10px 5px;
}

.ant-input-affix-wrapper input {
  font-size: 15px;
  color: white;
  background-color: transparent !important;;
}

.ant-input-affix-wrapper .ant-input-prefix {
  margin: 0px 5px 0px 10px;
  padding: 3px;
}

.ant-input-affix-wrapper .ant-input-prefix svg {
  width: 20px;
  height: 20px;
}

.ant-input-affix-wrapper .ant-input-suffix {
  margin: 0px 3px 0px 0px;
}

.ant-input-affix-wrapper .ant-input-suffix svg {
  width: 20px;
  height: 20px;
}

.verifyCodeInput {
  border-radius: 25px 0px 0px 25px;
}

.verifyCode {
  width: 100%;
  height: 100%;
}

.verifyCode:hover {
  cursor: pointer;
}

.logo-info {
  margin: 0px 0px 25px 0px;
}

.logo-img {
  width: 100%;
  height: 100%;
}

.login-button {
  background-color: transparent !important;
  color: white !important;
  padding: 5px 30%;
}

.qustion :hover {
  cursor: pointer;
}

.particles-js-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
}
#particles-js {
  width: 100%;
  height: 100%;
}
</style>