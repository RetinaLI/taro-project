import Taro, { Component } from '@tarojs/taro'
import {View, Image} from '@tarojs/components'

import './icon-label-card/icon-label-card.scss'
interface IconLabelCardPropTypes {
  label?: string,
  list: any[]
}

export default class Sunzi extends Component<IconLabelCardPropTypes> {
  static defaultProps = {
    label: 'who?',
    list: []
  };

  // constructor(props, context){
  //   super(props, context);
  // }

  state = {
  }

  componentWillReceiveProps (nextProps) {
    console.info('nextProps  ', nextProps.label);
  }

  componentDidMount () {

  }

  render () {
    return(
      <View className="ico-image-item flex">
        {this.props.label}====={this.props.list[0].a}

      </View>
    );
  }
}