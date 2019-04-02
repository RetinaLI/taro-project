import Taro, { Component } from '@tarojs/taro'
import {View, CoverView, Map, Text} from '@tarojs/components'
import carService from '../../../services/car'
import * as echarts from '../../../plugins/ec-canvas/echarts';
import gcoord from 'gcoord';

import iconPath1 from '../../../assets/trip/icon-start.png';
import iconPath2 from '../../../assets/trip/icon-end.png';
import iconPath3 from '../../../assets/trip/tran.png';

import './car-day-driving-behavior-info.scss'
import TaroEchart from '../../../base-components/taro-echart/taro-echart';

interface CarDayDrivingBehaviorInfoPropTypes {
  carId?: string,
  framenum?: string,
  protocol: string,
  year: number,
  month: number,
  day: number,
  mileage: number,
  travelTime: number,
  avgVelocity: number,
  maxVelocity: number
}

export default class CarDayDrivingBehaviorInfo extends Component<CarDayDrivingBehaviorInfoPropTypes> {
  static defaultProps = {
    carId: null,
    framenum: null,
    protocol: null,
    year: (new Date()).getFullYear(),
    month: (new Date()).getMonth() + 1,
    day: (new Date()).getDate(),
    mileage: 0,
    travelTime: 0,
    avgVelocity: 0,
    maxVelocity: 0
  }

  state = {
    showMap: false,
    includePoints: [],
    markers: [],
    polyline: [],
    MAP_LINE_TITLE_COLOR: {
      RAPID_ACCELERATION: {
        iconText: '加',
        num: 0,
        name: '急加速',
        color: '#FF7D2A'
      }, // 急加速 扣2分 最高10分
      SERIOUS_OVER_SPEED: {
        iconText: '超',
        num: 0,
        name: '严重超速',
        color: '#6756FF'
      }, // 严重超速 5 10
      EXCEED_IDLE: {
        iconText: '怠',
        num: 0,
        name: '超长怠速',
        color: '#E33CD8'
      }, // 过长怠速 1 10
      SHARP_BRAKE: {
        iconText: '刹',
        num: 0,
        name: '急刹车',
        color: '#ECC600'
      }, // 急刹车 2 10
      LONG_BRAKE: {
        iconText: '长',
        num: 0,
        name: '超长刹车',
        color: '#00B6D0'
      }, // 过长刹车 2 10
      OVER_TURN_DRIVE: {
        iconText: '转',
        num: 0,
        name: '超转行驶',
        color: '#D16007'
      }, // 超转行驶
    }
  }
  chart = null;
  drivingBehaviorData = null
  locationList = [];
  polylines = [];

  canvas = null;
  canvasHeight = null;
  canvasWidth = null;
  dataLoaded = false;

  componentWillReceiveProps (nextProps) {

  }

  componentDidMount () {
    this.refs.chart.init((canvas, width, height) => {
      this.canvas = canvas;
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.renderRadarChart();
    });
  }

  componentDidShow () {
    this.bindData();
    this.bindBehavior();
  }

  async bindBehavior () {
    let data = await carService.getFindByDay({
      day: `${this.props.year}-${this.props.month}-${this.props.day}`,
      carId: this.props.carId,
    });
    if (data.code === 200) {
      let map = this.state.MAP_LINE_TITLE_COLOR;
      data.drivingBehaviorVoList.map(item => {
        map[item.type].num += 1;
      });
      this.setState({
        MAP_LINE_TITLE_COLOR: map
      });
    }
    this.drivingBehaviorData = data;
  }
  async bindData () {
    Taro.showNavigationBarLoading();
    let markers = [];
    let includePoints = [];
    let polyline = [];
    let polylines = [];
    let list = [];
    // 获取地图坐标
    let data = await carService.getTripDayMap({
      framenum: this.props.framenum,
      startTime: `${this.props.year}-${this.props.month}-${this.props.day} 00:00:00`,
      endTime: `${this.props.year}-${this.props.month}-${this.props.day} 23:59:59`,
    });
    if (data.code === 200) {
      Taro.hideNavigationBarLoading();
      // 优化返回数据
      list = data.list.filter(ele => ele.accOn).map(ele => {
        let result = gcoord.transform(
          [ele.longitude, ele.latitude],  // 经纬度坐标
          gcoord.BD09,  // 当前坐标系
          gcoord.GCJ02,  // 目标坐标
        );
        return {
          dataTime: ele.dataTime,
          longitude: result[0],
          latitude: result[1],
        };
      });
      // 保存路线，用于分段trip-day-tiem截取数据
      // wx.setStorageSync('map', JSON.stringify(this.list));
      let len = list.length;
      let mid = Math.floor(len / 2);
      includePoints = list;
      polylines[0] = {
        points: list.slice(0, mid),
        color: '#FF0000',
        width: 2,
        dottedLine: false,
      };
      // setTimeout(() => {
      polylines[1] = {
        points: list.slice(mid, len + 1),
        color: '#FF0000',
        width: 2,
        dottedLine: false,
      };
      // }, 30);
      polyline = polylines;

      let iconPath = '';
      list.forEach((ele, i) => {
        if (i === 0) {
          iconPath = iconPath1;
        } else if (i === len - 1) {
          iconPath = iconPath2;
        } else {
          iconPath = iconPath3;
        }
        Object.assign(ele, {
          id: i,
          iconPath,
          width: 21,
          height: 27,
          zIndex: 1 + i,
        });
      });

      markers = [
        list[0],
        list[len - 1],
      ];
    }
    this.locationList = list;
    this.polylines = polylines;
    this.renderRadarChart();
    this.setState({
      markers,
      polyline,
      includePoints,
      showMap: true
    });
  }

