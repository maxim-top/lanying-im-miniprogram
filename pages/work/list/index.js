//index.js
//获取应用实例

Page({
  data: {
    rosterList: [
      {
      user_id:1,
      avatar: '../../image/work/1.jpeg',
      username: '雨彤'
      }, {
        user_id: 2,
        avatar: '../../image/work/2.jpeg',
        username: '雪娇'
      }, {
        user_id: 3,
        avatar: '../../image/work/3.jpeg',
        username: '稍辉'
      }, {
        user_id: 4,
        avatar: '../../image/work/4.jpeg',
        username: '羽鹏'
      }, {
        user_id: 5,
        avatar: '../../image/work/5.jpeg',
        username: '金海'
      }, {
        user_id: 6,
        avatar: '../../image/work/7.jpeg',
        username: '姜维'
      }
    
    
    ],
  },
  //事件处理函数
  goChat: function (e) {
    var id = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../detail/index?uid=' + id,
    })
  }

})
