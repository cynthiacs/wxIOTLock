const app = getApp()
var baseUrl = 'https://www.leadcoreiot.top';
var devName = app.globalData.deviceName
function serverProxy() {
  console.log("serverProxy")
  this.wxCode = null
  this.userInfo = null
  this.token = null
}

function login(wxCode, userinfo, listener) {
  console.log("serverproxy: login")
  // var baseUrl = 'https://www.leadcoreiot.top';
  this.wxCode = wxCode
  this.userInfo = userinfo
  var userinfoJson = {}
  userinfoJson.username = userinfo.nickName
  userinfoJson.avtor = userinfo.avatarUrl

  var data = {
    js_code: wxCode,
    userinfo: JSON.stringify(userinfoJson),
    devid: "4"
  }
  wx.request({
    url: baseUrl + '/iot/api/wx/login',
    method: 'POST',
    data: data,
    success: function (data) {
      if (data.statusCode === 200) {
        console.log(data.data.token)
      } else {
      }
      listener(data)
    },
    fail: function (data) {
      wx.showToast({
        title: 'HTTP 请求失败',
        icon: none,
      })
      // listener(data)
    }
  });
}

function addPassword(keytype, keyname, listener) {
  var typestr = getKeyType(keytype)
  var data = {
    access_token: app.globalData.sessionId,
    name: keyname,
    devname: devName
  }
  var options = {
    url: '/iot/api/' + typestr + '/add',
    data: data,
    method: 'POST',
  }
  wxRequest(options, listener)
}

function getKeys(keytype, listener) {
  var typestr = getKeyType(keytype)
  var data = {
    access_token: app.globalData.sessionId,
    devname: devName
  }
  var options = {
    url: '/iot/api/' + typestr + '/search',
    data: data,
    method: 'GET',
  }
  wxRequest(options, listener)
}

function deleteKey(keytype, keyid, listener) {
  var typestr = getKeyType(keytype)
  var data = {
    access_token: app.globalData.sessionId,
    devname: devName
  }
  var options = {
    url: '/iot/api/' + typestr + '/' + keyid + '/del',
    data: data,
    method: 'POST',
  }
  wxRequest(options, listener)
}

function getKeyType(keytypeIndex) {
  var typestr = "password"//card/finger
  switch (parseInt(keytypeIndex)) {
    case 0:
      typestr = "password"
      break
    case 1:
      typestr = "finger"
      break
    case 2:
      typestr = "card"
      break
  }
  return typestr
}

function unlockonce(listener) {
  var data = {
    access_token: app.globalData.sessionId,
    devname: devName
  }
  var options = {
    url: '/iot/api/command/0x8110',
    data: data,
    method: 'POST',
  }
  wxRequest(options, listener)
}

function getPassword(passwordType, listener) {
  var data = {
    access_token: app.globalData.sessionId,
    devname: devName
  }
  var options = {
    url: '/iot/api/password/'+passwordType+'/search',
    data: data,
    method: 'GET',
  }
  wxRequest(options, listener)
}

function wxRequest(options, listener) {
  wx.request({
    url: baseUrl + options.url,
    method: options.method,
    data: options.data,
    success: function (data) {
      listener(data)
    },
    fail: function (data) {
      // listener(data)
      wx.showToast({
        title: 'HTTP 请求失败',
        icon: none,
      })
    }
  })
}

module.exports = {
  serverProxy: serverProxy,
  login: login,
  addPassword: addPassword,
  getKeys: getKeys,
  deleteKey: deleteKey,
  unlockonce: unlockonce,
  getPassword: getPassword,
}