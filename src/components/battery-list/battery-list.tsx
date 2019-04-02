import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './battery-list.scss'
interface BatteryListPropTypes {
  voltage?: object,
  temp?: object
}

export default class BatteryList extends Component<BatteryListPropTypes> {
  static defaultProps = {
    voltage: {},
    temp: {}
  };
  // constructor(props, context){
  //   super(props, context);
  // }

  state = {
  }

  componentWillReceiveProps (nextProps) {

  }

  render () {
    let { voltage, temp } = this.props;
    let name = null;
    let unit = null;
    let length = 0;
    let list = null;
    let listRender = null;
    let max = null;
    let min = null;
    if (voltage) {
      name = '电压';
      unit = 'V';
      length = voltage.length;
      list = voltage.list;
      max = voltage.max;
      min = voltage.min;
    } else {
      name = '温度';
      unit = '℃';
      length = temp.length;
      list = temp.list;
      max = temp.max;
      min = temp.min;
    }
    if (list) {
      listRender = list.map((item, index) => {
        return <View className="item">
          {(index + 1) < 10 ? <Text className="name">{name}{'0' + (index + 1)}</Text> : <Text className="name">{name}{index + 1}</Text>}
          <Text className={`item-num ${item.value === max ? 'max' : item.value === min ? 'min' : ''}`}>{item.value}{unit}</Text>
        </View>
      })
    }
    return(
      <View className="battery-box">
        <View className="title">
          <Text className="title-name">{name}数据列表</Text>
          <Text className="num">{length}项</Text>
        </View>
        <View className="list-box">
          {listRender}
        </View>
      </View>
    );
  }
}