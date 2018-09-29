function serverProxy() {
  console.log("serverProxy")
  this.wxCode = null
  this.userInfo = null
}

function login(wxCode, userinfo, listener) {
  console.log("serverproxy: login")
  var baseUrl = 'https://www.leadcoreiot.top';
  this.wxCode = wxCode
  this.userInfo = userinfo
  var userinfoJson = {}
  userinfoJson.username = userinfo.nickName
  userinfoJson.avtor = userinfo.avatarUrl
  var data = {
    js_code: wxCode,
    userinfo: userinfoJson,
  }
  console.log(data)
  wx.request({
    url: baseUrl + '/iot/api/wx/login',
    method: 'POST',
    data: data,
    success: function(data) {
      listener(data)
    },
    fail: function(data) {
      listener(data)
    }
  });
}

module.exports = {
  serverProxy: serverProxy,
  login: login
}