// pages/time/time.js
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
    let that = this;
    wx.request({
      url: 'https://wx.zhejiuban.com/wx/repair/process_log', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        process_id: options.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
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
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})