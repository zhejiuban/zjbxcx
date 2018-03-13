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
    repair_id: null,
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
    result: null,
    service_img_url: [],
    create_time: null,
    finish_time: null,
    user_name: '',
    user_phone: '',
    method: null,
    appointment: null
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
  // 点击跳转到评价页面
  to_evaluate: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?id=' + id,
    })
  },

  // 点击跳转到维修日志记录
  to_processLog: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/time/time?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      mask: true,
      title: '加载中',
    });
    
    let repair_id = options.repair_id;
    that.setData({
      repair_id: repair_id
    });
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
        if(res.data.code==403){
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
        }else{
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
            result: res.data.result,
            service_img_url: res.data.service_img_url,
            repair_status: res.data.repair_status,
            create_time: res.data.create_time,
            finish_time: res.data.finish_time,
            user_name: res.data.user_name,
            user_phone: res.data.user_phone,
            method: res.data.method,
            appointment: res.data.appointment
          });
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  phoneCall: function (e) {
    console.log(e.currentTarget.dataset.phone);
    wx.showModal({
      title: '提示',
      content: '是否拨打：' + e.currentTarget.dataset.phone,
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
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