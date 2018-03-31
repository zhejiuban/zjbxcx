// pages/areaManual/areaManual.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],             //上传图片的url路径
    img_ids: [],          //上传图片的id
    img_count: 3,         //目前可以上传图片的数量
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
    area_name: '',
    room_name:'',

    org_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (app.globalData.area_uuid){
      that.getAreaInfo(app.globalData.area_uuid);
    }
  },

  click_scan: function () {
    // 允许从相机和相册扫码
    let that = this;
    wx.scanCode({
      success: (res) => {
        let str = decodeURIComponent(res.result);
        let url = res.result;
        let uuid = app.getUrlParam(url, "uuid");
        that.getAreaInfo(uuid);
      }
    });
  },

  getAreaInfo: function (area_uuid) {
    let that = this;
    that.getArea(area_uuid);
    // wx.request({
    //   url: 'https://wx.zhejiuban.com/wx/need_validation',
    //   method: "POST",
    //   data: {
    //     role: app.globalData.role,
    //     area_uuid: area_uuid,
    //     openId: app.globalData.openId
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     wx.hideLoading();
    //     res.data = app.getResData(res);
    //     if (res.data.code == 1) {
    //       //验证通过，可以正常报修
    //       that.getArea(area_uuid);
    //     } else if (res.data.code == 403) {
    //       wx.showModal({
    //         title: '提示',
    //         content: res.data.message,
    //         showCancel: false
    //       });
    //     } else if (res.data.code == 404) {
    //       wx.showModal({
    //         title: '提示',
    //         content: res.data.message,
    //         showCancel: false,
    //         success: function (res) {
    //           if (res.confirm) {
    //             wx.redirectTo({
    //               url: "/pages/index/service/service"
    //             });
    //           }
    //         }
    //       })
    //     } else if (res.data.code == 'system') {
    //       wx.redirectTo({
    //         url: "/pages/system/system"
    //       });
    //     } else {
    //       wx.showModal({
    //         title: '提示',
    //         content: res.data.message,
    //         showCancel: false,
    //         success: function (res) {
    //           if (res.confirm) {
    //             wx.redirectTo({
    //               url: '/pages/index/service/service',
    //             });
    //           }
    //         }
    //       })
    //     }
    //   }
    // });
  },

  getArea:function(area_uuid) {
    let that = this;
    wx.request({
      url: 'https://wx.zhejiuban.com/wx/area/find_area',
      method: "post",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        role: app.globalData.role,
        uuid: area_uuid,
        openId: app.globalData.openId
      },
      success: function (res) {
        console.log(res.data);
        console.log("classify");
        that.setData({
          area_id: res.data.area_id,
          area_name: res.data.area_name,
          org_id: res.data.org_id,
          org_name: res.data.org_name,
          room_name: res.data.room_name
        });
        that.get_classify(that.data.org_id);
      }
    })
  },

  //获取所有报修项目
  get_classify: function (orgId) {
    let that = this;
    wx.request({
      url: 'https://wx.zhejiuban.com/wx/area/get_classify',
      method: 'GET',
      data: {
        role: app.globalData.role,
        openId: app.globalData.openId,
        pid: 0,
        org_id: orgId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let data = res.data;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          arr[i] = {
            id: data[i].id,
            name: data[i].name,
          };
        }
        that.setData({
          classify: arr,
          classify_id: arr[0].id
        });
      }
    })
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
              url: 'https://wx.zhejiuban.com/file/img_file',
              filePath: tempFilePaths[i],
              method: "POST",
              name: 'img',
              formData: {
                openId: app.globalData.openId,
                org_id: that.data.org_id
              },
              header: {
                'content-type': 'multipart/form-data' // 默认值
              },
              success: function (res) {
                let arrs1 = that.data.img_ids.concat(res.data);
                that.setData({
                  img_ids: arrs1
                })
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
          wx.request({
            url: 'https://wx.zhejiuban.com/file/delete_img_file',
            method: "POST",
            data: {
              role: app.globalData.role,
              openId: app.globalData.openId,
              id: img_ids[index]
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
            }
          });

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
    let remarks = e.detail.value.remarks;
    let user_phone = null;
    if (e.detail.value.user_phone){
      user_phone = e.detail.value.user_phone;
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
    } else if (e.detail.value.remarks.length == 0) {
      wx.showModal({
        title: '提示',
        content: '问题描述不能为空',
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
        url: 'https://wx.zhejiuban.com/wx/repair/area_repair',
        method: "POST",
        data: {
          role: app.globalData.role,
          area_id: that.data.area_id,
          classify_id: that.data.classify_id,
          org_id: that.data.org_id,
          remarks: remarks,
          img_id: img_id,
          openId: app.globalData.openId,
          user_phone: user_phone
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 1) {
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
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
              }
            })
          }
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    }
  },

})