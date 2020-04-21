// pages/ApplicationDetails/ApplicationDetails.js
const app = getApp()
var util = require('../../../utils/util.js');
var http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ApplicationDetailsId: null,
    ApplicationDetailsList: {},
    ifShow: {},
    buttonUse: {
      'modify': true,
      'del': true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //申请列表item获取申请详情的apply_id
    var that = this;
    var apply_id = options.apply_id;
    that.setData({
      ApplicationDetailsId: apply_id,
    })
    this.getDentialApplicationList();
  },

  //从id请求http的申请详情
  getDentialApplicationList: function () {
    var self = this;
    http.request({
      url: '/stu/apply/' + this.data.ApplicationDetailsId,
      method: 'GET',
      success: (res) => {
        let ifShow = {
          'request': true,
          'org': true,
          'note': true,
          'verifier_name': true,
          'material': true
        }
        let buttonUse = {}
        switch (res.check_status) {
          case '待审核':
            ifShow.org = false
            ifShow.note = false
            ifShow.verifier_name = false
            buttonUse = {
              'modify': true,
                'del': true
            }
            break
          case '审核通过':
            ifShow.note = res.note ? true : false
            let beginTime = util.timeDateToInt(res.date, res.begin_time)
            let endTime = util.timeDateToInt(res.date, res.end_time)
            let nowTime = (new Date()).getTime()
            if (nowTime < beginTime) {
              res.check_status = '待使用'
              buttonUse = {
                'modify': false,
                'del': true
              }
            }
            else if (nowTime > endTime) {
              res.check_status = '已使用'
              buttonUse = {
                'modify': false,
                'del': false
              }
            }
            else {
              res.check_status = '使用中'
              buttonUse = {
                'modify': false,
                'del': false
              }
            }
            break
          case '审核失败':
            buttonUse = {
              'modify': true,
              'del': false
            }
            break
        }
        ifShow.material = res.material ? true : false
        ifShow.request = res.request ? true : false
        res.begin_time = util.timeIntToString(res.begin_time)
        res.end_time = util.timeIntToString(res.end_time)
        this.setData({
          ApplicationDetailsList: res,
          ifShow: ifShow,
          buttonUse: buttonUse
        })
      }
    })
  },
  modify:function(){
    if (this.data.ApplicationDetailsList.check_status =="待审核"){
      wx.navigateTo({
        url: '/pages/roomApply/apply/apply?id=' + this.data.ApplicationDetailsId,
      });
    }else{
      wx.showToast({
        title: '不可修改',
        icon: 'none',
      })
    }
  },

  del: function () {
    if (this.data.ApplicationDetailsList.check_status == "待审核" || this.data.ApplicationDetailsList.check_status == "待使用") {
      var tip=" "
      wx.showModal({
        title: '提示',
        content: '确定撤销申请？',
        success: (sm)=> {
          if (sm.confirm) {
            http.request({
              url: '/stu/apply/' + this.data.ApplicationDetailsId,
              method: 'POST',
              success: (res) => {
                tip = res.tip
                wx.showToast({
                  title: tip,
                  icon: 'none',
                })
              }
           })
            console.log("用户点击确认")
            
          } 
          else if (sm.cancel) {
            console.log('用户点击取消')
            wx.showToast({
              title: '取消撤销',
              icon: 'none',
            })
          }
        }
      })

    } else {
      wx.showToast({
        title: '不可修改',
        icon: 'none',
      })
    }
  }
})