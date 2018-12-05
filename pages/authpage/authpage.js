// pages/authpage/authpage.js
const serverProxy = require('../../utils/serverproxy.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: null,
    userName: null,
    devId: null,
    devName: null,
    date: null,
    applyid: null,
    hasChecked: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      devId: options.devid,
      devName: options.devname,
      userId: options.fromuser,
      userName: options.username,
      applyid: options.applyid,
    })
    serverProxy.getAuthInfo('2', '0', msg => {
      console.log(msg)
      if(msg.statusCode == 200) {
        let authlist = msg.data
        for(let i = 0 ; i < authlist.length; i++) {
          if (parseInt(this.data.applyid)  == authlist[i].id) {
            this.setData({
              hasChecked: false
            })
            return
          }
        }
      }
    })
  },

  agree: function() {
    console.log(this.data.devId)
    serverProxy.replyAuth("1", this.data.devId, this.data.userId,
        this.data.applyid, msg => {
      console.log(msg)
      if (msg.statusCode == 200) {
        console.log("agree success")
        wx.showToast({
          title: '您已同意授权',
          icon: 'none',
          duration: 1500,
        })
        wx.navigateTo({
          url: '../index/index',
        })
      }
    })
  },

  disagree: function() {
    serverProxy.replyAuth("0", this.data.devId, this.data.userId,
      this.data.applyid, msg => {
      console.log(msg)
      if (msg.statusCode == 200) {
        console.log("disagree success")
        wx.showToast({
          title: '您已取消授权',
          icon: 'none',
          duration: 1500,
        })
        wx.navigateTo({
          url: '../index/index',
        })
      }
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