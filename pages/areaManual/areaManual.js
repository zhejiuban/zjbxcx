// pages/areaManual/areaManual.js

const config = require('../../config')

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],             //上传图片的url路径
    img_ids: [],          //上传图片的id
    img_count: 3,         //目前可以上传图片的数量

    //报修类别  1 场地  2资产报修  3 设备组报修
    other: 1,

    //报修项目
    classify:[],
    index: 0,
    uploaderImg: "/images/upload.png",
    classify_id: '',
    org_id: '',
    isSubmit: true,       // 是否可以点击提交
    //长按事件
    touchStartTime: 0,    // 触摸开始时间
    touchEndTime: 0,      // 触摸结束时间

    //场地
    area_id: '',
    area_uuid: '',
    area_name: '',
    room_name:'',
    org_name: '',

    date: '',
    time: '10:00',

    //是否是重复报修
    repeat_repair: 0,

  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  //获取当前时间，格式YYYY-MM-DD
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.network_state();
    let that = this;
    that.setData({
      date: that.getNowFormatDate()
    });
    // 微信扫小程序获取的参数
    if (app.globalData.area_uuid) {
      wx.showLoading({
        mask: true,
        title: '加载中',
      });
      that.setData({
        area_uuid: app.globalData.area_uuid
      });
      if (app.globalData.openId) {
        that.getAreaInfo(that.data.area_uuid);
      }
      wx.hideLoading();
    } else if (options.area_uuid) {
      //小程序里面扫描二维码
      wx.showLoading({
        mask: true,
        title: '加载中',
      });
      let area_uuid = options.area_uuid;
      that.getAreaInfo(area_uuid);
      app.globalData.area_uuid = area_uuid;
      that.setData({
        area_uuid: area_uuid
      });
      wx.hideLoading();
    } 

  },

  click_scan: function () {
    // 允许从相机和相册扫码
    let that = this;
    wx.scanCode({
      success: (res) => {
        let str = decodeURIComponent(res.result);
        let url = res.result;
        let uuid = app.getUrlParam(url, app.globalData.uuid, app.globalData.areas);
        that.getAreaInfo(uuid);
      }
    });
  },

  getAreaInfo: function (area_uuid) {
    let that = this;
    that.getArea(area_uuid);
  },

  getArea:function(area_uuid) {
    let that = this;
    wx.request({
      url: config.findAreaUrl,
      method: "post",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        role: app.globalData.role,
        token: app.globalData.token,
        uuid: area_uuid,
        openId: app.globalData.openId
      },
      success: function (res) {
        if (res.data.code == 404){
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/index/service/service',
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
                wx.redirectTo({
                  url: '/pages/index/service/service',
                })
              }
            }
          })
        } else if (res.data.code == 1403) {
          app.errorPrompt(res.data);
        } else {
          that.setData({
            area_id: res.data.area_id,
            area_name: res.data.area_name,
            org_id: res.data.org_id,
            org_name: res.data.org_name,
            room_name: res.data.room_name,
            classifies: res.data.classifies
          });
          that.get_classify(res.data.classifies);
        }
      },
      fail: function () {
        wx.hideLoading();
        app.requestError();
      },
      complete: function(){
        wx.hideLoading();
      }
    })
  },

  //获取所有报修项目
  get_classify: function (data) {
    let that = this;
    let arr = [
      {
        id: '',
        name: '请选择'
      }
    ];
    for (let i = 1; i <= data.length; i++) {
      arr[i] = {
        id: data[i-1].id,
        name: data[i-1].name,
      };
    }
    that.setData({
      classify: arr,
      classify_id: ''
    });
  },

  //选择报修项目
  bindClassifyChange: function (e) {
    let that = this;
    let classify_id = that.data.classify[e.detail.value].id;
    that.setData({
      classify_id: classify_id,
      index: e.detail.value
    })
  },

  selectImg: function () {
    let that = this;
    if (!that.data.area_id) {
      wx.showModal({
        title: '提示',
        content: '请先选择报修的场地',
        showCancel: false
      })
    } else {
      wx.chooseImage({
        count: that.data.img_count, // 默认9
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          for (var i = 0; i < tempFilePaths.length; i++) {
            wx.uploadFile({
              url: config.imgFileUrl,
              filePath: tempFilePaths[i],
              method: "POST",
              name: 'img',
              formData: {
                token: app.globalData.token,
                openId: app.globalData.openId,
                org_id: that.data.org_id
              },
              header: {
                'content-type': 'multipart/form-data' // 默认值
              },
              success: function (res) {
                if(res.data.code == 1403){
                  app.errorPrompt(res.data);
                }
                let arrs1 = that.data.img_ids.concat(res.data);
                that.setData({
                  img_ids: arrs1
                })
              },
              fail: function () {
                wx.hideLoading();
                app.requestError();
              }
            })
          }
          let old_imgs = that.data.imgs.concat(tempFilePaths);
          let count = that.data.img_count - tempFilePaths.length;
          that.setData({
            imgs: old_imgs,
            img_count: count
          });
        }
      })
    }
  },


  // 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  // 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },

  // 长按
  longTap: function (e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success: function (res) {
        if (res.confirm) {
          let imgs = that.data.imgs;
          let img_ids = that.data.img_ids;
          //数组下标
          let index = e.currentTarget.dataset.index;
          imgs.splice(index, 1);
          img_ids.splice(index, 1);
          that.setData({
            imgs: imgs,
            img_ids: img_ids
          });
        } else if (res.cancel) {
        }
      }
    })
  },

  //图片预览  单击事件
  imgShow: function (e) {
    let that = this;
    if (that.touchEndTime - that.touchStartTime < 350) {
      let current_src = e.currentTarget.dataset.src;
      wx.previewImage({
        current: current_src, // 当前显示图片的http链接
        urls: that.data.imgs // 需要预览的图片http链接列表
      })
    }
  },

  formSubmit: function (e) {
    let that = this;
    e.detail.value['img'] = that.data.img;
    let time = that.data.date + " " + that.data.time;
    let remarks = e.detail.value.remarks;
    let user_phone = null;
    if (e.detail.value.user_phone){
      user_phone = e.detail.value.user_phone;
    }
    let user_name = null;
    if (e.detail.value.user_name) {
      user_name = e.detail.value.user_name;
    }
    let img_id = null;
    if(that.data.img_ids.length>0){
      img_id = that.data.img_ids.join(",");
    }

    if (!that.data.area_id) {
      wx.showModal({
        title: '提示',
        content: '请选择一个有效的场地',
        showCancel: false,
        success: function (res) {
        }
      })
    } else if (!that.data.classify_id) {
      wx.showModal({
        title: '提示',
        content: '请选择所要报修项目',
        showCancel: false,
        success: function (res) {
        }
      })
    } else if (e.detail.value.remarks.length == 0) {
      wx.showModal({
        title: '提示',
        content: '问题描述不能为空',
        showCancel: false,
        success: function (res) {
        }
      })
    } else if (e.detail.value.user_phone.length == 0) {
      wx.showModal({
        title: '提示',
        content: '联系方式不能为空',
        showCancel: false,
        success: function (res) {
        }
      })
    } else {
      app.globalData.uuid = null;
      wx.showLoading({
        mask: true,
        title: '正在提交中...',
      })
      wx.request({
        url: config.areaRepairUrl,
        method: "POST",
        data: {
          role: app.globalData.role,
          token: app.globalData.token,
          other: that.data.other,
          area_id: that.data.area_id,
          classify_id: that.data.classify_id,
          org_id: that.data.org_id,
          remarks: remarks,
          img_id: img_id,
          openId: app.globalData.openId,
          user_name: user_name,
          user_phone: user_phone,
          appointment: time
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 1) {

            //防止重复报修
            that.setData({
              repeat_repair: 1
            });

            app.globalData.area_uuid = null;
            wx.showModal({
              title: '提示',
              content: '报修成功,等待维修',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/index/service/service'
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
                  wx.redirectTo({
                    url: "/pages/index/service/service"
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
              success: function (res) {
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
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    }
  },

  to_index:function () {
    let that = this;
    app.globalData.area_uuid = null;
    that.data.area_id = null;
    app.toIndex();
  }

})