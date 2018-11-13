//app.js

App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    

    var devId = wx.getStorageSync('DEVID')
    console.log("getStorageSync devId = " + devId)
    if (devId) {
      this.globalData.deviceId = devId
    }

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    
  },

  setDevId: function(id, name) {
    this.globalData.deviceId = id
    this.globalData.deviceName = name
  },

  globalData: {
    sessionId: null,
    userInfo: null,
    deviceName: null,//"dev_rrpc",
    deviceId: undefined,//4,
  }
})