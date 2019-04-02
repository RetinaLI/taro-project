import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './car-city-history-map.scss'

import MapList from '../../map-list/map-list'
import carService from '../../../services/car';

interface CarCityHistoryMapPropTypes {
  carId: string,
  year: number,
  month: number
}

export default class CarCityHistoryMap extends Component<CarCityHistoryMapPropTypes> {
  static defaultProps = {
    carId: '',
    year: (new Date()).getFullYear(),
    month: (new Date()).getMonth() + 1
  }

  // constructor(props, context){
  //   super(props, context);
  // }

  state = {
    mapList: [],
    cityCount: 0,
    provinceCount: 0,
    citys: false
  }

  componentWillReceiveProps (nextProps) {
    // console.info('car-trip-summary nextProps ', nextProps);
  }

  componentDidMount () {
  }

  componentDidShow () {
    this.bindData();
  }

  async bindData () {
    // 获取经过的省份
    let city = carService.getMonthProvince({
      carId: this.props.carId,
      month: `${this.props.year}-${this.props.month}`
    });

    // 获取城市排行
    let order = carService.getMonthCity({
      carId: this.props.carId,
      month: `${this.props.year}-${this.props.month}`
    });

    let data = await Promise.all([city, order]);
    console.info('==========', data);
    let citys = false, cityCount = 0, citiesOrder = [], provinceCount = 0;
    let newList = [];
    if (data[0].list.length > 0) {
      citys = false;
      newList = data[0].list.sort((a, b) => {
        return b.value - a.value;
      }).map(ele => {
        return {
          name: ele.key,
          value: ele.value
        };
      });
      provinceCount = data[0].list.length;   // 经过的省份、城市、比例
    } else {
      citys = true;
    }
    if (data[1].list.length > 0) {
      data[1].list.sort((a, b) => {
        return b.count - a.count;
      });
      cityCount = data[1].list.length;   // 经过的省份、城市、比例
      citiesOrder = data[1].list;   // 经过的城市
    }
    console.info(newList);
    this.setState({
      provinceCount,
      cityCount,
      citys,
      mapList: newList
    });
  }

  render () {
    return (
      <View className="part meter">
        <View className="part-title">
          <Text>车辆足迹</Text>
        </View>
        <View className="part-content">
          <View className={`title ${this.state.citys ? 'pos-center' : ''}`}>车辆运营途径<Text>{this.state.provinceCount}</Text>个省份、<Text>{this.state.cityCount}</Text>个城市</View>
          <MapList mapList={this.state.mapList} mapData={this.state.mapList}></MapList>
        </View>
      </View>
    );
  }
}