// pages/evaluate/evaluate.js

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
    key: 0,//评分

    repair_id:'',
    items: ''
  },

  //点击右边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    this.setData({
      key: key
    })
  },
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key: key
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    app.network_state();
    that.setData({
      repair_id: options.id
    });
    wx.request({
      url: config.repairAllInfoUrl,
      method: "POST",
      data: {
        role: app.globalData.role,
        token: app.globalData.token,
        repair_id: options.id,
        openId: app.globalData.openId
      },
      header: {
        'content-type': 'application/json'
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
          that.setData({
            items: res.data
            // equipment_id: res.data.equipment_id ? res.data.equipment_id : '',
            // equipment_name: res.data.equipment_name ? res.data.equipment_name : '',
            // asset_name: res.data.asset_name,
            // field_path: res.data.field_path,
            // remarks: res.data.remarks,
            // img_url: res.data.img_url,
            // stars_key: res.data.stars_key,
            // appraisal: res.data.appraisal ? res.data.appraisal : '',
            // complain: res.data.complain,
            // service_status: res.data.service_status,
            // service_worker: res.data.service_worker,
            // result: res.data.result,
            // service_img_url: res.data.service_img_url,
            // repair_status: res.data.repair_status,
            // create_time: res.data.create_time,
            // finish_time: res.data.finish_time,
            // user_name: res.data.user_name,
            // user_phone: res.data.user_phone,
            // method: res.data.method,
            // result_status: res.data.result_status,
            // sign_date: res.data.sign_date,
            // org_id: res.data.org_id,
            // org_name: res.data.org_name
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

  // form表单提交
  formSubmit: function (e){
    wx.showLoading({
      mask: true,
      title: '加载中',
    });
    let that = this;
    let score = that.data.key;
    if (score){
      let appraisal = e.detail.value.appraisal;
      let repair_id = that.data.repair_id;
      wx.request({
        url: config.evaluateUrl,
        method: "POST",
        data: {
          role: app.globalData.role,
          token: app.globalData.token,
          openId: app.globalData.openId,
          repair_id: repair_id,
          score: score,
          appraisal: appraisal,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 1) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/index/over/over'
                  })
                }
              }
            })
          } else if (res.data.code == 403) {
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
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
            })
          }
        },
        fail: function () {
          wx.hideLoading();
          app.requestError();
        }
      })
    }else{
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '请先选择评分，以便于我们以后更好的服务，谢谢',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } 
        }
      })
    }
  }
})