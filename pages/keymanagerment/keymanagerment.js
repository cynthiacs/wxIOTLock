// pages/keymanagerment/keymanagerment.js
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  addpsw: function (e) {
    var index = e.currentTarget.dataset.index
    console.log("index = " + index)
    wx.navigateTo({
      url: 'addpassword/addpassword?index=' + index
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