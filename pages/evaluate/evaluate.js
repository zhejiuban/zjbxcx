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
          } else if (res.data.code == 0) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/index/service/service',
                  });
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function(res){
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/index/service/service',
                  });
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