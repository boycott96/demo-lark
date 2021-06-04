module.exports = {
  devServer: {
    port: 3000,
    proxy: {
      '/v1': {
        target: "http://localhost:8082",
        ws: true,
        changeOrigin: true
      },
      '/open-apis': {
        target: 'https://open.feishu.cn',
        ws: true,
        changeOrigin: true
      }
    }
  },
};
