import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'
import MapList from '../../components/map-list/map-list'
import profileService from '../../services/profile'

type PageOwnProps = {

}

type PageState = {

}

type IProps = PageOwnProps & PageState;

interface MapList {
  props: IProps;
}
class MapList extends Component {
  config: Config = {
    navigationBarTitleText: '首页',
    usingComponents: {
      // 'ec-canvas': '../components/taro-echart/ec-canvas'
    }
  }

  state = {
    ec: {
      lazyLoad: true,
      // onInit: this.lineChart
    },
    mapList: [],
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }

  componentWillMount () {
    this.initData();
  }

  componentDidMount () {

  }
  componentWillUnmount () { }

  async componentDidShow () {
  }

  componentDidHide () { }

  async initData () {
    this.bindProvinceCarInfo();
  }

  async bindProvinceCarInfo() {
    await this.getProvinceCarInfo();
  }

  // 各省车辆情况
  async getProvinceCarInfo() {
    this.setState({
      mapList: []
    });
    let mapList = [];
    let result = await profileService.getProvinceCarInfo();
    if (!result.objectList || result.objectList.length === 0) {
      return;
    }
    mapList = result.objectList.map(item => {
      return {
        name: item[0],
        value: item[1]
      };
    }).filter(value => value.name !== '');
    this.setState({
      mapList: mapList
    });
  }

  render () {
    return (
      <View>
        <MapList mapList={this.state.mapList} mapData={this.state.mapList}></MapList>
      </View>
    )
  }

}
export default MapList as ComponentClass<PageOwnProps, PageState>
