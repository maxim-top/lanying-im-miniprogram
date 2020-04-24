//index.js
//获取应用实例

Page({
  data: {
    profile: {},
    navHeight: 0,
    uid: 0,
  },
  onLoad: function (p) {

    const { uid } = p;
    this.setData({ uid, navHeight: getApp().globalData.navH });
    this.getUserInfo();
  },


  getUserInfo () {
    const im = getApp().globalData.im;
    im.rosterManage
      .asyncSearchRosterById({ user_id: this.data.uid })
      .then(res => {
        res.avatar = im.sysManage.getImage({
          avatar: res.avatar
        });
        this.setData({ profile: res });
      });
  },


  backClick () {
    wx.navigateBack();
  },

  goChat () {
    wx.navigateTo({
      url: '/pages/roster/index?uid=' + this.data.profile.user_id,
    })
  }
})