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
      url: app.globalData.url + 'wx/job_number',
      method: "POST",
      data: {
        role: 1,
        token: app.globalData.token,
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
                  wx.navigateTo({
                    url: '/pages/manual/manual'
                  })
                }else{
                  wx.navigateTo({
                    url: '/pages/index/service/service'
                  })
                }
                
              }
            }
          })
        } else if (res.data.code == 1403) {
          app.errorPrompt(res.data);
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
      fail: function () {
        wx.hideLoading();
        app.requestError();
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  }
})