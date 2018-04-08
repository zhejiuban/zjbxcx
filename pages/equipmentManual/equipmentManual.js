// pages/equipmentManual/equipmentManual.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipment_id: '',
    org_name: '',
    org_id: '',
    area_name: '',
    area_id: '',
    asset_list: [],
    asset_id: '',
    asset_uuid: '',
    index: 0,


    imgs: [],             //上传图片的url路径
    img_ids: [],          //上传图片的id
    img_count: 3,         //目前可以上传图片的数量
    //长按事件
    touchStartTime: 0,    // 触摸开始时间
    touchEndTime: 0,      // 触摸结束时间

    uploaderImg: "/images/upload.png",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.network_state();
    let that = this;
    if (app.globalData.group_uuid) {
      console.log(app.globalData.group_uuid);
      if (app.globalData.openId) {
        that.getEquipment(app.globalData.group_uuid);
      }
    }
  },

  /**
   * 生命周期函数--监听页面卸载
  */
  onUnload: function () {
    console.log("onUnload");
    app.globalData.area_uuid = null;
  },

  getEquipment: function (group_uuid) {
    let that = this;
    wx.request({
      url: app.globalData.url + 'wx/find_equipment',
      method: "POST",
      data: {
        role: app.globalData.role,
        openId: app.globalData.openId,
        equipment_uuid: group_uuid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let data = res.data;
        if (res.data.code == 1) {
          that.setData({
            equipment_id: data.equipment_id,
            equipment_name: data.equipment_name,
            org_name: data.org,
            org_id: data.org_id,
            area_name: data.area,
            area_id: data.area_id,
            asset_list: data.list,
            asset_id: data.list[0].asset_id,
            asset_uuid: data.list[0].asset_uuid
          })
        } else if (res.data.code == 403) {
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
        } else {
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
        }
        console.log(that.data.asset_id);
        wx.hideLoading();
      }
    });
  },

  //选择报修资产
  bindAssetChange: function (e) {
    let that = this;
    let asset_id = that.data.asset_list[e.detail.value].asset_id;
    let asset_uuid = that.data.asset_list[e.detail.value].asset_uuid;
    that.setData({
      asset_id: asset_id,
      asset_uuid: asset_uuid,
      index: e.detail.value
    });
    console.log(that.data.asset_id);
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
            url: app.globalData.url + 'file/img_file',
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
    let asset_id = that.data.asset_id;
    if (!that.data.asset_id) {
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
        url: app.globalData.url + 'wx/repair/add',
        method: "POST",
        data: {
          role: app.globalData.role,
          asset_uuid: that.data.asset_uuid,
          asset_id: that.data.asset_id,
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
          if (res.data.code == 1) {
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
  to_index: function () {
    let that = this;
    that.data.equipment_id = null;
    app.globalData.group_uuid = null;
    app.toIndex();
  }

})