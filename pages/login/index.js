//index.js
//获取应用实例

Page({
  data: {
    openId: '',
    sname: '',
    spass: '',
    checked: true,
    appid: "",
    /////
    ratelOk: false,
    authCode: '',
  },
  onLoad: function () {
    const appid = this.getAppid();
    this.setData({ appid });
    this.initFlooIM();
  },

  checkboxChange (e) {
    const checked = e.detail.value.length > 0;
    this.setData({ checked })
  },

  bindHandler () {
    if (!this.data.sname || !this.data.spass) {
      wx.showToast({
        title: '请输入信息!',
      })
      return;
    } else {
      wx.showLoading({
        title: '登录中',
      })
      getApp().globalData.im.login({ // error message on base/index.js .. needs modify here ..
        name: this.data.sname,
        password: this.data.spass,
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
    this.saveAppid(value);
    this.initFlooIM();
  },

  nameHandler (evt) {
    const sname = evt.detail.value;
    this.setData({ sname });
  },

  passHandler (evt) {
    const spass = evt.detail.value;
    this.setData({ spass });
  },

  initFlooIM () {
    getApp().initFlooIM();
    const im = getApp().globalData.im;
    if (im) {
      im.on('refresh_retal', () => {
        this.setData({ ratelOk: true });
        if (this.data.authCode) {
          this.getInfo(this.data.authCode);
        }
      });

      im.on('login', (p) => {
        const open_id = this.data.openId;
        wx.hideLoading();
        const uid = im.userManage.getUid();
        if (uid === 6597271199616) { // tester ... go work list ...
          wx.redirectTo({
            url: '../work/list/index'
          })
        } else {
          if (this.data.checked && !getApp().globalData.loginInfo.user_id) {
            im.sysManage.asyncWxbind({
              open_id, type: 1,
            }).then(res => {
              getApp().globalData.binded = true;
              wx.switchTab({
                url: '../contact/index',
              })
            }).catch(ex => {
              wx.showToast({
                title: '绑定失败',
                success: () => {
                  setTimeout(() => {
                    wx.switchTab({
                      url: '../contact/index',
                    })
                  }, 2000)
                }
              })

            })
          } else {
            wx.switchTab({
              url: '../contact/index',
            })
          }
        }
      })
      this.wxAuth();
    }
  },

  wxAuth () { // 获取 用户信息的。。
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: (res) => {
        wx.hideLoading();
        if (res.code) {
          this.getInfo(res.code);
        } else {
          wx.showToast({
            title: '微信授权失败',
          })
        }
      }
    });
  },

  getInfo (code) {
    if (!this.data.ratelOk) {
      this.setData({ authCode: code });
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    const im = getApp().globalData.im;
    im.sysManage.asyncWxlogin({ code }).then(res => {
      wx.hideLoading();
      if (res.openid) {//未绑定
        this.setData({ openId: res.openid });
        getApp().globalData.openId = res.openid;
      } else {
        getApp().globalData.loginInfo = res;
        getApp().globalData.binded = true;
        !getApp().globalData.muralDisconnect && im.idLogin(res);
      }
    }).catch(ex => {
      wx.hideLoading();
      wx.showToast({
        title: '微信取信息失败',  //这里没有code  
      })
    })
  },

  getAppid () {
    return wx.getStorageSync("lanying-im-appid") || "welovemaxim";
  },
  saveAppid (v) {
    return wx.setStorageSync("lanying-im-appid", v);
  },

  onShow () {
    getApp().globalData.isLoginPage = true;
  },

  onUnload () {
    getApp().globalData.isLoginPage = false;
  },



})
