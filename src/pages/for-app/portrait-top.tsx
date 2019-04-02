import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CarPortraitSummary from '../../components/car/car-portrait-summary/car-portrait-summary';
import CarPortraitTrack from '../../components/for-app/car-portrait-track/car-portrait-track';

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
    this.setState({
      carId
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
      <View className="portrait container">
        <CarPortraitSummary carId={this.state.carId}></CarPortraitSummary>
        <CarPortraitTrack carId={this.state.carId}></CarPortraitTrack>
      </View>
    )
  }
}
export default Portrait as ComponentClass<PageOwnProps, PageState>
