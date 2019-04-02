import Taro, { Component } from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'

import './icon-label-card.scss'
interface IconLabelCardPropTypes {
  label?: string,
  content: string,
  iconUrl: string,
  className?: string
}

export default class IconLabelCard extends Component<IconLabelCardPropTypes> {
  static externalClasses = ['ext-item-clz', 'ext-img-box-clz', 'ext-img-clz', 'ext-txt-box-clz', 'ext-txt-label-clz', 'ext-txt-content-clz', 'ext-txt-text-clz'];
  static defaultProps = {
    label: 'who?',
    content: '-',
    iconUrl: '',
    className: ''
  };

  // constructor(props, context){
  //   super(props, context);
  // }

  state = {
  }

  componentWillReceiveProps (nextProps) {
  }

  componentDidMount () {

  }

  render () {
    let { label, content, iconUrl } = this.props;
    return(
      <View className="ico-image-item flex ext-item-clz">
        <View className="icon-box flex ext-img-box-clz">
          <Image className="img ext-img-clz" src={iconUrl} mode="aspectFit" lazy-load="false" />
        </View>
        <View className="txt-box flex flex-column ext-txt-box-clz">
          <View className="t1 ext-txt-label-clz">{label}</View>
          <View className="t2 ext-txt-content-clz"><Text className="ext-txt-text-clz">{content}</Text></View>
        </View>
      </View>
    );
  }
}