//index.js
//获取应用实例

Page({
  data: {
    profile: {},
    binded: false,
    navHeight: 0,
    wxinfo: {},
  },
  onLoad: function () {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
        this.setData({ navHeight });
      },
      fail (err) {
        console.log(err);
      }
    })

    const app = getApp().globalData;
    const token = app.im.userManage.getToken();
    const app_id = app.im.userManage.getAppid();
    app.im.userManage.asyncGetProfile(true).then(profile => {
      let avatar = profile.avatar;
      if (avatar) {
        if (avatar.indexOf('http') !== 0) {
          avatar = 'https://api.maxim.top/file/download/avatar?object_name=' + avatar;
        }
        avatar = avatar + '&image_type=2' + '&access-token=' + token + '&app_id=' + app_id;
      } else {
        avatar = '../../image/roster.png';
      }
      profile.avatar = avatar;
      // profile.nick_name = profile.alias || profile.nick_name || profile.username;
      this.setData({ profile })
    });

    app.im.on("onDisconnect", () => {
      // app.im.userManage.deleteToken();
      // wx.reLaunch({
      //   url: '/pages/account/login/index',
      // })
    });
    this.wxAuth();

    this.getIsBind();
  },

  bindWechat () {
    if (this.data.binded) {
      this.unbindHandler();
    } else {
      if (getApp().globalData.openId) {
        this.bindHandler();
      } else {
        this.wxAuth();
      }

    }
  },

  getIsBind () {
    getApp().globalData.im.sysManage.asyncWechatIsbind().then(binded => {
      this.setData({ binded });
    });
  },

  bindHandler (open_id) {
    getApp().globalData.im.sysManage.asyncWxbind({
      open_id, type: 1,
    }).then(res => {
      this.setData({ binded: true })
    }).catch(ex => {
      wx.showToast({
        title: '绑定失败',
      })
    })
  },

  unbindHandler () {
    getApp().globalData.im.sysManage.asyncWechatUnbind().then(res => {
      this.setData({ binded: false })
      this.wxAuth();
    }).catch(ex => {
      wx.showToast({
        title: '解绑失败',
      })
    })
  },

  wxAuth () { // 获取 用户信息的。。页面加载就触发
    wx.login({
      success: (res) => {
        if (res.code) {
          const wxinfo = this.data.wxinfo;
          wxinfo.code = res.code;
          this.setData({ wxinfo });
        }
      }
    });
  },

  getInfo () {
    const im = getApp().globalData.im;
    const code = this.data.wxinfo.code;
    const data = this.data.wxinfo.data;
    const iv = this.data.wxinfo.iv;

    im.sysManage.asyncWxlogin({ code, data, iv }).then(res => {
      wx.hideLoading();
      if (res.openid) {//未绑定
        this.bindHandler(res.openid);
      }
    })
  },

  logout () {
    getApp().imLogout();
  },

  bindGetUserInfo (e) { // 登录的点击....
    if (e.detail.userInfo) {
      const wxinfo = this.data.wxinfo;
      wxinfo.data = e.detail.encryptedData;
      wxinfo.iv = e.detail.iv;
      this.setData({ wxinfo });
      this.getInfo();


    } else {
      wx.showToast({
        title: '微信登录需要授权'
      });
    }
  },

  goAbout () {
    wx.navigateTo({
      url: './about/index',
    })
  },
  goQrcode() {
    wx.navigateTo({
      url: './qrcode/index',
    })
  }

})
