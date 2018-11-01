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
    devId: -1,
    locklist: [],
    code: null
  },

  onLoad: function (options) {
    console.log("onLoad")
    console.log(options)
    var devId
    if (options.scene) {
      console.log(options.scene)
      var scene = decodeURIComponent(options.scene)
      var sArr = scene.split('&')
      devId = (sArr[0].split('='))[1]
      console.log("scene:" + devId)
    } else if (options.devid) {
      devId = options.devid
      console.log("devid:" + devId)
    }

    if(devId) {
      this.setData({
        devId: devId
      })
      console.log("this devid:" + this.data.devId)
    }else {
      this.setData({
        devId: app.globalData.deviceId
      })
      console.log("this gdevid:" + this.data.devId)
    }

    if(app.globalData.userInfo != null) {
      this.setData({
        isAuthed: true
      })
      var that = this
      wx.checkSession({
        success: res => {
          var sessionId = wx.getStorageSync('SESSIONID')
          console.log("sessionId = " + sessionId)
          if (sessionId && app.globalData.deviceId) {
            //连接有效，根据Id获取设备名，进行后续操作
            app.globalData.sessionId = sessionId
            serverProxy.getLocks(function (msg) {
              console.log(msg)
              if (msg.statusCode == 200) {
                var id = app.globalData.deviceId
                var list = msg.data
                for (var i = 0; i < list.length; i++) {
                  if (id && id == list[i].group_id) {
                    // app.globalData.deviceName = list[i].name
                    serverProxy.setDevName(id, list[i].name)
                    console.log("get lock name:" + app.globalData.deviceName)
                    break
                  }
                }
                // that.setData({
                //   locklist: list
                // })
              }
            })
          } else {
            //连接有效，但是本地数据被清理，需要去智能锁设置中重新登陆或绑定
            wx.showModal({
              title: '温馨提示',
              content: '您的门锁信息可能被清理，请去智能锁设置中设置默认锁或者添加门锁信息',
              success(res) {
                that.lockSetting()
              }
            })
          }
          console.log("session effective")
        },
        fail: res => {
          //连接失效，不提示用户，重新登陆
          console.log("session invalid")
          that.login()
        }
      })
    }
  },

  bindGetUserInfo: function(e) {
    //第一次使用，用户授权 
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
            app.globalData.userInfo = userInfo
            var devId = that.data.devId
            console.log("after getUserInfo:" + devId)
            if (devId && devId != -1) {
              serverProxy.login(code, userInfo, devId, function (msg) {
                if (msg.statusCode == 200) {
                  console.log("server login success")
                  app.globalData.sessionId = msg.data.token
                  wx.setStorageSync("SESSIONID", app.globalData.sessionId)
                  app.globalData.deviceId = devId
                  wx.setStorageSync("DEVID", app.globalData.deviceId)
                  serverProxy.getLocks(function (msg) {
                    console.log(msg)
                    if (msg.statusCode == 200) {
                      var id = app.globalData.deviceId
                      var list = msg.data
                      for (var i = 0; i < list.length; i++) {
                        if (id && id == list[i].group_id) {
                          // app.globalData.deviceName = list[i].name
                          serverProxy.setDevName(id, list[i].name)
                          console.log("get lock name:" + app.globalData.deviceName)
                          break
                        }
                      }
                    }
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
          },
          fail: res => {
            console.log(res)
          }
        })
        that.setData({
          isAuthed: true
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

  unlockonce: function() {
    if (!app.globalData.deviceId
    || app.globalData.deviceId == -1) {
      this.showDialog()
      return
    }
    serverProxy.unlockonce(function(msg) {
      console.log(msg)
      if(msg.statusCode == 200) {
        if(msg.data.result == 0) {
          wx.showToast({
            title: '开锁成功',
            icon: 'none',
            duration: 3000,
          })
        }else {
          wx.showToast({
            title: '开锁失败',
            icon: 'none',
            duration: 3000,
          })
        }
      }else {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 3000,
        })
      }
    })
  },

  shareKey: function() {
    if (!app.globalData.deviceId
      || app.globalData.deviceId == -1) {
      this.showDialog()
      return
    }
    wx.navigateTo({
      url: '../tempkeylist/tempkeylist',
    })
  },
  
  getUnlockLog: function () {
    if (!app.globalData.deviceId
      || app.globalData.deviceId == -1) {
      this.showDialog()
      return
    }
    wx.navigateTo({
      url: '../loglist/loglist',
    })
  },

  getKeyLists: function () {
    if (!app.globalData.deviceId
      || app.globalData.deviceId == -1) {
      this.showDialog()
      return
    }
    wx.navigateTo({
      url: '../keyslist/keyslist',
    })
  },

  keyManagerment: function() {
    if (!app.globalData.deviceId
      || app.globalData.deviceId == -1) {
      this.showDialog()
      return
    }
    wx.navigateTo({
      url: '../keymanagerment/keymanagerment',
    })
  },

  lockSetting: function() {
    wx.navigateTo({
      url: '../locklist/locklist',
    })
  },

  setPassword: function () {
    wx.navigateTo({
      url: '../pswsettings/pswsettings',
    })
  },

  showDialog: function() {
    wx.showModal({
      title: '温馨提示',
      content: '您还没有设置智能锁，快去设置您的智能锁吧',
      showCancel: false,
    })
  },

  toastHide: function () {
    this.setData({
      isHiddenToast: true
    })
  }
})
