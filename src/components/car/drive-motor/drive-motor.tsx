import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import CarService from '../../../services/car'
import IconLabelCardList from '../../../base-components/icon-label-card-list/icon-label-card-list'

import './drive-motor.scss'
import driveMotorIcon1 from '../../../assets/realtime/drive-motor1.png'
import driveMotorIcon2 from '../../../assets/realtime/drive-motor2.png'
import engineIcon3 from '../../../assets/realtime/engine3.png'
import driveMotorIcon4 from '../../../assets/realtime/drive-motor4.png'

interface DriveMotorPropTypes {
  carId?: string
}

export default class DriveMotor extends Component<DriveMotorPropTypes> {
  static defaultProps = {
    carId: null
  }

  state = {
    driveMotorLen: '',
    driveMotor: [
      {
        code: '1110033',
        img: driveMotorIcon1,
        name: '电机转矩',
        content: '--' || [],
      },
      {
        code: '1110036',
        img: driveMotorIcon2,
        name: '电机转速',
        content: '--' || [],
      },
      {
        code: '1110038',
        img: engineIcon3,
        name: '电机温度',
        content: '--' || [],
      },
      {
        code: '1110037',
        img: driveMotorIcon4,
        name: '控制器温度',
        content: '--' || [],
      }
    ]
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillMount () {
    this.getDriveMotorList();
  }

  async getDriveMotorList() {
    let result = await CarService.getDriveMotorList({carId: this.props.carId});
    if (!result.list || result.list.length === 0) {
      return;
    }
    let driveMotor = this.state.driveMotor;
    let list = result.list;
    let driveMotorLen = list.find(m => m.code === '1140015');
    if (driveMotorLen) {
      driveMotorLen = Number(driveMotorLen.content);
      let driveMotorCode = ['1110033', '1110036', '1110038', '1110037'];
      driveMotor.forEach(v => {
        let item = list.find(m => m.code === v.code);
        if (item) {
          if (driveMotorCode.indexOf(v.code) > -1) {
            if (driveMotorLen > 1) {
              item.content = item.content.split(',');
              v.content = item.content.map(value => {
                value = Number(value) + item.unit;
                return value;
              });
              return v;
            } else {
              if (RegExp(/,/).exec(item.content)) {
                item.content = '';
              }
              v.content = (item.content === '' || item.content == null || !item.content) ? '--' : Number(item.content) + item.unit;
              return v;
            }
          }
        }
      });
    }
    this.setState({
      driveMotor: driveMotor,
      driveMotorLen: driveMotorLen
    })
  }


  render () {
    let { driveMotorLen, driveMotor } = this.state;
    let lenList = '0'.repeat(driveMotorLen).split('');

    let list = driveMotor.map((item, index) => {
      return {
        key: item.name,
        label: item.name,
        iconUrl: item.img,
        content: item.content
      }
    });

    let driveMotorLenRender = lenList? lenList.map((value, i) => {
      return <View key={i}>
        <View className="part-title">
          <Text>驱动电机{i + 1}工况</Text>
        </View>
        <View className="part-main">
          <IconLabelCardList
            list={list}
            i={i}
            className="item-count two"
            ext-item-clz="list-item"
            ext-img-box-clz="img-box"
            ext-img-clz="img"
            ext-txt-label-clz="label"
            ext-txt-text-clz="content"
          ></IconLabelCardList>
        </View>
      </View>
    }) : null;

    return(
      <View className="part drive-motor">
        <View className="title flex">
          <Text className="text">驱动电机</Text>
          <Text className="text num">{driveMotorLen}个</Text>
        </View>
        {driveMotorLenRender}
      </View>
    );
  }
}