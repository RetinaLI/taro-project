import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './car-body-info.scss'
import IconLabelCard from '../../../base-components/icon-label-card/icon-label-card';

// import carService from '../../services/car';

interface CarBodyInfoPropTypes {
  list: any[]
}

export default class CarBodyInfo extends Component<CarBodyInfoPropTypes> {
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
    let listRender = this.props.list.map((item, index) => {
      return <IconLabelCard
              class="item"
              key={String(item.name)}
              iconUrl={item.isOn ? item.imgOn : item.imgOff}
              content={item.isOn ? 'ON' : 'OFF'}
              label={item.name}
              ext-item-clz="list-item"
              ext-img-box-clz="img-box"
              ext-img-clz="img"
              ext-txt-label-clz="label"
              ext-txt-text-clz="content"
              ></IconLabelCard>
    });

    return (
      <View className="part meter">
        <View className="part-title">
          <Text>车体状态</Text>
        </View>
        <View className="part-content flex list-box">
          {listRender}
        </View>
      </View>
    );
  }
}