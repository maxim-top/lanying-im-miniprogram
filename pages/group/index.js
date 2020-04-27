//index.js
//获取应用实例
import { toNumber, toLong } from '../../third/tools.js';
Page({
  data: {
    messages: [],
    gid: 0,
    scrolltop: 1000,
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
    recordFile: '',
  },

  onShow: function () {
    this.setData({ showing: false });
    getApp().globalData.im.groupManage.readGroupMessage(this.data.gid);
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
    const { gid } = options;
    this.setData({ gid: gid - 0 });
    const app = getApp().globalData;
    const messages = app.im.groupManage.getGruopMessage(gid - 0);
    this.appendMessage({
      messages,
    })
    setTimeout(() => { this.scroll() }, 500);
    getApp().globalData.im.on("onGroupMessage", message => {
      this.receiveNewMessage(message);
    });

    getApp().globalData.im.groupManage.readGroupMessage(this.data.gid);
    const allGroupMap = app.im.groupManage.getAllGroupDetail();
    const sgroup = allGroupMap[gid] || {};
    this.setData({ stitle: sgroup.name || '' });

    const wh = wx.getSystemInfoSync().windowHeight - this.data.navHeight - 70;
    this.setData({ wh });
  },

  appendMessage: function (data) {
    const newMessages = data.messages || [];
    const isHistory = data.history;
    const oldMessages = this.data.messages || [];
    newMessages.forEach(meta => {
      isHistory && (meta.h = true);
      const { to } = meta;
      if (to != this.data.gid) {
        return; // rosterchat, 必须有一个id是 sid
      }

      if (oldMessages.length > 0) {
        const firstItem = oldMessages[0];
        const lastItem = oldMessages[oldMessages.length - 1];
        const compFirst = toLong(meta.id).comp(firstItem.id || 0);
        const compLast = toLong(meta.id).comp(lastItem.id || 0);

        if (compFirst === -1) { // 比第一个小
          oldMessages.unshift(meta);
        } else if (compLast === 1) {
          oldMessages.push(meta);
        } else {
          let index = -1;
          for (var i = 0; i < oldMessages.length - 2; i += 1) {
            const compCurr = toLong(meta.id).comp(oldMessages[i].id);
            const compNext = toLong(meta.id).comp(oldMessages[i + 1].id);
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
    // context.commit('setMessage', [].concat(oldMessages));
    // if (!isHistory && oldMessages.length !== state.messages.length) {
    //   state.scroll = state.scroll + 1;
    // }
    this.setData({
      messages: [].concat(oldMessages)
    })

  },

  receiveNewMessage (message) {
    const app = getApp().globalData;
    const to = message.to;
    const pid = this.data.gid;
    if (pid == to) {
      if (!this.checkTyping(message)) {
        // const smessages = app.im.groupManage.getGruopMessage(pid - 0);
        this.appendMessage({
          messages: [message],
        })
        this.scroll();
      }
    }
    if (this.data.showing) {
      getApp().globalData.im.groupManage.readGroupMessage(this.data.gid);
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
      getApp().globalData.im.sysManage.sendGroupMessage({
        content,
        gid: this.data.gid,
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
    recorderManager.onError((res) => {
      console.log("录音错误: ", res);
    });
    recorderManager.onStop(function(res){
      that.setData({
        recordFile: res.tempFilePath,
        duration: Math.ceil((new Date().getTime() - that.data.startTime) / 1000)
      });
      
      that.preupload(that.data.recordFile);
      console.log("录音完成: ", that.data.recordFile);
    });

    const options = {
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
    };
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
    recorderManager.stop();
    this.setData({ recordTxt: '按下录音' });
  },
  preupload (path) {
    const that = this;
    getApp().globalData.im.sysManage.asyncGetFileUploadChatFileUrl({
      file_type: 104,
      to_id: this.data.gid,
      to_type: 2
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
        'app_id': getApp().globalData.appid,
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
    im.sysManage.sendGroupMessage({
      type: 'audio',
      gid: this.data.gid,
      content: "",
      attachment: fileInfo
    });

  }

})
