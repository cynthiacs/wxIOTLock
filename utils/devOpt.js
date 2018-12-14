const app = getApp()
const serverProxy = require('serverproxy.js')
const customUI = require('customUI.js')

function scanActLock(listener) {
  wx.scanCode({
    success: res => {
      console.log(res)
      if (res.path) {
        var devId
        let path = res.path
        let param = (path.split("?"))[1]
        let paramArr = param.split("&")
        for (let i = 0; i < paramArr.length; i++) {
          console.log("paramArr[" + i + "]:" + paramArr[i])
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
          } else {
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

          if (devId) {
            break
          }
        }
        console.log("scan get devId:" + devId)
        if (devId) {
          serverProxy.getLocks(msg => {
            console.log(msg)
            if (msg.statusCode == 200) {
              var list = msg.data
              for (let k = 0; k < list.length; k++) {
                if (devId == list[k].id) {
                  console.log("lock has been binded")
                  wx.showModal({
                    title: '添加智能锁设备',
                    content: '您已绑定该设备，是否确定切换至该设备？',
                    success: res => {
                      if (res.confirm) {
                        serverProxy.setDevName(devId, list[k].name)
                        listener()
                      }
                    }
                  })
                  return
                }
              }
              wx.showModal({
                title: '添加智能锁设备',
                content: '是否确定添加ID为' + devId + '的智能锁',
                success: res => {
                  if (res.confirm) {
                    console.log("you have logined, to bind")
                    bindNewLock(devId, listener)
                  }
                }
              })
            }
          })
          return
        }
      }
      showError()
    },
    fail: res => {
      showError()
    }
  })
}

function showError() {
  wx.showModal({
    title: '友情提示',
    content: '未扫描到有效的智能锁信息',
    showCancel: false
  })
}

function bindNewLock(devId, listener) {
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
              listener()
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
}

function login(devId, listener) {
  wx.login({
    success: res => {
      console.log("wx login success")
      var code = res.code
      wx.getUserInfo({
        success: res => {
          var userInfo = res.userInfo
          app.globalData.userInfo = userInfo
          console.log("before login:" + devId)
          serverProxy.login(code, userInfo, devId, msg => {
            if (msg.statusCode == 200) {
              console.log("server login success")
              console.log(msg)
              app.globalData.sessionId = msg.data.token
              wx.setStorageSync("SESSIONID", app.globalData.sessionId)
              var ownerId = msg.data.owner_user_id
              if (ownerId && devId) {
                console.log("login result: dev has manager")
                customUI.showApplyDialog(ownerId, devId)
              } else {
                serverProxy.getLocks(msg => {
                  console.log(msg)
                  if (msg.statusCode == 200) {
                    var list = msg.data
                    if (devId) {
                      for (let i = 0; i < list.length; i++) {
                        if (devId && devId == list[i].id) {
                          serverProxy.setDevName(devId, list[i].name)
                        }
                      }
                    } else if (list.length > 0) {
                      serverProxy.setDevName(list[0].id, list[0].name)
                    }
                    if (listener) {
                      listener(msg)
                    }
                  }
                })
              }
            } else {
              if (listener) {
                listener(msg)
              }
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
    },
    fail: res => {
      wx.showToast({
        title: '登录失败，可能是网络问题',
        icon: 'none',
        duration: 1500
      })
    }
  })
}

module.exports = {
  scanActLock: scanActLock,
  bindNewLock: bindNewLock,
  login: login,
}