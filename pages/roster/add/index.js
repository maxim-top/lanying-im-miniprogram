//index.js
//获取应用实例

Page({
  data: {
    searchText: '',
    rosterInfo: {},
    alias: '',
    navHeight: 0,
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

  searchHandler (evt) {
    const searchText = evt.detail.value;
    this.setData({ searchText });
  },
  aliasHandler (evt) {
    const alias = evt.detail.value;
    this.setData({ alias });
  },

  search () {
    if (!this.data.searchText) {
      return;
    }
    const app = getApp().globalData;
    wx.hideKeyboard();
    app.im.rosterManage.asyncSearchRosterByName({ username: this.data.searchText })
      .then(res => {
        res.avatar = app.im.sysManage.getImage({ avatar: res.avatar, sdefault: '../../image/r.png' });
        this.setData({ rosterInfo: res })
      })
  },


  backClick () {
    wx.navigateBack();
  },

  addFriend () {
    const user_id = this.data.rosterInfo.user_id;
    const alias = this.data.alias;
    getApp().globalData.im.rosterManage.asyncApply({ user_id, alias }).then(() => {
      wx.showToast({
        title: '请求已发送'
      })
    });
  },
  goChat() {
    if (this.data.rosterInfo.relation == 0) {// 已是好友
      wx.navigateTo({
        url: '../index?uid=' + this.data.rosterInfo.user_id,
      })
    }
  }
})
