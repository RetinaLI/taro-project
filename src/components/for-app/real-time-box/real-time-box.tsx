import Taro, { Component } from '@tarojs/taro'
import {View} from '@tarojs/components'
import CarService from '../../../services/car'
import DashboardChart from '../../../base-components/dashboard-chart/dashboard-chart'
import Log from '../../../providers/log'

import './real-time-box.scss'

interface RealTimeBoxPropTypes {
  carId?: string,
  did?: string
}

export default class RealTimeBox extends Component<RealTimeBoxPropTypes> {
  static defaultProps = {
    carId: null,
    did: null
  }

  state = {
    dashBoard: {},
    sendTime: ''
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
    Log.info('仪表盘carId：', this.props.carId)
    let res = await CarService.getRealTimeInfo({carId: this.props.carId});

    let speedVal = res.dashBoard.find(v => v.name === '速度').value;
    let roundVal = res.dashBoard.find(v => v.name === '转速').value;
    let oilVal = res.dashBoard.find(v => v.name === '油耗').value;
    let speedDeg = this.numberToAngle('speed', speedVal);
    let roundDeg = this.numberToAngle('round', roundVal);
    let oilDeg = this.numberToAngle('oil', oilVal);
    // clearTimeout(this.timer);
    // this.timer = null;
    let dashBoard = {
      speedVal: speedVal,
      roundVal: roundVal,
      oilVal: oilVal,
      speedDeg: speedDeg,
      roundDeg: roundDeg,
      oilDeg: oilDeg
    }
    this.setState({
      dashBoard: dashBoard
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
    let {sendTime, dashBoard} = this.state;

    return(
      <View>
        <View className="part meter">
          <DashboardChart dashBoard={dashBoard} sendTime={sendTime}></DashboardChart>
        </View>
      </View>
    );
  }

  numberToAngle (type, num = 0) {
    const angleMaxMap = {
      speed: 255,
      round: 3600,
      oil: 126
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