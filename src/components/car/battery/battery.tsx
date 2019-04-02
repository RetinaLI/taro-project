import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import CarService from '../../../services/car'
import IconLabelCardList from '../../../base-components/icon-label-card-list/icon-label-card-list'

import './battery.scss'
import arrowRight from '../../../assets/realtime/arrow-right.png'
import voltageIcon1 from '../../../assets/realtime/voltage1.png'
import voltageIcon2 from '../../../assets/realtime/voltage2.png'
import voltageIcon3 from '../../../assets/realtime/voltage3.png'
import voltageIcon4 from '../../../assets/realtime/voltage4.png'
import tempIcon1 from '../../../assets/realtime/temp1.png'
import tempIcon2 from '../../../assets/realtime/temp2.png'
import tempIcon3 from '../../../assets/realtime/temp3.png'
import tempIcon4 from '../../../assets/realtime/temp4.png'

interface BatteryPropTypes {
  carId?: string
}

export default class Battery extends Component<BatteryPropTypes> {
  static defaultProps = {
    carId: null
  };

  state = {
    batteryLen: '',
    voltage: [
      {
        img: voltageIcon1,
        name: '最高电压',
        value: '--',
      },
      {
        img: voltageIcon2,
        name: '最低电压',
        value: '--',
      },
      {
        img: voltageIcon3,
        name: '平均电压',
        value: '--',
      },
      {
        img: voltageIcon4,
        name: '采集个数',
        value: '--',
      }
    ],
    temperature: [
      {
        img: tempIcon1,
        name: '最高温度',
        value: '--',
      },
      {
        img: tempIcon2,
        name: '最低温度',
        value: '--',
      },
      {
        img: tempIcon3,
        name: '平均温度',
        value: '--',
      },
      {
        img: tempIcon4,
        name: '采集个数',
        value: '--',
      }
    ]
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillMount () {
    this.getBatteryLen();
    this.getVoltageList();
    this.getTemperatureList();
  }

  async getBatteryLen() {
    let batteryLen = '';
    let result = await CarService.getDriveMotorList({carId: this.props.carId});
    if (!result.list || result.list.length === 0) {
      return;
    };
    let item = result.list.find(m => m.code === '1110076');
    console.info('item',item)
    if (item) {
      if (item.content) {
        batteryLen = item.content + '个';
      } else {
        batteryLen = '';
      }
    }
    console.info('batteryLen:',batteryLen)
    this.setState({
      batteryLen: batteryLen
    })
  }

  // 电池电压详情
  async getVoltageList() {
    let result = await CarService.getBatteryList({carId: this.props.carId, code: '1110107'});
    if (!result || result.length === 0) {
      return;
    }
    let voltage = this.state.voltage;
    let list = result.filter(o => o.value).sort((a, b) => b.value - a.value);
    voltage[0].value = Number(list[0].value).toFixed(2) + 'V';
    voltage[1].value = Number(list[list.length - 1].value).toFixed(2) + 'V';
    voltage[3].value = list.length + '个';
    let value = 0;
    list.forEach(item => {
      value += Number(item.value);
    });
    voltage[2].value = (value / list.length).toFixed(2) + 'V';
    this.setState({
      voltage: voltage
    })
  }

  // 电池温度详情
  async getTemperatureList() {
    let result = await CarService.getBatteryList({carId: this.props.carId, code: '1110108'});
    if (!result || result.length === 0) {
      return;
    }
    let temperature = this.state.temperature;
    let list = result.filter(o => o.value).sort((a, b) => b.value - a.value);
    temperature[0].value = list[0].value + '°C';
    temperature[1].value = list[list.length - 1].value + '°C';
    temperature[3].value = list.length + '个';
    let value = 0;
    list.forEach(item => {
      value += Number(item.value);
    });
    temperature[2].value = (value / list.length).toFixed(2) + '°C';
    this.setState({
      temperature: temperature
    })
  }

  locationLink(carId, type, e) {
    e.preventDefault();
    Taro.navigateTo({
      url: `battery-detail?carId=${carId}&type=${type}`
    })
  }

  render () {
    let { batteryLen, voltage, temperature } = this.state;
    let voltageList = voltage.map(item => {
      return {
        key: item.name,
        label: item.name,
        iconUrl: item.img,
        content: item.value
      }
    });
    let tempList = temperature.map(item => {
      return {
        key: item.name,
        label: item.name,
        iconUrl: item.img,
        content: item.value
      }
    });

    return(
      <View className="part battery">
        <View className="title flex">
          <Text className="text">单体电池</Text>
          <Text className="text num">{batteryLen}</Text>
        </View>
        <View className="voltage">
          <View className="part-title" onClick={this.locationLink.bind(this, this.props.carId, 'voltage')}>
            <Text>电压详情</Text>
            <Image className="icon_arrow_right fr img" src={arrowRight} />
          </View>
          <IconLabelCardList
            list={voltageList}
            className="item-count two"
            ext-item-clz="list-item"
            ext-img-box-clz="img-box"
            ext-img-clz="img"
            ext-txt-label-clz="label"
            ext-txt-text-clz="content"
          ></IconLabelCardList>
        </View>
        <View className="temp">
          <View className="part-title" onClick={this.locationLink.bind(this, this.props.carId, 'temp')}>
            <Text>温度详情</Text>
            <Image className="icon_arrow_right fr img" src={arrowRight} />
          </View>
          <IconLabelCardList
            list={tempList}
            className="item-count two"
            ext-item-clz="list-item"
            ext-img-box-clz="img-box"
            ext-img-clz="img"
            ext-txt-label-clz="label"
            ext-txt-text-clz="content"
          ></IconLabelCardList>
        </View>
      </View>
    );
  }
}