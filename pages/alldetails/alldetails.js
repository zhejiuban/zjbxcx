// pages/details/details.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/normal.png',
    selectedSrc: '../../images/selected.png',
    halfSrc: '../../images/half.png',

    //工单详情
    asset_name: '',
    field_path: '',
    remarks: '',
    img_url: [],
    stars_key: '',
    appraisal: '',
    complain: '',
    repair_status: '',    //工单状态
    service_status: '',  //维修状态
    service_worker: '',
    suggest: '',
    service_img_url: []
  },
  imgShow: function (e) {
    var that = this;
    var current_url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current_url, // 当前显示图片的http链接
      urls: that.data.img_url // 需要预览的图片http链接列表
    })
  },

  serviceImgShow: function (e) {
    var that = this;
    var current_url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current_url, // 当前显示图片的http链接
      urls: that.data.service_img_url // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let repair_id = options.repair_id;
    let that = this;
    wx.request({
      url: 'https://wx.zhejiuban.com/wx/repair/repair_all_info',
      method: "POST",
      data: {
        repair_id: repair_id,
        openId: app.globalData.openId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          asset_name: res.data.asset_name,
          field_path: res.data.field_path,
          remarks: res.data.remarks,
          img_url: res.data.img_url,
          stars_key: res.data.stars_key,
          appraisal: res.data.appraisal,
          complain: res.data.complain,
          service_status: res.data.service_status,
          service_worker: res.data.service_worker,
          suggest: res.data.suggest,
          service_img_url: res.data.service_img_url,
          repair_status: res.data.repair_status
        });
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})