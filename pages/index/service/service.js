let app = getApp();
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    count: 1,   //分页
    items: [
      [
        [
          'http://img3.imgtn.bdimg.com/it/u=2314859093,2968863833&fm=214&gp=0.jpg',
          'http://ookzqad11.bkt.clouddn.com/avatar.png'
        ],
        '计算机1',
        '芜湖职业技术学院/南校区/创业孵化园'
      ],
      [
        ['http://ookzqad11.bkt.clouddn.com/avatar.png'],
        '计算机2',
        '芜湖职业技术学院/南校区/创业孵化园'
      ],
      [
        ['http://ookzqad11.bkt.clouddn.com/avatar.png'],
        '计算机3',
        '芜湖职业技术学院/南校区/创业孵化园'
      ],
      [
        ['http://ookzqad11.bkt.clouddn.com/avatar.png'],
        '计算机4',
        '芜湖职业技术学院/南校区/创业孵化园'
      ],
      [
        ['http://ookzqad11.bkt.clouddn.com/avatar.png'],
        '计算机5',
        '芜湖职业技术学院/南校区/创业孵化园'
      ],
      [
        ['http://ookzqad11.bkt.clouddn.com/avatar.png'],
        '计算机6',
        '芜湖职业技术学院/南校区/创业孵化园'
      ],
      [
        ['http://ookzqad11.bkt.clouddn.com/avatar.png'],
        '计算机7',
        '芜湖职业技术学院/南校区/创业孵化园'
      ]
    ]
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
  // 转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
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

  // 查看详情
  clickDetail: function () {
    wx.navigateTo({
      url: '/pages/details/details',
    })
  },

  // 查看详情包括评论
  clickAllDetail: function () {
    wx.navigateTo({
      url: '/pages/alldetails/alldetails',
    })
  },

  // 扫码报修
  scanCode:function(){
    app.scanCode();
  },

  // 报修
  toManual: function () {
    app.toManual();
  },

  // 我的
  toMe:function(){
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
  to_evaluate: function (e) {
    // console.log(e.currentTarget.dataset.id);
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?id=' + id,
    })
  },

  // 图片预览
  prev_img: function (e) {
    console.log(e);
    let url = e.currentTarget.dataset.url['0'];
    let urls = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log("下拉");
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  //滚动到底部触发事件  
  searchScrollLower: function () {
    console.log("上拉加载");
    wx.showLoading();
    let counts = this.data.count + 1;
    let arr = [
      [
        [
          'http://img3.imgtn.bdimg.com/it/u=2314859093,2968863833&fm=214&gp=0.jpg',
          'http://ookzqad11.bkt.clouddn.com/avatar.png'
        ],
        '计算机8',
        '芜湖职业技术学院/南校区/创业孵化园'
      ],
      [
        [
          'http://img3.imgtn.bdimg.com/it/u=2314859093,2968863833&fm=214&gp=0.jpg',
          'http://ookzqad11.bkt.clouddn.com/avatar.png'
        ],
        '计算机9',
        '芜湖职业技术学院/南校区/创业孵化园'
      ],
      [
        [
          'http://img3.imgtn.bdimg.com/it/u=2314859093,2968863833&fm=214&gp=0.jpg',
          'http://ookzqad11.bkt.clouddn.com/avatar.png'
        ],
        '计算机10',
        '芜湖职业技术学院/南校区/创业孵化园'
      ],
      [
        [
          'http://img3.imgtn.bdimg.com/it/u=2314859093,2968863833&fm=214&gp=0.jpg',
          'http://ookzqad11.bkt.clouddn.com/avatar.png'
        ],
        '计算机11',
        '芜湖职业技术学院/南校区/创业孵化园'
      ],
    ];
    let arr1 = this.data.items;
    let arrs = arr1.concat(arr);
    // var arrs = this.data.items1.concat(arr);
    this.setData({
      count: counts,
      items: arrs
    });
    console.log(arrs);
    wx.hideLoading();
    // let that = this;
    // var count = this.data.count+1;

    // wx.request({
    //   url: 'test.php', 
    //   data: {
    //     count: count
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
  },

  

  onLoad: function () {
    let that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        let calc = clientHeight * rpxR - 180;
        // console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  footerTap: app.footerTap
})