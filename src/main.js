import { createApp } from "vue";
import App from "./App.vue";
import "cesium/Widgets/widgets.css";
import axios from "axios";

import "ant-design-vue/dist/antd.css";

import router from "./router/index";

import "@/assets/css/glo.css";

import { Tree, Spin, Typography, Input, Button, Form, Icon, Layout, Space, Row, Col, Divider } from "ant-design-vue";

const app = createApp(App);

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == "production") {
  axios.defaults.baseURL = "/mgt-server";
}

app.use(router).use(Row).use(Col).use(Tree).use(Spin).use(Typography).use(Input).use(Button).use(Form).use(Icon).use(Layout).use(Space).use(Divider).mount("#app");