  render () {
    let showProtocol = this.props.protocol === 'ZKC02OV' || this.props.protocol === 'GBT32960';
    let map = this.state.MAP_LINE_TITLE_COLOR;
    let $list = Object.keys(map).map((key, index) => {
      let item = map[key];
      return <View className="map-line-title-item flex" key={String(key)} onClick={this.showDrivingBehavior.bind(this, key, index)}>
              <Text className="icon-txt" style={`background-color: ` + (item.num === 0 ? '#BBB' : item.color)}>{item.iconText}</Text>
              <Text className="d-count"style={`color: ` + (item.num === 0 ? '#AAA' : '#4F91FF')}>{item.num}</Text>
              <Text className="d-name"style={`color: ` + (item.num === 0 ? '#AAA' : '#4F91FF')}>{item.name}</Text>
            </View>
    });

    return (
      <View className="day-run part">
        <View className="day-run-title flex">
          <Text className="txt-title">今日行程</Text>
          { !showProtocol && <View className="day-run-btn flex" onClick={this.navigatorToDayTime}>
                  <Text className="btn-txt">分段行程</Text>
                  <Text className="foton-ui arr-icon right blue"></Text>
            </View> }
        </View>
        <View className="day-map">
          <View className="day-map-view">
            <Map id="day-map" className="day-map" include-points={this.state.includePoints}
                markers={this.state.markers} polyline={this.state.polyline}>
              { !this.state.showMap && <CoverView className="day-map-cover">
                  <CoverView className="map-loding">数据加载中...</CoverView>
                </CoverView> }
            </Map>
          </View>

          { !showProtocol && (<View className="map-line-title-list">
                  {$list}
              </View>)
          }
          { !showProtocol && ( <View className="map-echart flex">
                    <View className="map-radar">
                      <TaroEchart
                        ref="chart"
                        lazyLoad={true}
                        // onInit={this.initLineChart}
                      >
                      </TaroEchart>
                    </View>
                    <View className="map-echart-info">
                      <View className="map-echart-info-item">
                        <Text className="t1">行驶里程：</Text>
                        <Text className="t2">{this.props.mileage}km</Text>
                      </View>
                      <View className="map-echart-info-item">
                        <Text className="t1">行驶时长：</Text>
                        <Text className="t2">{this.props.travelTime}</Text>
                      </View>
                      <View className="map-echart-info-item">
                        <Text className="t1">平均速度：</Text>
                        <Text className="t2">{this.props.avgVelocity}km/h</Text>
                      </View>
                      <View className="map-echart-info-item">
                        <Text className="t1">最大速度：</Text>
                        <Text className="t2">{this.props.maxVelocity}km/h</Text>
                      </View>
                    </View>
              </View>
            )
          }
        </View>
      </View>
    );
  }
  renderRadarChart () {
    if (!this.canvas) return;
    let val = Object.keys(this.state.MAP_LINE_TITLE_COLOR).map(key => this.state.MAP_LINE_TITLE_COLOR[key].num);
    let max = Math.max(...val);
    let newVal = val.map(ele => {
      return ele + Math.ceil(max / 2);
    });

    let RAPID_ACCELERATION = this.state.MAP_LINE_TITLE_COLOR.RAPID_ACCELERATION.num * 2 > 10
      ? 10
      : this.state.MAP_LINE_TITLE_COLOR.RAPID_ACCELERATION.num * 2;
    let SHARP_BRAKE = this.state.MAP_LINE_TITLE_COLOR.SHARP_BRAKE.num * 2 > 10 ? 10 : this.state.MAP_LINE_TITLE_COLOR.SHARP_BRAKE.num * 2;
    let SERIOUS_OVER_SPEED = this.state.MAP_LINE_TITLE_COLOR.SERIOUS_OVER_SPEED.num * 5 > 10
      ? 10
      : this.state.MAP_LINE_TITLE_COLOR.SERIOUS_OVER_SPEED.num * 5;
    let EXCEED_IDLE = this.state.MAP_LINE_TITLE_COLOR.EXCEED_IDLE.num * 1 > 10 ? 10 : this.state.MAP_LINE_TITLE_COLOR.EXCEED_IDLE.num * 1;
    let LONG_BRAKE = this.state.MAP_LINE_TITLE_COLOR.LONG_BRAKE.num * 2 > 10 ? 10 : this.state.MAP_LINE_TITLE_COLOR.LONG_BRAKE.num * 2;
    let OVER_TURN_DRIVE = this.state.MAP_LINE_TITLE_COLOR.OVER_TURN_DRIVE.num * 3 > 10
      ? 10
      : this.state.MAP_LINE_TITLE_COLOR.OVER_TURN_DRIVE.num * 3;
    let codeNum = 100 - RAPID_ACCELERATION - SHARP_BRAKE -
      SERIOUS_OVER_SPEED - EXCEED_IDLE - LONG_BRAKE - OVER_TURN_DRIVE;
    // this.setOption(newVal, max, codeNum);
    let echartsRadarOption = {
      title: {
        text: codeNum,
        top: 'center',
        left: 'center',
        textStyle: {
          color: '#4475FD',
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      radar: {
        name: {
          color: '#bbb',
          fontSize: 10,
        },
        radius: '60%',
        nameGap: 2,
        splitNumber: 1,
        splitLine: {
          lineStyle: {
            color: '#bbb',
          },
        },
        indicator: [
          {name: '急加速', max: max + Math.ceil(max / 2) + 5},
          {name: '急刹车', max: max + Math.ceil(max / 2) + 5},
          {name: '严重超速', max: max + Math.ceil(max / 2) + 5},
          {name: '超长怠速', max: max + Math.ceil(max / 2) + 5},
          {name: '超长刹车', max: max + Math.ceil(max / 2) + 5},
          {name: '超转行驶', max: max + Math.ceil(max / 2) + 5},
        ],
      },
      series: [
        {
          name: '',
          type: 'radar',
          symbol: 'none',
          areaStyle: {
            color: '#E3EBFF',
          },
          lineStyle: {
            color: '#6790FD',
            type: 'dotted',
          },
          data: [
            {
              value: newVal,
            },
          ],
        },
      ],
    }
    let chart = echarts.init(this.canvas, null, {
      width: this.canvasWidth,
      height: this.canvasHeight
    });
    this.canvas.setChart(chart);
    // console.info(1);
    chart.setOption(echartsRadarOption);
    this.chart = chart;
    return chart;
  }
  navigatorToDayTime () {
    Taro.navigateTo({
      url: `./day-time-trip?y=${this.props.year}-${this.props.month}-${this.props.day}&carId=${this.props.carId}&framenum=${this.props.framenum}`
    });
  }
  showDrivingBehavior (key, index) {
    let markers = [];
    let polyline = [];
    let showDataMap = false;

    this.setState({
      markers,
      polyline
    });
    let marksDay = []; // 保存索引及异常类型

    // 找出异常行为线段集合[]
    let findByDays = this.drivingBehaviorData.drivingBehaviorVoList ? this.drivingBehaviorData.drivingBehaviorVoList : [];
    let findDay = findByDays.filter(ele => ele.type === key).map(item => {
      // 查出索引
      let start = this.locationList.findIndex((ele) => {
        return (new Date(item.startTime.replace(/-/g, '/')).getTime()) <=
          (new Date(ele.dataTime.replace(/-/g, '/')).getTime());
      });
      let end = this.locationList.findIndex((ele) => {
        return (new Date(item.endTime.replace(/-/g, '/')).getTime()) <=
          (new Date(ele.dataTime.replace(/-/g, '/')).getTime());
      });
      // 保存索引及异常类型
      if (start !== -1) {
        marksDay.push({
          start,
          type: item.type
        });
      }
      // 截取线段坐标
      return {
        points: this.locationList.slice(start, end + 1),
        color: this.state.MAP_LINE_TITLE_COLOR[item.type].color,
        width: 2,
        dottedLine: false,
      };
    });
    polyline = this.polylines;
    polyline = polyline.concat(findDay);
    let len = this.locationList.length;
    if (len > 1) {
      if (marksDay.length) {
        let newMarks = marksDay.map(ele => {
          if (ele.start >= 0) {
            return Object.assign(this.locationList[ele.start], {
              label: {
                content: this.state.MAP_LINE_TITLE_COLOR[ele.type].iconText,
                color: '#ffffff',
                padding: 3,
                anchorY: -17,
                anchorX: -7,
                borderRadius: 5,
                zIndex: 3,
                fontSize: 10,
                bgColor: this.state.MAP_LINE_TITLE_COLOR[ele.type].color,
              },
            });
          } else {
            return [];
          }
        });
        newMarks.push(this.locationList[0], this.locationList[this.locationList.length - 1]);
        markers = newMarks;
      }
    } else {
      markers = this.locationList;
    }
    this.setState({
      markers,
      polyline
    });
  }
}