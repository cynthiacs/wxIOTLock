// pages/tempkeylist/addtemppsw/addtemppsw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: '说明：临时密码为一次性密码，密码使用后将永久失效',
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