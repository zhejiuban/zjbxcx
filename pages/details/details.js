// pages/details/details.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      asset_name:'',
      asset_id:'',
      asset_field:'',
      remarks:'',
      img_url:[] 
  },
  imgShow: function (e) {
    var that = this;
    var current_url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current_url, // 当前显示图片的http链接
      urls: that.data.img_url // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.network_state();
    let that = this;
    wx.request({
      url: 'https://wx.zhejiuban.com/repair/repair_info',
      method:"POST",
      data: {
        role: app.globalData.role,
        openId: app.globalData.openId,
        repair_id: options.repair_id,
        status: options.status
      },
      header: {
        'content-type': 'application/json' // 默认值
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
          let data = res.data;
          that.setData({
            asset_name: data.asset_name,
            asset_id: data.asset_id,
            asset_field: data.field_path,
            remarks: data.remarks,
            img_url: [data.img_url]
          });
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