import Taro, { Component } from '@tarojs/taro'
import {View} from '@tarojs/components'
import CarService from '../../../services/car'
import DashboardChartEnergy from '../../../base-components/dashboard-chart-energy/dashboard-chart-energy'

import './car-energy-summary-box.scss'
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
    this.getRealTimeInfo();
    this.getCarDetailInfo();
  }

  async getRealTimeInfo() {
    let res = await CarService.getRealTimeInfo({carId: this.props.carId});

    let gears = res.dashBoard.find(v => v.name === '档位').value;
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
    let {sendTime, dashBoardEnergy} = this.state;

    return(
      <View className="part meter energy">
        <DashboardChartEnergy dashBoardEnergy={dashBoardEnergy} sendTime={sendTime}></DashboardChartEnergy>
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