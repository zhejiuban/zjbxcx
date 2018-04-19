const config = require('config')

//app.js
App({
  onLaunch: function (e) {
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
  },

  onShow: function (e) {
    let that = this;
    if (e.query.q) {
      //微信扫描二维码携带的参数
      let url = decodeURIComponent(e.query.q);
      let asset_uuid = that.getUrlParam(url, that.globalData.assets);
      if(asset_uuid){
        that.globalData.asset_uuid = asset_uuid;
      }else{
        let area_uuid = that.getUrlParam(url, that.globalData.areas);
        if (area_uuid){
          that.globalData.area_uuid = area_uuid;
        }else{
          let equipment_uuid = that.getUrlParam(url, that.globalData.equipments);
          that.globalData.equipment_uuid = equipment_uuid;
        }
      }
      if (!that.globalData.validate) {
        that.getUserInfo();
      }
    } else {
      if (!that.globalData.validate) {
        that.getUserInfo();
      }
    }
  },
  /**
   * 用户授权  用户信息(昵称等信息)
   */
  getUserInfo: function () {
    let that = this;
    wx.getSetting({
      success: res => {
        let scope_user = res.authSetting['scope.userInfo'];
        wx.login({
          success: res => {
            let code = res.code;
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.showLoading({
              mask: true,
              title: '加载中',
            });
            wx.getUserInfo({
              success: res => {
                let iv = res.iv;
                let encryptedData = res.encryptedData;
                //发起网络请求
                //登录授权
                wx.request({
                  // url: that.globalData.url + 'wx/login',
                  url: config.loginUrl,
                  method: "POST",
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  data: {
                    token: that.globalData.token,
                    code: code,
                    iv: iv,
                    encryptedData: encryptedData
                  },
                  success: function (res) {
                    // res.data = that.getResData(res);
                    that.globalData.userInfo = res.data;
                    that.globalData.openId = res.data.openId;
                    that.globalData.unionid = res.data.unionId;
                    //判断有没有验证身份(判断是否注册)
                    wx.request({
                      // url: that.globalData.url + 'wx/authentication',
                      url: config.authenticationUrl,
                      method: "POST",
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      data: {
                        role: 1,    //用户角色
                        token: that.globalData.token,
                        openId: that.globalData.openId,
                        unionid: that.globalData.unionid
                      },
                      success: function (res) {
                        wx.hideLoading();
                        // res.data = that.getResData(res);
                        if(res.data.code==1){
                          //验证过了
                          that.globalData.authorization=1;
                          that.globalData.user_id = res.data.user_id;
                          that.globalData.validate = true;
                          if (that.globalData.asset_uuid || that.globalData.area_uuid || that.globalData.equipment_uuid){
                            that.needValidation();
                          } else {
                            wx.redirectTo({
                              url: "/pages/index/service/service"
                              // url: "/pages/areaRepair/areaRepair"
                            });
                          }
                        } else if (res.data.code == 1403) {
                          that.errorPrompt(res.data);
                        } else {
                          //未注册用户信息
                          /**
                           * 首先判断是否有资产uuid
                           * 有资产id存在的话，去后台判断是否需要LDAP
                           * 如果没有资产存在的，直接授权手机号验证
                           * */
                          wx.request({
                            // url: that.globalData.url + 'wx/add_user',
                            url: config.addUserUrl,
                            method: "POST",
                            header: {
                              'content-type': 'application/json' // 默认值
                            },
                            data: {
                              role: 1,    //用户角色
                              token: that.globalData.token,
                              openId: that.globalData.openId,
                              unionid: that.globalData.unionid,
                              name: that.globalData.userInfo.nickName,
                              avatar: that.globalData.userInfo.avatarUrl
                            },
                            success: function (res) {
                              // res.data = that.getResData(res);
                              that.globalData.validate = true;
                              if (res.data.code == 1) {
                                that.globalData.user_id = res.data.user_id;
                                //用户添加成功
                                //判断此单位是如何验证用户的
                                if (that.globalData.asset_uuid || that.globalData.area_uuid || that.globalData.equipment_uuid) {
                                  wx.request({
                                    // url: that.globalData.url + 'wx/user_auth',
                                    url: config.userAuthUrl,
                                    method: "POST",
                                    header: {
                                      'content-type': 'application/json' // 默认值
                                    },
                                    data: {
                                      role: 1,    //用户角色
                                      token: that.globalData.token,
                                      user_id: that.globalData.user_id,
                                      asset_uuid: that.globalData.asset_uuid,
                                      area_uuid: that.globalData.area_uuid,
                                      equipment_uuid: that.globalData.equipment_uuid
                                    },
                                    success: function (res) {
                                      // res.data = that.getResData(res);
                                      if(res.data.code==1){
                                        if (that.globalData.asset_uuid) {
                                          wx.redirectTo({
                                            url: '/pages/manual/manual',
                                          })
                                        } else if (that.globalData.area_uuid){
                                          wx.redirectTo({
                                            url: '/pages/areaManual/areaManual',
                                          })
                                        } else if (that.globalData.equipment_uuid){
                                          wx.redirectTo({
                                            url: '/pages/equipmentManual/equipmentManual',
                                          })
                                        }
                                      }else if(res.data.code==0){
                                        wx.showModal({
                                          title: '提示',
                                          content: '二维码url错误',
                                          showCancel: false,
                                          success: function (res) {
                                            if (res.confirm) {
                                              wx.redirectTo({
                                                url: '/pages/index/service/service',
                                              })
                                            } 
                                          }
                                        })
                                      }else if (res.data.code == 'LDAP') {
                                        wx.showModal({
                                          title: '提示',
                                          content: '需要LDAP验证',
                                          showCancel: false,
                                          success: function (res) {
                                            if (res.confirm) {
                                              wx.navigateTo({
                                                url: '/pages/index/service/service',
                                              })
                                            }
                                          }
                                        })
                                      } else if (res.data.code == 'system') {
                                        wx.navigateTo({
                                          url: '/pages/system/system',
                                        })
                                      }
                                    }
                                  })
                                } else {
                                  wx.redirectTo({
                                    url: '/pages/index/service/service',
                                  })
                                }
                              } else if (res.data.code == 1403) {
                                that.errorPrompt(res.data);
                              }
                            }
                          });
                          
                        }
                      },
                      fail: function () {
                        wx.hideLoading();
                        that.requestError();
                      }
                    })
                  },
                  fail: function () {
                    wx.hideLoading();
                    that.requestError();
                  }
                });
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                // if (that.userInfoReadyCallback) {
                //   that.userInfoReadyCallback(res)
                // }
              },
              fail: function () {
                wx.hideLoading();
                that.globalData.showLoad = false;
                that.globalData.btnShow = true;
                if (scope_user == false) {
                  that.globalData.firstLogin = 2;
                }
                if (that.globalData.firstLogin==1){
                  wx.navigateTo({
                    url: '/pages/home/home?type=1',
                  });
                }else{
                  wx.showModal({
                    title: '微信授权',
                    content: '获取你的公开信息（昵称、头像等）',
                    confirmText: '允许',
                    cancelText: '拒绝',
                    success: function (res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success: function (res) {
                            if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                              wx.showLoading({
                                mask: true,
                                title: '加载中',
                              });
                            } else {
                              // 拒绝授权用户信息，回到home页面进行授权
                              wx.redirectTo({
                                url: '/pages/home/home',
                              })
                            }
                          }
                        })
                      } else if (res.cancel) {
                        that.globalData.showLoad = false;
                        that.globalData.btnShow = true;
                        //拒绝授权用户信息，回到home页面进行授权
                        wx.redirectTo({
                          url: '/pages/home/home?type=1',
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  },

  //获取资产信息
  getAssetInfo: function (asset_uuid) {
    let that = this;
    wx.request({
      // url: that.globalData.url + 'wx/asset_find',
      url: config.assetFindUrl,
      method: "POST",
      data: {
        token: that.globalData.token,
        openId: that.globalData.openId,
        asset_uuid: asset_uuid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(res.data.code){
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        }else{
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
      },
      fail: function () {
        wx.hideLoading();
        that.requestError();
      }
    });
  },

  globalData: {
    userInfo: null,
    openId: null,
    unionid: null,
    user_id: null,
    //二维码资产参数key
    assets: 'assets',
    areas: 'areas',
    equipments: 'groups',

    uuid: 'uuid',

    btnShow: false,
    showLoad: false,
    firstLogin: 1,
    asset_uuid: null,
    area_uuid:null,
    equipment_uuid: null,
    //是否已经授权手机号
    authorization:null,
    validate: false,
    btnShow: false,
    //角色
    role: 1,
    //全局变量 url
    url: 'https://wx.zhejiuban.com/',
    token: 'd3hfWmhlSml1QmFuKywuMjA0'
  },
  swichNav: function (url) {
    wx.redirectTo({
      url: url,
    })
  },

  /**
   * 底部tabBar
   */
  // 扫码报修
  scanCode: function () {
    // 允许从相机和相册扫码
    let that = this;
    wx.scanCode({
      success: (res) => {
        let url = res.result;
        let asset_uuid = that.getUrlParam(url, that.globalData.assets);
        let areas_uuid = null;
        let equip_uuid = null;
        if (asset_uuid){
          that.globalData.asset_uuid = asset_uuid;
        }else{
          areas_uuid = that.getUrlParam(url, that.globalData.areas);
          if (areas_uuid){
            that.globalData.area_uuid = areas_uuid;
          }else{
            equip_uuid = that.getUrlParam(url, that.globalData.equipments);
            if (equip_uuid){
              that.globalData.equipment_uuid = equip_uuid;
            }
          }
        }
        that.needValidation();
      }
    })
  },


  needValidation: function () {
    let that = this;
    if (that.globalData.area_uuid || that.globalData.asset_uuid || that.globalData.equipment_uuid){
      wx.request({
        // url: that.globalData.url + 'wx/need_validation',
        url: config.needValidationUrl,
        method: "POST",
        data: {
          role: that.globalData.role,
          token: that.globalData.token,
          area_uuid: that.globalData.area_uuid,
          asset_uuid: that.globalData.asset_uuid,
          equipment_uuid: that.globalData.equipment_uuid,
          openId: that.globalData.openId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {

          wx.hideLoading();
          // res.data = that.getResData(res);
          if (res.data.code == 1) {
            //验证通过，可以正常报修
            if (that.globalData.area_uuid) {
              wx.redirectTo({
                url: '/pages/areaManual/areaManual',
              })
            } else if (that.globalData.equipment_uuid) {
              wx.redirectTo({
                url: '/pages/equipmentManual/equipmentManual',
              })
            } else if (that.globalData.asset_uuid) {
              wx.redirectTo({
                url: '/pages/manual/manual',
              })
            } else {
              wx.redirectTo({
                url: '/pages/index/service/service',
              })
            }
          } else if (res.data.code == 403) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            });
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
          } else if (res.data.code == 'system') {
            wx.navigateTo({
              url: "/pages/system/system"
            });
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
        }
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '暂不支持此物品报修',
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

  // 报修
  toManual: function () {
    wx.redirectTo({
      url: '/pages/manual/manual',
    })
  },

  // getUrlParam: function (url, ref, type) {
  //   let str = "";
  //   // 如果不包括此参数
  //   if (url.indexOf(ref) == -1) {
  //     return "";
  //   } 
  //   str = url.substr(url.indexOf('?') + 1);
  //   let arr = str.split("&");
  //   let site = '';
  //   for (let i in arr) {
  //     let paired = arr[i].split('=');
  //     if (i==0 && paired[1]==type){
  //       site=type;
  //     }
  //     if (i==1 && site==type){
  //       return paired[1];
  //     }
  //   }
  //   return "";
  // },


  getUrlParam: function (url, type) {
    let str = "";
    let arr = url.split("/");
    let repairType = arr[arr.length-2];

    if(type==repairType){
      return arr[arr.length-1];
    }
    return "";
  },


  getResData: function (res) {
    let jsonStr = res.data;
    jsonStr = jsonStr.replace(" ", "");
    if (typeof jsonStr != 'object') {
      jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
      var jj = JSON.parse(jsonStr);
      res.data = jj;
    }
    return res.data
  },

  network_state: function () {
    let that = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if (networkType == 'none') {
          wx.showModal({
            title: '提示',
            content: '网络失败，请重试',
            showCancel: false,
            confirmText: '点击重试',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/index/service/service',
                })
              }
            }
          })
        }
      }
    })
  },

  //403 退出小程序
  closeProgram: function (res) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: res.data.message,
      success: function (res) {
        if (res.confirm) {
          that.globalData.btnShow = true;
          wx.navigateTo({
            url: '/pages/home/home?type='+1,
          })
        } else if (res.cancel) {
          wx.navigateBack({
            delta: 1
          });
        }

      }
    })
  },

  requestError: function () {
    wx.hideLoading();
    wx.showModal({
      title: '提示',
      content: '网络请求超时，请稍后重试',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/index/service/service',
          })
        }
      }
    })
  },

  //回到首页
  toIndex: function () {
    wx.redirectTo({
      url: "/pages/index/service/service"
    })
  },

  //  我的
  toMe: function () {
    wx.navigateTo({
      url: '/pages/me/me',
    })
  },

  errorPrompt: function (data) {
    if(data.code==1403){
      wx.showModal({
        title: '提示',
        content: data.message,
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
  }



})