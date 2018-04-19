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
     
    asset_uuid: '',
    asset_id: '',
    asset_name:'',
    
    spec: '',
    org: '',
    org_id: '',
    dempartment:'',
    area: '',
    category: '',

    uploaderImg:"/images/upload.png",
    
    isSubmit: true,       // 是否可以点击提交
    //长按事件
    touchStartTime: 0,    // 触摸开始时间
    touchEndTime: 0,      // 触摸结束时间

    infoShow: false,
    // infoIcon: '/images/arrow-down.png'
    infoIcon: '/images/nav.png'
    
  },

  onLoad: function (options) {
    app.network_state();
    let that = this;
    //微信扫描二维码链接携带的参数
    
    // 微信扫小程序获取的参数
    if(app.globalData.asset_uuid){
      wx.showLoading({
        mask: true,
        title: '加载中',
      });
      that.setData({
        asset_uuid: app.globalData.asset_uuid
      });
      if(app.globalData.openId){
        that.getAssetInfo(that.data.asset_uuid);
      }
      wx.hideLoading();
    } else if (options.asset_uuid){
      //小程序里面扫描二维码
      wx.showLoading({
        mask: true,
        title: '加载中',
      });
      let asset_uuid = options.asset_uuid;
      that.getAssetInfo(asset_uuid);
      app.globalData.asset_uuid = asset_uuid;
      that.setData({
        asset_uuid: asset_uuid
      });
      wx.hideLoading();
    } 
  },
  

  //获取资产信息
  getAssetInfo: function(asset_uuid){
    let that = this;
    that.getAsset(asset_uuid);
  },

  getAsset: function (asset_uuid) {
    let that = this;
    wx.request({
      // url: app.globalData.url + 'wx/asset_find',
      url: config.assetFindUrl,
      method: "POST",
      data: {
        role: app.globalData.role,
        token: app.globalData.token,
        openId: app.globalData.openId,
        asset_uuid: asset_uuid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        } else if (res.data.code==403) {
          wx.redirectTo({
            url: '/pages/index/service/service',
          })
        } else if (res.data.code == 404) {
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
            asset_name: res.data.name,
            asset_id: res.data.id,
            asset_uuid: res.data.asset_uid,
            area: res.data.area ? res.data.area_path : '暂无',
            category: res.data.category ? res.data.category.name : '暂无',
            department: res.data.department ? res.data.department.name : '暂无',
            org: res.data.org ? res.data.org.name : '暂无',
            org_id: res.data.org_id,
            spec: res.data.spec ? res.data.spec : '暂无',
            area_id: res.data.area_id,
            isSubmit: false
          });
        }
        wx.hideLoading();
      },
      fail: function () {
        wx.hideLoading();
        app.requestError();
      }
    });
  },

  click_info: function () {
    let that = this;
    if(that.data.infoShow==false){
      this.setData({
        infoShow: true,
      });
    }else{
      this.setData({
        infoShow: false,
      });
    }
    
  },

  click_scan:function(){
    // 允许从相机和相册扫码
    let that = this;
    wx.scanCode({
      success: (res) => {
        let str = decodeURIComponent(res.result);
        let url = res.result;
        let asset_uuid = app.getUrlParam(url, app.globalData.assets);
        that.getAssetInfo(asset_uuid);
      }
    });
  },

  selectImg: function () {
    let that = this;
    wx.chooseImage({
      count: that.data.img_count, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        let str = that.data.imgId;
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            // url: app.globalData.url + 'wx/img_file',
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
              });
            }
          })
        }
        var old_imgs = that.data.imgs.concat(tempFilePaths);
        var count = that.data.img_count - tempFilePaths.length;
        that.setData({
          imgs: old_imgs,
          img_count: count
        });
      },
      fail: function () {
        wx.hideLoading();
        app.requestError();
      }
    })
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
        }
      },
      fail: function () {
        wx.hideLoading();
        app.requestError();
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
    e.detail.value['category_id'] = that.data.category_id;
    let asset_uuid = that.data.asset_uuid;
    let remarks = e.detail.value.remarks;
    let img_id = that.data.img_ids.join(",");
    let asset_id = that.data.asset_id;
    if (!that.data.asset_id){
      wx.showModal({
        title: '提示',
        content: '请选择一个有效的资产',
        showCancel: false,
        success: function (res) {
        }
      });
    } else if (e.detail.value.remarks.length == 0) {
      wx.showModal({
        title: '提示',
        content: '问题描述不能为空',
        showCancel: false,
        success: function (res) {
        }
      });
    } else if (e.detail.value.user_phone.length == 0) {
      wx.showModal({
        title: '提示',
        content: '联系方式不能为空',
        showCancel: false,
        success: function (res) {
        }
      })
    } else {
      let user_phone = null;
      if (e.detail.value.user_phone) {
        user_phone = e.detail.value.user_phone;
      }
      app.globalData.uuid = null;
      wx.showLoading({
        mask: true,
        title: '正在提交中...',
      });
      wx.request({
        // url: app.globalData.url + 'wx/repair/add', 
        url: config.addUrl, 
        method:"POST",
        data: {
          role: app.globalData.role,
          token: app.globalData.token,
          asset_uuid: asset_uuid,
          asset_id: asset_id,
          remarks: remarks,
          img_id: img_id,
          area_id: that.data.area_id,
          openId: app.globalData.openId,
          user_phone: user_phone
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading();
          if(res.data.code == 1){
            app.globalData.uuid = null;
            wx.showModal({
              title: '提示',
              content: '报修成功，等待维修',
              showCancel: false,
              success: function (res) {
                app.globalData.uuid = null;
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/index/service/service'
                  });
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
                    url: "/pages/home/home"
                  });
                }
              }
            })
          } else if (res.data.code == 404) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: "/pages/index/service/service"
                  });
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
  },
  to_index: function () {
    let that = this;
    that.data.asset_uuid = null;
    that.data.asset_id = null;
    app.globalData.asset_uuid = null;
    app.toIndex();
  }
})