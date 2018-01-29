// pages/phone/phone.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // uuid : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    // if(options.uuid){
    //   this.setData({
    //     uuid: options.uuid
    //   })
    // }
  },

  /**
   * 点击授权绑定手机号
   */
  getPhoneNumber: function (e) {
    let that = this;
    let iv = e.detail.iv;
    let encryptedData = e.detail.encryptedData;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      // wx.showModal({
      //   title: '提示',
      //   showCancel: false,
      //   content: '未授权不能操作',
      //   success: function (res) {
      //   }
      // });
    } else {
      wx.login({
        success: res => {
          console.log(res);
          let code = res.code;
          wx.getUserInfo({
            success: res => {
              //发起网络请求
              wx.request({
                url: 'https://wx.zhejiuban.com/wx/find_phone', //仅为示例，并非真实的接口地址
                method: "POST",
                data: {
                  role: 1,    //用户角色
                  code: code,
                  iv: iv,
                  encryptedData: encryptedData
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  if (app.globalData.uuid){
                    console.log(app.globalData.uuid);
                    wx.redirectTo({
                      url: "/pages/manual/manual"
                    });
                  }else{
                    wx.redirectTo({
                      url: "/pages/index/service/service"
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
  }
})