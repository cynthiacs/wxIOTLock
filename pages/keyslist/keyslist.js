// pages/keyslist/keyslist.js
const serverProxy = require('../../utils/serverproxy.js')

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
    numKeys: [
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
    fingerKeys: [],
    icKeys: [],
    keys: [],
    keyType: 0,
    hiddenmodalput: true,
    index: 0,
    newName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var index = options.index
    // var lists = this.data.lists

    // wx.setNavigationBarTitle({
    //   title: lists[index].title + '列表',
    // })
    // this.setData({
    //   keyType: index
    // })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  updateKeys: function (keyType) {
    var that = this
    var typeindex = keyType
    serverProxy.getKeys(keyType, function (msg) {
      // wx.hideLoading()
      if (msg.statusCode == 200) {
        console.log(msg)
        switch (typeindex) {
          case 0:
            that.setData({
              numKeys: msg.data
            })
            break
          case 1:
            that.setData({
              fingerKeys: msg.data
            })
            break
          case 2:
            that.setData({
              icKeys: msg.data
            })
            break
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

  editKey: function (e) {
    var index = e.currentTarget.dataset.index
    var keyType = e.currentTarget.dataset.type
    var list = this.getList(keyType)
    // var keyId = list[index].id
    this.setData({
      hiddenmodalput: false,
      newName: list[index].name,
      keys: list,
      index: index,
      keyType: keyType
    })
  },

  userInput: function (e) {
    this.setData({
      newName: e.detail.value,
    })
  },

  cancel: function (e) {
    this.setData({
      hiddenmodalput: true,
    })
  },

  confirm: function (e) {
    var that = this
    var newName = this.data.newName
    if (newName == '') {
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
    serverProxy.editKey(this.data.keyType, keyId, newName, function (msg) {
      if (msg.statusCode == 200) {
        that.updateKeys(that.data.keyType)
      } else {
        wx.showToast({
          title: '重命名失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  deleteKey: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var keyType = e.currentTarget.dataset.type
    var list = this.getList(keyType)
    var keyId = list[index].id
    serverProxy.deleteKey(keyType, keyId,
      function (msg) {
        if (msg.statusCode == 200) {
          that.updateKeys(keyType)
        } else {
          wx.showToast({
            title: '删除钥匙失败',
            icon: 'none',
            duration: 3000
          })
        }

      })
  },

  getList: function(keytype) {
    var list = this.data.numKeys
    switch (keytype) {
      case 0:
        break
      case 1:
        list = this.data.fingerKeys
        break
      case 2:
        list = this.data.icKeys
        break
    }
    return list
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.showLoading({
    //   title: '获取钥匙列表',
    // })
    this.updateKeys(0)
    this.updateKeys(1)
    this.updateKeys(2)
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