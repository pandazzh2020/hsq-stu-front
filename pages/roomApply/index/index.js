//index.js
//获取应用实例
const app = getApp()
var http = require('../../../utils/http.js');

Page({
  data: {
    iconList: [{
      icon: 'edit',
      color: 'red',
      name: '申请教室',
      url: '/pages/roomApply/apply/apply'
    }, {
      icon: 'search',
      color: 'orange',
        name: '查看教室',
        url: '/pages/roomApply/room/room'
    }, {
      icon: 'people',
      color: 'yellow',
        name: '我的申请',
        url: '/pages/roomApply/myApply/myApply'
    }],
    newNotice: {}
  },
  onLoad: function (options) {
    let newNotice = {};
    console.log(this)
    http.request({
      'url': '/stu/notice/0',
      'success': (res) => {
        newNotice = res
        this.setData({
          newNotice: newNotice
        })
      }
    })
  }
})
