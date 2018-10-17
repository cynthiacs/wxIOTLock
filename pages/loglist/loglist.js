// pages/loglist/loglist.js
const serverProxy = require('../../utils/serverproxy.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      // {
      //   id: 1122,
      //   typename: "指纹密码",
      //   pwname: "我的指纹",
      //   time: "2018-10-17T03:07:19.000Z",
      //   device_name: "dev_rrpc"
      // },
      // {
      //   id: 2345,
      //   typename: "数字密码",
      //   pwname: "老大",
      //   time: "2018-10-17T03:25:19.000Z",
      //   device_name: "dev_rrpc"
      // },
      // {
      //   id: 6844,
      //   typename: "限时密码",
      //   pwname: "老二",
      //   time: "2018-10-17T03:25:19.000Z",
      //   device_name: "dev_rrpc"
      // },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    serverProxy.getUnlockLog(function (msg) {
      that.setData({
        list: msg.data.rows
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