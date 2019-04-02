import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import RealTime from './real-time'
import TripIndex from './trip-index'
import Portrait from './portrait'
import './car-detail.scss'
type PageOwnProps = {
}

type PageState = {
}

type IProps = PageOwnProps & PageState;

interface CarDetail {
  props: IProps;
}

class CarDetail extends Component {
  config: Config = {
    navigationBarTitleText: '车辆详情',
    usingComponents: {
    }
  }

  state = {
    currentTab: 0,
    carId: '',
    protocol: ''
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }

  componentWillMount () {
  }

  componentDidMount () {
  }
  componentWillUnmount () { }

  componentDidShow () {
    this.setState({
      carId: this.$router.params.carId,
      protocol: this.$router.params.protocol
    });
  }

  componentDidHide () { }

  handleClick (value) {
    this.setState({
      currentTab: value
    });
  }

  render () {
    const tabList = [{ title: '实时' }, { title: '行程' }, { title: '画像' }];

    return (
      <View className="container">
        <AtTabs current={this.state.currentTab} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.currentTab} index={0} >
            <RealTime></RealTime>
          </AtTabsPane>
          <AtTabsPane current={this.state.currentTab} index={1}>
            <TripIndex carId={this.state.carId} protocol={this.state.protocol}></TripIndex>
          </AtTabsPane>
          <AtTabsPane current={this.state.currentTab} index={2}>
            <Portrait></Portrait>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
export default CarDetail as ComponentClass<PageOwnProps, PageState>
