const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const timeIntToString = number => {
  let hour = parseInt(number / 60)
  let minute = number - hour * 60
  if (minute < 10) {
    minute = '0' + minute
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  return hour + ':' + minute
}

const timeDateToInt= (date, num) => {
  let dates = date.split('-')
  let hour = parseInt(num / 60)
  let minute = num - hour * 60
  let time = new Date(dates[0], dates[1] - 1, dates[2], hour, minute, 0, 0)
  console.log(time)
  return time.getTime()
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  timeIntToString: timeIntToString,
  timeDateToInt: timeDateToInt
}
