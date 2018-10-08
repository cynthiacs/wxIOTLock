//index.js
//获取应用实例
const app = getApp()
const serverProxy = require('../../utils/serverproxy.js')

Page({
  data: {
    imgUrls: [
      '../../icons/lock0.jpg',
      '../../icons/lock1.jpg',
      '../../icons/lock2.jpg',
      '../../icons/lock3.jpg'
    ],
    isAuthed: false,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    isHiddenLoading: true,
    isHiddenToast: true,
    battery: "电量剩余：",
    code: null
  },

  onLoad: function () {
    console.log("onLoad")
    console.log(app.globalData.sessionId)
    if (app.globalData.sessionId != null) {
      this.setData({
        isAuthed: true
      })
      wx.checkSession({
        success: res => {
          console.log("session effective")
        },
        fail: res => {
          console.log("session invalid")
          this.login()
        }
      })
    }else {
      this.setData({
        isAuthed: false
      })
    }
  },

  bindGetUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo) {
      this.login()
    }
  },

  login: function () {
    var that = this
    wx.login({
      success: res => {
        console.log("wx login success")
        var code = res.code
        //test code
        // app.globalData.sessionId = "021qEHFZ1wrOJ01TLKFZ1RoYFZ1qEHFo"
        // wx.setStorageSync("SESSIONID", app.globalData.sessionId)
        // that.setData({
        //   isAuthed: true
        // })
        wx.getUserInfo({
          success: res => {
            var userInfo = res.userInfo
            serverProxy.login(code, userInfo, function (msg) {
              if (msg.statusCode == 200) {
                app.globalData.sessionId = msg.data.token
                wx.setStorageSync("SESSIONID", app.globalData.sessionId)
                that.setData({
                  isAuthed: true
                })
              } else {
                wx.showToast({
                  title: '登录失败，可能是网络问题',
                  icon: 'none',
                  duration: 1500
                })
              }
            })
          }
        })
      },
      fail: res => {
        wx.showToast({
          title: '登录失败，可能是网络问题',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  
  getBattery: function () {
    // this.setData({
    //   isHiddenLoading: false
    // })
    wx.showToast({
      title: '电量剩余：30%',
      icon: 'none',
      duration: 3000
    })
  },

  setPassword: function () {
    wx.navigateTo({
      url: '../pswsettings/pswsettings',
    })
  },

  toastHide: function () {
    this.setData({
      isHiddenToast: true
    })
  }
})
