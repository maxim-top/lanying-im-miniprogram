//index.js
//获取应用实例

Page({
  data: {
    sname: '',
    spass: '',
    navHeight: 0,
    sign: '',
    mobile: '',
    openId: '',
  },
  onLoad: function (p) {
    if (p.openId) {
      this.setData({ openId: p.openId })
    } else if (p.sign) {
      this.setData({ sign: p.sign, mobile: p.mobile })
    }
    this.setData({ navHeight: getApp().globalData.navH });

    const im = getApp().getIM();
    if ( im ) {
      im.on('loginSuccess', this.onLogin);
      im.on('loginerror', this.onLoginFailure);
    };
  },

  bindHandler () { //点击登录
    if (!this.data.sname || !this.data.spass) {
      wx.showToast({
        title: '请输入信息!',
      })
      return;
    } else {
      wx.showLoading({
        title: '注册中',
      });
      const im = getApp().globalData.im;
      wx.showLoading({
        title: '登录中',
      });

      getApp().saveLoginInfo({
        username: this.data.sname,
        password: this.data.spass,
      });
      getApp().ensureIMLogin();
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
    if (this.data.openId) {
      this.bindWechat();
    } else {
      this.bindPhone();

    }
  },



  goContact () {
    wx.switchTab({
      url: '/pages/contact/index',
    })
  },

  goLoginBindReg () {
    if (this.data.openId) {
      wx.redirectTo({
        url: '../loginbind/index?openId=' + this.data.openId,
      })
    } else if (this.data.mobile) {
      wx.redirectTo({
        url: '../loginbind/index?mobile=' + this.data.mobile + '&sign=' + this.data.sign,
      })
    }
  },

  backClick () {
    this.goLoginBindReg();
  },

  goBindReg () {
    wx.redirectTo({
      url: '../loginbindreg/index?mobile=' + this.data.mobile + '&sign=' + this.data.sign,
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


  bindPhone () {
    getApp().globalData.im.userManage.asyncUserMobileBindSign({
      mobile: this.data.mobile,
      sign: this.data.sign,
    }).then(() => {
      this.goContact();
    }).catch(ex => {
      this.goContact();
    })
  },

  bindWechat () {
    getApp().globalData.im.sysManage.asyncWxbind({  // bind 账号...
      open_id: this.data.openId, type: 1,
    }).then(res => {
      this.goContact();
    }).catch(ex => {
      wx.showToast({
        title: '绑定失败',
        success: () => {
          setTimeout(() => {
            this.goContact();
          }, 2000)
        }
      })
    })
  },



})
