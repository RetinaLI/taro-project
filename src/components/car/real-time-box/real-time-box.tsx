import Taro, { Component } from '@tarojs/taro'
import {View} from '@tarojs/components'
import CarService from '../../../services/car'
import DashboardChart from '../../../base-components/dashboard-chart/dashboard-chart'
import IconLabelCardList from '../../../base-components/icon-label-card-list/icon-label-card-list'
import IconLabelCard from '../../../base-components/icon-label-card/icon-label-card'
import CarEngineEnvInfo from '../car-engine-env-info/car-engine-env-info';
import CarBodyInfo from '../car-body-info/car-body-info';

import './real-time-box.scss'
import mileageIcon from '../../../assets/realtime/mileage.png'
import oilIcon from '../../../assets/realtime/oil.png'
import waterTempIcon from '../../../assets/realtime/temperature.png'

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
    mileage: 0,
    remainderGas: '--',
    waterTemp: '--',
    faults: [],
    engine: [],
    carBody: [],
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

    let remainderGas = res.dashBoard.find(v => v.name === '油量').value;
    let waterTemp = res.dashBoard.find(v => v.name === '水温').value;
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
      remainderGas: remainderGas,
      waterTemp: waterTemp,
      faults: res.faults,
      engine: res.engine,
      carBody: res.carBodyInfo,
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
    let {mileage, sendTime, dashBoard, remainderGas, waterTemp, faults, engine, carBody} = this.state;

    let iconLabelCardList = [
      { key: '0', label: '里程', content: mileage ? mileage + ' KM' : '--' , iconUrl: mileageIcon },
      { key: '1', label: '油量', content: remainderGas != null ? remainderGas + ' %' : '--', iconUrl: oilIcon },
      { key: '2', label: '水温', content: waterTemp != null ? waterTemp + ' ℃' : '--', iconUrl: waterTempIcon }
    ];

    let faultsRender = faults ? faults.map((item:{ isRed: boolean, txtRed: string, txt: string, imgRed: string, img: string }, index) => {
      return <IconLabelCard
              class="item clearfix "
              key={String(item.txt)}
              label={item.isRed ? item.txtRed : item.txt}
              iconUrl={item.isRed ? item.imgRed : item.img}
              ext-txt-content-clz="hide"
              ext-txt-label-clz={(item.isRed ? 'txt-box-red':'txt-box')}
              ext-item-clz={(item.isRed ? 'bg-red':'bg-gray')}
            ></IconLabelCard>;
    }) : null;

    return(
      <View>
        <View className="part meter">
          <DashboardChart dashBoard={dashBoard} sendTime={sendTime}></DashboardChart>
          <View className="flex lg-box">
            <IconLabelCardList list={iconLabelCardList} ext-item-clz="list-item"></IconLabelCardList>
          </View>
          <View className="flex md-items">
            { faultsRender }
          </View>
        </View>
        <CarEngineEnvInfo list={engine}></CarEngineEnvInfo>
        <CarBodyInfo list={carBody}></CarBodyInfo>
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