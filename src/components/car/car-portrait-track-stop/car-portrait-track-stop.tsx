import Taro, { Component } from '@tarojs/taro'
import { View, Text, Map } from '@tarojs/components'
import gcoord from 'gcoord'
import CarService from '../../../services/car'
import MapList from '../../map-list/map-list'
// import 'http://api.map.baidu.com/api?v=2.0&ak=5cGDv7LARbvAOX84P8wkI0kcK66SduUm'

import './car-portrait-track-stop.scss'

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

    // 经常停车点
    let stopMarkers = res.stops.map((item, i) => {
      if (item.key.indexOf('-') !== -1) {
        let site = item.key.split('-');
        let lonLat = gcoord.transform(
          [Number(site[0]), Number(site[1])],
          gcoord.BD09,
          gcoord.GCJ02
        );
        return {
          iconPath: '../assets/portrait/stop.png',
          id: i,
          latitude: lonLat[1],
          longitude: lonLat[0],
          width: 12,
          height: 16
        };
      }
    }).slice(0, 10);
    // if (process.env.TARO_ENV === 'h5') {
      // var script = document.createElement("script");
      // script.setAttribute('src', 'http://api.map.baidu.com/api?v=2.0&ak=5cGDv7LARbvAOX84P8wkI0kcK66SduUm');
      // console.info('BMap', BMap)
      // var map = new BMap.Map("allmap");            // 创建Map实例
      // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
      // var local = new BMap.LocalSearch(map, {
      //   renderOptions:{map: map, autoViewport:true}
      // });
    // }

    this.setState({
      stopMarkers: stopMarkers
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
        <View className="stop-point">
          <View className="h3">经常停车点</View>
          <View className="part stop-map">
            {process.env.TARO_ENV === 'h5'
              ? <View id="map">11111</View>
              : <Map className="stop-point-map" longitude="108.324520" latitude="33.599994" scale="5" markers={this.state.stopMarkers} show-location></Map>
            }
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