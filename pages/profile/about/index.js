
Page({
  data: {
    navHeight: 0,
  },

  onUnload: function () {
    this.setData({ showing: false });
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
  },

  backClick () {
    wx.navigateBack();
  }

})
