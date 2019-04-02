
// import {$} from '../../plugins/zepto.min.js'

// (function() {
// // if (process.env.NODE_ENV === 'development' && process.env.TARO_ENV === 'h5') {

//   window.WebViewJavascriptBridge = {
//     callHandler: function(method, url, params, fn) {
//       $.ajax({
//         type: method,
//         url: url,
//         data: params,
//         dataType: 'json',
//         // timeout: 300,
//         // context: $('body'),
//         success: function(data){
//           fn(data)
//           // let data = {
//           //   "info": "",
//           //   "onlineMap": {
//           //     "yestodayRunCount": 0,
//           //     "ONLINENUM": 174002,
//           //     "todayCanBusCount": 450830974,
//           //     "ALLNUM": 206236,
//           //     "todayLocationCount": 82859230,
//           //     "OFFLINENUM": 32234,
//           //     "yestodayStopCount": 0,
//           //     "yestodayCanBusCount": 0,
//           //     "todayStopCount": 131322,
//           //     "dayRegTerminalCount": 111,
//           //     "todayRunCount": 43499,
//           //     "yestodayLocationCount": 0
//           //   },
//           //   "success": true,
//           //   "texts": "",
//           //   "url": ""
//           // }
//         },
//         error: function(xhr, type){
//           alert('Ajax error!')
//         }
//       })
//     }
//   };
// // }
// });