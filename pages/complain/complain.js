// pages/complain/complain.js
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
      url: app.globalData.url +'repair/complain',
      method: "POST",
      data: {
        role: app.globalData.role,
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
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})