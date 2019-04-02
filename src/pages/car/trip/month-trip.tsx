import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

import CarSummary from '../../../base-components/car-summary/car-summary';
import CarCityHistoryMap from '../../../components/car/car-city-history-map/car-city-history-map';
import CarCalendar from '../../../components/car/car-calendar/car-calendar';

import icon1 from '../../../assets/trip/oper-icon-01.png';
import icon2 from '../../../assets/trip/oper-icon-02.png';
import icon3 from '../../../assets/trip/oper-icon-03.png';
import icon4 from '../../../assets/trip/oper-icon-04.png';
import icon5 from '../../../assets/trip/oper-icon-05.png';

import './month-trip.scss'

type PageOwnProps = {
}

type PageState = {
}

type IProps = PageOwnProps & PageState;

interface MonthTrip {
  props: IProps;
}


class MonthTrip extends Component {
  static defaultProps = {
  }

  config: Config = {
    navigationBarTitleText: '月行程',
    usingComponents: {
    }
  }

  state = {
    carId: '',
    framenum: '',
    protocol: '',
    year: (new Date()).getFullYear(),
    month: (new Date()).getMonth() + 1,
    summaries: [
      {
        iconUrl: icon1,
        label: '本月里程',
        content: '0',
        unit: 'km',
        key: 'mileage'
      },
      {
        iconUrl: icon2,
        label: '本月时长',
        content: '0',
        unit: 'h',
        key: 'workTimeInSeconds'
      },
      {
        iconUrl: icon3,
        label: '本月行驶',
        content: '0',
        unit: '天',
        key: 'workDays'
      },
      {
        iconUrl: icon4,
        label: '运营天数',
        content: '0',
        unit: '天',
        key: 'workDays'
      },
      {
        iconUrl: icon5,
        label: '平均速度',
        content: '0',
        unit: 'km/h',
        key: 'avgVelocity'
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
      item.content = (option[item.key] || 0) + item.unit;
      return item;
    });

    this.setState({
      summaries: list,
      carId: option.carId,
      framenum: option.framenum,
      protocol: option.protocol,
      year: Number(option.y.split('-')[0]),
      month: Number(option.y.split('-')[1])
    });
  }

  componentDidHide() { }

  render() {
    return (
      <View className="container">
        <CarSummary summary-title="运营概况" list={this.state.summaries}></CarSummary>
        <CarCityHistoryMap
          carId={this.state.carId}
          year={this.state.year}
          month={this.state.month}
        ></CarCityHistoryMap>
        <CarCalendar
          carId={this.state.carId}
          framenum={this.state.framenum}
          protocol={this.state.protocol}
          year={this.state.year}
          month={this.state.month}
        ></CarCalendar>
      </View>
    )
  }
}
export default MonthTrip as ComponentClass<PageOwnProps, PageState>
