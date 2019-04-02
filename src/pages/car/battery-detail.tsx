import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import CarService from '../../services/car';
import BatteryList from '../../components/battery-list/battery-list'
import NoMore from '../../base-components/no-more/no-more'

import './battery-detail.scss'
type PageOwnProps = {

}

type PageState = {
}

type IProps = PageOwnProps & PageState;

interface BatteryDetail {
  props: IProps;
}


class BatteryDetail extends Component {
  config: Config = {
    navigationBarTitleText: '车辆详情',
    usingComponents: {
    }
  }

  state = {
    voltage: {},
    temp: {},
    type: ''
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }

  componentWillMount () {
    let carId = this.$router.params.carId;
    let type = this.$router.params.type;
    this.getVoltageList(carId);
    this.getTempList(carId);
    this.setState({
      type: type
    })
  }

  componentDidMount () {
  }
  componentWillUnmount () { }

  async componentDidShow () {
  }

  componentDidHide () { }

  async getVoltageList(carId) {
    let result = await CarService.getBatteryList({carId: carId, code: '1110107'});
    if (!result || result.length === 0) {
      return;
    }
    let voltageList = result.filter(o => o.value).map(item => {
      return {
        value: Number(item.value).toFixed(2)
      };
    });
    let voltageLen = voltageList.length;
    let list = result.filter(o => o.value).sort((a, b) => b.value - a.value);
    let max = list[0].value;
    let min = list[list.length - 1].value;
    let voltage = {
      list: voltageList,
      length: voltageLen,
      max: max,
      min: min
    }
    this.setState({
      voltage: voltage,
      voltageLen: voltageLen
    })
  }

  async getTempList(carId) {
    let result = await CarService.getBatteryList({carId: carId, code: '1110108'});
    if (!result || result.length === 0) {
      return;
    }
    let tempList = result.filter(o => o.value).map(item => {
      return {
        value: item.value
      };
    });
    let tempLen = tempList.length;
    let list = result.filter(o => o.value).sort((a, b) => b.value - a.value);
    let max = list[0].value;
    let min = list[list.length - 1].value;
    let temp = {
      list: tempList,
      length: tempLen,
      max: max,
      min: min
    }
    this.setState({
      temp: temp
    })
  }

  render () {
    let { voltage, type, temp } = this.state;
    return (
      <View className="container">
        <View className="content">
          {type === 'voltage' && <BatteryList voltage={voltage}></BatteryList>}
          {type === 'temp' && <BatteryList temp={temp}></BatteryList>}
        </View>
        <NoMore></NoMore>
      </View>
    )
  }
}
export default BatteryDetail as ComponentClass<PageOwnProps, PageState>
