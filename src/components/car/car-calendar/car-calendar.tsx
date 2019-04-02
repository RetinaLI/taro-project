import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './car-calendar.scss'

import carService from '../../../services/car';
import numToFixed from '../../../lib/numToFixed';

interface CarCalendarPropTypes {
  year: number,
  month: number,
  carId: string,
  framenum: string,
  protocol: string
}

export default class CarCalendar extends Component<CarCalendarPropTypes> {
  static defaultProps = {
    year: (new Date()).getFullYear(),
    month: (new Date()).getMonth() + 1,
    carId: '',
    framenum: '',
    protocol: ''
  }

  // constructor(props, context){
  //   super(props, context);
  // }

  state = {
    runMap: {},
    selectedMonth: -1
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
    Taro.showNavigationBarLoading();
    let data = await carService.getTripMonthList({
      carId: this.props.carId,
      month: `${this.props.year}${this.props.month}`
    });
    let arr = {};
    if (data.code === 200 && data.dailyList.length) {
      Taro.hideNavigationBarLoading();
      data.dailyList.forEach(ele => {
        let index = parseInt(ele.dataTime.replace(/\s.+/, '').replace(/.+-/, ''));
        arr[index] = (Object.assign({}, ele, {
          mileage: numToFixed(ele.mileage / 1000, 1),
          avgVelocity: numToFixed(ele.avgVelocity, 1),
          maxVelocity: numToFixed(ele.maxVelocity, 1)
        }));
      });
    }
    this.setState({
      runMap: arr
    });
  }

  render () {
    let firstDate = new Date(this.props.year + '/' + this.props.month + '/1 00:00:00');
    let startIndex = firstDate.getDay();
    let endDate = new Date(firstDate.setMonth(this.props.month) - 60 * 60 * 1000);
    let count = startIndex + endDate.getDate();
    let dataMap = this.state.runMap;
    let selectedM = this.state.selectedMonth;
    // console.info(startIndex, count);
    let list = '1'.repeat(count).split('').map((item, index) => {
      let c = index < startIndex ? '' : (index - startIndex + 1);
      return {
        cMonth: index < startIndex ? '' : (index - startIndex + 1),
        d: dataMap[c]
      };
    });
    let $days = list.map((item, index) => {
      return <View
              onClick={this.navigatorToDay.bind(this, item.d, item.cMonth)}
              className={`day ${item.d ? 'run' : ''} ${selectedM == item.cMonth ? 'selected' : ''}`} key={String(index)}>
        <Text className="txt">{item.cMonth}</Text>
      </View>
    });

    return (
      <View className="part meter">
        <View className="part-title">
          <Text>运营日历</Text>
        </View>
        <View className="part-content clearfix">
          <View className="month">
            <View className="headbox flex">
              <View className="headdate">日</View>
              <View className="headdate">一</View>
              <View className="headdate">二</View>
              <View className="headdate">三</View>
              <View className="headdate">四</View>
              <View className="headdate">五</View>
              <View className="headdate">六</View>
            </View>
            <View className="days flex">
              { $days }
            </View>
          </View>
        </View>
      </View>
    );
  }

  navigatorToDay (item, month) {
    this.setState({
      selectedMonth: month
    });
    if (item) {
      Taro.navigateTo({
        url: `/pages/car/trip/day-trip?y=${item.dataTime.replace(/\s.+/, '')}&carId=${this.props.carId}&mileage=${item.mileage}&fuelConsumption=${item.fuelConsumption}&workTimeInSeconds=${item.workTimeInSeconds}&framenum=${this.props.framenum}&maxVelocity=${item.maxVelocity}&idleTime=${item.idleTime}&avgVelocity=${item.avgVelocity}&chargeCount=${item.chargeCount}&protocol=${this.props.protocol}`
      });
    }
  }
}