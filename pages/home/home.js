// pages/home/home.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    butName: '点我重新授权',
    btnShow: false,
    btnLoading: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that = this;
    console.log("0.0.41");
    if(options.type!=1){
      // wx.showLoading({
      //   mask: true,
      //   title: '登录中',
      // });
      app.globalData.firstLogin=2;
    };
  },

  onShow: function () {
    if(app.globalData.openId){
      wx.showLoading({
        // mask: true,
        title: '登录中',
      });
      app.getUserInfo();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    that.setData({
      btnShow: app.globalData.btnShow
    });
  },

  getUserInfo: function (){
    let that = this;
    app.getUserInfo();
  }
})