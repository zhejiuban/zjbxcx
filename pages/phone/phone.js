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
      // console.log(app.globalData.userInfo);
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
                  res.data = app.getResData(res);
                  console.log(res.data);
                  if(res.data.code==1){
                    app.globalData.authorization = 1;
                    app.globalData.validate = true;
                    if (app.globalData.uuid){
                      console.log(app.globalData.uuid);
                      wx.redirectTo({
                        url: "/pages/manual/manual"
                      });
                    } else if (app.globalData.area_uuid){
                      wx.redirectTo({
                        url: "/pages/areaManual/areaManual"
                      });
                    }else{
                      wx.redirectTo({
                        url: "/pages/index/service/service"
                      })
                    }
                  }else{
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
                }
              })
            }
          })
        }
      })
    }
  }
})