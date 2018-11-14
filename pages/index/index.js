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
    mDevId: undefined,
    locklist: [],
    code: null
  },

  onLoad: function (options) {
    console.log("onLoad options:")
    console.log(options)
    var devId
    var gdevId = app.globalData.deviceId
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
    this.setData({
      mDevId: devId
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log("wx.getSetting has authed")
          this.setData({
            isAuthed: true
          })
          var session = wx.getStorageSync('SESSIONID')
          if (!session) {
            console.log("session has been cleaned")
            this.login()
          } else {
            app.globalData.sessionId = session
            this.sessionCheck()
          }
        } else {
          console.log("wx.getSetting not authed")
        }
      }
    })
  },

  sessionCheck: function () {
    wx.checkSession({
      success: res => {
        console.log("session effective")
        serverProxy.getLocks(msg => {
          console.log("getLocks:")
          console.log(msg)
          if (msg.statusCode == 200) {
            var gid = app.globalData.deviceId
            var id = this.data.mDevId
            var list = msg.data
            if(!id) {
              if (!gid) {
                if (list != null && list.length > 0) {
                  console.log("get lock from list")
                  serverProxy.setDevName(list[0].id, list[0].name)
                }
              } else {
                this.setNewGID(gid, list)
              }
            }else {
              if (!this.setNewGID(id, list)) {
                console.log("to bind devId " + id)
                this.bindNewLock(id)
              }
            }
          }
        })
      },
      fail: res => {
        //连接失效，不提示用户，重新登陆
        console.log("session invalid")
        this.login()
      }
    })
  },

  bindNewLock: function(id) {
    serverProxy.bindLock(id, msg => {
      console.log("bindLock:")
      console.log(msg)
      if (msg.data.success) {
        //如果绑定成功gid设为id
        serverProxy.getLocks(msg => {
          if (msg.statusCode == 200) {
            var newList = msg.data
            this.setNewGID(id, newList)
          }
        })
      } else {
        var userId = msg.data.owner_user_id
        if (userId) {
          this.showApplyDialog()
        }
      }
    })
  },

  showApplyDialog: function () {
    wx.showModal({
      title: '绑定申请',
      content: '该设备已绑定管理员，需要向管理员申请绑定，申请通过后会通知你，是否确定申请？',
      success(res) {
        if (res.confirm)
          console.log("todo: apply for manager")
        else if (res.cancel)
          wx.showToast({
            title: '绑定设备失败',
            icon: 'none',
            duration: 2000,
          })
      }
    })
  },

  setNewGID: function(id, list) {
    for (let i = 0; i < list.length; i++) {
      if (id && id == list[i].id) {
        serverProxy.setDevName(id, list[i].name)
        console.log("setNewGID new lock name:" + app.globalData.deviceName)
        return true
      }
    }
    return false
  },

  bindGetUserInfo: function (e) {
    //第一次使用，用户授权 
    console.log(e)
    if (e.detail.userInfo) {
      this.login()
    }
  },

  login: function (devId) {
    wx.login({
      success: res => {
        console.log("wx login success")
        var code = res.code
        wx.getUserInfo({
          success: res => {
            var userInfo = res.userInfo
            app.globalData.userInfo = userInfo
            var id = this.data.mDevId
            var devId = app.globalData.deviceId
            if (id) {
              devId = id
            }
            console.log("before login:" + devId)
            serverProxy.login(code, userInfo, devId, msg => {
              if (msg.statusCode == 200) {
                console.log("server login success")
                console.log(msg)
                app.globalData.sessionId = msg.data.token
                wx.setStorageSync("SESSIONID", app.globalData.sessionId)
                if (devId) {
                  var userId = msg.data.owner_user_id
                  if (userId) {
                    console.log("login result: dev has manager")
                    this.showApplyDialog()
                  } else {
                    serverProxy.getLocks(msg => {
                      console.log(msg)
                      if (msg.statusCode == 200) {
                        var list = msg.data
                        this.setNewGID(devId, list)
                      }
                    })
                  }
                } else {
                  wx.showModal({
                    title: '温馨提示',
                    content: '您还没有绑定门锁信息，请去智能锁设置中设置默认锁或者添加门锁信息',
                    success: res => {
                      if (res.confirm)
                        this.lockSetting()
                    }
                  })
                }
              } else {
                wx.showToast({
                  title: '登录失败，可能是网络问题',
                  icon: 'none',
                  duration: 1500
                })
              }
            })
          },
          fail: res => {
            console.log(res)
          }
        })
        this.setData({
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

  unlockonce: function () {
    if (!app.globalData.deviceId ||
      app.globalData.deviceId == -1) {
      this.showDialog()
      return
    }
    serverProxy.unlockonce(function (msg) {
      console.log(msg)
      if (msg.statusCode == 200) {
        if (msg.data.result == 0) {
          wx.showToast({
            title: '开锁成功',
            icon: 'none',
            duration: 3000,
          })
        } else {
          wx.showToast({
            title: '开锁失败',
            icon: 'none',
            duration: 3000,
          })
        }
      } else {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 3000,
        })
      }
    })
  },

  shareKey: function () {
    // if (!app.globalData.deviceId ||
    //   app.globalData.deviceId == -1) {
    //   this.showDialog()
    //   return
    // }
    wx.navigateTo({
      url: '../tempkeylist/tempkeylist',
    })
  },

  getUnlockLog: function () {
    if (!app.globalData.deviceId ||
      app.globalData.deviceId == -1) {
      this.showDialog()
      return
    }
    wx.navigateTo({
      url: '../loglist/loglist',
    })
  },

  getKeyLists: function () {
    if (!app.globalData.deviceId ||
      app.globalData.deviceId == -1) {
      this.showDialog()
      return
    }
    wx.navigateTo({
      url: '../keyslist/keyslist',
    })
  },

  keyManagerment: function () {
    if (!app.globalData.deviceId ||
      app.globalData.deviceId == -1) {
      this.showDialog()
      return
    }
    wx.navigateTo({
      url: '../keymanagerment/keymanagerment',
    })
  },

  lockSetting: function () {
    wx.navigateTo({
      url: '../locklist/locklist',
    })
  },

  setPassword: function () {
    wx.navigateTo({
      url: '../pswsettings/pswsettings',
    })
  },

  showDialog: function () {
    wx.showModal({
      title: '温馨提示',
      content: '您还没有设置智能锁，快去设置您的智能锁吧',
      showCancel: false,
      success: res => {
        if(res.confirm) {
          this.lockSetting()
        }
      }
    })
  },
})