//index.js
//获取应用实例
import { toNumber, numToString } from '../../../third/tools.js';
import moment from '../../../third/moment.js';

Component({
  data: {
    cls: '',
    username: '',
    avatar: '',
    audio: '',
    contentType: 0,
    content: '',
    attachImage: '',
    messageType: 0,
    time: '',
    playing: false,
    from: '',
  },

  properties: {
    message: {
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}
    }
  },


  attached: function () {
    const message = this.data.message;
    const app = getApp().globalData;
    const uid = app.im.userManage.getUid();
    const from = message.from;
    const cls = uid == from ? 'self' : 'roster';
    const type = message.type;
    const toType = message.toType;
    let content = message.content || '';
    let username = '';

    const umaps = app.im.rosterManage.getAllRosterDetail();
    const fromUserObj = umaps[from] || {};
    if( from == 0 ){
      // system message
      fromUserObj.username = "系统通知";
      fromUserObj.avatar = "/pages/image/tab/setting.png";
    }

    let avatar = app.im.sysManage.getImage({
      avatar: fromUserObj.avatar,
      sdefault: "../../image/r.png"
    });
    username = fromUserObj.nick_name || fromUserObj.username || "";
    if (from == uid) {
      username = "我";
    }

    const attach = message.attach || {};
    let url = attach.url || '';

    if (url && type === 'image') {
      url = app.im.sysManage.getImage({avatar: url});
    }
    if (url && type === 'audio') {
      // 1. use the audio url;
      let audio = app.im.sysManage.getAudio({url});
      console.log("getAudio: ", audio);
      this.setData({
        audio,
      });
      
      // 2. download audio to local file
      // const that = this;
      // app.im.sysManage.downloadAudio({url}).then((res) => {
      //   console.log("getAudio: ", res);
      //   that.setData({
      //     audio: res,
      //   });
      // }).catch((ex) => {
      //   console.error("getAudio error: ", ex);
      // });
    }

    let { timestamp } = message;
    timestamp = toNumber(timestamp);

    let time = moment(timestamp).calendar("", {
      sameDay: "[今天] HH:mm",
      lastDay: "[昨天] HH:mm",
      sameElse: "YYYY-MM-DD HH:mm"
    });

    this.setData({
      attach,
      cls,
      username,
      avatar,
      type,
      toType,
      content,
      attachImage: url,
      time,
      from,
    });
  },

  methods: {
    splayAudio: function () {
      const innerAudioContext = wx.createInnerAudioContext()
      // innerAudioContext.autoplay = true
      innerAudioContext.obeyMuteSwitch = false;
      innerAudioContext.loop = false;
      innerAudioContext.src = this.data.audio;
      console.log("Play audio: ", this.data.audio);
      this.setData({ playing: true });
      innerAudioContext.onPlay(() => {
        setTimeout(() => {
          innerAudioContext.stop();
        }, (this.data.attach.duration+3) * 1000);
      })
      innerAudioContext.onError((res) => {
        console.error("Can't play audio due to ", res);
        console.error("Play audio error: ", this.data.audio);
        this.setData({ playing: false });
      })
      innerAudioContext.onStop((res) => {
        this.setData({ playing: false });
      })

      innerAudioContext.play();
    },
    goUserProfile () {
      if (this.data.cls == 'roster') {
        wx.navigateTo({
          url: '/pages/profile/userinfo/index?uid=' + this.data.from,
        });
      }
    }
  },

})
