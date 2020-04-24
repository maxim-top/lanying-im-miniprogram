
Component({
  data: {
    navHeight: 0,
    navTop: 0,
  },

  properties: {
    title: {
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: ""
    },
    bgColor: {
      type: String,
      value: "white"
    }

  },


  attached: function () {

    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
        this.setData({ navHeight, navTop });
      },
      fail (err) {
        console.log(err);
      }
    })



  },

  methods: {},

})
