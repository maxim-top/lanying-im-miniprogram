Page({
  data: {
    mobile: '',
    code: '',
    navHeight: 0,
    codeText: '获取验证码',
    timerValue: 0,
  },
  onLoad: function () {
    this.setData({ navHeight: getApp().globalData.navH });
  },



  sbind () {
    if (!this.data.mobile || !this.data.code) {
      wx.showToast({
        title: '请输入信息!',
      })
      return;
    } else {
      wx.showLoading({
        title: '绑定中',
      })
      getApp().globalData.im.userManage.asyncUserBindMobile({ // error message on base/index.js .. needs modify here ..
        mobile: this.data.mobile,
        captcha: this.data.code,
      }).then(() => {
        wx.hideLoading();
        this.goContact();
      }).catch(ex => {
        wx.hideLoading();
        wx.showToast({
          title: '绑定失败！',
        });
      })
    }
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
      wx.showToast('手机不正确');
      return;
    }

    this.setData({ timerValue: 60 });
    wx.showLoading({
      title: '发送中'
    });
    getApp().globalData.im.userManage.asyncUserSendSms({ // error message on base/index.js .. needs modify here ..
      mobile: this.data.mobile,
    }).then(() => {
      wx.hideLoading();
      setTimeout(() => {
        this.stimera();
      }, 1000);
    }).catch(ex => {
      wx.hideLoading();
      this.setData({ timerValue: 0, codeText: '获取验证码' });
    })
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
  }




})
