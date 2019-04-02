import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './car-engine-env-info.scss'
import IconLabelCardList from '../../../base-components/icon-label-card-list/icon-label-card-list';

// import carService from '../../services/car';

interface CarEngineEnvInfoPropTypes {
  list: any[]
}

export default class CarEngineEnvInfo extends Component<CarEngineEnvInfoPropTypes> {
  static defaultProps = {
    list: []
  }

  // constructor(props, context){
  //   super(props, context);
  // }

  state = { }

  componentWillReceiveProps (nextProps) {
    // console.info('car-trip-summary nextProps ', nextProps);
  }

  componentDidMount () {
  }

  componentDidShow () {
    // this.bindData();
  }

  async bindData () {
    // let result = await carService.getTripIndex({ carId: this.props.carId });
    // // console.info('bindData', result);
    // let list = this.state.list;
    // list[0].content = result.map.TT_MILEAGE;

    // this.setState({
    //   list: list
    // });
  }

  render () {
    let list = this.props.list.map((item, index) => {
      return {
        key: item.name,
        label: item.name,
        iconUrl: item.img,
        content: item.value
      }
    });

    return (
      <View className="part meter">
        <View className="part-title">
          <Text>发动机工况</Text>
        </View>
        <View className="part-content">
          <IconLabelCardList
            list={list}
            className="item-count two"
            ext-item-clz="list-item"
            ext-img-box-clz="img-box"
            ext-img-clz="img"
            ext-txt-label-clz="label"
            ext-txt-text-clz="content" ></IconLabelCardList>
        </View>
      </View>
    );
  }
}