// pages/details/details.js

const config = require('../../config')

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
    repair_no: '',
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
    appointment: '',
    sign_date: '',
    evaluation_time: '',
    org_id: '',
    org_name: '',
    worker_phone: '',
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
      url: config.repairAllInfoUrl,
      method: "POST",
      data: {
        role:app.globalData.role,
        token: app.globalData.token,
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
        } else if (res.data.code == 1403){
          app.errorPrompt(res.data);
        } else if (res.data.code == 404) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: "/pages/index/service/service"
                })
              }
            }
          })
        }else{
          let data = res.data;
          that.setData({
            equipment_id: data.equipment_id ? data.equipment_id : '',
            equipment_name: data.equipment_name ? data.equipment_name : '',
            repair_no: data.repair_no ? data.repair_no : '',
            asset_name: data.asset_name,
            field_path: data.field_path,
            remarks: data.remarks,
            img_url: data.img_url,
            stars_key: data.stars_key,
            appraisal: data.appraisal ? data.appraisal: '',
            complain: data.complain,
            service_status: data.service_status,
            service_worker: data.service_worker,
            result: data.result,
            service_img_url: data.service_img_url,
            repair_status: data.repair_status,
            create_time: data.create_time,
            finish_time: data.finish_time,
            user_name: data.user_name,
            user_phone: data.user_phone,
            worker_phone: data.worker_phone,
            method: data.method,
            appointment: data.appointment,
            result_status: data.result_status,
            sign_date: data.sign_date,
            evaluation_time: data.evaluation_time,
            org_id: data.org_id,
            org_name: data.org_name
          });
        }
      },
      fail: function () {
        app.requestError();
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    let that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载

    wx.request({
      url: config.repairAllInfoUrl,
      method: "POST",
      data: {
        role: app.globalData.role,
        token: app.globalData.token,
        repair_id: that.data.repair_id,
        openId: app.globalData.openId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
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
        } else if (res.data.code == 1403) {
          app.errorPrompt(res.data);
        } else if (res.data.code == 404) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: "/pages/index/service/service"
                })
              }
            }
          })
        } else {
          let data = res.data;
          that.setData({
            equipment_id: data.equipment_id ? data.equipment_id : '',
            equipment_name: data.equipment_name ? data.equipment_name : '',
            repair_no: data.repair_no ? data.repair_no : '',
            asset_name: data.asset_name,
            field_path: data.field_path,
            remarks: data.remarks,
            img_url: data.img_url,
            stars_key: data.stars_key,
            appraisal: data.appraisal ? data.appraisal : '',
            complain: data.complain,
            service_status: data.service_status,
            service_worker: data.service_worker,
            result: data.result,
            service_img_url: data.service_img_url,
            repair_status: data.repair_status,
            create_time: data.create_time,
            finish_time: data.finish_time,
            user_name: data.user_name,
            user_phone: data.user_phone,
            worker_phone: data.worker_phone,
            method: data.method,
            appointment: data.appointment,
            result_status: data.result_status,
            sign_date: data.sign_date,
            org_id: data.org_id,
            org_name: data.org_name
          });
        }
      },
      fail: function () {
        app.requestError();
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
        }
      }
    })
  },
})