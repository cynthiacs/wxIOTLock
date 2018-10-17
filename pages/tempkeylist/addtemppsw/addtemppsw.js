// pages/tempkeylist/addtemppsw/addtemppsw.js
const serverProxy = require('../../../utils/serverproxy.js')
//[{"id":7,"name":"密码","due_date":"2018-10-12T00:00:00.000Z","create_date":"2018-10-12T03:02:55.530Z","device_name":"dev_rrpc","key":"249238"}]

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // tips: [
    //   '说明：临时密码为一次性密码，密码使用后将永久失效。',
    //   '说明：限时密码可限制密码的使用期限，时间超过有效日期后密码失效，密码生成后不能删除，但可修改密码有效期。',
    //   '说明：限时段密码可限制密码的使用时间段，仅在有效时间段内密码有效，过期或未到该时段，密码均无效，密码生成后不能删除，但可修改有效时段。',
    //   '说明：限次密码可限制密码的使用次数，使用次数超过限定次数后密码失效，密码生成后不能删除，但可修改次数。'],
    // typeList: ['临时密码', '限时密码', '限时段密码', '限次密码'],
    typeList: [
      {
        id: 0,
        name: '临时密码',
        tip: '说明：临时密码为一次性密码，密码使用后将永久失效。',
      },
      {
        id: 1,
        name: '限时密码',
        tip: '说明：限时密码可限制密码的使用期限，时间超过有效日期后密码失效，密码生成后不能删除，但可修改密码有效期。',
      },
      {
        id: 2,
        name: '限时段密码',
        tip: '说明：限时段密码可限制密码的使用时间段，仅在有效时间段内密码有效，过期或未到该时段，密码均无效，密码生成后不能删除，但可修改有效时段。',
      },
      {
        id: 3,
        name: '限次密码',
        tip: '说明：限次密码可限制密码的使用次数，使用次数超过限定次数后密码失效，密码生成后不能删除，但可修改次数。'
      },
    ],
    longPswsize: 0,
    index: 0,
    today: '2016-09-01',
    date: '2016-09-01',
    bgtime:'00:00',
    edtime:'23:59',
    counts: 0,
    key: '',
    pos: 0,
  },

  userInput: function (e) {
    this.setData({
      key: e.detail.value
    })
  },

  countsInput: function (e) {
    this.setData({
      counts: e.detail.value
    })
  },

  bindPickerChange: function(e) {
    var index = e.detail.value
    // if (this.data.pos && index == 0) {
    //   index = 1
    // }
    this.setData({
      index: index
    })
    
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindbgTimeChange: function (e) {
    this.setData({
      bgtime: e.detail.value
    })
  },

  bindedTimeChange: function (e) {
    this.setData({
      edtime: e.detail.value
    })
  },

  createNewPsw: function(e) {
    var index = parseInt(this.data.index)
    console.log("createNewPsw: index = " + index)
    var id = this.data.typeList[index].id
    console.log("createNewPsw: id = " + id)
    if (!this.data.pos && this.data.longPswsize >= 3 && id > 0) {
      wx.showModal({
        title: '提示',
        content: '每个智能锁最多只能生成3条长期密码，请返回修改已有长期密码！',
        showCancel: false,
      })
      return
    }
    if(this.data.key == '') {
      wx.showToast({
        title: '请先输入您的数字密码',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (id == 3 && this.data.counts == 0) {
      wx.showToast({
        title: '请先输入限制次数',
        icon: 'none',
        duration: 1500
      })
      return
    }
    var param = {
      key: this.data.key,
    }
    switch (id) {
      case 0://临时密码
        break
      case 1://限时密码
        param.due_date = this.data.date
        // param.pos = ++this.data.longPswsize
        break
      case 2://限时段密码
        param.bt = this.data.bgtime
        param.et = this.data.edtime
        // param.pos = ++this.data.longPswsize
        break
      case 3://限次密码
        param.counts = this.data.counts
        // param.pos = ++this.data.longPswsize
        break
    }
    if (id > 0) {
      if (this.data.pos) {
        param.pos = this.data.pos
      } else {
        param.pos = ++this.data.longPswsize
      }
    }
    
    serverProxy.newPassword(id, param, function(msg) {
      if (msg.statusCode == 200) {
        wx.showModal({
          title: '新密码',
          content: msg.data.key,
          showCancel: false,
        })
      }else {
        wx.showToast({
          title: '创建密码失败，请确认数字密码是否有误',
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var now = new Date()
    var y = now.getFullYear()
    var m = now.getMonth() + 1
    var d = now.getDate()
    var h = now.getHours()
    var min = now.getMinutes()
    if(options.pos) {
      this.setData({
        typeList: this.data.typeList.slice(1)
      })
    }
    
    this.setData({
      longPswsize: options.longPswsize,
      pos: options.pos,
      today: y + '-' + this.getTimestr(m) + '-' + this.getTimestr(d),
      date: y + '-' + this.getTimestr(m) + '-' + this.getTimestr(d),
      bgtime: this.getTimestr(h) + ':' + this.getTimestr(min),
    })
  },

  getTimestr: function (time) {
    if (time < 10) {
      time = '0' + time
    }
    return time
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