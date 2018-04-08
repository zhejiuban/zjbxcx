// pages/home/home.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    butName: '点我重新授权',
    btnShow: app.globalData.btnShow,
    btnLoading: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this;
    if(options.type!=1){
      app.globalData.firstLogin=2;
    };
    console.log(that.data);
  },

  onShow: function () {
    let that = this;
    if(app.globalData.openId){
      if (app.globalData.asset_uuid){
        wx.navigateTo({
          url: '/pages/manual/manual',
        })
      } else if (app.globalData.area_uuid){
        wx.navigateTo({
          url: '/pages/areaManual/areaManual',
        })
      } else if (app.globalData.group_uuid){
        wx.navigateTo({
          url: '/pages/groupManual/groupManual',
        })
      }else{
        wx.redirectTo({
          url: '/pages/index/service/service',
        })
      }
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