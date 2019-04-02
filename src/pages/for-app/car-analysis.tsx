import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'
import CarAnalysis from '../../components/car-analysis/car-analysis'
import profileService from '../../services/profile'

type PageOwnProps = {

}

type PageState = {

}

type IProps = PageOwnProps & PageState;

interface Index {
  props: IProps;
}

class Index extends Component {

  config: Config = {
    navigationBarTitleText: '首页',
    usingComponents: {
      // 'ec-canvas': '../components/taro-echart/ec-canvas'
    }
  }

  state = {
    carScaleData: []
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
    this.bindCarModelsInfo();
  }

  async bindCarModelsInfo() {
    await this.getCarModelsInfo();
    this.state.carScaleData.map((item, key) => {
      let textWidth = 0;
      let length = item.name.length * 11;
      setTimeout(() => {
        let query;
        if (process.env.TARO_ENV === 'h5') {
          query = Taro.createSelectorQuery().in(this);
        } else {
          query = Taro.createSelectorQuery().in(this.$scope);
        }
        query.select('.car-name').boundingClientRect((res) => {
          textWidth = res.width;
          console.info('textWidth', textWidth)
          console.info('length', length)
          if (length > textWidth) {
            item.showAnimate = true;
            console.info(item)
          }
          console.info('item11',item)
          this.setState(item);
        }).exec();
      }, 2000);
      console.info(item)
    });
  }

  // 各车型车辆数
  async getCarModelsInfo() {
    let result = await profileService.getCarModelsInfo();
    if (!result.list || result.list.length === 0) {
      return;
    }
    result.list.sort((a, b) => b.car_count - a.car_count);
    let carScaleData = result.list
      .filter(value => value.name !== '')
      .map(item => {
        return {
          name: item.car_brand_name + item.car_type_name,
          value: item.car_count,
          showAnimate: false,
        };
      });
    this.setState({
      carScaleData: carScaleData
    });
  }


  render () {
    return (
      <View>
        <CarAnalysis carScaleData={this.state.carScaleData}></CarAnalysis>
      </View>
    )
  }

  // 判断值是否存在函数
  isBlank(val) {
    if (val == null || val === '') {
      return true;
    }
  }

}

export default Index as ComponentClass<PageOwnProps, PageState>
