//index.js
//获取应用实例
import { toLong } from '../../third/tools.js';
Page({
  data: {
    messages: [],
    uid: 0,
    scrolltop: 999999,
    inputValue: '',
    showing: false,
    stitle: '',
    wh: 0,
    navHeight: 0,
    showvoice: false,
    recordTxt: '按下录音',
    startTime: 0,
    duration: 0,
    timer: null,
  },

  onShow: function () {
    getApp().globalData.im.rosterManage.readRosterMessage(this.data.uid);
    this.setData({ showing: true });
  },

  onUnload: function () {
    this.setData({ showing: false });
  },

  onLoad: function (options) {

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

    this.setData({ showing: false });
    let { uid, nick = '' } = options;
    this.setData({ uid: uid - 0 });

    const app = getApp().globalData;
    const messages = app.im.rosterManage.getRosterMessageByRid(uid - 0);
    this.appendMessage({
      messages,
    })
    setTimeout(() => { this.scroll() }, 500);
    getApp().globalData.im.on("onRosterMessage", message => {
      this.receiveNewMessage(message);
    });
    getApp().globalData.im.rosterManage.readRosterMessage(this.data.uid);

    /** 设置title */
    const umaps = app.im.rosterManage.getAllRosterDetail();
    let fromUserObj = umaps[uid] || {};
    if ( uid == 0 ) fromUserObj.username = '系统通知';

    this.setData({ stitle: nick || fromUserObj.nick_name || fromUserObj.username || '' });

    const wh = wx.getSystemInfoSync().windowHeight - this.data.navHeight - 50;
    this.setData({ wh });
  },

  appendMessage: function (data) {
    const newMessages = data.messages || [];
    const isHistory = data.history;
    const uid = getApp().globalData.im.userManage.getUid();
    const oldMessages = this.data.messages || [];
    console.log("APPEND message new: ", newMessages);
    newMessages.forEach(meta => {
      isHistory && (meta.h = true);
      /////////////////////
      const { from, to } = meta;

      let saveUid = from == uid ? to : from;
      if( saveUid == '' ) saveUid = 0; // empty from means system message

      if (saveUid + '' !== this.data.uid + '') {
        return; // rosterchat, 必须有一个id是 sid
      }

      if (oldMessages.length > 0) {
        const firstItem = oldMessages[0];
        const lastItem = oldMessages[oldMessages.length - 1];
        const compFirst = toLong(meta.id).comp(toLong(firstItem.id || 0));
        const compLast = toLong(meta.id).comp(toLong(lastItem.id || 0));

        if (compFirst === -1) { // 比第一个小
          oldMessages.unshift(meta);
        } else if (compLast === 1) {
          oldMessages.push(meta);
        } else {
          let index = -1;
          for (var i = 0; i < oldMessages.length - 2; i += 1) {
            const compCurr = toLong(meta.id).comp(toLong(oldMessages[i].id));
            const compNext = toLong(meta.id).comp(toLong(oldMessages[i + 1].id));
            if (compCurr === 1 && compNext === -1) {
              index = i;
            }
          }
          if (index > -1) {
            oldMessages.splice(index, 0, meta); // 插入到这里
          }
        }
      } else { // 数组为空
        oldMessages.push(meta);
      }
    })

    this.setData({
      messages: [].concat(oldMessages)
    })

  },

  receiveNewMessage (message) {
    const app = getApp().globalData;
    const uid = app.im.userManage.getUid();;
    const to = message.to;
    const from = message.from;
    const pid = this.data.uid;
    if (
      (uid == to && from == pid) ||
      (uid == from && to == pid)
    ) {
      if (!this.checkTyping(message)) {
        const smessages = app.im.rosterManage.getRosterMessageByRid(this.data.uid - 0);
        this.appendMessage({
          messages: smessages,
        })
        this.scroll();
      }
    }
    if (this.data.showing) {
      getApp().globalData.im.rosterManage.readRosterMessage(this.data.uid);
    }

  },

  checkTyping (message) {
    const { ext = {} } = message;
    if (typeof ext.input_status !== "undefined") {
      let status = ext.input_status;
      if (status == "nothing") {
        // this.header.querySelector(".typing").style.display = "none";
      } else {
        // this.header.querySelector(".typing").style.display = "inline";
        // this.header.querySelector(".typing").innerHTML = status + "...";
      }
      return true;
    }
    return false;
  },

  scroll () {
    const scrolltop = this.data.scrolltop + this.data.messages.length * 1000;
    this.setData({ scrolltop });
  },

  sendMessageHandler () {
    const content = this.data.inputValue;
    if (content) {
      getApp().globalData.im.sysManage.sendRosterMessage({
        content,
        uid: this.data.uid,
      });
      setTimeout(() => {
        this.setData({ inputValue: '' });
      }, 400)

    }
  },

  inputChangeHandler (evt) {
    const inputValue = evt.detail && evt.detail.value || '';
    this.setData({ inputValue });
  },
  backClick () {
    wx.navigateBack();
  },

  voiceHandler () {
    this.setData({
      showvoice: !this.data.showvoice
    })
  },
  startRecord () {

    wx.authorize({
      scope: "scope.record",
      success: function () {
        console.log("录音授权成功");
      },
      fail: function () {
        console.log("录音授权失败");
      }
    });

    var that = this;
    const recorderManager = wx.getRecorderManager();
    const options = {
      duration: 30000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 500
    }
    recorderManager.onError((res) => {
      console.log(res);

    });
    recorderManager.start(options);

    this.setData({
      startTime: new Date().getTime(), recordTxt: '录音中'
    })

    const timer = setTimeout(() => {
      this.stopRecord();
    }, 30000);

    this.setData({ timer })
  },
  stopRecord () {
    if (this.data.timer) {
      clearTimeout(this.data.timer);
      this.setData({ timer: null });
    }
    const recorderManager = wx.getRecorderManager();
    var that = this;

    recorderManager.onStop((res) => {
      console.log('。。停止录音。。', res.tempFilePath)
      const { tempFilePath } = res;
      that.setData({
        duration: Math.ceil((new Date().getTime() - that.data.startTime) / 1000)
      });
      that.preupload(tempFilePath);
    });
    recorderManager.stop();
    /////
    this.setData({ recordTxt: '按下录音' });
  },
  preupload (path) {
    const that = this;
    getApp().globalData.im.sysManage.asyncGetFileUploadChatFileUrl({
      file_type: 101,
      to_id: this.data.uid,
      to_type: 1
    }).then(res => {
      that.uploadVoice(path, res)
    })
  },

  uploadVoice (path, param) {
    const that = this;
    const app = getApp().globalData;
    const token = app.im.userManage.getToken();
    wx.uploadFile({
      url: param.upload_url,
      filePath: path,
      name: "file",//后台要绑定的名称
      header: {
        "Content-Type": "multipart/form-data",
        'access-token': token,
        'app_id': getApp().globalData.appid
      },
      //参数绑定
      formData: {
        OSSAccessKeyId: param.oss_body_param.OSSAccessKeyId,
        policy: param.oss_body_param.policy,
        key: param.oss_body_param.key,
        signature: param.oss_body_param.signature,
        callback: param.oss_body_param.callback
      },
      success: function (res) {
        that.sendVoiceMessage(param.download_url);
      },
      fail: function (ress) {
        console.log("。。录音保存失败。。");
      }
    });

  },

  sendVoiceMessage (url) {
    const im = getApp().globalData.im;
    const fileInfo = {
      dName: 'file',
      url,
      duration: this.data.duration,
    };
    im.sysManage.sendRosterMessage({
      type: 'audio',
      uid: this.data.uid,
      content: "",
      attachment: fileInfo
    });

  }

})
