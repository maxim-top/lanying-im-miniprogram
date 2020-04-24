
Page({
  data: {
    mobile: '',
    code: '',
    navHeight: 0,
    codeText: '获取验证码',
    timerValue: 0,
    openId: '',
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

  sbind () { // 点击继续的按钮
    if (!/^((13[0-9])|(14[0-9])|(15[^4,\D])|(166)|(17[0-9])|(18[0-9]))\d{8}$/.test(this.data.mobile)) {
      wx.showToast({ title: '请输入正确的手机号' });
      return;
    }
    if (!this.data.code) {
      wx.showToast({ title: '请输入验证码' });
      return;
    }
    /**
     *  先获取是否有账号密码，有的话直接登录进来。
     *  没有则跳转到 注册并绑定
     */
    getApp().globalData.im.userManage.asyncUserMobileLogin({
      captcha: this.data.code,
      mobile: this.data.mobile,
    }).then(res => {
      if (res.sign) {
        wx.redirectTo({
          url: '../loginbindreg/index?sign=' + res.sign + '&mobile=' + this.data.mobile,
        })
      } else {
        getApp().saveLoginInfo({
          username: res.username,
          password: res.password,
        });
        getApp().ensureIMLogin();
      }
    }).catch(ex => {
      wx.showToast({ title: '验证码登录失败' });
    })
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

  onLogin () {
    wx.switchTab({
      url: '/pages/contact/index',
    })

  },

  mobileHandler (evt) {
    const mobile = evt.detail.value;
    this.setData({ mobile });
  },

  codeHandler (evt) {
    const code = evt.detail.value;
    this.setData({ code });
  },


  goContact () {
    wx.switchTab({
      url: '/pages/contact/index',
    })
  },

  getCode () {
    if (this.data.timerValue > 0) {
      return;
    }
    if (!/^((13[0-9])|(14[0-9])|(15[^4,\D])|(166)|(17[0-9])|(18[0-9]))\d{8}$/.test(this.data.mobile)) {
      wx.showToast({ title: '请输入正确的手机号' });
      return;
    }

    this.setData({ timerValue: 60 });
    getApp().globalData.im.userManage.asyncUserSendSms({ // error message on base/index.js .. needs modify here ..
      mobile: this.data.mobile,
    }).then(() => {
      // wx.hideLoading();
      // this.goContact();
    })


    setTimeout(() => {
      this.stimera();
    }, 1000);
  },

  stimera () {
    const timerValue = this.data.timerValue - 1;
    let codeText = '（' + timerValue + '）秒'
    if (timerValue == 0) {
      codeText = '获取验证码';
    }
    // const codeText = '（' + timerValue + '）秒'
    this.setData({ timerValue, codeText });

    if (timerValue > 0) {
      setTimeout(() => {
        this.stimera();
      }, 1000);
    }
  },
  goreg () {
    wx.redirectTo({
      url: '../reg/index?from=logincode',
    })
  },

  backClick () {
    wx.redirectTo({
      url: '../loginpass/index',
    });
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
  }

})
