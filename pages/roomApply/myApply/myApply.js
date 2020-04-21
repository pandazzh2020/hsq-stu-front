// pages/ViewApplication/ViewApplication.js
const app = getApp()
var util = require('../../../utils/util.js');
var http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    //申请列表
    ApplicationList: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getApplicationList();
  },

  //获取申请列表ApplicationList
  getApplicationList: function () {
    var self = this;
    http.request({
      url: '/stu/apply',
      success: (res) => {
        console.log(res);
        let ApplicationList = []
        for (let i in res) {
          switch (res[i]['check_status']) {
            case 0:
              res[i].check_status = '待审核'
              res[i].progress = 25
              break
            case 1:
              let beginTime = util.timeDateToInt(res[i].date, res[i].begin_time )
              let endTime = util.timeDateToInt(res[i].date, res[i].end_time)
              let nowTime = (new Date()).getTime()
              if (nowTime < beginTime) {
                res[i].check_status = '待使用'
                res[i].progress = 50
              }
              else if (nowTime > endTime) {
                res[i].check_status = '已使用'
                res[i].progress = 100
              }
              else {
                res[i].check_status = '使用中'
                res[i].progress = 75
              }
              break
            case 2:
              res[i].check_status = '审核失败'
              res[i].progress = 100
              break
          }
        }
        self.setData({
          ApplicationList: res
        })
      }
    })
  },

  //获取申请列详情的id
  toDetailsApplication: function (e) {
    var index = e.currentTarget.dataset.index;
    var ApplicationList = this.data.ApplicationList;
    var apply_id = ApplicationList[index].apply_id;
    wx.navigateTo({
      url: '/pages/roomApply/myApplyDetails/myApplyDetails?apply_id=' + apply_id,
    });
  },

})