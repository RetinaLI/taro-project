import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import CarService from '../../../services/car'
import MapList from '../../../components/map-list/map-list'

import './car-portrait-track.scss'

interface CarPortraitTrackStopPropTypes {
  carId: string
}

export default class CarPortraitTrackStop extends Component<CarPortraitTrackStopPropTypes> {
  static defaultProps = {
    carId: null
  }

  state = {
    provinceCount: 0,
    mapSeriesData: [],
    raty: 0,
    stopMarkers: [],
    cityCount: 0
  }

  componentWillReceiveProps (nextProps) {
    // console.info('nextProps ', nextProps);
  }

  componentWillMount () {
    this.getPortraitData();
  }

  componentDidMount () {
  }

  componentDidShow () {

  }

  async getPortraitData() {
    let result = await CarService.getPortraitData({ carId: this.props.carId });
    let res = result.data;
    // 地图数据(省份)
    let provincesList = res.provinces.map(item => {
      return {
        name: item.key,
        value: item.value
      };
    });
    let provinceCount = provincesList.length; // 经过的省份
    let seriesData = [];
    if (provincesList.length > 0) {
      seriesData = this.convertProvinceName(this.convertArrJsonName(this.convertArrJsonName(provincesList, 'provincecount', 'value')));
      seriesData.sort((a, b) => b.value - a.value);
    }
    this.setState({
      provinceCount: provinceCount,
      mapSeriesData: seriesData
    })

    // 经过的城市
    let citiesOrder = res.cities.map(item => {
      return {
        city: item.key,
        count: item.value
      };
    }).sort((a, b) => b.value - a.value);
    let cityCount = res.cities.length;
    this.setState({
      citiesOrder: citiesOrder,
      cityCount: cityCount
    })

    let r4 = await CarService.getCitiesProportion({ carId: this.props.carId });
    let raty = 0;
    if (r4.map.citiesProportion) {
      raty = r4.map.citiesProportion.toFixed(2);
    } else {
      raty = cityCount / 2;
    }
    this.setState({
      raty: raty
    })
  }

  render () {

    return (
      <View>
        <View className="part footprint">
          <View className="part-title">
            <Text>车辆足迹</Text>
          </View>
          <View className="part-main">
            <View className="title">车辆运营途径<Text>{this.state.provinceCount}</Text>个省份、<Text>{this.state.cityCount}</Text>个城市</View>
            <View className="title">超过<Text>{this.state.raty + '%'}</Text>的车辆</View>
            <View className="mapchart">
              <MapList mapList={this.state.citiesOrder} mapData={this.state.mapSeriesData} isCities={true}></MapList>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 改省份名
  convertProvinceName (data) {
    return JSON.parse(JSON.stringify(data).replace(/[省|市|自治区|壮族自治区|回族自治区|维吾尔自治区|特别行政区]/g, ''));
  }

  // 改字段名
  convertArrJsonName (json, oldName = 'province', newName = 'name') {
    let reg = new RegExp(oldName, 'ig');
    return JSON.parse(JSON.stringify(json).replace(reg, newName));
  }
}