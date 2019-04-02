import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import CarService from '../../../services/car'

import './car-location-nav.scss'
import arrowRight from '../../../assets/realtime/arrow-right.png'
import locationIcon from '../../../assets/cars/location.png'

interface CarLocationNavPropTypes {
  carId?: string,
  did?: string
}

export default class CarLocationNav extends Component<CarLocationNavPropTypes> {
  static defaultProps = {
    carId: null,
    did: null
  };

  state = {
    position: {}
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillMount () {
    this.getCarDetailInfo();
  }

  async getCarDetailInfo() {
    let r = await CarService.getCarDetailInfo({did: this.props.did});
    let timesBefore;
    let nowTime = new Date().getTime();
    let lastLocaTime = 0;
    if (r.lastTimeShow) {
      lastLocaTime = new Date(Date.parse(r.lastTimeShow.replace(/-/g, '/'))).getTime();
      let timeAgo = nowTime - lastLocaTime;
      if (timeAgo < 0) {
        timesBefore = '1秒前';
      }
      let years = Math.floor(timeAgo / (1000 * 60 * 60 * 24 * 365));
      let days = Math.floor(timeAgo / (1000 * 60 * 60 * 24));
      let hours = Math.floor((timeAgo % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((timeAgo % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((timeAgo % (1000 * 60)) / 1000);
      if (years > 0) {
        timesBefore = years + '年前';
      } else if (years <= 0 && days > 0) {
        timesBefore = days + '天前';
      } else if (years <= 0 && days <= 0 && hours > 0) {
        timesBefore = hours + '小时前';
      } else if (years <= 0 && days <= 0 && hours <= 0 && minutes > 0) {
        timesBefore = minutes + '分钟前';
      } else {
        timesBefore = (seconds < 1 ? 1 : seconds) + '秒前';
      }
    }
    let position = {
      location: r.address,
      timesBefore: timesBefore,
      vin: r.vin,
      lpn: r.lpn
    };
    this.setState({
      position: position
    })
  }

  locationLink(vin, lpn e) {
    e.preventDefault();
    Taro.navigateTo({
      url: `location?did=${this.props.did}&carId=${this.props.carId}&vin=${vin}&lpn=${lpn}`
    })
  }

  render () {
    let {position} = this.state;

    return(
      <View>
        <View className="location flex" onClick={this.locationLink.bind(this, position.vin, position.lpn)}>
          <View className="t-box flex">
            <Image className="img icon_loca" src={locationIcon}/>
            <View className="t1">{position.location}</View>
          </View>
          <View className="t-box flex">
            <View className="t2">{position.timesBefore}</View>
            <Image className="img icon_arrow_right" src={arrowRight}/>
          </View>
        </View>
      </View>
    );
  }
}