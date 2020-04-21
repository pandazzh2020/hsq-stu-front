const config = {
  base_url: "http://127.0.0.1:5000/api",
  appkey: "XXX"
}
const tips = {
  1: "抱歉，出现了一个错误",
  101: "系统状态异常",
  102: "用户已断开连接，请重新登录"
}

function show_error(err_code) {
  if (!err_code) {
    err_code = 1;
  }
  wx.showToast({
    title: tips[err_code],
    icon: 'none',
    duration: 2000
  })
}
const request = params => {
  if (!params.method) {
    params.method = "GET";
  }
  wx.request({
    url: config.base_url + params.url,
    method: params.method,
    data: params.data,
    headers: {
      'content-type': 'appliaction/json',
      'appkey': config.appkey
    },
    success: (res) => {
      if (res.statusCode == 200) {
        if (params.success) {
          let result = res.data;
          if ( result.code == 0 ) {
            params.success(result.data );
          }
          else {
            show_error(result.code );
          }
        }
      }
      else {
        let error_code = res.error_code;
        show_error(error_code);
      }
    },
    fail: (err) => {
      show_error(1)
    }
  })
}

module.exports = {
  request: request
}