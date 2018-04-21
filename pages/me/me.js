let app = getApp();
// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      avatarUrl:'',         //用户头像
      nickName:'',          //用户名
      num:50
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.network_state();
    let info = app.globalData.userInfo;
    this.setData({
      avatarUrl:info.avatarUrl,
      nickName:info.nickName
    });
  },

  toArea: function (){
    wx.redirectTo({
      url: '/pages/areaRepair/areaRepair',
    })
  },
  to_index: function () {
    let that = this;
    app.toIndex();
  }
})