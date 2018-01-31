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
    asset_uuid: "",
    asset_id: '',
    asset_name: '',
    uploaderImg: "/images/upload.png",
    category: '',
    isSubmit: true,       // 是否可以点击提交
    //长按事件
    touchStartTime: 0,    // 触摸开始时间
    touchEndTime: 0,      // 触摸结束时间
    org_id: null,

    //场地
    index: 0,
    area: [],

    //资产列表
    asset_list: [],
    asset_index: 0,

    //固定场地值
    area_names: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: 'https://wx.zhejiuban.com/wx/area/find_area',
      method: 'POST',
      data: {
        openId: app.globalData.openId,
        pid: 0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let arr = [];
        let data = res.data;
        let page = that.data.page + 1;
        for (var i = 0; i < data.length; i++) {
          arr[i] = {
            area_id: data[i].area_id,
            area_uuid: data[i].area_uuid,
            name: data[i].name,
            org_id: data[i].org_id,
            pid: data[i].pid
          };
        }
        that.setData({
          area: arr,
          org_id: data[0].org_id
        })
      }
    })
  },

  bindPickerChange: function (e) {
    let that = this;
    let area_id = that.data.area[e.detail.value].area_id;

    let area_names = that.data.area_names + that.data.area[e.detail.value].name+"/";
    that.setData({
      area_names: area_names
    });

    //获取当前场地下的所有资产
    wx.request({
      url: 'https://wx.zhejiuban.com/wx/area/find_asset',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        openId: app.globalData.openId,
        area_id: area_id
      },
      success: function (res) {
        console.log(res);
        if(res.data.length>0){
          let arr = [];
          let data = res.data;
          let page = that.data.page + 1;
          for (let i = 0; i < data.length; i++) {
            arr[i] = {
              asset_id: data[i].asset_id,
              asset_name: data[i].asset_name,
              asset_uuid: data[i].asset_uuid,
              category: data[i].category
            }
          }
          that.setData({
            asset_list: arr,
            asset_index: 0,
            asset_id: arr[0].asset_id,
            asset_uuid: arr[0].asset_uuid
          });
        }
        
      }
    });

    //获取当前场地下的子场地
    wx.request({
      url: 'https://wx.zhejiuban.com/wx/area/find_area',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        openId: app.globalData.openId,
        pid: area_id
      },
      success: function (res) {
        let arr = [];
        let data = res.data;
        let page = that.data.page + 1;
        for (var i = 0; i < data.length; i++) {
          arr[i] = {
            area_id: data[i].area_id,
            area_uuid: data[i].area_uuid,
            name: data[i].name,
            org_id: data[i].org_id,
            pid: data[i].pid
          };
        }
        that.setData({
          area: arr,
        })
      }
    });
  },

  //重置
  resetArea: function () {
    let that = this;

    that.setData({
      //场地
      area: [],
      //资产列表
      asset_list: [],
      asset_index: 0,
      //固定场地值
      area_names: '',
      asset_uuid: "",
      asset_id: '',
      asset_name: '',
      category: '',
    });
    that.onLoad();
  },

  //选择资产
  bindAssetChange: function (e) {
    let that = this;
    let asset_id = that.data.asset_list[e.detail.value].asset_id;
    let asset_uuid = that.data.asset_list[e.detail.value].asset_uuid;
    that.setData({
      asset_index: e.detail.value,
      asset_id: asset_id,
      asset_uuid: asset_uuid
    })
  },

  //上传图片
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
    let img_id = that.data.img_ids.join(",");
    console.log(img_id);
    let asset_id = that.data.asset_id;
    if (!asset_id) {
      wx.showModal({
        title: '提示',
        content: '请选择一个有效的资产',
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
        url: 'https://wx.zhejiuban.com/wx/repair/add',
        method: "POST",
        data: {
          asset_id: asset_id,
          remarks: remarks,
          img_id: img_id,
          openId: app.globalData.openId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 1) {
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
          } else if (res.data.code == 403) {
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