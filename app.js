//app.js
App({
  onLaunch: function (e) {
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    if(e.query.q){
      //微信扫描二维码携带的参数
      let url = decodeURIComponent(e.query.q);
      let asset_uuid = that.getUrlParam(url, that.globalData.asset_uuid);
      that.globalData.uuid = asset_uuid;
      that.getUserInfo();
    }else{
      that.getUserInfo();
    }
    console.log("onLaunch");
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
              title: '登录中',
            });
            wx.getUserInfo({
              success: res => {
                console.log(res.userInfo);
                that.globalData.userInfo = res.userInfo;
                let iv = res.iv;
                let encryptedData = res.encryptedData;
                //发起网络请求
                //登录授权
                wx.request({
                  url: 'https://wx.zhejiuban.com/wx/login',
                  method: "POST",
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  data: {
                    code: code,
                    iv: iv,
                    encryptedData: encryptedData
                  },
                  success: function (res) {
                    console.log(res);
                    that.globalData.openId = res.data.openId;
                    that.globalData.unionid = res.data.unionId;
                    //判断有没有验证身份(判断是否注册)
                    wx.request({
                      url: 'https://wx.zhejiuban.com/wx/authentication',
                      method: "POST",
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      data: {
                        role: 1,    //用户角色
                        openId: that.globalData.openId,
                        unionid: that.globalData.unionid
                      },
                      success: function (res) {
                        if(res.data.code==1){
                          //验证过了
                          if (that.globalData.uuid) {
                            wx.redirectTo({
                              url: '/pages/manual/manual',
                            });
                          }else{
                            wx.redirectTo({
                              // url: "/pages/area/area"
                              // url: "/pages/manual/manual"
                              // url: "/pages/index/assess/assess"
                              url: "/pages/index/service/service"
                            });
                          }
                        }else{
                          //未验证用户信息
                          /**
                           * 首先判断是否有资产uuid
                           * 有资产id存在的话，去后台判断是否需要LDAP
                           * 如果没有资产存在的，直接登录
                           * */
                          if (that.globalData.uuid) {
                            wx.request({
                              url: 'https://wx.zhejiuban.com/wx/need_validation',
                              method: "POST",
                              data: {
                                asset_uuid: that.globalData.uuid
                              },
                              header: {
                                'content-type': 'application/json'
                              },
                              success: function (res) {
                                console.log(res.data);
                                wx.hideLoading();
                                if(res.data.code==1){
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
                                } else{
                                  //不需要LDAP验证
                                  wx.request({
                                    url: 'https://wx.zhejiuban.com/wx/add_user',
                                    method: "POST",
                                    data: {
                                      openId: that.globalData.openId,
                                      unionid: that.globalData.unionid,
                                      name: that.globalData.userInfo.nickName,
                                      asset_uuid: that.globalData.uuid
                                    },
                                    header: {
                                      'content-type': 'application/json'
                                    },
                                    success: function (res) {
                                      wx.hideLoading();
                                      wx.redirectTo({
                                        url: "/pages/manual/manual"
                                      });
                                    }
                                  })
                                }
                              }
                            })
                          }else{
                            wx.redirectTo({
                              url: "/pages/index/service/service"
                            });
                          }
                        }
                        // if(res.data.code==0){
                        //   wx.redirectTo({
                        //     url: '/pages/login/login',
                        //   })
                        // }else{
                        //   if(that.globalData.uuid){
                        //     wx.redirectTo({
                        //       url: "/pages/manual/manual"
                        //     });
                        //   }else{
                        //     wx.redirectTo({
                        //       url: "/pages/index/service/service"
                        //     })
                        //   }
                        // }
                      }
                    })
                  }
                });
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res)
                }
              },
              fail: function () {
                wx.hideLoading();
                that.globalData.showLoad = false;
                that.globalData.btnShow = true;
                if (scope_user == false) {
                  that.globalData.firstLogin = 2;
                }
                if (that.globalData.firstLogin==1){
                  wx.redirectTo({
                    url: '/pages/home/home?type=1',
                  });
                }else{
                  wx.showModal({
                  title: '提示',
                  content: '需要允许获取用户信息，确定将继续设置，取消将回到首页',
                  cancelText: '取消',
                  confirmText: '确定',
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: function (res) {
                          if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                            wx.showLoading({
                              mask: true,
                              title: '登录中',
                            });
                            that.getUserInfo();
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
      url: 'https://wx.zhejiuban.com/wx/asset_find',
      method: "POST",
      data: {
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
      }
    });
  },

  globalData: {
    userInfo: null,
    openId: null,
    unionid: null,
    //二维码资产参数key
    asset_uuid: 'id',
    btnShow: false,
    showLoad: false,
    firstLogin: 1,
    uuid: null,
    // login: null
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
        let asset_uuid = that.getUrlParam(url, that.globalData.asset_uuid);
        wx.navigateTo({
          url: '/pages/manual/manual?asset_uuid=' + asset_uuid,
        })
      }
    })
  },

  // 报修
  toManual: function () {
    wx.navigateTo({
      url: '/pages/manual/manual',
    })
  },

  getUrlParam: function (url, ref) {
    let str = "";
    // 如果不包括此参数
    if (url.indexOf(ref) == -1) {
      return "";
    }
    str = url.substr(url.indexOf('?') + 1);
    let arr = str.split("&");
    for (let i in arr) {
      let paired = arr[i].split('=');
      if (paired[0] == ref) {
        return paired[1];
      }
    }
    return "";
  },

  //  我的
  toMe: function () {
    wx.navigateTo({
      url: '/pages/me/me',
    })
  }
})