import Taro, { Component } from '@tarojs/taro'
import {View} from '@tarojs/components'
import IconLabelCard from '../icon-label-card/icon-label-card';

import './icon-label-card-list.scss'
interface IconLabelCardListPropTypes {
  list: {label: string, content: string | object, iconUrl: string, key: string | number}[],
  className?: string,
  i?: number
}

export default class IconLabelCardList extends Component<IconLabelCardListPropTypes> {
  static externalClasses = [
    'ext-item-clz',
    'ext-img-box-clz',
    'ext-img-clz',
    'ext-txt-box-clz',
    'ext-txt-label-clz',
    'ext-txt-content-clz',
    'ext-txt-text-clz'
  ];
  static defaultProps = {
    list: [],
    className: 'item-count three',
    i: null
  };

  state = {
  }

  componentWillReceiveProps (nextProps) {
    // console.info('nextProps, ', nextProps);
  }

  componentDidMount () {
  }

  render () {
    let {i} = this.props;
    let $listRender = this.props.list.map((item: { label: string, content: string | {}, iconUrl: string, key: string | number }) => {
      let content = typeof(item.content) === 'object'? item.content[i] : item.content;
      return <IconLabelCard
              class="item"
              ext-item-clz="ext-item-clz"
              ext-img-box-clz="ext-img-box-clz"
              ext-img-clz="ext-img-clz"
              ext-txt-box-clz="ext-txt-box-clz"
              ext-txt-label-clz="ext-txt-label-clz"
              ext-txt-content-clz="ext-txt-content-clz"
              ext-txt-text-clz="ext-txt-text-clz"
              key={String(item.key)}
              label={item.label}
              content={content}
              iconUrl={item.iconUrl}
            ></IconLabelCard>
    })
    return (
      <View className={`ico-image-list flex ` + this.props.className}>
        {$listRender}
      </View>
    );
  }
}