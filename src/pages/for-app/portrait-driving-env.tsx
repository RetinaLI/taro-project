import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CarPortraitDrivingEnv from '../../components/car/car-portrait-driving-env/car-portrait-driving-env'

type PageOwnProps = {

}

type PageState = {
}

type IProps = PageOwnProps & PageState;

interface PortraitDrivingEnv {
  props: IProps;
}


class PortraitDrivingEnv extends Component {
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
        <CarPortraitDrivingEnv carId={this.state.carId}></CarPortraitDrivingEnv>
      </View>
    )
  }
}
export default PortraitDrivingEnv as ComponentClass<PageOwnProps, PageState>
