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
    // wx.navigateTo({
    //   url: 'addlock/addlock',
    // })
    var that = this
    wx.scanCode({
      success(res) {
        console.log(res)
        if(res.path) {
          var devId
          let path = res.path
          let param = (path.split("?"))[1]
          let paramArr = param.split("&")
          for(let i = 0; i < paramArr.length; i++) {
            let devArr = paramArr[0].split("=")
            for(let j = 0; j < devArr.length; j++) {
              if(devArr[j] == "devid") {
                devId = devArr[j+1]
                break
              }
            }
            if(devId) {
              break
            }
          }
          console.log("scan get devId:"+devId)
          if(devId) {
            wx.showModal({
              title: '添加智能锁设备',
              content: '是否确定添加ID为'+devId+'的智能锁',
              success(res) {
                if (!app.globalData.sessionId) {
                  that.login(devId)
                }else {
                  console.log("you have logined, to bind")
                }
              }
            })
          }
        }else {
          //show no info
        }

      }
    })
  },

  login: function(devId) {
    var that = this
    wx.login({
      success: res => {
        var code = res.code
        wx.getUserInfo({
          success: res => {
            var userInfo = res.userInfo
            app.globalData.userInfo = userInfo
            console.log("after getUserInfo:" + devId)
            if (devId) {
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
                          list[i].checked = true
                          console.log("get lock name:" + app.globalData.deviceName)
                          break
                        }
                      }
                      that.setData({
                        list: list
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: '添加失败，可能是网络问题',
                    icon: 'none',
                    duration: 1500
                  })
                }
              })
            }
          }
        })
      }
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
          if (id && id == list[i].group_id) {
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