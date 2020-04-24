//index.js
//获取应用实例

Page({
  data: {
    name: '',
    description: '',
    rosterList: [],
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

    this.getRosterList();
  },

  nameHandler (evt) {
    const name = evt.detail.value;
    this.setData({ name });
  },
  descriptionHandler (evt) {
    const description = evt.detail.value;
    this.setData({ description });
  },

  getRosterList () {
    const app = getApp().globalData;
    const token = app.im.userManage.getToken();
    app.im.rosterManage.asyncGetRosterIdList().then(res => {
      const uid = app.im.userManage.getUid()
      res = res.filter(x => x !== uid);
      app.im.rosterManage.asnycGetRosterListDetailByIds(res).then(() => {
        const allMaps = app.im.rosterManage.getAllRosterDetail() || {};
        const retObj = res.map(i => {
          const rosterInfo = allMaps[i];
          const unreadCount = app.im.rosterManage.getUnreadCount(i);
          let avatar = rosterInfo.avatar;
          avatar = app.im.sysManage.getImage({ avatar: rosterInfo.avatar, sdefault: '../../image/r.png' });
          return Object.assign({}, rosterInfo, { unreadCount, avatar });

        });
        this.setData({ rosterList: retObj, token })
      })
    }).catch(ex => {
      wx.showToast({
        title: '获取用户列表失败',
      })
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
  tapRoster (e) {
    var idx = e.currentTarget.dataset.idx;
    const list = [].concat(this.data.rosterList);
    const obj = list[idx];
    obj.flag = !obj.flag;
    list[idx] = obj;
    this.setData({ rosterList: list })

  },

  create () {
    let list = this.data.rosterList.filter(x => x.flag);
    list = list.map(x => x.user_id);
    if (!list.length) {
      wx.showToast({ title: '请选择群成员' });
      return;
    }
    if (!this.data.name) {
      wx.showToast({ title: '请输入群名称' });
      return;
    }
    getApp().globalData.im.groupManage.asyncCreate({
      name: this.data.name,
      type: 1,
      description: this.data.description,
      user_list: list
    })
      .then(() => {
        wx.showToast({
          title: '创建群成功',
          success: () => {
            setTimeout(() => {
              wx.navigateBack();
            }, 2000)
          }
        });
      });

  }


})
