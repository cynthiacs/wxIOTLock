// pages/locklist/locklist.js
const app = getApp()
const serverProxy = require('../../utils/serverproxy.js')
const customUI = require('../../utils/customUI.js')

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
    wx.scanCode({
      success: res => {
        console.log(res)
        if(res.path) {
          var devId
          let path = res.path
          let param = (path.split("?"))[1]
          let paramArr = param.split("&")
          for(let i = 0; i < paramArr.length; i++) {
            console.log("paramArr["+i+"]:"+paramArr[i])
            let devArr = paramArr[0].split("=")
            console.log("devArr.length:" + devArr.length)
            if (devArr[0] == "scene" && devArr.length <= 2) {
              // for ios & simulator.
              // eg:paramArr[0]:scene=devid%3D1%26pk%3Da19ZV8Xax35
              var scene = decodeURIComponent(devArr[1])
              var sArr = scene.split('&')
              devId = (sArr[0].split('='))[1]
              console.log("scene:" + devId)
              break
            } else{
              // for android
              // ed:paramArr[0]:scene=devid=1
              for (let j = 0; j < devArr.length; j++) {
                console.log("devArr[" + j + "]:" + devArr[j])
                if (devArr[j] == "devid") {
                  devId = devArr[j + 1]
                  break
                }
              }
            }
            
            if(devId) {
              break
            }
          }
          console.log("scan get devId:"+devId)
          if(devId) {
            var list = this.data.list
            var hasBinded = false
            for (let k = 0; k < list.length; k++) {
              if (devId == list[k].id) {
                console.log("lock has been binded")
                hasBinded = true
                break
              }
            }
            if (hasBinded) {
              wx.showModal({
                title: '添加智能锁设备',
                content: '您已经添加了ID为' + devId + '的智能锁，请在下面的列表中选择',
                showCancel: false,
              })
            }else {
              wx.showModal({
                title: '添加智能锁设备',
                content: '是否确定添加ID为' + devId + '的智能锁',
                success: res => {
                  if (res.confirm) {
                    if (!app.globalData.sessionId) {
                      this.login(devId)
                    } else {
                      console.log("you have logined, to bind")
                      this.bindNewLock(devId)
                    }
                  }
                }
              })
            }
            return
          }
        }
        this.showError()
      },
      fail: res => {
        this.showError()
      }
    })
    
  },

  showError: function () {
    wx.showModal({
      title: '友情提示',
      content: '未扫描到有效的智能锁信息',
      showCancel: false
    })
  },

  bindNewLock: function (devId) {
    serverProxy.bindLock(devId, msg => {
      console.log("bindLock:")
      console.log(msg)
      if (msg.data.success) {
        //如果绑定成功gid设为id
        serverProxy.getLocks(msg => {
          if (msg.statusCode == 200) {
            var newList = msg.data
            for (var j = 0; j < newList.length; j++) {
              if (devId == newList[j].id) {
                serverProxy.setDevName(devId, newList[j].name)
                break
              }
            }
          }
        })
      } else {
        var ownerId = msg.data.owner_user_id
        if (ownerId) {
          customUI.showApplyDialog(ownerId, devId)
        }
      }
    })
  },

  // showApplyDialog: function (ownerId, devId) {
  //   wx.showModal({
  //     title: '绑定申请',
  //     content: '该设备已绑定管理员，需要向管理员申请绑定，申请通过后会通知你，是否确定申请？',
  //     success(res) {
  //       if (res.confirm)
  //         console.log("todo: apply for manager")
  //       else if (res.cancel)
  //         wx.showToast({
  //           title: '绑定设备失败',
  //           icon: 'none',
  //           duration: 2000,
  //         })
  //     }
  //   })
  // },

  login: function(devId) {
    wx.login({
      success: res => {
        var code = res.code
        wx.getUserInfo({
          success: res => {
            var userInfo = res.userInfo
            app.globalData.userInfo = userInfo
            console.log("after getUserInfo:" + devId)
            if (devId) {
              serverProxy.login(code, userInfo, devId, msg => {
                if (msg.statusCode == 200) {
                  console.log("server login success")
                  app.globalData.sessionId = msg.data.token
                  wx.setStorageSync("SESSIONID", app.globalData.sessionId)
                  app.globalData.deviceId = devId
                  wx.setStorageSync("DEVID", app.globalData.deviceId)
                  serverProxy.getLocks(msg => {
                    console.log(msg)
                    if (msg.statusCode == 200) {
                      var id = app.globalData.deviceId
                      var list = msg.data
                      for (var i = 0; i < list.length; i++) {
                        if (id && id == list[i].id) {
                          // app.globalData.deviceName = list[i].name
                          serverProxy.setDevName(id, list[i].name)
                          list[i].checked = true
                          console.log("get lock name:" + app.globalData.deviceName)
                          break
                        }
                      }
                      this.setData({
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
    serverProxy.getLocks(msg => {
      console.log(msg)
      if(msg.statusCode == 200) {
        var id = app.globalData.deviceId
        var list = msg.data
        for (var i = 0; i < list.length; i++) {
          if (id && id == list[i].id) {
            list[i].checked = true
            break
          }
        }
        this.setData({
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