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
      avatarUrl: info.avatarUrl ? info.avatarUrl : '/images/avatar.png',
      nickName: info.nickName ? info.nickName : '暂无昵称'
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