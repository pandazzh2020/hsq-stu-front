//logs.js
const util = require('../../../utils/util.js')
var http = require('../../../utils/http.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    noticeDentailId: null,
    noticeDentailList: {},
  },

  
  onLoad: function (options) {
    //从公告列表获取公告详情的id
    var that = this;
    var noticeId = options.noticeId;
    that.setData({
      noticeDentailId: noticeId,
    })
    //console.log(noticeId);
    //console.log(this.data.noticeDentailId);
    this.getDentialNoticeList();
  },

  
  //从id请求http的公告详情
  getDentialNoticeList: function () {
    var self = this;
    http.request({
      url: '/stu/notice/' + this.data.noticeDentailId,
      success: (res) => {
        self.noticeCallBack(res); //将返回值返回到callback函数中使用
      }
    })

    //console.log(this.data.noticeDentailList);
  },

  //返回值返回到callback函数中使用
  noticeCallBack: function (res) {
   // console.log(res)
    this.setData({
      noticeDentailList: res,
    })
    console.log(this.data.noticeDentailList);
  },

})

