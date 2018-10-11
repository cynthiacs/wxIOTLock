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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    serverProxy.getPassword('counts', function (msg) {
      console.log("counts:")
      console.log(msg)
    })
    serverProxy.getPassword('time', function (msg) {
      console.log("time:")
      console.log(msg)
    })
    serverProxy.getPassword('deadline', function (msg) {
      console.log("deadline:")
      console.log(msg)
    })
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