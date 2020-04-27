//index.js
//获取应用实例
Page({
  data: {
    openId: '',
    appid: "",
    navHeight: 0,
    wxinfo: {},
  },

  onLoad: function () {
    const appid = getApp().getAppid();
    this.setData({ appid });
    
    if( getApp().isIMLogin() ){
      this.onLogin();
      return;
    }else{
      const im = getApp().getIM();
      if ( im ) {
        im.on('loginSuccess', this.onLogin);
        im.on('loginerror', this.onLoginFailure);
      }
    }
    
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
        this.setData({ navHeight });
        getApp().globalData.navH = navHeight;
      },
      fail (err) {
        console.log(err);
      }
    })
  },


  appidTapHandler () {
    this.selectComponent('#prompt').showPrompt();
  },

  confirm (p) {
    const { value } = p.detail;
    this.setData({
      appid: value,
    })

    getApp().setupIM( value );
    const im = getApp().getIM();
    if ( im ) {
      im.on('loginSuccess', this.onLogin);
      im.on('loginerror', this.onLoginFailure);
    }
  },

  saveUserInfo (e) { // 登录的点击....
    if (e.detail.userInfo) {
      let wxinfo = this.data.wxinfo;
      wxinfo.data = e.detail.encryptedData;
      wxinfo.iv = e.detail.iv;
      this.setData({ wxinfo });
    } else {
      wx.showToast({
        title: '微信登录需要授权'
      });
    }
  },

  wxAuth () { // 获取 用户信息的。。页面加载就触发
    wx.login({
      success: (res) => {
        if (res.code) {
          let wxinfo = this.data.wxinfo;
          wxinfo.code = res.code;
          this.setData({ wxinfo });
          this.wechatLogin();
        }else {
          wx.hideLoading();
          wx.showToast({
            title: '微信授权失败',
          })
        }
      }
    });
  },

  wechatLogin () {
    wx.showLoading({
      title: '加载中',
    })
    getApp().globalData.im.sysManage.asyncWxlogin({
      code: this.data.wxinfo.code,
      iv: this.data.wxinfo.iv,
      data: this.data.wxinfo.data
    }).then(res => {
      wx.hideLoading();
      if (res.openid) {//未绑定
        this.setData({ openId: res.openid });
        getApp().globalData.openId = res.openid;
        wx.showToast({
          title: '未绑定微信!',
          icon: 'none',
          duration: 2000,
          success: () => {
            wx.redirectTo({
              url: '../loginbindreg/index?openId=' + res.openid,
            });
          }
        })
      } else {
        getApp().saveLoginInfo(res);
        getApp().ensureIMLogin();
      
        const im = getApp().getIM();
        if ( im ) {
          im.on('loginSuccess', this.onLogin);
          im.on('loginerror', this.onLoginFailure);
        };
      }
    }).catch(ex => {
      console.log("Wechat login ex: ", ex);
      wx.hideLoading();
      wx.showToast({
        title: '微信登陆失败',  //这里没有code  
      });
    })
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
      wx.switchTab({
        url: '/pages/contact/index',
      })
    }
  },

  onLoginFailure (msg) {
    wx.hideLoading();
    wx.showToast({
      title: '登录出错',
    })
  },


  goLogin () {
    wx.redirectTo({
      url: '../loginpass/index',
    })
  },

  goreg () {
    wx.redirectTo({
      url: '../reg/index?from=home',
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

})
