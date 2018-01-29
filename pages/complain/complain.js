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
      url: 'https://wx.zhejiuban.com/repair/complain',
      method: "POST",
      data: {
        repair_id: repair_id,
        complain: complain,
        openId: app.globalData.openId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '感谢您的反馈！我们会及时处理！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/index/over/over'
              })
            }
          }
        })
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})