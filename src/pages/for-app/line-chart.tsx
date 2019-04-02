import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'
import LineChart from '../../base-components/line-chart/line-chart';
import profileService from '../../services/profile'

type PageOwnProps = {

}

type PageState = {

}

type IProps = PageOwnProps & PageState;

interface LineChartPage {
  props: IProps;
}

class LineChartPage extends Component {
  config: Config = {
    navigationBarTitleText: '首页',
    usingComponents: {
      // 'ec-canvas': '../components/taro-echart/ec-canvas'
    }
  }

  state = {
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
    this.bindCarConfigurationInfo();
  }
  async bindCarConfigurationInfo() {
    await this.getCarConfigurationInfo();
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
  }

  render () {
    let { xAxisData, lineData } = this.state;
    return (
      <View>
        <LineChart xAxisData={xAxisData} lineData={lineData}></LineChart>
      </View>
    )
  }

  // 判断值是否存在函数
  isBlank(val) {
    if (val == null || val === '') {
      return true;
    }
  }

}

export default LineChartPage as ComponentClass<PageOwnProps, PageState>
