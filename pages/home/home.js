// pages/home/home.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    butName: '重新授权',
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
      } else if (app.globalData.equipment_uuid){
        wx.navigateTo({
          url: '/pages/equipmentManual/equipmentManual',
        })
      }else{
        wx.reLaunch({
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
    wx.showModal({
      title: '授权提示',
      content: '获取你的公开信息（昵称、头像等）',
      confirmText: '允许',
      cancelText: '拒绝',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: function (res) {
              if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                wx.showLoading({
                  mask: true,
                  title: '加载中',
                });
                app.getUserInfo();
              } else {
                // 拒绝授权用户信息，回到home页面进行授权
                wx.reLaunch({
                  url: '/pages/home/home',
                })
              }
            }
          })
        }
      }
    })
  }
})