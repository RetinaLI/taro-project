import Taro, { Component } from '@tarojs/taro'
import {View} from '@tarojs/components'
import CarService from '../../../services/car'
import DashboardChartEnergy from '../../../base-components/dashboard-chart-energy/dashboard-chart-energy'
import IconLabelCardList from '../../../base-components/icon-label-card-list/icon-label-card-list'

import './car-energy-summary-box.scss'
import mileageIcon from '../../../assets/realtime/mileage.png'
import voltageIcon from '../../../assets/realtime/voltage.png'
import currentIcon from '../../../assets/realtime/current.png'

interface CarEnergySummaryBoxPropTypes {
  carId?: string,
  did?: string
}

export default class CarEnergySummaryBox extends Component<CarEnergySummaryBoxPropTypes> {
  static defaultProps = {
    carId: null,
    did: null
  }

  state = {
    mileage: 0,
    totleVoltage: '--',
    totleCurrent: '--',
    sendTime: '',
    dashBoardEnergy: {}
  }
  chart = null;
  option = {};

  componentWillReceiveProps (nextProps) {

  }

  componentWillMount () {

  }

  componentDidMount () {
    this.getTripIndex();
    this.getRealTimeInfo();
    this.getCarDetailInfo();
  }

  async getTripIndex() {
    let res = await CarService.getTripIndex({carId: this.props.carId});
    if (res.code === 200) {
      let mileage = res.map.TT_MILEAGE;
      this.setState({
        mileage: mileage
      })
    }
  }

  async getRealTimeInfo() {
    let res = await CarService.getRealTimeInfo({carId: this.props.carId});

    let gears = res.dashBoard.find(v => v.name === '档位').value;
    let totleVoltage = res.dashBoard.find(v => v.name === '总电压').value;
    let totleCurrent = res.dashBoard.find(v => v.name === '总电流').value;
    let speedVal = res.dashBoard.find(v => v.name === '速度').value;
    let SOCVal = res.dashBoard.find(v => v.name === 'SOC').value;
    let speedDeg = this.numberToAngle('speed', speedVal);
    let SOCDeg = this.numberToAngle('SOC', SOCVal);
    clearTimeout(this.timer);
    // this.timer = null;
    let dashBoardEnergy = {
      speedVal: speedVal,
      SOCVal: SOCVal,
      speedDeg: speedDeg,
      SOCDeg: SOCDeg,
      gears: gears
    }
    this.setState({
      totleVoltage: totleVoltage,
      totleCurrent: totleCurrent,
      dashBoardEnergy: dashBoardEnergy
    })
  }

  async getCarDetailInfo() {
    let r = await CarService.getCarDetailInfo({did: this.props.did});
    let sendTime = r.lastTimeShow.split(' ')[1];
    this.setState({
      sendTime: sendTime,
    })
  }


  render () {
    let {mileage, sendTime, dashBoardEnergy, totleVoltage, totleCurrent} = this.state;

    let iconLabelCardList = [
      { label: '里程', content: mileage ? mileage + ' KM' : '--' , iconUrl: mileageIcon },
      { label: '总电压', content: totleVoltage != null ? totleVoltage + ' V' : '--', iconUrl: voltageIcon },
      { label: '总电流', content: totleCurrent != null ? totleCurrent + ' A' : '--', iconUrl: currentIcon }
    ];

    return(
      <View className="part meter energy">
        <DashboardChartEnergy dashBoardEnergy={dashBoardEnergy} sendTime={sendTime}></DashboardChartEnergy>
        <View className="lg-box flex">
          <IconLabelCardList list={iconLabelCardList} ext-item-clz="list-item"></IconLabelCardList>
        </View>
      </View>
    );
  }

  numberToAngle (type, num = 0) {
    const angleMaxMap = {
      speed: 255,
      SOC: 100
    };
    let max = angleMaxMap[type];
    if (!max) return;
    const x = 225;  // 起始角度
    const allAngle = 270;   // 总角度
    let a = num / max * allAngle;   // 应该旋转的角度
    a = Math.round(a);
    let res = x - a;
    return res;
  }

}