//index.js
//获取应用实例
import { toNumber, numToString } from '../../../third/tools.js';
import moment from '../../../third/moment.js';

Component({
  data: {
    cls: '',
    username: '',
    avatar: '',
    contentType: 0,
    content: '',
    attachImage: '',
    messageType: 0,
    time: '',
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
    const cls = uid == from ? 'messageFrame self' : 'messageFrame roster';
    const type = message.type;
    const toType = message.toType;
    let content = message.content || '';

    let attachImage = '';
    let username = '';

    const umaps = app.im.rosterManage.getAllRosterDetail();
    const fromUserObj = umaps[from] || {};
    let avatar = app.im.sysManage.getImage({
      avatar: fromUserObj.avatar,
      sdefault: "../../image/r.png"
    });
    username = fromUserObj.nick_name || fromUserObj.username || "";
    if (from == uid) {
      username = "我自己";
    }
    const attach = message.attach || {};

    let url = attach.url || '';

    if (url && type === 'image') {
      url = app.im.sysManage.getImage({ avatar: url });
    }

    let { timestamp } = message;
    timestamp = toNumber(timestamp);

    let time = moment(timestamp).calendar("", {
      sameDay: "[今天] HH:mm",
      lastDay: "[昨天] HH:mm",
      sameElse: "YYYY-MM-DD HH:mm"
    });

    this.setData({
      cls,
      username,
      avatar,
      type,
      toType,
      content,
      attachImage: url,
      time,
    });




  },

  methods: {},

})
