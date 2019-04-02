import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CarPortraitSummary from '../../components/car/car-portrait-summary/car-portrait-summary';
import CarPortraitTrackStop from '../../components/car/car-portrait-track-stop/car-portrait-track-stop';
import CarPortraitDrivingEnv from '../../components/car/car-portrait-driving-env/car-portrait-driving-env'
import NoMore from '../../base-components/no-more/no-more'

import './portrait.scss'
type PageOwnProps = {

}

type PageState = {
}

type IProps = PageOwnProps & PageState;

interface Portrait {
  props: IProps;
}


class Portrait extends Component {
  config: Config = {
    navigationBarTitleText: '车辆详情',
    usingComponents: {
    }
  }

  state = {
    carId: '',
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }

  componentWillMount () {
    let carId = this.$router.params.carId;
  }

  componentDidMount () {
  }
  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  render () {
    return (
      <View className="portrait container">
        <CarPortraitSummary carId={this.state.carId}></CarPortraitSummary>
        <CarPortraitTrackStop carId={this.state.carId}></CarPortraitTrackStop>
        <CarPortraitDrivingEnv carId={this.state.carId}></CarPortraitDrivingEnv>
        <NoMore></NoMore>
      </View>
    )
  }
}
export default Portrait as ComponentClass<PageOwnProps, PageState>
