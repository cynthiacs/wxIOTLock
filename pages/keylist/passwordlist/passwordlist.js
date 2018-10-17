// pages/keylist/passwordlist/passwordlist.js
const serverProxy = require('../../../utils/serverproxy.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [
      {
        icon: "/icons/num_key.png",
        title: "数字钥匙",
      },
      {
        icon: "/icons/finger_key.png",
        title: "指纹钥匙",
      },
      {
        icon: "/icons/ic_key.png",
        title: "IC卡钥匙",
      }
    ],
    keys: [
      // {
      //   id: 1,
      //   name: "钥匙1",
      //   create_date: "2018-10-10T03:02:47.233Z",
      //   device_name: "dev_rrpc"
      // },
      // {
      //   id: 2,
      //   name: "钥匙2",
      //   create_date: "2018-10-10T03:02:47.233Z",
      //   device_name: "dev_rrpc"
      // },
    ],
    icon: null,
    isNotBlankList: false,
    keyType: 0,
    hiddenmodalput: true,
    index: 0,
    newName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = options.index
    var lists = this.data.lists
    
    wx.setNavigationBarTitle({
      title: lists[index].title + '列表',
    })
    this.setData({
      icon: lists[index].icon,
      keyType: index
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  addkey: function() {
    var index = this.data.keyType
    console.log("index = " + index)
    wx.navigateTo({
      url: 'addpassword/addpassword?index=' + index
    })
  },

  updateKeys: function() {
    var that = this
    serverProxy.getKeys(this.data.keyType, function (msg) {
      if (msg.statusCode == 200) {
        console.log(msg)
        if (msg.data.length > 0) {
          that.setData({
            keys: msg.data,
            isNotBlankList: true
          })
        }else {
          that.setData({
            keys: [],
            isNotBlankList: false
          })
        }
      } else {
        wx.showToast({
          title: '获取钥匙列表失败',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  editKey: function(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      hiddenmodalput: false,
      index: index,
    })
  },

  userInput: function(e) {
    this.setData({
      newName: e.detail.value,
    })
  },

  cancel: function(e) {
    this.setData({
      hiddenmodalput: true,
    })
  },

  confirm: function(e) {
    var that = this
    var newName = this.data.newName
    if(newName == '') {
      wx.showToast({
        title: '请输入新的钥匙名字',
        icon: 'none',
        duration: 1500
      })
      return
    }
    this.setData({
      hiddenmodalput: true,
    })
    var keyId = this.data.keys[this.data.index].id
    serverProxy.editKey(this.data.keyType, keyId, newName, function(msg) {
      if(msg.statusCode == 200) {
        that.updateKeys()
      }else {
        wx.showToast({
          title: '重命名失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  deleteKey: function(e) {
    console.log("delete pressed")
    var that = this
    var index = e.currentTarget.dataset.index
    var keyId = this.data.keys[index].id
    serverProxy.deleteKey(this.data.keyType, keyId,
     function(msg) {
       if(msg.statusCode == 200) {
         that.updateKeys()
       }else {
         wx.showToast({
           title: '删除钥匙失败',
           icon: 'none',
           duration: 3000
         })
       }

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.updateKeys()
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