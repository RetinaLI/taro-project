import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'
import MapList from '../components/map-list/map-list'
import Summary from '../components/summary/summary'
import CarAnalysis from '../components/car-analysis/car-analysis'
import LineChart from '../base-components/line-chart/line-chart';
import profileService from '../services/profile'
import { connect } from '@tarojs/redux'


import './index.scss'
// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion
type PageOwnProps = {

}

type PageState = {

}

type IProps = PageOwnProps & PageState;

interface Index {
  props: IProps;
}

// @connect(({ profile }) => ({
//   profile: profile.profile,
//   platform: profile.platform
// }))

class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页',
    usingComponents: {
      // 'ec-canvas': '../components/taro-echart/ec-canvas'
    }
  }

  state = {
    numData: [0, 0, 0, 0, 0, 0],
    carScaleData: [],
    mapList: [],
    xAxisData: [],
    lineData: []
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }

  componentWillMount () {
    this.initData();
  }

  componentDidMount () {

  }
  componentWillUnmount () { }

  async componentDidShow () {
  }

  componentDidHide () { }

  async initData () {
    // this.hiddenText = false;
    this.bindCarSituation();
    this.bindProvinceCarInfo();
    this.bindCarConfigurationInfo();
    this.bindCarModelsInfo();
    // setTimeout(() => {
    //   this.hiddenText = true;
    //   this.$apply();
    // }, 5000);
  }

  async bindCarSituation() {
    await this.getCarSituation();
  }

  async bindProvinceCarInfo() {
    await this.getProvinceCarInfo();
  }

  async bindCarConfigurationInfo() {
    await this.getCarConfigurationInfo();
  }

  async bindCarModelsInfo() {
    await this.getCarModelsInfo();
    // console.info('this.state.carScaleData',this.state.carScaleData)
    // if (this.state.carScaleData.length === 0) return;
    // this.state.carScaleData.map((item, key) => {
    //   console.info(item)
    //   let textWidth = 0;
    //   let length = item.name.length * 11;
    //   setTimeout(() => {
    //     let query;
    //     if (process.env.TARO_ENV === 'h5') {
    //       query = Taro.createSelectorQuery().in(this);
    //     } else {
    //       query = Taro.createSelectorQuery().in(this.$scope);
    //     }
    //     query.select('.car-name').boundingClientRect((res) => {
    //       textWidth = res.width;
    //       console.info('textWidth', textWidth)
    //       console.info('length', length)
    //       if (length > textWidth) {
    //         item.showAnimate = true;
    //         console.info(item)
    //       }
    //       console.info('item11',item)
    //       this.setState(item);
    //     }).exec();
    //   }, 2000);
    //   console.info(item)
    // });
  }

  // 车辆状况
  async getCarSituation () {
    let result = await profileService.getCarSituation();
    let onlineMap = result.onlineMap;
    let allNum = onlineMap.ALLNUM || 0;
    let onlineNum = onlineMap.ONLINENUM || 0;
    let offlineNum = onlineMap.OFFLINENUM || 0;
    let todayRunCount = onlineMap.todayRunCount || 0;
    let todayStopCount = onlineNum - todayRunCount || 0;
    let dayRegTerminalCount = onlineMap.dayRegTerminalCount || 0;
    let numData = [allNum, onlineNum, offlineNum, todayRunCount, todayStopCount, dayRegTerminalCount];
    // this.setState({
    //   numData: numData
    // })
    this.NumAutoPlusAnimation({
      time: 1500,
      num: numData,
      regulator: 30
    });
  }

  // 各省车辆情况
  async getProvinceCarInfo() {
    this.setState({
      mapList: []
    });
    let mapList = [];
    let result = await profileService.getProvinceCarInfo();
    if (!result.objectList || result.objectList.length === 0) {
      return;
    }
    mapList = result.objectList.map(item => {
      return {
        name: item[0],
        value: item[1]
      };
    }).filter(value => value.name !== '');
    this.setState({
      mapList: mapList
    });
  }

  // 近六个月车辆配装情况
  async getCarConfigurationInfo() {
    let result = await profileService.getCarConfigurationInfo();
    if (!result.data || !result.data.series || result.data.series.length === 0) {
      return;
    }
    let xAxisData = result.data.categories;
    let lineData = [];
    result.data.series.map((item, key) => {
      result.data.series[key].data.map((value, i) => {
        if (this.isBlank(lineData[i])) {
          lineData[i] = 0;
        }
        lineData[i] += value;
      });
    });
    this.setState({
      xAxisData: xAxisData,
      lineData: lineData
    })
    // this.lineOption.xAxis.data = xAxisData;
    // this.lineOption.series[0].data = lineData;
    // if (this.lineChart) {
    //   this.lineChart.setOption(this.lineOption);
    // }
  }

  // 各车型车辆数
  async getCarModelsInfo() {
    let result = await profileService.getCarModelsInfo();
    if (!result.list || result.list.length === 0) {
      return;
    }
    result.list.sort((a, b) => b.car_count - a.car_count);
    let carScaleData = result.list
      .filter(value => value.name !== '')
      .map(item => {
        return {
          name: item.car_brand_name + item.car_type_name,
          value: item.car_count,
          showAnimate: false,
        };
      });
    this.setState({
      carScaleData: carScaleData
    });
  }


  render () {
    let { numData, mapList, xAxisData, lineData, carScaleData } = this.state;
    return (
      <View className="container">
        <View className="top-info">您好！欢迎使用</View>
        <View className="part summary">
          <Summary numData={numData}></Summary>
        </View>
        <View className="part hots">
          <View className="part-title">分布热点</View>
          <View>
             <MapList mapList={mapList} mapData={mapList}></MapList>
          </View>
        </View>
        <View className="part equip-trend">
          <View className="part-title">配装趋势</View>
          <LineChart xAxisData={xAxisData} lineData={lineData}></LineChart>
        </View>
        <View className="part car-analysis">
          <View className="part-title">运营分析</View>
          <CarAnalysis carScaleData={carScaleData}></CarAnalysis>
        </View>
      </View>
    )
  }

  // 判断值是否存在函数
  isBlank(val) {
    if (val == null || val === '') {
      return true;
    }
  }

  // 改省份名
  convertProvinceName (data) {
    return JSON.parse(JSON.stringify(data).replace(/[省|市|自治区|壮族自治区|回族自治区|维吾尔自治区|特别行政区]/g, ''));
  }

  NumAutoPlusAnimation(options) {
    let numData = [0, 0, 0, 0, 0, 0];
    options = options || {};
    let time = options.time, // 总时间--毫秒为单位
      finalNum = options.num, // 要显示的真实数值
      regulator = options.regulator || 100, // 调速器，改变regulator的数值可以调节数字改变的速度
      step = [], // 每30ms增加的数值
      count = [0, 0, 0, 0, 0, 0], // 计数器
      initial = [0, 0, 0, 0, 0, 0],
      t = [];
    let timer = setInterval(() => {
      finalNum.map((item, i) => {
        step[i] = finalNum[i] / (time / regulator);
        count[i] += step[i];
        if (finalNum[i] !== 0) {
          if (count[i] >= finalNum[i]) {
            clearInterval(timer);
            count[i] = finalNum[i];
          }
        }
        t[i] = Math.round(count[i]);
        if (t[i] === initial[i]) {
          return;
        }
        initial[i] = t[i];
        numData[i] = initial[i];
        this.setState({
          numData: numData
        });
      });
    }, 30);
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
