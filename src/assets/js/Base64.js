const Buffer = require("buffer").Buffer;
const Base64 = {
  /**
   * 将对象编码成 base64 字符串 并且转化成合法URI
   * @param {Object} target
   * @returns
   */
  encode(target) {
    return encodeURIComponent(
      Buffer.from(JSON.stringify(target), "utf-8").toString("base64")
    );
  },
  /**
   * base64 解码 utf-8
   * @param {String} str
   * @returns
   */
  decode(str) {
    return JSON.parse(
      Buffer.from(decodeURIComponent(str), "base64").toString("utf-8")
    );
  },
};
export default Base64;
