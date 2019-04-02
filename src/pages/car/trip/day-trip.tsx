import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

import CarSummary from '../../../base-components/car-summary/car-summary';

import icon1 from '../../../assets/trip/oper-icon-01.png';
import icon2 from '../../../assets/trip/oper-icon-02.png';
import icon3 from '../../../assets/trip/oper-icon-05.png';
import icon4 from '../../../assets/trip/oper-icon-11.png';

import './day-trip.scss'
import secToTime from '../../../lib/secToTime';
import CarDayDrivingBehaviorInfo from '../../../components/car/car-day-driving-behavior-info/car-day-driving-behavior-info';

type PageOwnProps = {
}

type PageState = {
}

type IProps = PageOwnProps & PageState;

interface DayTrip {
  props: IProps;
}


class DayTrip extends Component {
  static defaultProps = {
  }

  config: Config = {
    navigationBarTitleText: '日行程',
    usingComponents: {
    }
  }

  state = {
    carId: '',
    framenum: '',
    protocol: '',
    year: (new Date()).getFullYear(),
    month: (new Date()).getMonth() + 1,
    day: (new Date()).getDate(),
    showProtocol: false,
    maxVelocity: 0,
    avgVelocity: 0,
    travelTime: 0,
    mileage: 0,
    summaries: [
      {
        iconUrl: icon1,
        label: '今日里程',
        content: '0',
        unit: 'km',
        key: 'mileage'
      },
      {
        iconUrl: icon2,
        label: '行驶时长',
        content: '0',
        unit: 'h',
        contentFn (val) {
          return secToTime(val);
        },
        key: 'workTimeInSeconds'
      },
      {
        iconUrl: icon3,
        label: '怠速时长',
        content: '0',
        contentFn (val) {
          return secToTime(val);
        },
        unit: '天',
        key: 'idleTime'
      },
      {
        iconUrl: icon4,
        label: '燃油消耗',
        content: '0',
        unit: 'L',
        key: 'fuelConsumption'
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
    let list = this.state.summaries.map(item => {
      let val = (option[item.key] || 0);
      item.content = item.contentFn && item.contentFn(val) || (val + item.unit);
      return item;
    });
    this.setState({
      showProtocol: option.protocol === 'ZKC02OV' || option.protocol === 'GBT32960',
      summaries: list,
      carId: option.carId,
      framenum: option.framenum,
      protocol: option.protocol,
      year: Number(option.y.split('-')[0]),
      month: Number(option.y.split('-')[1]),
      day: Number(option.y.split('-')[2]),
      maxVelocity: option.maxVelocity,
      avgVelocity: option.avgVelocity,
      travelTime: option.travelTime,
      mileage: option.mileage,
    });
  }

  componentDidHide() { }

  render() {
    return (
      <View className="container">
        <CarSummary summary-title="运营概况" list={this.state.summaries}></CarSummary>
        <CarDayDrivingBehaviorInfo
          carId={this.state.carId}
          framenum={this.state.framenum}
          protocol={this.state.protocol}
          year={this.state.year}
          month={this.state.month}
          day={this.state.day}
          mileage={this.state.mileage}
          travelTime={this.state.travelTime}
          avgVelocity={this.state.avgVelocity}
          maxVelocity={this.state.maxVelocity}
        ></CarDayDrivingBehaviorInfo>
      </View>
    )
  }
}
export default DayTrip as ComponentClass<PageOwnProps, PageState>
