import qs from "qs";

const USER_API = "/api/v2/user";
const VERIFY_API = "/api/v2/verify"

export let CLIENT_NAME = "";

if (process.env.NODE_ENV == "production") {
    CLIENT_NAME = "/vue3-cesium";
    axios.defaults.baseURL = "/mgt-server";
}


/**
 * 管理员登录
 * 这里后面的路由可以根据后端进行配置的
 * project-config.admin-login-router
 * @param {*} query 
 * @returns 
 */
export const login = (query) => {
    return axios.post(`${USER_API}/login`, qs.parse(query));
}

/**
* 获取验证码
*/
export const getVerifyCode = () => {
    return axios.get(`${VERIFY_API}/getCode/base64`);
}

export const userLoginState = (data) => {
    return axios.post(`${USER_API}/state`);
}