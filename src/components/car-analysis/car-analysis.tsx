import Taro, { Component } from '@tarojs/taro'
import {View, Label, Progress, Text} from '@tarojs/components'
// import { AtNoticebar, AtButton } from 'taro-ui'

import './car-analysis.scss'
interface CarAnalysisPropTypes {
  carScaleData?: object
}

export default class CarAnalysis extends Component<CarAnalysisPropTypes> {
  static defaultProps = {
    carScaleData: []
  };

  state = {

  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }

  render () {
    let { carScaleData } = this.props;
    if (!carScaleData || carScaleData.length === 0) return

    // console.info('carScaleData', carScaleData)
    // let carScale = carScaleData.map((item, index) =>
    //   <View className="progress-box" key={index}>
    //     <Label className="car-name">
    //       <View className={item.showAnimate ? 'content' : ''}>{item.name}</View>
    //     </Label>
    //     <View className="progress" style={{width: (item.value/carScaleData[0].value)*200 + 'px'}}>
    //       <Progress percent={100} stroke-width={6} activeColor="#4F91FF" backgroundColor="#fff" border-radius={3}/>
    //     </View>
    //     <Text>{item.value}辆</Text>
    //   </View>
    // )
    return(
      <View>
        {/* {carScale} */}
        {carScaleData.map((item, index) => (
          <View className="progress-box" key={index}>
            {/* <AtNoticebar marquee>
              <View className={item.showAnimate ? 'content' : ''}>{item.name}</View>
            </AtNoticebar> */}
            <Label className="car-name">
              <View className={item.showAnimate ? 'content' : ''}>{item.name}</View>
            </Label>
            <View className="progress" style={{width: (item.value/carScaleData[0].value)*200 + 'px'}}>
              <Progress percent={100} stroke-width={6} activeColor="#4F91FF" backgroundColor="#fff" border-radius={3}/>
            </View>
            <Text className="progress-num">{item.value}辆</Text>
          </View>
        ))}
      </View>
    );
  }

}