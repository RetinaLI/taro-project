import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './car-summary.scss'
import IconLabelCardList from '../icon-label-card-list/icon-label-card-list';

interface CarTripSummaryPropTypes {
  summaryTitle: string,
  list: any[]
}

export default class CarTripSummary extends Component<CarTripSummaryPropTypes> {
  static externalClasses = ['ext-part-clz']
  static defaultProps = {
    summaryTitle: '',
    list: []
  }

  // constructor(props, context){
  //   super(props, context);
  // }

  state = {}

  componentWillReceiveProps (nextProps) {
    console.info('car-summary nextProps ', nextProps);
  }

  componentDidMount () {
  }

  componentDidShow () {
  }

  render () {
    let resList = this.props.list.map((item, index) => {
      return {
        key: index,
        content: item.content,
        label: item.label,
        iconUrl: item.iconUrl
      };
    });
    return (
      <View className="part meter ext-part-clz">
        { this.props.summaryTitle && <View className="part-title">
            <Text>{this.props.summaryTitle}</Text>
          </View> }
        <View className="part-content">
          <IconLabelCardList
            list={resList}
            className="item-count two"
            ext-item-clz="list-item"
            ext-img-box-clz='img-box'
            ext-txt-label-clz="label"
            ext-txt-text-clz="content"
          ></IconLabelCardList>
        </View>
      </View>
    );
  }
}