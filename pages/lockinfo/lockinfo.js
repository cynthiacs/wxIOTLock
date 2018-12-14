// pages/lockinfo/lockinfo.js
const app = getApp()
const devOpt = require('../../utils/devOpt.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mDevName: null,
    mLockList: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mDevName: options.devname
    })

  },

  actLock: function() {
    devOpt.scanActLock(msg => {
      console.log("update mDevName")
      this.setData({
        mDevName: app.globalData.deviceName
      })
    })
  },

  chooseLock: function() {
    wx.navigateTo({
      url: '../locklist/locklist',
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
    console.log("lockInfo:onshow")
    this.setData({
      mDevName: app.globalData.deviceName
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