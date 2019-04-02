import Taro, { Component } from '@tarojs/taro'
import {View, Image} from '@tarojs/components'

import './icon-label-card/icon-label-card.scss'
import Sunzi from './sunzi';
interface IconLabelCardPropTypes {
  label?: string,
  list: any[]
}

export default class Child extends Component<IconLabelCardPropTypes> {
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
        {this.props.label}-------
        <Sunzi label={this.props.label} list={this.props.list}></Sunzi>
      </View>
    );
  }
}