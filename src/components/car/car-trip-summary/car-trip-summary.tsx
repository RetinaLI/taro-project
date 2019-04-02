import Taro, { Component } from '@tarojs/taro'

import './car-trip-summary.scss'
import CarSummary from '../../../base-components/car-summary/car-summary';

import carService from '../../../services/car';

import icon1 from '../../../assets/trip/oper-icon-01.png';
import icon2 from '../../../assets/trip/oper-icon-02.png';
import icon3 from '../../../assets/trip/oper-icon-03.png';
import icon4 from '../../../assets/trip/oper-icon-04.png';
import icon5 from '../../../assets/trip/oper-icon-05.png';
import icon6 from '../../../assets/trip/oper-icon-06.png';

interface CarTripSummaryPropTypes {
  carId: string
}

export default class CarTripSummary extends Component<CarTripSummaryPropTypes> {
  static defaultProps = {
    carId: null
  }

  // constructor(props, context){
  //   super(props, context);
  // }

  state = {
    list: [
      {
        label: '累计里程',
        content: '0',
        iconUrl: icon1,
        unit: 'km'
      },
      {
        label: '累计时长',
        content: '0',
        iconUrl: icon2,
        unit: 'h'
      },
      {
        label: '累计行驶',
        content: '0',
        iconUrl: icon3,
        unit: '天'
      },
      {
        label: '监控天数',
        content: '0',
        iconUrl: icon4,
        unit: '天'
      },
      {
        label: '平均速度',
        content: '0',
        iconUrl: icon5,
        unit: 'km/h'
      },
      {
        label: '利用率',
        content: '0',
        iconUrl: icon6,
        unit: '%'
      }
    ]
  }

  componentWillReceiveProps (nextProps) {
    // console.info('car-trip-summary nextProps ', nextProps);
  }

  componentDidMount () {
  }

  componentDidShow () {
    this.bindData();
  }

  async bindData () {
    let result = await carService.getTripIndex({ carId: this.props.carId });
    let data = await carService.getTripIndexCreated({ carId: this.props.carId });
    // console.info('bindData', result);
    let list = this.state.list;
    list[0].content = result.map.TT_MILEAGE || 0;
    list[1].content = result.map.TT_WORK_TIME || 0;
    list[2].content = result.map.TT_WORK_DAYS || 0;
    list[4].content = result.map.TT_AVG_VELOCITY || 0;
    list[5].content = result.map.TT_WORK_PERCENT || 0;
    if (data.code === 200 && data.data.created) {
      list[3].content = parseInt(Math.abs(
        new Date(data.data.created.replace(/-/g, '/')).getTime() - (new Date()).getTime()) / 1000 /
        60 / 60 / 24 + '') + '';
    }

    this.setState({
      list: list
    });
  }

  render () {
    let resList = this.state.list.map((item) => {
      return {
        content: item.content + item.unit,
        label: item.label,
        iconUrl: item.iconUrl
      };
    });
    return (
        <CarSummary summary-title="运营概况" list={resList}></CarSummary>
      );
  }
}