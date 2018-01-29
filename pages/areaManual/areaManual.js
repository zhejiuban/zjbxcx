// pages/areaManual/areaManual.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "",
    imgId: "",
    asset_uuid: "",
    asset_id: '',
    asset_name: '',
    uploaderImg: "/images/upload.png",
    category: '',

    //场地
    index: 0,
    firlds1: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: 'https://wx.zhejiuban.com/field/get_field', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        pid:"0"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          fields1: res.data
        })
      }
    })
  },

  bindPickerChange: function (e) {
    console.log(e);
    let pid = this.data.fields1[e.detail.value]['0'];
    console.log(pid);
    // this.setData({
    //   id1: e.detail.value,
    //   id2: 0,
    //   id3: 0
    // });
    // let that = this;
    // wx.request({
    //   url: 'https://wx.zhejiuban.com/field/select1', //仅为示例，并非真实的接口地址
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   data: {
    //     openId: app.globalData.openId,
    //     pid: pid
    //   },
    //   success: function (res) {
    //     that.setData({
    //       fields2: res.data['0'],
    //       fields3: res.data['1']
    //     })
    //   }
    // });
  },
})