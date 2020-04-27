//index.js
//获取应用实例

Page({
  data: {
    rosterList: [],
    groupList: [],
    staticList: [],
    showRoster: true,
    showGroup: true,
    menuCurr: 0,
    navHeight: 0,
    showsupports: false,
  },
  //事件处理函数
  goChat: function (e) {
    var id = e.currentTarget.dataset.uid;
    const nick = e.currentTarget.dataset.nick;
    wx.navigateTo({
      url: '../roster/index?uid=' + id + '&nick=' + nick,
    })
  },
  goGroup: function (e) {
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '../group/index?gid=' + gid,
    })
  },

  getRosterList () {
    const im = getApp().getIM();
    im.rosterManage.asyncGetRosterIdList().then(res => {
      const uid = im.userManage.getUid();
      res = res.filter(x => x !== uid);
      im.rosterManage.asnycGetRosterListDetailByIds(res).then(() => {
        const allMaps = im.rosterManage.getAllRosterDetail() || {};
        const retObj = res.map(i => {
          const rosterInfo = allMaps[i];
          const unreadCount = im.rosterManage.getUnreadCount(i);
          let avatar = rosterInfo.avatar;
          avatar = im.sysManage.getImage({ avatar: rosterInfo.avatar, sdefault: '../image/r.png' });
          return Object.assign({}, rosterInfo, { unreadCount, avatar });

        });
        this.setData({ rosterList: retObj })
      })
    }).catch(ex => {
      console.error("Get roster list exception: ", ex);
      wx.showToast({
        title: '获取用户列表失败',
      })
    })
  },

  getGroupList () {
    const im = getApp().getIM();
    im.groupManage.asyncGetJoinedGroups().then(res => {
      const retObj = res.map(i => {
        const unreadCount = im.groupManage.getUnreadCount(i.group_id);
        let avatar = i.avatar;
        avatar = im.sysManage.getImage({
          avatar: avatar,
          type: "group",
          sdefault: '../image/g.png',
        });
        return Object.assign({}, i, { unreadCount, avatar });
      });
      this.setData({ groupList: retObj })
    }).catch(ex => {
      wx.showToast({
        title: '获取群列表失败',
      })
    })
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

    const im = getApp().getIM();
    if(im) {
      im.on("loginerror", (err) => {
        console.log("Login error due to ", err);
      });
      im.on("onRosterListUpdate", () => {
        this.getRosterList();
      });
  
      im.on("onGroupListUpdate", () => {
        this.getGroupList();
      });
    }

    this.asyncGetStatics();
    this.getRosterList();
    this.getGroupList();
    
    const showsupports = getApp().getAppid() == 'welovemaxim';
    this.setData({ showsupports});
  },

  onShow: function () {
    if ( !getApp().isIMLogin() ) {
      getApp().isLoginPage = true;
      wx.reLaunch({
        url: '../login/index',
      })
    }
  },

  menuClick: function (e) {
    this.setData({
      menuCurr: e.currentTarget.dataset.num
    })
  },

  asyncGetStatics: function () {
    const im = getApp().getIM();
    im.sysManage.asyncGetStaticContact().then(res => {
      res = res.map(x => {
        x.avatar = im.sysManage.getImage({ avatar: x.avatar, sdefault: '../image/r.png' });
        return x;
      })
      this.setData({ staticList: res })
    });
  },
  addRoster: function () {
    wx.navigateTo({ url: '../roster/add/index' })
  },
  createGroup: function () {
    wx.navigateTo({ url: '../group/create/index' })
  },
})
