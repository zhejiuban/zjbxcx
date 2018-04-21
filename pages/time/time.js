const config = require('../../config')

// pages/time/time.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.network_state();
    wx.showLoading({
      mask:true,
      title: '加载中',
    })
    let that = this;
    wx.request({
      url: config.processLogUrl,
      method: 'POST',
      data: {
        role: app.globalData.role,
        token: app.globalData.token,
        openId: app.globalData.openId,
        process_id: options.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let data = res.data;
        let arr = [];
        for(let i=0;i<data.length;i++){
          let state = '';
          switch(data[i].op_state){
            case 1: 
              state = '创建新工单';
            break;
            case 2:
              state = '已分派工单';
            break;
            case 3:
              state = '维修人员接单';
            break;
            case 4:
              state = '维修人员拒单';
            break;
            case 5:
              state = '维修人员已填写维修结果';
            break;
            case 6:
              state = '用户已评价';
            break;
          }
          arr[i] = {
            op_state: data[i].op_state,
            state: state,
            remarks: data[i].remarks,
            created_at: data[i].created_at
          }
        }
        that.setData({
          logs:arr
        })
      },
      fail: function () {
        wx.hideLoading();
        app.requestError();
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})