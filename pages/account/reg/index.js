//index.js
//获取应用实例

Page({
  data: {
    openId: '',
    sname: '',
    spass: '',
    appid: "",
    /////
    ratelOk: false,
    authCode: '',
    navHeight: 0,
    from: '',
  },
  onLoad: function (options) {
    this.setData({
      from: options.from
    });
    const appid = getApp().getAppid();
    this.setData({ appid });
    this.setData({ navHeight: getApp().globalData.navH });
    
    const im = getApp().getIM();
    if ( im ) {
      im.on('loginSuccess', this.onLogin);
      im.on('loginerror', this.onLoginFailure);
    };
  },

  reg () {
    if (!this.data.sname || !this.data.spass) {
      wx.showToast({
        title: '请输入信息!',
      })
      return;
    } else {
      wx.showLoading({
        title: '注册中',
      })
      const im = getApp().globalData.im;
      im.userManage.asyncRegister({ // error message on base/index.js .. needs modify here ..
        username: this.data.sname,
        password: this.data.spass,
      }).then(() => {
        wx.showLoading({
          title: '登录中',
        })
        im.login({ // error message on base/index.js .. needs modify here ..
          name: this.data.sname,
          password: this.data.spass,
        })
      }).catch(ex => {
        wx.hideLoading();
        wx.showToast({
          title: '注册失败'
        });
      })
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
    getApp().saveLoginInfo({
      username: this.data.sname,
      passowrd: this.data.spass
    })
    
    wx.hideLoading();
    wx.redirectTo({
      url: '../regbind/index',
    });
  },

  backClick () {
    if (this.data.from == 'home') {
      wx.redirectTo({ url: '../login/index' });
    } else if (this.data.from == 'loginpass') {
      wx.redirectTo({ url: '../loginpass/index' });
    } else if (this.data.from == 'logincode') {
      wx.redirectTo({ url: '../logincode/index' });
    }
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

  goCodeLogin () {
    wx.redirectTo({
      url: '../loginpass/index?from=reg',
    })
  },



})
