import Taro, { Component } from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import * as echarts from '../../plugins/ec-canvas/echarts';
import TaroEchart from '../../base-components/taro-echart/taro-echart'

import './dashboard-chart-energy.scss'

interface DashboardChartEnergyPropTypes {
  dashBoardEnergy?: object,
  sendTime?: string,
  mileage?: number
}

export default class DashboardChartEnergy extends Component<DashboardChartEnergyPropTypes> {
  static defaultProps = {
    dashBoardEnergy: {},
    sendTime: '',
    mileage: 0
  }

  state = {
    ec: {
      lazyLoad: true,
    },
    sendTime: ''
  }
  energyChart = null;
  energyOption = {};

  componentWillReceiveProps (nextProps) {
    let dashBoardEnergy = nextProps.dashBoardEnergy;
    this.state.sendTime = nextProps.sendTime;
    this.bindEngryOption(dashBoardEnergy.speedVal, dashBoardEnergy.SOCVal, dashBoardEnergy.speedDeg, dashBoardEnergy.SOCDeg);
  }

  componentWillMount () {
  }

  componentDidMount () {
    setTimeout(() => {
      this.refs.dashboardEnergy.init((...args) => {
        this.initDashboardEnergy(...args);
      });
    }, 0)

  }

  render () {
    let {dashBoardEnergy} = this.props;

    return(
      <View className="energyDashboard">
        {dashBoardEnergy.gears && <Text className="gears">{dashBoardEnergy.gears}</Text>}
        <TaroEchart
          ref="dashboardEnergy"
          lazyLoad={true}
          className="dashboard-canvas"
        >
        </TaroEchart>
      </View>
    );
  }

  initDashboardEnergy (canvas, width, height) {
    let chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    chart.setOption(this.energyOption);
    this.energyChart = chart;
    return chart;
  }

  bindEngryOption(speedVal = 0, SOCVal = 0, speedDeg, SOCDeg) {
    if (!speedDeg || speedDeg === 225) speedDeg = 224.9;
    if (!SOCDeg || SOCDeg === 225) SOCDeg = 224.9;
    let obj = {
      backgroundColor: 'rgba(0,0,0,0)',
      title: {
        text: '更新时间：' + this.state.sendTime,
        textStyle: {
          color: '#999',
          fontSize: 10
        },
        left: 15,
        top: 10
      },
      series: [
        {
          name: '速度',
          type: 'gauge',
          min: 0,
          max: 255,
          center: ['30%', '68%'],
          splitNumber: 11,
          radius: '51%',
          silent: true,
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 0,
              color: [[1, '#4F91FF']]
            }
          },
          axisLabel: {            // 坐标轴小标记
            show: false
          },
          axisTick: {            // 坐标轴小标记
            length: 2,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: '#999',
            }
          },
          splitLine: {           // 分隔线
            length: 5,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              width: 1,
              color: '#999'
            }
          },
          pointer: {           // 分隔线
            width: 1,
            color: '#4475FD'
          },
          title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontSize: 10,
              color: '#999',
              padding: [2, 6],
              backgroundColor: '#F2F2F2',
              borderRadius: 7
            }
          },
          detail: {
            offsetCenter: ['0', '60%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 24,
              color: '#444'
            },
            formatter: function (v) {
              let a = '--';
              if (v === undefined || v === null || isNaN(v)) v = a;
              return [v, '{x|KM/H}'].join('\n');
            },
            rich: {
              x: {
                fontSize: 8,
                color: '#999'
              }
            }
          },
          data: [{ value: speedVal, name: '速度' }]
        },
        {
          name: 'SOC',
          type: 'gauge',
          min: 0,
          max: 100,
          center: ['71.5%', '68%'],
          splitNumber: 11,
          radius: '51%',
          silent: true,
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 0,
              color: [[1, '#5DDFAD']]
            }
          },
          axisLabel: {            // 坐标轴小标记
            show: false
          },
          axisTick: {            // 坐标轴小标记
            length: 2,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
              color: '#999',
            }
          },
          splitLine: {           // 分隔线
            length: 5,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              width: 1,
              color: '#999'
            }
          },
          pointer: {           // 分隔线
            width: 1,
            color: '#4475FD'
          },
          title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontSize: 10,
              color: '#999',
              padding: [2, 6],
              backgroundColor: '#F2F2F2',
              borderRadius: 7
            }
          },
          detail: {
            offsetCenter: [0, '60%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 24,
              color: '#444'
            },
            formatter: function (v) {
              let a = '--';
              if (v === undefined || v === null || isNaN(v)) v = a;
              return [v, '{x|%}'].join('\n');
            },
            rich: {
              x: {
                fontSize: 8,
                color: '#999'
              }
            }
          },
          data: [{ value: SOCVal, name: 'SOC' }]
        },
        {
          name: '速度圆环',
          type: 'gauge',
          min: 0,
          max: 255,
          center: ['30%', '68%'],
          endAngle: speedDeg,    // 控制圆环终点
          splitNumber: 0,
          radius: '54%',
          silent: true,
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 2,
              color: [[1, '#4F91FF']]  // 指针颜色
            }
          },
          pointer: {
            show: false
          },
          axisLabel: {            // 坐标轴小标记
            show: false
          },
          axisTick: {            // 坐标轴小标记
            show: false
          },
          splitLine: {           // 分隔线
            show: false
          },
          title: {
            show: false
          },
          detail: {
            show: false
          },
          data: []
        },
        {
          name: 'SOC圆环',
          type: 'gauge',
          min: 0,
          max: 100,
          center: ['71.5%', '68%'],
          endAngle: SOCDeg,    // 控制圆环终点
          splitNumber: 0,
          radius: '54%',
          silent: true,
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 2,
              color: [[1, '#5DDFAD']]  // 指针颜色
            }
          },
          pointer: {
            show: false
          },
          axisLabel: {            // 坐标轴小标记
            show: false
          },
          axisTick: {            // 坐标轴小标记
            show: false
          },
          splitLine: {           // 分隔线
            show: false
          },
          title: {
            show: false
          },
          detail: {
            show: false
          },
          data: []
        }
      ]
    };
    this.energyOption = obj;
    return obj
  }
}