//index.js
//获取应用实例

Page({
  data: {
    sname: '',
    spass: '',
    appid: "",
    /////
    ratelOk: false,
    authCode: '',
    navHeight: 0,
  },
  onLoad: function () {
    const appid = getApp().getAppid();
    this.setData({ appid });
    this.setData({ navHeight: getApp().globalData.navH });

    const im = getApp().getIM();
    if ( im ) {
      im.on('loginSuccess', this.onLogin);
      im.on('loginerror', this.onLoginFailure);
    }
  },

  bindHandler () { // 点击登录
    if (!this.data.sname || !this.data.spass) {
      wx.showToast({
        title: '请输入信息!',
      })
      return;
    } else {
      wx.showLoading({
        title: '登录中',
      })
      
      getApp().saveLoginInfo({
        username: this.data.sname,
        password: this.data.spass,
      });
      getApp().ensureIMLogin();
    }
  },

  appidTapHandler () {
    this.selectComponent('#prompt').showPrompt();
  },

  confirm (p) {
    const { value } = p.detail;
    this.setData({
      ratelOk: false,
      authCode: '',
      appid: value,
    })
    
    getApp().setupIM( value );
    const im = getApp().getIM();
    if ( im ) {
      im.on('loginSuccess', this.onLogin);
      im.on('loginerror', this.onLoginFailure);
    }
  },

  nameHandler (evt) {
    const sname = evt.detail.value;
    this.setData({ sname });
  },

  passHandler (evt) {
    const spass = evt.detail.value;
    this.setData({ spass });
  },

  onLogin () {
    wx.hideLoading();
    
    //FIXME: chanage tester account
    const info = getApp().getLoginInfo();
    const username = info ? info.username : "";
    if ('wechat_test' === username) { // tester ... go work list ...
      wx.redirectTo({
        url: '/pages/work/list/index'
      })
    } else {
      this.goContact();
    }
  },



  goContact () {
    wx.switchTab({
      url: '/pages/contact/index',
    })
  },

  goCodeLogin () {
    wx.redirectTo({
      url: '../logincode/index',
    })
  },
  goreg () {
    wx.redirectTo({
      url: '../reg/index?from=loginpass',
    })
  },
  backClick () {
    wx.redirectTo({
      url: '../login/index',
    })
  },

  onUnload () {
    const im = getApp().getIM();
    if ( im ) {
      im.off('loginSuccess', this.onLogin);
      im.off('loginerror', this.onLoginFailure);
    }
  },

  onHide () {
    this.onUnload();
  },

  onLoginFailure (msg) {
    wx.hideLoading();
    wx.showToast({
      title: '登录出错',
    })
  },



})
