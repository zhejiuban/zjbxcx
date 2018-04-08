// pages/system/system.js
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
    app.network_state();
  },

  formSubmit: function (e) {
    let that = this;
    let phone = e.detail.value.phone;
    wx.request({
      url: app.globalData.url + 'wx/system_auth',
      method: "POST",
      data: {
        role: app.globalData.role,
        openId: app.globalData.openId,
        user_id: app.globalData.user_id,
        asset_uuid: app.globalData.uuid,
        area_uuid: app.globalData.area_uuid,
        phone: phone
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        res.data = app.getResData(res);
        console.log(res.data);
        console.log("system");
        if(res.data.code==1){
          wx.showModal({
            title: '提示',
            content: '用户认证成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                if (app.globalData.uuid){
                  wx.redirectTo({
                    url: '/pages/manual/manual',
                  })
                } else if (app.globalData.area_uuid){
                  wx.redirectTo({
                    url: '/pages/areaManual/areaManual',
                  })
                } else if (app.globalData.group_uuid){
                  wx.redirectTo({
                    url: '/pages/groupManual/groupManual',
                  })
                }else{
                  wx.redirectTo({
                    url: '/pages/index/service/service',
                  })
                }
              }
            }
          })
        }else if(res.data.code==0){
          wx.showModal({
            title: '提示',
            content: '暂无报修权限，请联系管理员',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/index/service/service',
                })
              }
            }
          })
        }else if(res.data.code==403){
          wx.showModal({
            title: '提示',
            content: '请扫描正确的资产或场地二维码',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/index/service/service',
                })
              }
            }
          })
        }
      }
    })
  },

})