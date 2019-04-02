import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Text, Map, ScrollView } from '@tarojs/components'

import CarSummary from '../../../base-components/car-summary/car-summary';
import carService from '../../../services/car';
import gcoord from 'gcoord';

import secToTime from '../../../lib/secToTime'
import numToFixed from '../../../lib/numToFixed'

import icon1 from '../../../assets/trip/oper-icon-01.png';
import icon2 from '../../../assets/trip/oper-icon-02.png';
import icon3 from '../../../assets/trip/oper-icon-05.png';
import icon4 from '../../../assets/trip/oper-icon-10.png';
import iconPath1 from '../../../assets/trip/icon-start.png';
import iconPath2 from '../../../assets/trip/icon-end.png';
import iconPath3 from '../../../assets/trip/tran.png';
import './day-time-trip.scss'

type PageOwnProps = {
}

type PageState = {
}

type IProps = PageOwnProps & PageState;

interface DayTimeTrip {
  props: IProps;
}


class DayTimeTrip extends Component {
  static defaultProps = {
  }

  config: Config = {
    navigationBarTitleText: '日行程分段详情',
    usingComponents: {
    }
  }

  state = {
    framenum: '',
    markers: [],
    polyline: [],
    pathList: [],
    includePoints: [],
    summaries: [
      {
        iconUrl: icon1,
        label: '行驶里程',
        content: '0',
        unit: 'km'
      },
      {
        iconUrl: icon2,
        label: '行驶时长',
        content: '0',
        unit: 'h',
        contentFn (val) {
          return secToTime(val);
        }
      },
      {
        iconUrl: icon3,
        label: '平均速度',
        content: '0',
        unit: 'km/h'
      },
      {
        iconUrl: icon4,
        label: '最大速度',
        content: '0',
        unit: 'km/h'
      }
    ]
  }


  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }

  componentWillMount() {
  }

  componentDidMount() {
  }
  componentWillUnmount() { }

  componentDidShow() {
    let option = this.$router.params;
    this.bindData(option);
  }

  componentDidHide() { }


  async getMapList(index) {
    let item = this.state.pathList[index];
    this.renderPosition(index);
    // this.showMap = false;
    let markers = [];
    let includePoints = [];
    let polyline = [];

    let summaries = this.state.summaries;
    summaries[0].content = (item.mileage || 0) + summaries[0].unit;
    summaries[1].content = item.workTime || 0;
    summaries[2].content = (item.avgVelocity || 0) + summaries[0].unit;
    summaries[3].content = (item.maxVelocity || 0) + summaries[0].unit;

    let data = await carService.getTripDayMap({
      framenum: this.state.framenum,
      startTime: `${item.startTime}`,
      endTime: `${item.endTime}`,
    });
    if (data.code === 200) {
      // Taro.hideNavigationBarLoading();
      let list = data.list.filter(ele => ele.accOn).map(ele => {
        let result = gcoord.transform(
          [ele.longitude, ele.latitude],  // 经纬度坐标
          gcoord.BD09,  // 当前坐标系
          gcoord.GCJ02,  // 目标坐标
        );
        return {
          dataTime: ele.dataTime,
          longitude: result[0],
          latitude: result[1],
        };
      });
      let len = list.length;
      includePoints = list;
      polyline = [
        {
          points: list,
          color: '#FF0000',
          width: 2,
          dottedLine: false,
        }];
      let iconPath = '';
      list.forEach((ele, i) => {
        if (i === 0) {
          iconPath = iconPath1;
        } else if (i === len - 1) {
          iconPath = iconPath2;
        } else {
          iconPath = iconPath3;
        }
        Object.assign(ele, {
          id: i,
          iconPath,
          width: 21,
          height: 27,
          zIndex: 2,
        });
      });
      markers = list;
      // this.showMap = true;
      // this.$apply();
      this.setState({
        markers,
        polyline,
        includePoints,
        summaries
      });
    }
  };
  async renderPosition(index) {
    let ele = this.state.pathList[index];

    let addressStart = await carService.getTimeAddress({
      latitude: ele.startLatitude,
      longitude: ele.startLongitude,
    });
    let addressEnd = await carService.getTimeAddress({
      latitude: ele.endLatitude,
      longitude: ele.endLongitude,
    });
    ele.startAdd = addressStart.address;
    ele.endAdd = addressEnd.address;
    let list = this.state.pathList;
    list[index] = ele;
    this.setState({
      pathList: list
    });
  }
  async bindData (option) {
      this.setState({
        framenum: option.framenum
      });
      let pathList = [];
      // 获取分段行程
      let data = await carService.getTripDayTime({
        day: option.y,
        carId: option.carId,
      });
      if (data.code === 200) {
        pathList = data.list.map(ele => {
          return Object.assign(ele, {
            mileage: numToFixed(ele.mileage / 1000, 1),
            workTime: secToTime(
              Math.round((new Date(ele.endTime.replace(/-/g, '/')).getTime() -
                new Date(ele.startTime.replace(/-/g, '/')).getTime()) / 1000)),
            avgVelocity: numToFixed(ele.avgVelocity),
            maxVelocity: numToFixed(ele.maxVelocity),
            startAdd: '...',
            endAdd: '...'
          });
        });
      }

      console.info('===============', this.state.pathList);
      this.setState({
        pathList
      }, () => {
        if (pathList.length > 0) this.getMapList(0);
      });


  }

  render() {
    console.info(this.state.pathList);
    let $list = this.state.pathList.map((item, index) => {
      return <SwiperItem key={String(index)}>
          <View className="day-time-swiper-item flex">
            <View className="day-time-swiper-item-start flex">
              <Text className="icon">起</Text>
              <View className="info">
                <Text className="txt1">{item.startTime}</Text>
                <Text className="txt2">{item.startAdd}</Text>
              </View>
            </View>
            <View className="day-time-swiper-item-start flex day-time-swiper-item-end">
              <Text className="icon">终</Text>
              <View className="info">
                <Text className="txt1">{item.endTime}</Text>
                <Text className="txt2">{item.endAdd}</Text>
              </View>
            </View>
          </View>
        </SwiperItem>
    });

    return (
      <View className="container">
        <Swiper previousMargin="68rpx" nextMargin="68rpx" className="my-swiper"
                onChange={this.changeItem}>
          {$list}
        </Swiper>
        <View className="trip-day">
          <View className="day-run">
            <View className="day-map">
              <View className="no-part">
                <CarSummary list={this.state.summaries} ext-part-clz="summary-clz"></CarSummary>
              </View>
              <View className="time-map-load">
                <Map id="day-map2" className="day-map2" includePoints={this.state.includePoints}
                     markers={this.state.markers} polyline={this.state.polyline}>
                  {/* <CoverView className="day-map-cover" wx:if="{{!showMap}}">
                    <CoverView className="map-loding">数据加载中...</CoverView>
                  </CoverView> */}
                </Map>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
  changeItem (e) {
    if (e.detail.source === 'touch') {
      let index = e.detail.current || 0;
      this.getMapList(index);
    }
  }
}
export default DayTimeTrip as ComponentClass<PageOwnProps, PageState>
