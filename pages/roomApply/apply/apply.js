const app = getApp();

var http = require('../../../utils/http.js');
var util = require('../../../utils/util.js');
 
Page({
  data: {
    //申请的数据
    applyData: { 
      "activity_name": "",//活动名称
      "activity_date": (new Date()).getFullYear() + "-" + ((new Date()).getMonth() < 9 ? "0" : "") + ((new Date()).getMonth() + 1) + "-" + (new Date()).getDate(),//活动日期 初始值为当天日期
      "begin_time": "",//活动开始时间（整数表示）
      "end_time": "",//活动结束时间（整数表示）
      "building": "",//使用教室楼号
      "floor": "",//使用教室楼层
      "room": "",//使用教室名称
      "applicant_name": "",//申请人姓名
      "applicant_id": "",//学号 
      "applicant_phone": "",//联系方式
      "people_num": "",//参与人数
      "requests": "",//活动需求 备注
      "leader_name": "",//负责老师
      "material": "",//图片url
    },

    //教室列表
    roomList: {},//原始数据
    roomArray: [],//选择器选择列表
    roomIndex: [0,0,0],//选择器选中项

    //时间列表
    timeList: [],//原始数据
    timeArray: [],//选择器选择列表
    timeIndex: 0,//选择器选中项

    //提交按钮
    buttonText: '提交申请',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    imgList: [],
  },
  onLoad: function (options) {
    console.log(options)
    //判断是否从查看教室页面跳转来
    if (options.building) {
      http.request({
        url: '/stu/timetable',
        success: (res) => {
          let time = {
            timeList: res,//初始化timeList
            timeArray: [],
            timeIndex: options.time
          }
          //初始化timeArray
          for (let i in res) {
            time.timeArray.push(
              res[i][0] + ' (' + util.timeIntToString(res[i][1]) + '-' + util.timeIntToString(res[i][2]) + ')'
            )
          }

          this.setData(time)
          this.setData({
            'applyData.begin_time': res[time.timeIndex][1],
            'applyData.end_time': res[time.timeIndex][2]
          })
        }
      })
      http.request({
        url: '/stu/building',
        success: (res) => {
          let room = {
            roomList: res,//初始化timeList
            roomArray: [[], [], []],
            roomIndex: [0, 0, 0]
          }
          for (let building in res) {
            room.roomArray[0].push(building);//生成楼号列
          }
          for (let floor in res[options.building]) {
            room.roomArray[1].push(floor);//生成楼层列
          }
          room.roomArray[2] = res[options.building][options.floor];//生成教室列
          room.roomIndex[0] = room.roomArray[0].indexOf(options.building)
          room.roomIndex[1] = room.roomArray[1].indexOf(options.floor)
          room.roomIndex[2] = room.roomArray[2].indexOf(options.room)

          this.setData(room)
        }
      })
      this.setData({
        'applyData.building': options.building,
        'applyData.floor': options.floor,
        'applyData.room': options.room,
        'applyData.activity_date': options.date
      })
    }
    else if (options.id) {
      http.request({
        url: '/stu/apply/' + options.id,
        success: (res) => {
          this.setData({
            buttonText: "修改申请",//'提交申请'按钮变为'修改申请'
            //将res的内容传递给applyData
            'applyData.activity_name': res.activity_name,
            'applyData.activity_date': res.date,
            'applyData.building': res.building,
            'applyData.floor': res.floor,
            'applyData.room': res.room_name,
            'applyData.applicant_name': res.applicant_name,
            'applyData.applicant_id': res.applicant_id,
            'applyData.applicant_phone': res.applicant_phone,
            'applyData.people_num': res.people_count,
            'applyData.leader_name': res.teacher_name,
            'applyData.begin_time': res.begin_time,
            'applyData.end_time': res.end_time,
            'applyData.material': res.material ? res.material : '',
            'applyData.requests': res.request ? res.request : ''
          })
          http.request({
            url: '/stu/timetable',
            success: (res1) => {
              let time = {
                timeList: res1,//初始化timeList
                timeArray: [],
                timeIndex: 0
              }
              //初始化timeArray
              for (let i in res1) {
                time.timeArray.push(
                  res1[i][0] + ' (' + 
                  util.timeIntToString(res1[i][1]) + '-' + 
                  util.timeIntToString(res1[i][2]) + ')'
                )
              }

              let timeFind = []
              for (let i in res1) {
                timeFind.push(res1[i][1])
              }
              console.log('--time--')
              console.log(timeFind)
              console.log(res.begin_time)
              console.log('--time--')
              time.timeIndex = timeFind.indexOf(res.begin_time)
              this.setData(time)
            }
          })
          http.request({
            url: '/stu/building',
            success: (res1) => {
              let room = {
                roomList: res1,//初始化timeList
                roomArray: [[], [], []],
                roomIndex: [0, 0, 0]
              }
              for (let building in res1) {
                room.roomArray[0].push(building);//生成楼号列
              }
              for (let floor in res1[res.building]) {
                room.roomArray[1].push(floor);//生成楼层列
              }
              room.roomArray[2] = res1[res.building][res.floor];//生成教室列
              room.roomIndex[0] = room.roomArray[0].indexOf(res.building)
              room.roomIndex[1] = room.roomArray[1].indexOf(res.floor.toString())
              room.roomIndex[2] = room.roomArray[2].indexOf(res.room_name)
              console.log('--room--')
              console.log(room)
              console.log(res)
              console.log('--room--')
              this.setData(room)
            }
          })
        }
      })
    }
    else {
      http.request({
        url: '/stu/timetable',
        success: (res) => {
          let time = {
            timeList: res,//初始化timeList
            timeArray: [],
            timeIndex: 0
          }
          //初始化timeArray
          for (let i in res) {
            time.timeArray.push(
              res[i][0] + ' (' + util.timeIntToString(res[i][1]) + '-' + util.timeIntToString(res[i][2]) + ')'
            )
          }

          this.setData(time)
          this.setData({
            'applyData.begin_time': res[time.timeIndex][1],
            'applyData.end_time': res[time.timeIndex][2]
          })
        }
      })
      http.request({
        url: '/stu/building',
        success: (res) => {
          let room = {
            roomList: res,//初始化timeList
            roomArray: [[], [], []],
            roomIndex: [0, 0, 0]
          }
          for (let building in res) {
            room.roomArray[0].push(building);//生成楼号列
          }
          for (let floor in res[room.roomArray[0][0]]) {
            room.roomArray[1].push(floor);//生成楼层列
          }
          room.roomArray[2] = res[room.roomArray[0][0]][room.roomArray[1][0]];//生成教室列

          this.setData(room)
          this.setData({
            'applyData.building': room.roomArray[0][0],
            'applyData.floor': room.roomArray[1][0],
            'applyData.room': room.roomArray[2][0]
          })
        }
      })
    }

    /*////判断是否从修改申请页面跳转来
    if () {
      http.request({
        url: '/stu/apply/' + option.id,
        success: (res) => { 
          this.setData({
            buttonText: "修改申请",//'提交申请'按钮变为'修改申请'
             //将res的内容传递给applyData
            'applyData.activity_name': res.activity_name,
            'applyData.activity_date': res.activity_date,
            'applyData.activity_time': res.activity_time,
            'applyData.building': res.building,
            'applyData.floor': res.floor,
            'applyData.room': res.room,
            'applyData.applicant_name': res.applicant_name,
            'applyData.applicant_id': res.applicant_id,
            'applyData.applicant_phone': res.applicant_phone,
            'applyData.people_num': res.people_num,
            'applyData.requests': res.requests,
            'applyData.leader_name': res.leader_name,
            'applyData.material': res.material,
          })
        }
      })
    }*/
    console.log(this.data)
  },
//活动时间修改,选节次
  timeChange(e) {
    this.setData({
      'applyData.begin_time': this.data.timeList[e.detail.value][1],
      'applyData.end_time': this.data.timeList[e.detail.value][2],
      timeIndex: e.detail.value,
    })
  },
  //教室选择 roomChange 666666666666多列
  MultiChange(e) {
    this.setData({
      roomIndex: e.detail.value,
      'applyData.building': this.data.roomArray[0][e.detail.value[0]],
      'applyData.floor': this.data.roomArray[1][e.detail.value[1]],
      'applyData.room': this.data.roomArray[2][e.detail.value[2]],
    })
  },
  //教室列改变 roomColumnChange
  //此处修改各列，根据data的buildingList floorList roomList修改
  MultiColumnChange(e) {
    let roomList = this.data.roomList;

    let roomArray = [[],[],[]];
    roomArray[0] = this.data.roomArray[0]//楼号列不需要改变

    let roomIndex = this.data.roomIndex;
    roomIndex[e.detail.column] = e.detail.value;

    let building = roomArray[0][roomIndex[0]];
    for (floor in roomList[building]) {
      roomArray[1].push(floor);//生成楼层列
    }

    let floor = roomArray[1][roomIndex[1]];
    roomArray[2] = roomList[building][floor];//生成教室列

    this.setData({
      roomArray: roomArray,
      roomIndex: roomIndex
    })
  },

   //日期修改 dataChange
  dateChange(e) {
    this.setData({
      'applyData.activity_date': e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定删除该图片吗？',
      cancelText: '取消',
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textareaAInput(e) {  //活动需求
    this.setData({
      'applyData.requests': e.detail.value
    })
  },
  cancel(){  //之后可能会修改为返回上一页777
    wx.navigateTo({ 
      //点底部"取消"返回小程序主页
      url: '/pages/roomApply/index/index',

    })
  },
  formSubmit: function (e) {
    var obj = this;
    var post = e.detail.value;
    //请求接口
    http.request({
      url: '/stu/apply',    //http://xx.com/api/stu/apply   666
      header: {
      },
      method: "POST",
      data: this.data.applyData,
      success: function (res) {
        //请求成功后的弹窗
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
      },
    })
  },
  //添加上传图片,以下未测试,上传证明图片用777
  chooseImageTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  // 图片本地路径
  chooseWxImage: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res.tempFilePaths[0]);
        that.upImgs(res.tempFilePaths[0], 0) //调用上传方法
      }
    })
  },
  //图片上传服务器
  upImgs: function (imgurl, index) {
    var that = this;
    wx.uploadFile({
      url: '****/Upload', //证明图片接口的地址777
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'appication/x-www-form-urlencoded'//
      },
      formData: null,
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  updateValue: function (e) {
    let name = 'applyData.' + e.currentTarget.dataset.name
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
  }
})
