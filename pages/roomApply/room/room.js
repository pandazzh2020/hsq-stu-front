//index.js
//获取应用实例
const app = getApp()

var http = require('../../../utils/http.js');
var util = require('../../../utils/util.js');

Page({
  data: {
    date: (new Date()).getFullYear() + "-" + ((new Date()).getMonth()<9?"0":"")+((new Date()).getMonth()+1)+"-"+(new Date()).getDate(),
    buildingFloors: {
      "M楼": ["1", "2", "3", "4", "5"],
      "G楼": ["1", "2", "3", "4"],
      "N楼": ["1", "2", "3"]
    },
    buildings: ["M楼", "N楼", "G楼"],
    floors: ["1", "2", "3", "4", "5"],
    classRoom: {},
    rooms: ["101", "102", "103"],
    nowBuilding: "M楼",
    nowFloor: "1",
    timeTable: [],
    nowRoom: {
      "time": "",
      "room": ""
    },
    UsedRoom: {
      "activity": "",
      "organization": ""
    },
    roomMessage: {}
  },
  onLoad: function () {
    http.request({
      url: '/stu/timetable',
      success: (res) => {
        for(let i in res) {
          res[i][1] = util.timeIntToString(res[i][1])
          res[i][2] = util.timeIntToString(res[i][2])
        }
        this.setData({
          timeTable: res
        })
      }
    })
    http.request({
      url: '/stu/building',
      success: (res) => {
        let buildingFloors = {}
        let buildings = []
        for(let i in res) {
          buildingFloors[i] = []
          buildings.push(i)
          for(let m in res[i]) {
            buildingFloors[i].push(m)
          }
        }
        this.setData({
          buildingFloors: buildingFloors,
          buildings: buildings,
          floors: buildingFloors[buildings[0]],
          nowBuilding: buildings[0],
          nowFloor: buildingFloors[buildings[0]][0]
        })
        this.getClassroom()
        console.log(this.data)
      }
    })
  },
  showRoom(e) {
    let room = e.currentTarget.dataset.room
    this.setData({
      modalName: e.currentTarget.dataset.target,
      'roomMessage.name': this.data.nowBuilding + this.data.nowFloor + '层' + room
    })
    console.log(this.data.classRoom)
    console.log(this.data.classRoom[this.data.nowFloor])
    console.log(this.data.classRoom[this.data.nowFloor][room])
    http.request({
      url: '/stu/room/' + this.data.classRoom[this.data.nowFloor][room]['id'],
      success: (res) => {
        this.setData({
          'roomMessage.description': res.description,
          'roomMessage.max_num': res.max_num,
          'roomMessage.org': res.org,
          'roomMessage.picture': res.picture
        })
      }
    })
  },
  showUsedRoom(e) {
    let r = {
      "time": e.currentTarget.dataset.time,
      "room": e.currentTarget.dataset.room
    };
    this.setData({
      modalName: e.currentTarget.dataset.target,
      nowRoom: r
    })
    http.request({
      url: '/stu/room/use/' + this.data.classRoom[this.data.nowFloor][this.data.nowRoom["room"]]["id"],
      data: {
        "date": this.data.date,
        "time": this.data.nowRoom["time"] + 1
      },
      success: (res) => {
        this.setData({
          UsedRoom: res
        })
      }
    })
  },
  showUnUsedRoom(e) {
    let r = {
      "time": e.currentTarget.dataset.time,
      "room": e.currentTarget.dataset.room
    };    
    this.setData({
      modalName: e.currentTarget.dataset.target,
      nowRoom: r
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
    this.getClassroom()
  },
  toApply(e) {
    let url = "/pages/roomApply/apply/apply?"
            + "building=" + this.data.nowBuilding + "&"
            + "floor=" + this.data.nowFloor + "&"
            + "room=" + this.data.nowRoom.room + "&"
            + "date=" + this.data.date + "&"
            + "time=" + this.data.nowRoom.time;
    wx.navigateTo({
      url: url
    })
  },
  selectFloor(e) {
    this.setData({ nowFloor: e.currentTarget.dataset.floor.toString() });
    var rooms = [];
    for (var room in this.data.classRoom[this.data.nowFloor])
      rooms.push(room);
    this.setData({ rooms: rooms });
  },
  selectBuilding(e) {
    this.setData({ nowBuilding: e.currentTarget.dataset.building.toString() });
    this.setData({ floors: this.data.buildingFloors[this.data.nowBuilding] });
    this.setData({ nowFloor: this.data.floors[0] });
    this.getClassroom()
  },
  getClassroom() {
    http.request({
      url: '/stu/room/use?date=' + this.data.date + '&building=' + this.data.nowBuilding,
      success: (res) => {
        this.setData({ classRoom: res });
        var rooms = [];
        for (var room in this.data.classRoom[this.data.nowFloor])
          rooms.push(room);
        this.setData({ rooms: rooms });
      }
    })
  }
})