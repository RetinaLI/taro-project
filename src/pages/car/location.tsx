import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import CarService from '../../services/car';
import gcoord from 'gcoord';

import './location.scss'

class Location extends Component {

  config: Config = {
    navigationBarTitleText: '位置详情',
    enablePullDownRefresh: false,
    disableScroll: true,
    usingComponents: {
    }
  }

  state = {
    vin: '',
    lpn: '',
    carInfo: null,
    marker: [{
      iconPath: '../../assets/portrait/car.png',
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 46,
      height: 21
    }],
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps);
  }

  async componentWillMount () {
    console.info(this.$router.params)
    let did = this.$router.params.did;
    let carId = this.$router.params.carId;
    let carInfo = null;
    let marker = [{
      iconPath: '../../assets/portrait/car.png',
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 46,
      height: 21
    }];
    let res = await CarService.getLocationPageInfo({did, carId});
    console.info(res)
    if (!res.lastTimeShow) return;
    let lastTime = new Date(res.lastTimeShow.replace(/-/g, '/')).getTime();
    let convertTimesBefore = Math.floor((Date.now() - lastTime) / 1000 / 60);   // 分钟
    if (convertTimesBefore < 1) {
      convertTimesBefore = '1分钟';
    } else if (convertTimesBefore > 60) {
      convertTimesBefore = Math.round(convertTimesBefore / 60) + '小时';
    } else {
      convertTimesBefore = convertTimesBefore + '分钟';
    }
    res.convertTimesBefore = convertTimesBefore;
    carInfo = res;
    let lonLat = gcoord.transform(
      [res.longitude, res.latitude],
      gcoord.BD09,
      gcoord.GCJ02
    );
    marker[0].longitude = lonLat[0];
    marker[0].latitude = lonLat[1];
    this.setState({
      carInfo: carInfo,
      vin: this.$router.params.vin,
      lpn: this.$router.params.lpn,
    })
  }

  componentDidMount () {
  }
  componentWillUnmount () { }

  async componentDidShow () {
  }

  componentDidHide () { }

  render () {
    let { carInfo, vin, lpn } = this.state;
    let stop = null;
    let mapBox = null;
    if (!carInfo) return
    if (process.env.TARO_ENV === 'weapp') {
      if (carInfo) {
        mapBox = <Map id="location" longitude={carInfo.longitude} latitude={carInfo.latitude} markers={marker} scale="14" show-location></Map>
      }
    }
    if (carInfo.acc == 0) {
      stop = <View className="stop-times">停车{carInfo.convertTimesBefore || '--'}</View>
    }
    return (
      <View className="abc" carInfo={true}>
        <View className="map-box">
          {mapBox}
        </View>
        <View className="content">
          <View className="carId p20">{vin}</View>
          <View className="flex p20">
            <View className="lpn">{lpn}</View>
            {stop}
          </View>
          <View className="flex car-info-box p20">
            <View className="acc">
              <Text className="name">ACC：</Text>
              <Text className="value">{carInfo.acc == 0 ? 'OFF' : 'ON'}</Text>
            </View>
            <View className="speed">
              <Text className="name">速度：</Text>
              <Text className="value">{ carInfo.acc == 1 ? carInfo.speed + 'km/h' : '--'}</Text>
            </View>
            <View className="gps">
              <Text className="name">GPS定位：</Text>
              <Text className="value">{carInfo.gps || '--'}</Text>
            </View>
          </View>
          <View className="times-before p20">
            <Text className="label">最后定位时间：</Text>
            <Text className="value">{carInfo.lastTimeShow || '--'}</Text>
          </View>
          <View className="car-position p20">
            <Text className="label">车辆地址：</Text>
            <Text className="value">{carInfo.address || '--'}</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default Location as ComponentClass<PageOwnProps, PageState>
