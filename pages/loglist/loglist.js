// pages/loglist/loglist.js
const serverProxy = require('../../utils/serverproxy.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      // {
      //   id: 1122,
      //   typename: "指纹密码",
      //   pwname: "我的指纹",
      //   time: "2018-10-17T03:07:19.000Z",
      //   device_name: "dev_rrpc"
      // },
      // {
      //   id: 2345,
      //   typename: "数字密码",
      //   pwname: "老大",
      //   time: "2018-10-17T03:25:19.000Z",
      //   device_name: "dev_rrpc"
      // },
      // {
      //   id: 6844,
      //   typename: "限时密码",
      //   pwname: "老二",
      //   time: "2018-10-17T03:25:19.000Z",
      //   device_name: "dev_rrpc"
      // },
    ],
    currentTab: 0,
    bgdate: '2018-09-01',
    eddate: '2018-09-01',
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var now = new Date()
    var nowvalue = now.valueOf()
    var bg = new Date(nowvalue - 7 * 24 * 60 * 60 * 1000)
    var edy = now.getFullYear()
    var edm = now.getMonth() + 1
    var edd = now.getDate()
    var bgy = bg.getFullYear()
    var bgm = bg.getMonth() + 1
    var bgd = bg.getDate()
    console.log(now)
    this.setData({
      eddate: edy + '-' + this.getTimestr(edm) + '-' + this.getTimestr(edd),
      bgdate: bgy + '-' + this.getTimestr(bgm) + '-' + this.getTimestr(bgd),
    })
    serverProxy.getUnlockLog(msg => {
      this.setData({
        list: msg.data.rows
      })
    })
  },

  getTimestr: function (time) {
    if (time < 10) {
      time = '0' + time
    }
    return time
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  bindbgDateChange: function (e) {
    var bg = e.detail.value
    console.log(bg)
    var bgvalue = new Date(bg.replace(/-/g, "/"))
    
    this.setData({
      bgdate: e.detail.value
    })
  },

  bindedDateChange: function (e) {
    this.setData({
      eddate: e.detail.value
    })
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