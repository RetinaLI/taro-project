import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import {AjaxProvider} from './providers/ajax'
import Index from './pages/index'
import configStore from './store'
// import {$} from './test/test'

import './app.scss'
import 'taro-ui/dist/style/index.scss'



// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

// if (process.env.NODE_ENV === 'development' && process.env.TARO_ENV === 'h5') {
//   import './test/test'
// }

const store = configStore()

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/welcome',
      'pages/index',
      'pages/login',
      'pages/car/vehicle-internet',
      'pages/car/car-detail',
      'pages/car/location',
      'pages/car/battery-detail',
      'pages/car/trip/month-trip',
      'pages/car/trip/day-trip',
      'pages/car/trip/day-time-trip',
      'pages/message/index',
      'pages/profile/index',
      'pages/profile/platform-manager',

      'pages/for-app/map-list', // 首页地图
      'pages/for-app/line-chart', // 首页折线图
      'pages/for-app/car-analysis', // 首页运营分析
      'pages/for-app/portrait-top',  // 画像—sunmmary & 地图
      'pages/for-app/portrait-driving-env', // 画像—行车环境（饼图/柱状图）
      'pages/for-app/dashboard', // 实时—仪表盘

      'pages/test',
    ],
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示"
      }
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      'color': '#999999',
      'selectedColor': '#4475FD',
      list: [{
        pagePath: 'pages/index',
        iconPath: 'assets/shouye.png',
        selectedIconPath: 'assets/shouye-choose.png',
        text: '首页'
      }, {
        pagePath: 'pages/car/car-detail',
        iconPath: 'assets/chelianwang.png',
        selectedIconPath: 'assets/chelianwang-choose.png',
        text: '车联网'
      }, {
        pagePath: 'pages/message/index',
        iconPath: 'assets/icons/report@2x.png',
        selectedIconPath: 'assets/icons/report-choose@2x.png',
        text: '报告'
      }, {
        pagePath: 'pages/profile/index',
        iconPath: 'assets/mine.png',
        selectedIconPath: 'assets/mine-choose.png',
        text: '我的'
      }]
    }
  }

  componentDidMount () {
    AjaxProvider.init();
  }

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
