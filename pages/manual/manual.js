let app = getApp();
// pages/manual/manual.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],             //上传图片的url路径
    img_ids: [],          //上传图片的id
    img_count: 3,         //目前可以上传图片的数量
    asset_uuid: "",
    asset_id:'',
    asset_name:'',
    area_id: "",          // 场地
    uploaderImg:"/images/upload.png",
    category:'',
    
    isSubmit: true,       // 是否可以点击提交
    //长按事件
    touchStartTime: 0,    // 触摸开始时间
    touchEndTime: 0,      // 触摸结束时间
    org_id: null
  },

  onLoad: function (options) {
    let that = this;
    //微信扫描二维码链接携带的参数
    
    // 微信扫小程序获取的参数
    if(app.globalData.uuid){
      wx.showLoading({
        // mask: true,
        title: '加载中1',
      });
      that.setData({
        asset_uuid: app.globalData.uuid
      });
      if(app.globalData.openId){
        that.getAssetInfo(that.data.asset_uuid);
      }
    }

    //小程序里面扫描二维码
    if (options.asset_uuid){
      wx.showLoading({
        mask: true,
        title: '加载中2',
      });
      let asset_uuid = options.asset_uuid;
      that.getAssetInfo(asset_uuid);
      that.setData({
        asset_uuid: asset_uuid
      });
      wx.hideLoading();
    }
  },
  
  //获取资产信息
  getAssetInfo: function(asset_uuid){
    let that = this;
    app.globalData.uuid = asset_uuid;
    // app.getUserInfo();
    wx.request({
      url: 'https://wx.zhejiuban.com/wx/need_validation',
      method: "POST",
      data: {
        asset_uuid: app.globalData.uuid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 1) {
          // 前去验证  暂未写
          //需要LDAP验证
          wx.showModal({
            title: '提示',
            content: '需要LDAP用户验证',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/login/login',
                });
              } else if (res.cancel) {
                wx.redirectTo({
                  url: '/pages/index/service/service',
                });
              }
            }
          });
        } else if (res.data.code == 403) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        } else {
          console.log("不需要LDAP验证");
          wx.request({
            url: 'https://wx.zhejiuban.com/wx/add_user',
            method: "POST",
            data: {
              openId: app.globalData.openId,
              asset_uuid: app.globalData.uuid
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.request({
                url: 'https://wx.zhejiuban.com/wx/asset_find',
                method: "POST",
                data: {
                  openId: app.globalData.openId,
                  asset_uuid: asset_uuid
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log(res);
                  if (res.data.code == 1) {
                    wx.showModal({
                      title: '提示',
                      content: res.data.message,
                      showCancel: false
                    })
                  } else {
                    that.setData({
                      asset_name: res.data.name,
                      category: res.data.category,
                      field: res.data.field,
                      asset_id: res.data.id,
                      asset_uuid: res.data.asset_uid,
                      org_id: res.data.org_id,
                      area_id: res.data.area_id,
                      isSubmit: false
                    });
                  }
                  wx.hideLoading();
                }
              });
            }
          })
        }
      }
    });
  },


  input_uuid: function (e) {
    let that = this;
    if(e.detail.cursor==36){
      let asset_uuid = e.detail.value;
      wx.request({
        url: 'https://wx.zhejiuban.com/asset/find',
        method: "POST",
        data: {
          openId: app.globalData.openId,
          asset_uuid: asset_uuid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.setData({
            asset_name: res.data.name,
            category: res.data.category,
            field: res.data.field,
            asset_id: res.data.id,
            asset_uuid: asset_uuid,
            org_id: res.data.org_id,
            isSubmit: false
          });
          if (that.data.asset_id) {
            that.setData({
              disabled: false
            });
          } else {
            that.setData({
              disabled: true
            });
          }
        }
      })
    }else{
      that.setData({
        asset_name: '',
        category: '',
        field: '',
        asset_id: ''
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
        let asset_uuid = app.getUrlParam(url, app.globalData.asset_uuid);
        console.log(asset_uuid);
        that.getAssetInfo(asset_uuid);
      }
    });
  },

  selectImg: function () {
    let that = this;
    if (!that.data.asset_id) {
      wx.showModal({
        title: '提示',
        content: '请先选择报修的资产',
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
              id: img_ids[index]
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if(res.data.code==1){
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            }
          });

          imgs.splice(index, 1);
          img_ids.splice(index, 1);
          that.setData({
            imgs: imgs,
            img_ids: img_ids
          });
        } else if (res.cancel) {
          // console.log('用户点击取消')
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
    e.detail.value['category_id'] = that.data.category_id;
    let asset_uuid = that.data.asset_uuid;
    let remarks = e.detail.value.remarks;
    let img_id = that.data.img_ids.join(",");
    let asset_id = that.data.asset_id;
    console.log(that.data.area_id);
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
    }else{
      app.globalData.uuid = null;
      wx.showLoading({
        mask: true,
        title: '正在提交中...',
      });
      wx.request({
        url: 'https://wx.zhejiuban.com/wx/repair/add', 
        method:"POST",
        data: {
          asset_uuid: asset_uuid,
          asset_id: asset_id,
          remarks: remarks,
          img_id: img_id,
          area_id: that.data.area_id,
          openId: app.globalData.openId
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
              content: '维修人员正在赶来的路上，请耐心等待',
              showCancel: false,
              success: function (res) {
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
                  wx.navigateBack({
                    url: "/pages/home/home"
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
              }
            })
          }
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    }
  }
})