//index.js
//获取应用实例
const app = getApp()
var http = require('../../../utils/http.js');

Page({
  data: {
    state: true,
    startId:0,
    endId:0,
    //公告列表
    noticeList:[],
    getNum: 5
  },

  onLoad: function () {
    var self = this;
    http.request({
        url: '/stu/notice',
        data:{
          startid:0,
          endid:8,
        },
        success: (res) => {
          self.noticeListBack(res);
          self.startIdBack();
          self.endIdBack();
        }
      })
    },

  
  //回传noticeList
  noticeListBack:function(res){
    this.setData({
      noticeList: this.data.noticeList.concat(res),
    })
  },

  //回传下一次的startId
  startIdBack: function (res) {
    this.setData({
      startId:this.data.noticeList.length + 1,
    })
    console.log(this.data.startId);
  },
  //回传本次的endId
  endIdBack: function (res) {
    this.setData({
      endId: this.data.startId + this.data.getNum - 1 ,
    })
    console.log(this.data.endId);
  },

  //下拉刷新，获取公告列表noticeList
  onReachBottom: function () {
    if( !this.data.state ) {
      console.log(this.data.state)
      return 0
    }
    var self = this;
    wx.showLoading({
      title: '玩命加载中',
    })

    http.request({
      url: '/stu/notice',
      data:{
        startid:self.data.startId,
        endid:self.data.endId,
      },
      success: (res) =>{
        //console.log(res);
        if (res.length < this.data.getNum){//没有更多
          self.noticeListBack(res);
          self.setData({
            state: false
          }) 
        }else{
          self.noticeListBack(res);
          self.startIdBack();
          self.endIdBack();
          self.setData({
           state: true
          })   
        }
        wx.hideLoading();
      }
    })
    //console.log(this.data.state);
  },


  //获取公告详情的id
  toDetialNotice: function (e) {
    var index = e.currentTarget.dataset.index;
    var noticeList = this.data.noticeList;
    var noticeId = noticeList[index].id;
    wx.navigateTo({
      url: '/pages/roomApply/noticeDetails/noticeDetails?noticeId=' + noticeId,
    });
  },
  
})
