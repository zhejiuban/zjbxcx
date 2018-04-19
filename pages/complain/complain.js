// pages/complain/complain.js

const config = require('../../config')

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repair_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.network_state();
    let that = this;
    that.setData({
      repair_id: options.repair_id
    });
  },

  // form表单提交  用户投诉表单提交
  formSubmit: function (e) {
    let that = this;
    let complain = e.detail.value.complain;
    let repair_id = that.data.repair_id;
    wx.request({
      // url: app.globalData.url +'repair/complain',
      url: config.complainUrl,
      method: "POST",
      data: {
        role: app.globalData.role,
        token: app.globalData.token,
        repair_id: repair_id,
        complain: complain,
        openId: app.globalData.openId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 403) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  url: "/pages/home/home"
                })
              }
            }
          })
        } else if (res.data.code == 1403) {
          app.errorPrompt(res.data);
        } else {
          wx.showModal({
            title: '提示',
            content: '感谢您的反馈！我们会及时处理！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/index/over/over'
                })
              }
            }
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        app.requestError();
      }
    })
  }
})