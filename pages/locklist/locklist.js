// pages/locklist/locklist.js
const app = getApp()
const serverProxy = require('../../utils/serverproxy.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      // {
      //   id: 4,
      //   name: 'dev_rrpc',
      //   value: '我的家',
      //   checked: false,
      // },
      // {
      //   id: 5,
      //   name: 'dev_rrpc2',
      //   value: '我的公司',
      //   checked: false
      // },
    ],
  },

  addLock: function () {
    wx.navigateTo({
      url: 'addlock/addlock',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    serverProxy.getLocks(function(msg) {
      console.log(msg)
      if(msg.statusCode == 200) {
        var id = app.globalData.deviceId
        var list = msg.data
        for (var i = 0; i < list.length; i++) {
          if(id && id == list[i].id) {
            list[i].checked = true
            break
          }
        }
        that.setData({
          list: list
        })
      }
    })
  },

  radioChange: function(e) {
    var index = e.detail.value
    var list = this.data.list
    // app.setDevId(list[index].id, list[index].name)
    serverProxy.setDevName(list[index].id, list[index].name)
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