// pages/areaRepair/areaRepair.js

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

    uploaderImg: "/images/upload.png",

    isSubmit: true,       // 是否可以点击提交
    //长按事件
    touchStartTime: 0,    // 触摸开始时间
    touchEndTime: 0,      // 触摸结束时间

    orgs: '',
    orgIndex: 0,
    org_id: '',
    area_id: '',
    area_name: '',
    room_name: '',
    classify: '',
    classify_id: '',
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (JSON.stringify(options) != "{}"){

      that.setData({
        org_id: options.org_id,
        area_id: options.area_id,
        orgIndex: options.org_index,
      })
      that.get_org();
      //场地信息
      that.get_area(that.data.area_id);
    }else{
      that.get_org();
    }
  },

  get_org: function(){
    let that = this;
    wx.request({
      // url: app.globalData.url + 'wx/area/get_org',
      url: config.getOrgUrl,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        token: app.globalData.token,
        role: app.globalData.role,
        user_id: app.globalData.user_id
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
          if(res.data.code==1){
            //只关联一个单位
            that.setData({
              orgs: [{
                 id: res.data.id,
                 name: res.data.name
                 }],
              org_id: res.data.id
            })
          }else{
            that.setData({
              orgs: res.data
            });
          }
        }
      }
    })
  },

  get_area: function (area_id){
    let that = this;
    wx.request({
      // url: app.globalData.url + 'wx/area/find_area',
      url: config.findAreaUrl,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        token: app.globalData.token,
        role: app.globalData.role,
        area_id: area_id,
        openId: app.globalData.openId,
        user_id: app.globalData.user_id
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
            area_id: res.data.area_id,
            area_name: res.data.area_name,
            room_name: res.data.room_name,
            org_id: res.data.org_id,
          
            classify: res.data.classifies,
            classify_id: '',
            index: 0
          })
        }
      }
    })
  },

  bindOrgChange: function (e) {
    let that = this;
    let org_id = that.data.orgs[e.detail.value].id;
    that.setData({
      org_id: org_id,
      orgIndex: e.detail.value,
      //重置
      imgs: [],
      img_ids: [],
      area_id: '',
      area_name: '',
      room_name: '',
      classify: '',
      classify_id: '',
      index: 0
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

  select_area: function (e) {
    let that = this;
    let pid = e.currentTarget.dataset.pid;
    let org_id = that.data.org_id;
    console.log(org_id);
    let orgIndex = that.data.orgIndex;
    if (org_id){
      that.setData({
        area_id: '',
        area_name: '',
        room_name: '',
        classify: '',
        classify_id: '',
        index: 0,
        imgs: [],
        img_ids: []
      });
      wx.navigateTo({
        url: '/pages/areaList/areaList?org_id=' + org_id + '&pid=' + pid + '&org_index=' + orgIndex,
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请先选择报修单位',
        showCancel: false
      })
    }
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
              // url: app.globalData.url +'wx/img_file',
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
                if (res.data.code == 1403) {
                  app.errorPrompt(res.data);
                }
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

  formSubmit: function(e){
    let that = this;
    e.detail.value['img'] = that.data.img;
    let remarks = e.detail.value.remarks;
    let user_phone = null;
    if (e.detail.value.user_phone) {
      user_phone = e.detail.value.user_phone;
    }
    let img_id = null;
    if (that.data.img_ids.length > 0) {
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
        // url: app.globalData.url +'wx/repair/area_repair',
        url: config.areaRepairUrl,
        method: "POST",
        data: {
          role: app.globalData.role,
          token: app.globalData.token,
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
          } else if (res.data.code == 1403) {
            app.errorPrompt(res.data);
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
        fail: function () {
          wx.hideLoading();
          app.requestError();
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    }
  }

})