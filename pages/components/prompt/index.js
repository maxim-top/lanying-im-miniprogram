Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '标题'
    },
    btn_cancel: {
      type: String,
      value: '取消'
    },
    btn_certain: {
      type: String,
      value: '确定'
    }
  },
  data: {
    isHidden: true,
    svalue: '',
  },
  methods: {
    hidePrompt: function () {
      this.setData({
        isHidden: true
      })
    },
    showPrompt () {
      this.setData({
        isHidden: false,
        svalue: false
      })
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _cancel () {
      const isHidden = true;
      this.setData({ isHidden })
    },
    _confirm () {
      const value = this.data.svalue;
      this.triggerEvent("confirm", { value });
      const isHidden = true;
      this.setData({ isHidden })
    },
    _input (e) {
      const svalue = e.detail.value;
      this.setData({ svalue });
    }
  }
})