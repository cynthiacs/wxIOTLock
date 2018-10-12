// pages/tempkeylist/addtemppsw/addtemppsw.js
const serverProxy = require('../../../utils/serverproxy.js')
//[{"id":7,"name":"密码","due_date":"2018-10-12T00:00:00.000Z","create_date":"2018-10-12T03:02:55.530Z","device_name":"dev_rrpc","key":"249238"}]

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tips: [
      '说明：临时密码为一次性密码，密码使用后将永久失效。',
      '说明：限时密码可限制密码的使用期限，时间超过有效日期后密码失效，密码生成后不能删除，但可修改密码有效期。',
      '说明：限时段密码可限制密码的使用时间段，仅在有效时间段内密码有效，过期或未到该时段，密码均无效，密码生成后不能删除，但可修改有效时段。'],
    typeList: ['临时密码', '限时密码', '限时段密码'],
    objecttypeList: [
      {
        id: 0,
        name: '临时密码',
      },
      {
        id: 1,
        name: '限时密码',
      },
      {
        id: 2,
        name: '限时段密码',
      },
    ],
    index: 0,
    today: '2016-09-01',
    date: '2016-09-01',
    bgtime:'00:00',
    edtime:'23:59',
    key: '',
  },

  userInput: function (e) {
    this.setData({
      key: e.detail.value
    })
  },

  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindbgTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      bgtime: e.detail.value
    })
  },

  bindedTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      edtime: e.detail.value
    })
  },

  createNewPsw: function(e) {
    if(this.data.key == '') {
      wx.showToast({
        title: '请先输入您的数字密码',
        icon: 'none',
        duration: 1500
      })
      return
    }
    var param = {
      key: this.data.key,
    }
    switch(parseInt(this.data.index)) {
      case 0:
        param.counts = '1'
        break
      case 1:
        param.due_date = this.data.date
        break
      case 2:
        param.bt = this.data.bgtime
        param.et = this.data.edtime
        break
    }
    serverProxy.newPassword(this.data.index, param, function(msg) {
      if (msg.statusCode == 200) {
        wx.showModal({
          title: '新密码',
          content: msg.data.key,
          showCancel: false,
          confirmColor: '5af0b1',
        })
      }else {
        wx.showToast({
          title: '创建密码失败，请确认数字密码是否有误',
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var now = new Date()
    var y = now.getFullYear()
    var m = now.getMonth() + 1
    var d = now.getDate()
    var h = now.getHours()
    var min = now.getMinutes()
    
    this.setData({
      today: y + '-' + this.getTimestr(m) + '-' + this.getTimestr(d),
      date: y + '-' + this.getTimestr(m) + '-' + this.getTimestr(d),
      bgtime: this.getTimestr(h) + ':' + this.getTimestr(min),
    })
    
  },

  getTimestr: function (time) {
    if (time < 10) {
      time = '0' + time
    }
    return time
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})