import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CarLocationNav from '../../components/car/car-location-nav/car-location-nav'
import RealTimeBox from '../../components/car/real-time-box/real-time-box'
import CarEnergySummaryBox from '../../components/car/car-energy-summary-box/car-energy-summary-box'
import WarnInfo from '../../components/car/warn-info/warn-info'

import Battery from '../../components/car/battery/battery'
import DriveMotor from '../../components/car/drive-motor/drive-motor'
import NoMore from '../../base-components/no-more/no-more'


import './real-time.scss'
type PageOwnProps = {

}

type PageState = {

}

type IProps = PageOwnProps & PageState;

interface RealTime {
  props: IProps;
}

class RealTime extends Component {
  config: Config = {
    navigationBarTitleText: '车辆详情',
    usingComponents: {
    }
  }

  state = {
    carId: '',
    did: '',
    protocol: '',
    isEnergy: null
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }

  componentWillMount () {
    let did = this.$router.params.did;
    let carId = this.$router.params.carId;
    let protocol = this.$router.params.protocol;
    let isEnergy = null;
    if (protocol === 'ZKC02OV' || protocol === 'GBT32960') {
      isEnergy = true;
    } else {
      isEnergy = false;
    }
    this.setState({
      carId: carId,
      did: did,
      protocol: protocol,
      isEnergy: isEnergy
    })
  }

  componentDidMount () {

  }
  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  render () {
    return (
      <View className="real-time container">
        <CarLocationNav did={this.state.did} carId={this.state.carId}></CarLocationNav>
        {!this.state.isEnergy && <RealTimeBox carId={this.state.carId} did={this.state.did}></RealTimeBox>}
        {this.state.isEnergy && <View>
          <CarEnergySummaryBox carId={this.state.carId} did={this.state.did}></CarEnergySummaryBox>
          <Battery carId={this.state.carId}></Battery>
          <DriveMotor carId={this.state.carId}></DriveMotor>
        </View>}
        <WarnInfo carId={this.state.carId}></WarnInfo>
        <NoMore></NoMore>
      </View>
    )
  }
}
export default RealTime as ComponentClass<PageOwnProps, PageState>
