const config = require('../../../config')

let app = getApp();
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 2, //预设当前项的值
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    page: 1,   //分页
    items: [],
    status: 5,
    content: '1',    //判断上拉是否还有数据
    itemsLength: '1'  //获取有无数据
  },
  swichNav1: function () {
    app.swichNav('/pages/index/service/service');
  },
  swichNav2: function () {
    app.swichNav('/pages/index/assess/assess');
  },
  swichNav3: function () {
    app.swichNav('/pages/index/over/over');
  },
  swichNav4: function () {
    app.swichNav('/pages/index/all/all');
  },
  
  onLoad: function () {
    app.network_state();
    wx.showLoading({
      mask: true,
      title: '加载中',
    });
    let that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        let calc = clientHeight * rpxR - 180;
        that.setData({
          winHeight: calc
        });
      }
    });
    wx.request({
      url: config.repairListUrl,
      method: "POST",
      data: {
        role: app.globalData.role,
        token: app.globalData.token,
        status: that.data.status,
        openId: app.globalData.openId,
        page: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            itemsLength: '0'
          })
        } else if (res.data.code == 403) {
          app.globalData.openId = null;
          app.closeProgram(res);
        } else if (res.data.code == 1403) {
          app.errorPrompt(res.data);
        } else {
          let arr = [];
          let data = res.data;
          for (var i = 0; i < data.length; i++) {
            arr[i] = [[data[i].img_url], data[i].name, data[i].path, data[i].repair_id, data[i].complain];
          }
          that.setData({
            items: arr,
            itemsLength: '1'
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
  },

  onShow: function () {
    let that = this;
    that.setData({
      page: 1
    });
    that.onLoad();
  },

  // 查看详情包括评论
  clickAllDetail: function (e) {
    let repair_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/alldetails/alldetails?repair_id=' + repair_id,
    })
  },

  // 扫码报修
  scanCode: function () {
    app.scanCode();
  },

  // 报修
  toManual: function () {
    app.toManual();
  },

  // 我的
  toMe: function () {
    app.toMe();
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },

  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  // 点击跳转到评价页面
  to_complain: function (e) {
    let that = this;
    let repair_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/complain/complain?repair_id=' + repair_id,
    })
  },

  // 图片预览
  prev_img: function (e) {
    let url = e.currentTarget.dataset.url['0']['0'];
    let urls = e.currentTarget.dataset.url['0'];
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    let that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.request({
      url: config.repairListUrl,
      method: "POST",
      data: {
        role: app.globalData.role,
        token: app.globalData.token,
        status: that.data.status,
        openId: app.globalData.openId,
        page: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          items: [],
          page: 1,
          itemsLength: '1',
          content: '1',
        });
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        if (res.data.code == 0) {
          that.setData({
            itemsLength: '0',
            content: '1',
            page: 1
          })
        } else if (res.data.code == 1403) {
          app.errorPrompt(res.data);
        } else {
          let arr = [];
          let data = res.data;
          for (var i = 0; i < data.length; i++) {
            arr[i] = [[data[i].img_url], data[i].name, data[i].path, data[i].repair_id, data[i].complain];
          }
          that.setData({
            items: arr,
            page: 1,
            itemsLength: 1,
            content: '1',
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        app.requestError();
      }
    })
  },

  //上拉加载更多 
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (that.data.content != '0') {
      wx.showLoading();
      wx.request({
        url: config.repairListUrl,
        method: "POST",
        data: {
          role: app.globalData.role,
          token: app.globalData.token,
          status: that.data.status,
          openId: app.globalData.openId,
          page: that.data.page + 1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.length > 0) {
            let arr = [];
            let data = res.data;
            for (var i = 0; i < data.length; i++) {
              arr[i] = [[data[i].img_url], data[i].name, data[i].path, data[i].repair_id];
            }
            let arr1 = that.data.items;
            let arrs = arr1.concat(arr);
            that.setData({
              items: arrs,
              page: that.data.page + 1
            });
          } else if (res.data.code == 1403) {
            app.errorPrompt(res.data);
          }
          if (res.data.length < 10) {
            that.setData({
              content: '0'
            })
          }
          if (res.data.code == 0) {
            that.setData({
              content: '0'
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

  // 转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '这就办维修平台',
      path: '/pages/index/inde',
      imageUrl: '/images/1.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  footerTap: app.footerTap
})