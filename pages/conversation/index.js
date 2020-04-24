Page({
  data: {
    conversationList: [],
    navHeight: 0,
  },


  onShow: function () {
    const token = getApp().getIM().userManage.getToken();
    if (!token) {
      if (getApp().globalData.isLoginPage === false) {
        getApp().globalData.isLoginPage = true;
        wx.reLaunch({
          url: '../login/index',
        })
      }
    } else {
      this.getConversationList();
    }

  },
  touchConversation (e) {
    var id = e.currentTarget.dataset.sid;
    const type = e.currentTarget.dataset.type;
    if (type === 'roster') {
      wx.navigateTo({
        url: '../roster/index?uid=' + id,
      })
    } else {
      wx.navigateTo({
        url: '../group/index?gid=' + id,
      })
    }
  },

  getConversationList () {
    const app = getApp().globalData;
    const uid = app.im.userManage.getUid();
    let list = app.im.userManage.getConversationList();
    list = list.filter(x => x.id !== uid);
    const allGroupMap = app.im.groupManage.getAllGroupDetail();
    const allRosterMap = app.im.rosterManage.getAllRosterDetail() || {};
    const slist = list.map((item, index) => {
      let name;
      const id = item.id;
      const content = item.content;
      let avatar = '';
      const unreadCount = item.type == 'roster' ? app.im.rosterManage.getUnreadCount(id) :
        app.im.groupManage.getUnreadCount(id);
      const unread = unreadCount > 0 ? unreadCount : 0;
      if (item.type === 'roster') { //roster
        const sroster = allRosterMap[id] || {}
        name = sroster.nick_name || sroster.username || id;
        avatar = app.im.sysManage.getImage({ avatar: sroster.avatar, sdefault: '../image/r.png' });
      } else if (item.type === 'group') { //group
        const sgroup = allGroupMap[id] || {};
        name = sgroup.name || id;
        avatar = app.im.sysManage.getImage({
          avatar: sgroup.avatar,
          type: "group",
          sdefault: '../image/g.png',
        });
      }
      return {
        type: item.type,
        index,
        name,
        content,
        avatar,
        unread,
        sid: id,
      }
    });
    this.setData({ conversationList: [].concat(slist) });
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

    getApp().globalData.im.on("onRosterMessage", message => {
      this.getConversationList();
    });
    getApp().globalData.im.on("onGroupMessage", message => {
      this.getConversationList();
    });

    getApp().globalData.im.on("onRosterListUpdate", message => {
      this.getConversationList();
    });

    const app = getApp().globalData;
    app.im.on("onDisconnect", () => {
      // app.im.userManage.deleteToken();
      // if (getApp().globalData.isLoginPage === false) {
      //   getApp().globalData.isLoginPage = true;
      //   wx.reLaunch({
      //     url: '../login/index',
      //   })
      // }
    })

  },


})
