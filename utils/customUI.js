const serverProxy = require('serverproxy.js')

function showApplyDialog(ownerid, id) {
  wx.showModal({
    title: '绑定申请',
    content: '该设备已绑定管理员，需要向管理员申请绑定，申请通过后会通知你，是否确定申请？',
    success(res) {
      if (res.confirm) {
        console.log("apply for auth")
        serverProxy.applyAuth(ownerid+"", id, msg => {
          console.log(msg)
          if (msg.statusCode == 200) {
            console.log("applyAuth success")
            wx.showModal({
              title: '绑定申请已发送',
              content: '已向管理员发起绑定申请，申请通过后会由微信服务通知给您！',
              showCancel: false,
            })
          } else {
            wx.showToast({
              title: '绑定请求发送失败，可能是网络原因，请稍后重试',
              icon: 'none',
              duration: 1500,
            })
          }
        })
      } else if (res.cancel)
        wx.showToast({
          title: '绑定设备失败',
          icon: 'none',
          duration: 2000,
        })
    }
  })
}

module.exports = {
  showApplyDialog: showApplyDialog,
}