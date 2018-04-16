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
  },

  close_order: function () {
    wx.navigateBack({
      delta: 1
    }) 
  },

  /**
   * 点击授权绑定手机号
   */
  getPhoneNumber: function (e) {
    let that = this;
    let iv = e.detail.iv;
    let encryptedData = e.detail.encryptedData;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
    } else {
      wx.login({
        success: res => {
          let code = res.code;
          wx.getUserInfo({
            success: res => {
              //发起网络请求
              wx.request({
                url: app.globalData.url + 'wx/find_phone', //仅为示例，并非真实的接口地址
                method: "POST",
                data: {
                  role: 1,    //用户角色
                  token: app.globalData.token,
                  code: code,
                  iv: iv,
                  encryptedData: encryptedData,
                  asset_uid: app.globalData.uuid ? app.globalData.uuid : '',
                  area_uuid: app.globalData.area_uuid ? app.globalData.area_uuid : '',
                  nickName: app.globalData.userInfo.nickName,
                  union_id: app.globalData.unionid,
                  openid: app.globalData.openId
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  // res.data = app.getResData(res);
                  if(res.data.code==1){
                    app.globalData.authorization = 1;
                    app.globalData.validate = true;
                    if (app.globalData.uuid){
                      wx.navigateTo({
                        url: "/pages/manual/manual"
                      });
                    } else if (app.globalData.area_uuid){
                      wx.navigateTo({
                        url: "/pages/areaManual/areaManual"
                      });
                    }else{
                      wx.navigateTo({
                        url: "/pages/index/service/service"
                      })
                    }
                  } else if (res.data.code == 1403) {
                    app.errorPrompt(res.data);
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: res.data.message,
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          console.log("不是报修人员");
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
        }
      })
    }
  }
})