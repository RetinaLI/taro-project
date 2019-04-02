import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import RealTimeBox from '../../components/for-app/real-time-box/real-time-box'
import CarEnergySummaryBox from '../../components/for-app/car-energy-summary-box/car-energy-summary-box'

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

    console.info('protocol', protocol)
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
        {!this.state.isEnergy && <RealTimeBox carId={this.state.carId} did={this.state.did}></RealTimeBox>}
        {this.state.isEnergy && <CarEnergySummaryBox carId={this.state.carId} did={this.state.did}></CarEnergySummaryBox>}
      </View>
    )
  }
}
export default RealTime as ComponentClass<PageOwnProps, PageState>
