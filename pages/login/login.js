// pages/login/login.js
const app = getApp()
const serverProxy = require('../../utils/serverproxy.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '智能门锁',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.navigateTo({
      url: '../index/index',
    })
    // if (app.globalData.userInfo) {
    //   console.log("app.globalData.userInfo")
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.login({
    //     success: res => {
    //       console.log("wx login success")
    //       app.globalData.wxcode = res.code
    //     }
    //   })
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    serverProxy.serverProxy()
  },

  bindGetUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.rawData
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  },

  login: function () {
    console.log("login")
    serverProxy.login(app.globalData.wxcode, app.globalData.userInfo)
    wx.navigateTo({
      url: '../index/index',
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