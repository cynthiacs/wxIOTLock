// pages/pswsettings/addpassword/addpassword.js
const serverProxy = require('../../../utils/serverproxy.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [
      {
        icon: "/icons/password.png",
        title: "数字钥匙",
      },
      {
        icon: "/icons/fingerprint.png",
        title: "指纹钥匙",
      },
      {
        icon: "/icons/rfid.png",
        title: "IC卡钥匙",
      }
    ],
    icon: null,
    title: null,
    keyType: 0,
    keyname: null,
    isHiddenToast: true,
    toastText: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("add received index = "+options.index)
    var index = options.index
    var lists = this.data.lists
    this.setData({
      icon: lists[index].icon,
      title: lists[index].title,
      keyType: index,
      keyname: lists[index].title,
    })
    wx.setNavigationBarTitle({
      title: '添加'+this.data.title,
    })
  },

  userInput: function(e) {
    this.setData({
      keyname: e.detail.value
    })
  },

  setPassword: function() {
    var that = this
    serverProxy.addKey(this.data.keyType, this.data.keyname,
      function(msg){
       if(msg.statusCode == 200) {
         var id = msg.data.id
         console.log("addpassword id = "+id)
         
         var newkey = {
           id: id,
           name: that.data.keyname,
           alias: that.data.keyname,
           keytype: parseInt(that.data.keyType),
         }
         var databaseName = "KEYDATASET" + "_" + app.globalData.deviceName
         var dataset = wx.getStorageSync(databaseName)
         console.log(dataset)
         if(!dataset) {
           dataset = new Array()
         }
         dataset.push(newkey)
        //  wx.setStorageSync(databaseName, dataset)
         that.setData({
           toastText: that.data.title + ': ' + that.data.keyname + ' 创建成功',
           isHiddenToast: false
         })
       }else {
         wx.showToast({
           title: '钥匙创建失败',
           icon: 'none',
           duration: 3000
         })
       }
     })
  },

  toastHide: function () {
    this.setData({
      isHiddenToast: true
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