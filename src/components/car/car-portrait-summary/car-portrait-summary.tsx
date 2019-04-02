import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtRate } from 'taro-ui'
import CarService from '../../../services/car'
import ScoreChart from '../../../base-components/score-chart/score-chart'

import './car-portrait-summary.scss'

interface CarPortraitSummaryPropTypes {
  carId: string
}

export default class CarPortraitSummary extends Component<CarPortraitSummaryPropTypes> {
  static defaultProps = {
    carId: null
  }

  state = {
    score: 0,
    stars: []
  }

  componentWillReceiveProps (nextProps) {
    // console.info('nextProps ', nextProps);
  }

  componentWillMount () {
    this.getPortraitScore();
  }

  componentDidMount () {
  }

  componentDidShow () {
  }

  // 车体状况
  async getPortraitScore () {
    let r1 = await CarService.getPortraitScore({ carId: this.props.carId });
    let score = r1.score;   // 综合得分
    let stars = r1.stars;   // 星星
    this.setState({
      score: score,
      stars: stars,
    })
  }

  render () {
    let {stars, score} = this.state;

    console.info('stars', stars)

    let starsRender = stars.map((item, index) => {
      return <View className="item flex" key={index}>
        <View className="name">{item.name}:</View>
        <View className="star-box">
          <AtRate size='11' value={item.value} />
        </View>
      </View>
    });

    return (
      <View className="part car-info">
        <View className="part-title">
          <Text>车体状况</Text>
          <View className="part-main">
            <View className="scorechart">
              <ScoreChart score={score}></ScoreChart>
            </View>
            <View className="stars">
              {starsRender}
            </View>
          </View>
        </View>
      </View>
    );
  }
}