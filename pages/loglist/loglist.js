// pages/loglist/loglist.js
const serverProxy = require('../../utils/serverproxy.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      //   {
      //     id: 1122,
      //     typename: "指纹密码",
      //     pwname: "我的指纹",
      //     time: "2018-10-17T03:07:19.000Z",
      //     device_name: "dev_rrpc"
      //   },
      //   {
      //     id: 2345,
      //     typename: "数字密码",
      //     pwname: "老大",
      //     time: "2018-10-17T03:25:19.000Z",
      //     device_name: "dev_rrpc"
      //   },
      //   {
      //     id: 6844,
      //     typename: "限时密码",
      //     pwname: "老二",
      //     time: "2018-10-17T03:25:19.000Z",
      //     device_name: "dev_rrpc"
      //   },
    ],
    types: [{
        icon: "/icons/icon_num_key.png",
        title: "数字密码",
      },
      {
        icon: "/icons/icon_finger_key.png",
        title: "指纹密码",
      },
      {
        icon: "/icons/icon_ic_key.png",
        title: "IC卡密码",
      },
      {
        icon: "/icons/icon_date.png",
        title: "限时密码",
      },
      {
        icon: "/icons/icon_time.png",
        title: "限时段密码",
      },
      {
        icon: "/icons/icon_times.png",
        title: "限次密码",
      }
    ],
    currentTab: 0,
    bgdate: '2018-09-01',
    eddate: '2018-09-01',
    bt: '',
    et: '',
    totalpages: 0,
    currentPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var now = new Date()

    var nowvalue = now.valueOf()
    var bg = new Date(nowvalue - 7 * 24 * 60 * 60 * 1000)

    // var edy = now.getFullYear()
    // var edm = now.getMonth() + 1
    // var edd = now.getDate()
    // var bgy = bg.getFullYear()
    // var bgm = bg.getMonth() + 1
    // var bgd = bg.getDate()
    this.setData({
      eddate: util.formatDate(now),
      bgdate: util.formatDate(bg),
      bt: util.formatTime(bg),
      et: util.formatTime(now),
    })
    this.getLogs()
  },

  getLogs: function() {
    serverProxy.getUnlockLog(this.data.bt, this.data.et,
      this.data.currentPage, msg => {
        if (msg.statusCode == 200) {
          var datas = msg.data.rows
          for (var i = 0; i < datas.length; i++) {
            if (datas[i].typename == '数字密码') {
              datas[i].keyType = 0
            } else if (datas[i].typename == '指纹') {
              datas[i].keyType = 1
            } else if (datas[i].typename == '门禁卡') {
              datas[i].keyType = 2
            } else if (datas[i].typename == '限时密码') {
              datas[i].keyType = 3
            } else if (datas[i].typename == '限时段密码') {
              datas[i].keyType = 4
            } else if (datas[i].typename == '限次密码') {
              datas[i].keyType = 5
            }
            var timestr = datas[i].time
            var date = new Date(timestr)
            datas[i].datetime = util.formatTime(date)
          }
          this.setData({
            list: this.data.list.concat(datas),
            totalpages: msg.data.totalpages,
          })
        }
      })
  },

  getTimestr: function(time) {
    if (time < 10) {
      time = '0' + time
    }
    return time
  },

  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  toLower: function(e) {
    console.log("toLower:totalpages:" + this.data.totalpages)
    console.log("toLower:currentPage:" + this.data.currentPage)
    if (this.data.totalpages > this.data.currentPage) {
      this.data.currentPage++
        this.getLogs()
    } else {
      wx.showToast({
        title: '已经到列表底部',
        icon: 'none',
        duration: 1500,
      })
    }
  },

  bindbgDateChange: function(e) {
    var bg = e.detail.value
    console.log(bg)
    var bgtime = new Date(bg + ' 00:00:00')
    var bgvalue = bgtime.getTime()

    var ed = this.data.eddate
    var et = this.data.et
    var edvalue = new Date(et).getTime()
    console.log(bgtime)
    console.log(new Date(et))

    if (bgvalue > edvalue) {
      ed = bg
      et = util.formatTime(new Date(ed + ' 23:59:59'))
    } else if (bgvalue < edvalue - (8 * 24 * 60 * 60 - 1) * 1000) {
      wx.showModal({
        title: '温馨提示',
        content: '查询时间跨度不能超过七天,请重新设置日期',
        showCancel: false,
      })
      return
    }

    this.setData({
      bgdate: bg,
      bt: util.formatTime(bgtime),
      eddate: ed,
      et: et
    })
    this.getLogs()
  },

  bindedDateChange: function(e) {
    var ed = e.detail.value
    var edtime = new Date(ed + ' 23:59:59')
    var edvalue = edtime.getTime()

    var bg = this.data.bgdate
    var bt = this.data.bt
    var bgvalue = new Date(bt).getTime()
    console.log(new Date(bt))
    console.log(new Date(ed))
    if (edvalue < bgvalue) {
      bg = ed
      bt = util.formatTime(new Date(bg + ' 00:00:00'))
    } else if (edvalue > bgvalue + (8 * 24 * 60 * 60 - 1) * 1000) {
      wx.showModal({
        title: '温馨提示',
        content: '查询时间跨度不能超过七天,请重新设置日期',
        showCancel: false,
      })
      return
    }
    this.setData({
      eddate: ed,
      et: util.formatTime(edtime),
      bgdate: bg,
      bt: bt
    })
    this.getLogs()
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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