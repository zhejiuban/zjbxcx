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
    repair_id: '',
    asset_name: '',
    equipment_id: '',
    equipment_name: '',
    field_path: '',
    remarks: '',
    img_url: [],
    stars_key: '',
    appraisal: '',
    complain: '',
    repair_status: '',    //工单状态
    service_status: '',  //维修状态
    service_worker: '',
    result: '',
    result_status: '',
    service_img_url: [],
    create_time: '',
    finish_time: '',
    user_name: '',
    user_phone: '',
    method: '',
    // appointment: ''
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
    app.network_state();
    wx.showLoading({
      mask: true,
      title: '加载中',
    });
    
    let repair_id = options.repair_id;
    that.setData({
      repair_id: repair_id
    });
    wx.request({
      url: app.globalData.url+'wx/repair/repair_all_info',
      method: "POST",
      data: {
        role:app.globalData.role,
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
          that.setData({
            equipment_id: res.data.equipment_id ? res.data.equipment_id : '',
            equipment_name: res.data.equipment_name ? res.data.equipment_name : '',
            asset_name: res.data.asset_name,
            field_path: res.data.field_path,
            remarks: res.data.remarks,
            img_url: res.data.img_url,
            stars_key: res.data.stars_key,
            appraisal: res.data.appraisal ? res.data.appraisal: '',
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
            result_status: res.data.result_status
            // appointment: res.data.appointment
          });
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },


  network_state: function () {
    let that = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if (networkType == 'none') {
          wx.showModal({
            title: '提示',
            content: '网络失败，请重试',
            showCancel: false,
            confirmText: '点击重试',
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


  phoneCall: function (e) {
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