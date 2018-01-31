// pages/login/login.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  // 输入工号和密码
  formSubmit: function (e) {
    wx.showLoading({
      mask: true,
      title: '加载中',
    });
    let job_number = e.detail.value.number;
    let password = e.detail.value.password;
    wx.request({
      url: 'https://wx.zhejiuban.com/wx/job_number',
      method: "POST",
      data: {
        role: 1,
        job_number: job_number,
        password: password,
        openId: app.globalData.openId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 1) {
          app.globalData.login = true;
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                if(app.globalData.uuid){
                  wx.redirectTo({
                    url: '/pages/manual/manual'
                  })
                }else{
                  wx.redirectTo({
                    url: '/pages/index/service/service'
                  })
                }
                
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success: function (res) {
            }
          })
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  }
})