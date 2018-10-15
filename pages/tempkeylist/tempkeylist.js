// pages/tempkeylist/tempkeylist.js
const serverProxy = require('../../utils/serverproxy.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countkeyList: [],
    timekeyList: [],
    deadlinekeyList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  addpsw: function () {
    wx.navigateTo({
      url: 'addtemppsw/addtemppsw',
    })
  },

  shareDeadlineKey: function (e) {
    var index = e.currentTarget.dataset.index
    var pswInfo = this.data.deadlinekeyList[index]
    wx.navigateTo({
      url: 'sharepsw/sharepsw?pswtype=限时密码&psw=' + pswInfo.key + '&tips=' + '有效期至：' + pswInfo.due_date,
    })
  },

  shareTimeKey: function (e) {
    var index = e.currentTarget.dataset.index
    var pswInfo = this.data.timekeyList[index]
    wx.navigateTo({
      url: 'sharepsw/sharepsw?pswtype=限时段密码&psw=' + pswInfo.key + '&tips=' + '有效时间段：' + pswInfo.bt + '-' + pswInfo.et,
    })
  },

  shareCountkey: function (e) {
    var index = e.currentTarget.dataset.index
    var pswInfo = this.data.countkeyList[index]
    wx.navigateTo({
      url: 'sharepsw/sharepsw?pswtype=临时密码&psw=' + pswInfo.key + '&tips=' + '仅能开锁一次',
    })
  },

  delCountkey: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    serverProxy.deletePassword('counts', this.data.countkeyList[index].id,
      function (msg) {
        if (msg.statusCode == 200 && msg.data.success) {
          wx.showToast({
            title: '删除密钥成功',
            icon: 'none',
            duration: 1500
          })
          that.updateCountPsw()
        }
      })
  },

  updateCountPsw: function () {
    var that = this
    serverProxy.getPassword('counts', function (msg) {
      console.log("counts:")
      console.log(msg)
      that.setData({
        countkeyList: msg.data
      })
    })
  },

  updateDeadlinePsw: function () {
    var that = this
    serverProxy.getPassword('time', function (msg) {
      console.log("time:")
      console.log(msg)
      that.setData({
        timekeyList: msg.data
      })
    })
  },

  updateTimePsw: function () {
    var that = this
    serverProxy.getPassword('deadline', function (msg) {
      console.log("deadline:")
      console.log(msg)
      that.setData({
        deadlinekeyList: msg.data
      })
    })
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
    this.updateCountPsw()
    this.updateDeadlinePsw()
    this.updateTimePsw()
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