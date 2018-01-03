// pages/manual/manual.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [['北校区', '南校区'], ['信息工程学院', '电气工程学院', '人文旅游学院', '汽车工程学院', '机械工程学院'], ['001班gagfdfahf', '002班']],
    multiIndex: [0, 0, 0],
    index: 0,
    img: "",
    uuid: "",
    uploaderImg:"/images/upload.png"
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['信息工程学院', '电气工程学院', '人文旅游学院', '汽车工程学院', '机械工程学院'];
            data.multiArray[2] = ['0011班gdagdfag', '003班', '004班', '005班', '006班', '007班'];
            break;
          case 1:
            data.multiArray[1] = ['生物工程学院', '网络工程学院'];
            data.multiArray[2] = ['生物班', '网络班'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['0011班gdagdfag', 'test2'];
                break;
              case 1:
                data.multiArray[2] = ['test3'];
                break;
              case 2:
                data.multiArray[2] = ['test4', 'test5'];
                break;
              case 3:
                data.multiArray[2] = ['test6', 'test7', 'test8'];
                break;
              case 4:
                data.multiArray[2] = ['test9', 'test10', 'test11', 'test12'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['test13', 'test14'];
                break;
              case 1:
                data.multiArray[2] = ['test15', 'test16'];
                break;
              case 2:
                data.multiArray[2] = ['test17', 'test18', 'test19'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
  },

  click_scan:function(){
    // 允许从相机和相册扫码
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res.result);
        var result = res.result;
        if (true) {
          that.setData({
            uuid:result
          })
        }
      }
    });
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  selectImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);

        wx.uploadFile({
          url: 'https://wx.zhejiuban.com/uploader/imgfile',
          filePath: tempFilePaths[0],
          name: 'img',
          formData: {
          },
          success: function (res) {
            console.log(res)
          }
        })

        that.setData({
          img: tempFilePaths,
          uploaderImg: tempFilePaths
        });
      }
    })
  },
  imgShow: function (e) {
    console.log(e);
    var that = this;
    var current_src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current_src, // 当前显示图片的http链接
      urls: [current_src] // 需要预览的图片http链接列表
    })
  },
  formSubmit: function (e) {
    e.detail.value['img'] = this.data.img;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    wx.showModal({
      title: '提示',
      content: '维修人员正在赶来的路上，请耐心等待',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/index/service/service'
          })
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