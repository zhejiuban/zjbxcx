// pages/equipmentManual/equipmentManual.js

const config = require('../../config')

let app = getApp();
let interval = null; //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipment_id: '',
    equipment_uuid: '',
    org_name: '',
    org_id: '',
    area_name: '',
    area_id: '',
    asset_list: [],
    asset_id: '',
    asset_uuid: '',
    index: 0,

    //报修类别  1 场地  2资产报修  3 设备组报修
    other: 3,

    imgs: [],             //上传图片的url路径
    img_ids: [],          //上传图片的id
    img_count: 3,         //目前可以上传图片的数量
    //长按事件
    touchStartTime: 0,    // 触摸开始时间
    touchEndTime: 0,      // 触摸结束时间

    uploaderImg: "/images/upload.png",

    date: '',
    time: '',

    user_name: '',
    user_phone: '',

    //是否是重复报修
    repeat_repair: 0,

    //短信验证
    is_check: true,
    disabled: false,
    telephone: '',
    times: '获取验证码', //倒计时 
    currentTime: 60,
    verify: ''
  },

  phoneInput(e) {
    let value = e.detail.value
    this.setData({
      telephone: value
    })
    if (this.data.user_phone == '' || value != this.data.user_phone) {
      this.setData({
        is_check: true
      })
    } else {
      this.setData({
        is_check: false
      })
    }
  },
  codeInput(e) {
    let value = e.detail.value
    this.setData({
      verify: value
    })
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        times: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          times: '重新获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    var that = this;
    if (that.data.telephone.length != 11 || !app.phoneValidate(that.data.telephone))     {
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号',
        showCancel: false
      })
      return;
    }
    that.setData({
      disabled: true
    })
    this.getCode();
    //获取验证码
    wx.request({
      url: config.getSmsVerfiyCode,
      method: "POST",
      data: {
        token: app.globalData.token,
        openId: app.globalData.openId,
        phone: this.data.telephone
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code != 1) {
          wx.showModal({
            title: '提示',
            content: '验证码获取失败',
            showCancel: false
          })
        }
      },
      fail: function (e) {
        wx.showModal({
          title: '提示',
          content: '网络错误，请重试',
          showCancel: false
        })
      }
    })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.network_state();
    let that = this;
    that.setData({
      date: app.getNowFormatDate(),
      time: app.getNowHour()
    });
    // 微信扫小程序获取的参数
    if (app.globalData.equipment_uuid) {
      wx.showLoading({
        mask: true,
        title: '加载中',
      });
      that.setData({
        equipment_uuid: app.globalData.equipment_uuid
      });
      if (app.globalData.openId) {
        that.getEquipment(that.data.equipment_uuid);
      }
      wx.hideLoading();
    } else if (options.equipment_uuid) {
      //小程序里面扫描二维码
      wx.showLoading({
        mask: true,
        title: '加载中',
      });
      let equipment_uuid = options.equipment_uuid;
      that.getEquipment(equipment_uuid);
      app.globalData.equipment_uuid = equipment_uuid;
      that.setData({
        equipment_uuid: equipment_uuid
      });
      wx.hideLoading();
    } 

  },

  getEquipment: function (equipment_uuid) {
    let that = this;
    wx.request({
      url: config.findEquipmentUrl,
      method: "POST",
      data: {
        role: app.globalData.role,
        token: app.globalData.token,
        openId: app.globalData.openId,
        equipment_uuid: equipment_uuid
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
            asset_uuid: data.list[0].asset_uuid,
            user_name: res.data.user_name ? res.data.user_name : '',
            user_phone: res.data.user_phone ? res.data.user_phone : '',
          });
          if (that.data.user_phone.length == 11) {
            that.setData({
              is_check: false
            });
          }
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
        } else if (res.data.code == 1403) {
          app.errorPrompt(res.data);
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
        wx.hideLoading();
      },
      fail: function () {
        wx.hideLoading();
        app.requestError();
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
    let time = that.data.date + " " + that.data.time;
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
    } else if (e.detail.value.user_name.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false,
        success: function (res) {
        }
      })
    } else if (e.detail.value.user_phone.length != 11 || !app.phoneValidate(e.detail.value.user_phone)) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号',
        showCancel: false,
        success: function (res) {
        }
      })
    } else {

      if (that.data.is_check && that.data.verify.length < 4) {
        wx.showModal({
          title: '提示',
          content: '请输入验证码',
          showCancel: false
        })
        return;
      }

      let user_phone = null;
      if (e.detail.value.user_phone) {
        user_phone = e.detail.value.user_phone;
      }
      let user_name = null;
      if (e.detail.value.user_name) {
        user_name = e.detail.value.user_name;
      }
      app.globalData.uuid = null;
      wx.showLoading({
        mask: true,
        title: '正在提交中...',
      });
      wx.request({
        url: config.repairAddUrl,
        method: "POST",
        data: {
          other: that.data.other,
          role: app.globalData.role,
          token: app.globalData.token,
          asset_uuid: that.data.asset_uuid,
          asset_id: that.data.asset_id,
          remarks: remarks,
          img_id: img_id,
          area_id: that.data.area_id,
          openId: app.globalData.openId,
          user_name: user_name,
          user_phone: user_phone,
          is_check: that.data.is_check,
          verify: that.data.verify
          // appointment: time
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

            app.globalData.uuid = null;
            wx.showModal({
              title: '提示',
              content: '报修成功，等待维修',
              showCancel: false,
              success: function (res) {
                app.globalData.uuid = null;
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/index/service/service'
                  });
                  // app.guideAttention();
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
          } else if (res.data.code == 0) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // wx.reLaunch({
                  //   url: '/pages/index/service/service',
                  // });
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
                  // wx.reLaunch({
                  //   url: '/pages/index/service/service',
                  // });
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
  to_index: function () {
    let that = this;
    that.data.equipment_id = null;
    app.globalData.equipment_uuid = null;
    app.toIndex();
  }

})