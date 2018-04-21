// pages/areaList/areaList.js

const config = require('../../config')

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: '',
    org_id:'',
    area_id: '',
    org_index: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let pid = options.pid;
    let org_id = options.org_id;
    let org_index = options.org_index;
    that.setData({
      org_id: org_id,
      org_index: org_index
    });
    wx.request({
      url: config.getAreaUrl,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        token: app.globalData.token,
        role: app.globalData.role,
        openId: app.globalData.openId,
        org_id: org_id,
        pid: pid,
      },
      success: function (res) {
        that.setData({
          items: res.data
        })
      }
    })
  },

  next_area: function(e){
    let that = this;
    let org_id = that.data.org_id;
    let org_index = that.data.org_index;
    let pid = e.currentTarget.dataset.pid;

    wx.navigateTo({
      url: '/pages/areaList/areaList?org_id=' + org_id + "&pid=" + pid + '&org_index=' + org_index,
    });
  },

  radioChange: function (e) {
    let that = this;
    that.setData({
      area_id: e.detail.value
    })
  },

  to_areaRepair: function(){
    wx.redirectTo({
      url: '/pages/areaRepair/areaRepair',
    })
  },

  formSubmit: function (e){
    let that = this;
    let org_id = that.data.org_id;
    let area_id = that.data.area_id;
    let org_index = that.data.org_index;
    wx.redirectTo({
      url: '/pages/areaRepair/areaRepair?org_id=' + org_id + '&area_id=' + area_id + '&org_index=' + org_index,
    })
  }

})