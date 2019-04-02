import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './car-trip-timeline.scss'
import numToFixed from '../../../lib/numToFixed';
import toast from '../../../lib/toast';
import carService from '../../../services/car';

interface CarTripTimelinePropTypes {
  carId: string,
  protocol: string
}

export default class CarTripTimeline extends Component<CarTripTimelinePropTypes> {
  static defaultProps = {
    carId: null,
    protocol: null
  }

  // constructor(props, conText){
  //   super(props, conText);
  // }

  state = {
    currentYear: (new Date()).getFullYear(),
    minYear: (new Date()).getFullYear(),
    maxYear: (new Date()).getFullYear(),
    dataList: [],
    monthesData: '数据加载中...',
    showProtocol: false
  }

  framenum = null;

  componentWillReceiveProps (nextProps) {
    // console.info('car-trip-timeline nextProps ', nextProps);
  }

  componentDidMount () {
  }

  componentDidShow () {
    this.setState({
      showProtocol: this.props.protocol === 'ZKC02OV' || this.props.protocol === 'GBT32960'
    });
    this.bindMinYear();
    this.bindData();
  }

  async bindData () {
    this.setState({
      monthesData: '数据加载中...',
      dataList: []
    });
    let data = await carService.getTripIndexList({
      carId: this.props.carId,
      startMonth: this.state.currentYear + '-01',
      endMonth: this.state.currentYear + '-12'
    });
    if (data.code === 200) {
      let monthes = data.monthlyList.reverse().map(ele => {
        let date = ele.dataTime.split(' ')[0];
        return Object.assign(ele, {
          mileage: numToFixed(ele.mileage / 1000),
          dataTime: date,
          workTimeInSeconds: numToFixed(ele.workTimeInSeconds / 60 / 60), // 转小时
          avgVelocity: numToFixed(ele.avgVelocity),
          year: date.split('-')[0],
          month: date.split('-')[1],
        });
      });
      this.setState({
        monthesData: monthes.length <= 0 ? '暂无数据' : '',
        dataList: monthes
      });
    } else {
      this.setState({
        monthesData: '暂无数据'
      });
    }

  }

  async bindMinYear () {
    let data = await carService.getTripIndexCreated({ carId: this.props.carId });
    if (data.code === 200 && data.data.created) {
      this.framenum = data.data.framenum;
      this.setState({
        minYear: new Date(data.data.created.replace(/-/g, '/')).getFullYear()
      });
    }
  }

  render () {
    let showOilData = this.state.showProtocol;
    let $list = this.state.dataList.map((item, index) => {
      return <View className="year-list-item flex" key={String(index)} onClick={this.navigatorToMonth.bind(this, item)}>
              <View className="year-list-item-month">
                <Text className="month-num">{item.month}</Text>
                <Text className="month">月</Text>
              </View>
              <View className="year-list-item-content flex">
                <View className="year-list-item-content-left flex">
                  <View className="col-3 flex">
                    <Image className="year-icon year-icon-01"
                          src="../../../assets/trip/statistics-01.png"></Image>
                    <View className="year-icon-text">
                      <Text className="label">{item.workDays || 0}天</Text>
                      <Text className="txt">在线</Text>
                    </View>
                  </View>
                  <View className="col-3 flex">
                    <Image className="year-icon year-icon-02"
                          src="../../../assets/trip/statistics-02.png"></Image>
                    <View className="year-icon-text">
                      <Text className="label">{item.mileage || 0}km</Text>
                      <Text className="txt">里程</Text>
                    </View>
                  </View>
                  { showOilData && <View className="col-3 flex">
                    { item.fuelConsumption && item.fuelConsumption > 0 && <View>
                      <Image className="year-icon year-icon-03"
                            src="../../../assets/trip/statistics-03.png"></Image>
                      <View className="year-icon-text">
                        <Text className="label">{item.fuelConsumption || 0}L</Text>
                        <Text className="txt">油耗</Text>
                      </View>
                    </View> }
                  </View> }
                </View>
                <Text className="foton-ui arr-icon right opacity2 just-right"></Text>
              </View>
            </View>
    });
    return (
      <View className="part">
        <View className="part-title">
          <Text>行程统计</Text>
        </View>
        <View className="part-content year-top-btn flex">
          <View className={"year-btn" + (this.state.currentYear <= this.state.minYear && 'opacity2')} onClick={this.goPrevYear}>
            <i class="foton-ui arr-icon left"></i>
          </View>
          <Text className="year-text">{this.state.currentYear}年</Text>
          <View className={"year-btn" + (this.state.currentYear >= this.state.maxYear && 'opacity2')} onClick={this.goNextYear}>
            <i class="foton-ui arr-icon right"></i>
          </View>
        </View>
        { this.state.dataList.length === 0 && <View className="no-data">
            <Text>{this.state.monthesData}</Text>
          </View> }
        { this.state.dataList.length > 0 && <View className="year-list">
            { this.state.dataList.length > 1 && <Text className="line"></Text> }
            { $list }
          </View> }
      </View>
    );
  }

  goNextYear () {
    if (this.state.currentYear >= this.state.maxYear) return toast.warn('已是最大年份');
    this.state.currentYear = this.state.currentYear + 1;
    this.bindData();
  }
  goPrevYear () {
    if (this.state.currentYear <= this.state.minYear) return toast.warn('已是最小年份');
    this.state.currentYear = this.state.currentYear - 1;
    this.bindData();
  }
  navigatorToMonth (item) {
    Taro.navigateTo({
      url: `/pages/car/trip/month-trip?y=${item.dataTime}&carId=${this.props.carId}&runDays=${item.runDays}&mileage=${item.mileage}&fuelConsumption=${item.fuelConsumption}&workTimeInSeconds=${item.workTimeInSeconds}&avgVelocity=${item.avgVelocity}&workDays=${item.workDays}&framenum=${this.framenum}&chargeCount=${item.chargeCount}&protocol=${this.props.protocol}`,
    });
  }
}