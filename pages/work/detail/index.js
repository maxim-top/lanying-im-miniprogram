//index.js
//获取应用实例

Page({
  data: {
    name: '',
    offer: '',
    avatar: '',
    uid: -1,

  },
  onLoad: function (options) {
    const {uid} = options;
    const offs = ['Web工程师', 'iOS工程师', 'web工程师', 'C++架构师', '运维主管', '后端主管',];
    const names = ['雨彤', '雪娇', '稍辉', '羽鹏', '金海', '姜维',];
    this.setData({
      name: names[uid-1],
      offer: offs[uid-1],
      avatar: '../../image/work/'+uid+'.jpeg',
      uid,
    })
  },


  goChat(e) {
    const sids = [
      6601470303424, 6597271331072, 6597321479872, 6597321892992, 6597271396128, 6597271396128
    ];
    wx.navigateTo({
      url: '../../roster/index?uid=' + sids[this.data.uid -1],
    })
    
  },
  backClick() {
    wx.navigateBack();
  }
  


})