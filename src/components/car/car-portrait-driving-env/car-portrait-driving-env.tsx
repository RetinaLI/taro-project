import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CarService from '../../../services/car'
import PieChart from '../../../base-components/pie-chart/pie-chart'
import BarChart from '../../../base-components/bar-chart/bar-chart'

import './car-portrait-driving-env.scss'

interface CarPortraitDrivingEnvPropTypes {
  carId: string
}

export default class CarPortraitDrivingEnv extends Component<CarPortraitDrivingEnvPropTypes> {
  static defaultProps = {
    carId: null
  }

  state = {
    dayNight: {},
    weather:  {},
    wet: {},
    temp: {},
    altitude: {}
  }
  xyOptColors = ['#FFBC52', '#4F91FF'];

  componentWillReceiveProps (nextProps) {
    // console.info('nextProps ', nextProps);
  }

  componentWillMount () {
    this.getPortraitDayNight();
    this.getPortraitData();
    this.getPortraitAltitude();
  }

  componentDidMount () {
  }

  componentDidShow () {

  }

  // 昼夜分布情况
  async getPortraitDayNight () {
    let r = await CarService.getPortraitDayNight({ carId: this.props.carId });
    let dayNight = {
      name: '昼夜分布情况',
      data: r.data
    }
    this.setState({
      dayNight: dayNight
    })
  }

  async getPortraitData() {
    let result = await CarService.getPortraitData({ carId: this.props.carId });
    let res = result.data;

    // 天气分布情况
    let weatherList = res.weathers.map(item => {
      let name;
      let value = item.value;
      switch (item.key) {
      case 'RAINY':
        name = '雨';
        break;
      case 'SNOWY':
        name = '雪';
        break;
      case 'SPECIAL':
        name = '特殊天气';
        break;
      case 'CLEAR':
        name = '晴/阴/多云';
        break;
      }
      return {
        name,
        value
      };
    }).filter(v => v.value !== 0);
    let weather = {
      name: '天气分布情况',
      data: weatherList
    }
    this.setState({
      weather: weather
    })

    // 湿度分布
    let wetList = res.humiditys.map(item => {
      let name;
      let value = item.value;
      switch (item.key) {
      case 'DRY':
        name = '干燥';
        break;
      case 'WET':
        name = '潮湿';
        break;
      case 'COMFORT':
        name = '舒适';
        break;
      }
      return {
        name,
        value
      };
    }).filter(v => v.value !== 0);
    let wet = {
      name: '湿度分布情况',
      data: wetList
    }
    this.setState({
      wet: wet
    })

    // 温度分布
    let temperateList = [
      {name: '极寒', type: 'EXTREMECOLD', value: 0},
      {name: '寒冷', type: 'COLD', value: 0},
      {name: '凉爽', type: 'COOL', value: 0},
      {name: '温暖', type: 'WARM', value: 0},
      {name: '炎热', type: 'HOT', value: 0}
    ];
    let tempXAxisData = [];
    let tempTotle = 0;
    res.temperatures.forEach(item => {
      tempTotle += item.value;
    });
    temperateList.forEach(v => {
      res.temperatures.forEach((item, i) => {
        if (item.key === v.type) {
          v.value = Math.round(item.value / tempTotle * 100);
        }
      });
      tempXAxisData.push(v.name);
    });
    let tempSeriesData = [];
    temperateList.forEach(v => {
      let ind = tempXAxisData.indexOf(v.name);
      tempSeriesData[ind] = {
        value: v.value,
        itemStyle: {
          color: this.xyOptColors[ind % 2]
        }
      };
    });
    let temp = {
      name: '温度分布情况',
      xAxisData: tempXAxisData,
      seriesData: tempSeriesData
    }
    this.setState({
      temp: temp
    })
  }

  // 海拔分布情况
  async getPortraitAltitude () {
    let r = await CarService.getPortraitAltitude({ carId: this.props.carId });
    let xAxisData = ['平原', '丘陵', '山地', '高原'];
    let seriesData = [];
    r.data.forEach(v => {
      let ind = xAxisData.indexOf(v.name);
      seriesData[ind] = {
        value: v.value,
        itemStyle: {
          color: this.xyOptColors[ind % 2]
        }
      };
    });
    let altitude = {
      name: '海拔分布情况',
      xAxisData: xAxisData,
      seriesData: seriesData
    }
    this.setState({
      altitude: altitude
    })
  }

  render () {

    return (
      <View className="driving-env">
        <View className="h3">行车环境</View>
        <View className="part">
          <PieChart obj={this.state.dayNight}></PieChart>
        </View>
        <View className="part">
          <PieChart obj={this.state.weather}></PieChart>
        </View>
        <View className="part">
          <PieChart obj={this.state.wet}></PieChart>
        </View>
        <View className="part">
          <BarChart obj={this.state.temp}></BarChart>
        </View>
        <View className="part">
          <BarChart obj={this.state.altitude}></BarChart>
        </View>
      </View>
    );
  }


}