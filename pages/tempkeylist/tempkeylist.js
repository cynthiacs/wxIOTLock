// pages/tempkeylist/tempkeylist.js
const app = getApp()
const serverProxy = require('../../utils/serverproxy.js')
const util = require('../../utils/util.js')
const devOpt = require('../../utils/devOpt.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    onceList: [],
    longList: [],
    longPswSize: 0,
    emptyPos: 0,
    pageHasHide: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  addpsw: function() {
    wx.navigateTo({
      // url: 'addtemppsw/addtemppsw?os=' + 'add' + '&pos=' + this.data.emptyPos,
      url: 'addtemppsw/addtemppsw?os=' + 'add',
    })
  },

  addLongPsw: function(e) {

  },

  editlongPsw: function(e) {
    var index = e.currentTarget.dataset.index
    var item = this.data.longList[index]
    var pos = item.pos
    wx.navigateTo({
      url: 'addtemppsw/addtemppsw?os=' + 'edit' + '&pos=' + pos,
    })
  },

  sharelongPsw: function(e) {
    var index = e.currentTarget.dataset.index
    var pswInfo = this.data.longList[index].pwdinfo
    var keyinfo = {}
    var iconres = ''
    var tips = ''
    switch (parseInt(pswInfo.typeindex)) {
      case 4:
        iconres = '/icons/icon_date.png'
        // pswtype = '限时密码'
        tips = '有效期至：' + pswInfo.detail.due_date
        break
      case 5:
        iconres = '/icons/icon_time.png'
        // pswtype = '限时段密码'
        tips = '有效时间段：' + pswInfo.detail.bt + '-' + pswInfo.detail.et
        break
      case 6:
        iconres = '/icons/icon_times.png'
        // pswtype = '限次密码'
        tips = '有效开锁次数：' + pswInfo.detail.counts
        break
    }
    wx.navigateTo({
      url: 'sharepsw/sharepsw?iconres=' + iconres +
        '&pswtype=' + pswInfo.name + '&psw=' + pswInfo.detail.password + '&tips=' + tips,
    })
  },

  shareOncePsw: function(e) {
    var index = e.currentTarget.dataset.index
    var pswInfo = this.data.onceList[index]
    var iconres = '/icons/icon_count.png'
    var tips = '仅能开锁一次'
    wx.navigateTo({
      url: 'sharepsw/sharepsw?iconres=' + iconres +
        '&pswtype=' + pswInfo.name + '&psw=' + pswInfo.key + '&tips=' + tips,
    })
  },

  delOncePsw: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    serverProxy.deletePassword(this.data.onceList[index].id,
      function(msg) {
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
    for (var i = 0; i < list.length; i++) {
      serverProxy.deletePassword(list[i].id,
        function(msg) {
          if (msg.statusCode == 200 && msg.data.success) {
            cleanCount++
            if (cleanCount == list.length) {
              that.updateOncePsw()
            }
          }
        })
    }

  },

  updateOncePsw: function() {
    var that = this
    var len = this.data.onceList.length
    serverProxy.getPassword('once', function(msg) {
      console.log("oncePasswords:")
      console.log(msg)
      if (msg.statusCode == 200) {
        let list = msg.data
        for (let i = 0; i < list.length; i++) {
          let datestr = list[i].create_date
          let date = new Date(datestr)
          list[i].create_date = util.formatTime(date)
        }
        that.setData({
          onceList: list
        })
        if (that.data.pageHasHide && that.data.onceList.length > len) {
          wx.pageScrollTo({
            scrollTop: 80,
          })
        }
      }
    })
  },

  updateLongPsw: function() {
    var that = this
    serverProxy.getLongPasswords(function(msg) {
      console.log("longPasswords:")
      console.log(msg)
      if (msg.statusCode == 200) {
        var emptyPos = 0
        var list = msg.data
        var pswSize = 0
        for (var i = 0; i < list.length; i++) {
          if (list[i].pwdinfo != null) {
            that.setTypeIndex(list[i].pwdinfo)
            pswSize++
          } else if (emptyPos == 0) {
            emptyPos = list[i].pos
          }
        }
        that.setData({
          longList: list,
          emptyPos: emptyPos,
          longPswSize: pswSize
        })
      }
    })
  },

  setTypeIndex: function(item) {
    if (item.type == 'deadline') {
      item.typeindex = 4
      let duedate = item.detail.due_date
      let date = new Date(duedate)
      item.detail.due_date = util.formatTime(date)
    } else if (item.type == 'time') {
      item.typeindex = 5
    } else {
      item.typeindex = 6
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.deviceName != null) {
      this.updateLongPsw()
    }

    this.updateOncePsw()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      pageHasHide: true
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})