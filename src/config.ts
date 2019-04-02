const config = {
  serverDomain: 'http://localhost:9013',
  // serverDomain: 'http://10.100.51.107:8180',
  // serverDomain: 'http://10.107.1.225:8180',
  // serverDomain: 'https://wx.itink.com.cn',
  carThumbnailPrevPath: 'http://itink.com.cn/assets/car-icons/',
  miniAppId: 'wxec3b395cda488bce',
  mpAppId: 'wx774b2c7edcde5952',
  reportPrevPath: 'https://wx.itink.com.cn/pages/nosecurity/subscribe'
};

if (process.env.NODE_ENV === 'production' && process.env.TARO_ENV === 'h5') {
  config.serverDomain = '';
}

export default config;
