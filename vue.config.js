const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

let cesiumSource = "./node_modules/cesium/Source";
let cesiumWorkers = "../Build/Cesium/Workers";

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  outputDir: "vue3-cesium", // 打包的目录
  lintOnSave: false, // 在保存时校验格式
  productionSourceMap: false, // 生产环境是否生成 SourceMap
  devServer: {
    proxy: process.env.VUE_APP_BASE_URL,
  },
  chainWebpack: (config) => {
    // 压缩代码
    if (process.env.NODE_ENV != "development") {
      config.optimization.minimize(true);
    }
    // 分割代码
    config.optimization.splitChunks({
      chunks: "all",
    });
    // 用cdn方式引入
    config.externals({
      axios: "axios",
      $: "jquery",
    });
    // 标题
    config.plugin("html").tap((args) => {
      args[0].title = "瑞林环境科技工程实景展示平台";
      return args;
    });
  },
  configureWebpack: {
    output: {
      sourcePrefix: " ",
    },
    amd: {
      toUrlUndefined: true,
    },
    resolve: {
      alias: {
        // '@': path.resolve('src'),
        cesium: path.resolve(__dirname, cesiumSource),
      },
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumSource, cesiumWorkers), to: "Workers" },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: path.join(cesiumSource, "Assets"), to: "Assets" }],
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: path.join(cesiumSource, "Widgets"), to: "Widgets" }],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(cesiumSource, "ThirdParty/Workers"),
            to: "ThirdParty/Workers",
          },
        ],
      }),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("./"),
      }),
    ],
    module: {
      unknownContextCritical: false,
      unknownContextRegExp:
        /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/,
    },
  },
});
