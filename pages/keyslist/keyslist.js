// pages/keyslist/keyslist.js
const serverProxy = require('../../utils/serverproxy.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [
      {
        icon: "/icons/icon_num_key.png",
        title: "数字钥匙",
      },
      {
        icon: "/icons/icon_finger_key.png",
        title: "指纹钥匙",
      },
      {
        icon: "/icons/icon_ic_key.png",
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
    allkeys: [],
    keyType: 0,
    hiddenmodalput: true,
    index: 0,
    newName: '',
    counts: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  updateKeys: function (keyType) {
    var that = this
    var typeindex = keyType
    serverProxy.getKeys(keyType, msg => {
      // wx.hideLoading()
      if (msg.statusCode == 200) {
        console.log(msg)
        let resList = msg.data
        for (let i = 0; i < resList.length; i++) {
          resList[i].keyType = keyType
          let datestr = resList[i].create_date
          datestr = ((datestr.replace('T', ' ')).replace('Z', '')).replace(/-/g, '/')
          let time = new Date(datestr).getTime()
          resList[i].create_time = time
        }
        switch (typeindex) {
          case 0:
            that.setData({
              numKeys: resList
            })
            break
          case 1:
            that.setData({
              fingerKeys: resList
            })
            break
          case 2:
            that.setData({
              icKeys: resList
            })
            break
        }
        this.data.counts++
        if (this.data.counts == 3) {
          let temp = this.data.numKeys.concat(this.data.fingerKeys, this.data.icKeys)
          temp.sort(this.sortKeys("create_time"))
          this.setData({
            allkeys: temp
          })
          console.log(this.data.allkeys)
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

  touchstart: function(e) {
    let data = app.touch._touchstart(e, this.data.allkeys)
    this.setData({
      allkeys: data
    })
  },

  touchmove: function (e) {
    let data = app.touch._touchmove(e, this.data.allkeys)
    this.setData({
      allkeys: data
    })
  },


  sortKeys: function(property) {
    return function(a, b) {
      return b[property] - a[property]
    }
  },

  // sortKeys: function (keyType, resList) {
  //   let tempAll = this.data.allkeys
  //   let datestr
  //   for (let i = 0; i < resList.length; i++) {
  //     resList[i].keyType = keyType
  //     datestr = resList[i].create_date
  //     datestr = ((datestr.replace('T', ' ')).replace('Z', '')).replace(/-/g, '/')
  //     let time = new Date(datestr).getTime()
  //     resList[i].create_time = time
  //     for (var j = 0; j < tempAll.length; j++) {
  //       if (resList[i].create_time > tempAll[j].create_time) {
  //         tempAll.splice(j, 0, resList[i])
  //       }
  //     }
  //     if (j == tempAll.length) {
  //       while (i < resList.length) {
  //         tempAll.splice(j, 0, resList[i])
  //         i = i + 1
  //         j = j + 1
  //       }
  //     }
  //   }
  //   this.setData({
  //     allkeys: tempAll,
  //   })
  //   console.log("allkeys:")
  //   console.log(this.data.allkeys)
  // },

  editKey: function (e) {
    var index = e.currentTarget.dataset.index
    // var keyType = e.currentTarget.dataset.type
    // var list = this.getList(keyType)
    // var keyId = list[index].id
    this.setData({
      hiddenmodalput: false,
      newName: this.data.allkeys[index].name,
      // keys: list,
      index: index,
      // keyType: keyType
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
    var index = this.data.index
    var keyId = this.data.allkeys[index].id
    var keyType = this.data.allkeys[index].keyType
    serverProxy.editKey(keyType, keyId, newName, msg => {
      if (msg.statusCode == 200) {
        var updateItem = "allkeys["+index+"]"
        var newItem = this.data.allkeys[index]
        newItem.name = newName
        this.setData({
          [updateItem]: newItem,
        })
        // that.updateKeys(that.data.keyType)
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
    // var keyType = e.currentTarget.dataset.type
    var keyType = this.data.allkeys[index].keyType
    // var list = this.getList(keyType)
    var keyId = this.data.allkeys[index].id
    serverProxy.deleteKey(keyType, keyId,
      msg => {
        if (msg.statusCode == 200) {
          this.data.allkeys.splice(index, 1)
          this.setData({
            allkeys: this.data.allkeys,
          })
          // that.updateKeys(keyType)
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