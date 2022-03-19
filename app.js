import flooim from './im/floo-2.0.0.miniprogram.js';

App({
  onLaunch: function () {
    wx.showShareMenu();
  },

  onShow () {
    this.ensureIMLogin();
  },

  onHide () {
    if (this.globalData.im.disConnect) {
      console.log('disconnect onHide ....');
      this.getIM().disConnect();
    }
  },


  globalData: {
    im: {},
    navH: 0,
    // dnsServer: "https://dns.maximtop.com/v2/app_dns",
    appid: "welovemaxim",
    ws: true,
    autoLogin: true
  },

  ensureIMLogin() {
    if( ! this.getIM().isLogin ){
      this.initSDK();
    }

    const im = this.getIM();
    if (im && im.login) {
      const loginInfo = this.getLoginInfo();
      if (loginInfo && loginInfo.username) {
        im.login({
          //TODO: change name to username
          name: loginInfo.username, 
          password: loginInfo.password,
        })
      } else if (loginInfo && loginInfo.user_id) {
        im.idLogin({
          user_id: loginInfo.user_id,
          password: loginInfo.password
        });
      }
    }
  },

  initSDK () {
    const appid = this.getAppid();
    const dnsServer = this.globalData.dnsServer;
    const ws = this.globalData.ws;
    const autoLogin = this.globalData.autoLogin
    console.log("Init flooim for ", appid);
    const config = {
      autoLogin,
      dnsServer,
      appid,
      ws
    }
    const im = flooim(config);
    if (im) {
      this.globalData.im = im;
    }
  },

  getIM() {
    return this.globalData.im;
  },

  getAppid () {
    return this.globalData.appid;
  },

  setupIM( appid ) {
    console.log("Change appid to ", appid);
    this.globalData.appid = appid;
    this.getIM().logout();
    this.globalData.im = {};

    this.ensureIMLogin();
  },

  isIMLogin() {
    const im = this.getIM();
    return im && im.isLogin && im.isLogin();
  },

  saveLoginInfo( info ) {
    wx.setStorageSync('lanying_im_logininfo', info);
  },

  getLoginInfo() {
    return wx.getStorageSync('lanying_im_logininfo') || {};
  },

  imLogout () {
    const info = this.getLoginInfo();
    console.log("IM logout: ", info);
    this.getIM().logout();

    wx.removeStorageSync('lanying_im_logininfo');

    wx.reLaunch({
      url: '../account/login/index',
    })
  },

})
