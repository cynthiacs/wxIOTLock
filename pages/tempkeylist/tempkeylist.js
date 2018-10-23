// pages/tempkeylist/tempkeylist.js
const serverProxy = require('../../utils/serverproxy.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countkeyList: [],
    timekeyList: [],
    deadlinekeyList: [],
    onceList: [],
    longList: [],
    emptyPos: 0,
    oncePswSize: 0,
    pageHasHide: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  addpsw: function () {
    wx.navigateTo({
      url: 'addtemppsw/addtemppsw?os=' + 'add' + '&pos=' + this.data.emptyPos,
    })
  },

  editlongPsw: function(e) {
    var index = e.currentTarget.dataset.index
    var item = this.data.longList[index]
    var pos = item.pos
    wx.navigateTo({
      url: 'addtemppsw/addtemppsw?os=' + 'edit' + '&pos=' + pos,
    })
  },

  sharelongPsw: function (e) {
    var index = e.currentTarget.dataset.index
    var pswInfo = this.data.longList[index].pwdinfo
    var tips = ''
    var pswtype = ''
    switch (parseInt(pswInfo.typeindex)) {
      case 1:
        pswtype = '限时密码'
        tips = '有效期至：' + pswInfo.detail.due_date
        break
      case 2:
        pswtype = '限时段密码'
        tips = '有效时间段：' + pswInfo.detail.bt + '-' + pswInfo.detail.et
        break
      case 3:
        pswtype = '限次密码'
        tips = '有效开锁次数：' + pswInfo.detail.counts
        break
    }
    wx.navigateTo({
      url: 'sharepsw/sharepsw?pswtype=' + pswtype + '&psw=' + pswInfo.detail.password + '&tips=' + tips,
    })
  },

  shareOncePsw: function(e) {
    var index = e.currentTarget.dataset.index
    var pswInfo = this.data.onceList[index]
    wx.navigateTo({
      url: 'sharepsw/sharepsw?pswtype=临时密码&psw=' + pswInfo.key + '&tips=' + '仅能开锁一次',
    })
  },

  delOncePsw: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    serverProxy.deletePassword(this.data.onceList[index].id,
      function (msg) {
        if (msg.statusCode == 200 && msg.data.success) {
          wx.showToast({
            title: '删除密钥成功',
            icon: 'none',
            duration: 1500
          })
          that.updateOncePsw()
        }
      })
  },

  delAllOncePsw: function(e) {
    console.log("delAllOncePsw")
    var that = this
    var cleanCount = 0
    var list = this.data.onceList
    for(var i = 0; i < list.length; i++) {
      serverProxy.deletePassword(list[i].id,
        function (msg) {
          if (msg.statusCode == 200 && msg.data.success) {
            cleanCount++
            if(cleanCount == list.length) {
              that.updateOncePsw()
            }
          }
        })
    }

  },

  updateOncePsw: function () {
    var that = this
    var len = this.data.onceList.length
    serverProxy.getPassword('once', function (msg) {
      console.log("oncePasswords:")
      console.log(msg)
      that.setData({
        onceList: msg.data
      })
      if (that.data.pageHasHide && that.data.onceList.length > len) {
        wx.pageScrollTo({
          scrollTop: 80,
        })
      }
    })
  },

  updateLongPsw: function () {
    var that = this
    serverProxy.getLongPasswords(function (msg) {
      console.log("longPasswords:")
      console.log(msg)
      var emptyPos = 0
      var list = msg.data
      for (var i = 0; i < list.length; i++) {
        if (list[i].pwdinfo != null) {
          that.setTypeIndex(list[i].pwdinfo)
        } else if (emptyPos == 0) {
          emptyPos = list[i].pos
        }
      }
      that.setData({
        longList: list,
        emptyPos: emptyPos
      })
    })
  },

  setTypeIndex: function (item) {
    if (item.type == 'deadline') {
      item.typeindex = 1
    } else if (item.type == 'time') {
      item.typeindex = 2
    } else {
      item.typeindex = 3
    }
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
    this.updateLongPsw()
    this.updateOncePsw()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      pageHasHide: true
    })
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