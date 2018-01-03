// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgs: [
        'http://pic3.16pic.com/00/10/26/16pic_1026230_b.jpg',
        'http://scimg.jb51.net/allimg/151124/14-151124163140421.jpg',
        'http://pic32.nipic.com/20130817/9745430_101836881000_2.jpg'
      ]
  },
  imgShow: function (e) {
    console.log(e);
    var that = this;
    var current_src = e.currentTarget.dataset.src;
    console.log(e.currentTarget.dataset.src);
    wx.previewImage({
      current: current_src, // 当前显示图片的http链接
      urls: that.data.imgs // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})