import Taro, { Component } from '@tarojs/taro'
import {View} from '@tarojs/components'
import * as echarts from '../../plugins/ec-canvas/echarts'
import TaroEchart from '../taro-echart/taro-echart'

import './dashboard-chart.scss'

interface DashboardChartPropTypes {
  dashBoard?: object,
  sendTime?: string
}

export default class DashboardChart extends Component<DashboardChartPropTypes> {
  static defaultProps = {
    dashBoard: {},
    sendTime: ''
  }

  state = {
    ec: {
      lazyLoad: true,
    }
  }
  chart = null;
  option = {};

  componentWillReceiveProps (nextProps) {
    let dashBoard = nextProps.dashBoard;
    this.bindOption(dashBoard.speedVal, dashBoard.roundVal, dashBoard.oilVal, dashBoard.speedDeg, dashBoard.roundDeg, dashBoard.oilDeg, nextProps.sendTime);
  }

  componentWillMount () {

  }

  componentDidMount () {
    setTimeout(() => {
      this.refs.dashboard.init((...args) => {
        this.initDashboard(...args);
      });
    }, 0)

  }

  render () {
    return(
      <View className="dashboard">
        <TaroEchart
          ref="dashboard"
          lazyLoad={true}
          className="dashboard-canvas"
        >
        </TaroEchart>
      </View>
    );
  }

  initDashboard (canvas, width, height) {
    let chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    chart.setOption(this.option);
    this.chart = chart;
    return chart;
  }

  bindOption(speedVal = 0, roundVal = 0, oilVal = 0, speedDeg, roundDeg, oilDeg, sendTime) {
    if (!speedDeg || speedDeg === 225) speedDeg = 224.9;
    if (!roundDeg || roundDeg === 225) roundDeg = 224.9;
    if (!oilDeg || oilDeg === 225) oilDeg = 224.9;
    let obj = {
      backgroundColor: 'rgba(0,0,0,0)',
      title: {
        text: '更新时间：' + sendTime,
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
          center: ['50%', '48%'],
          splitNumber: 11,
          radius: '62%',
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
            offsetCenter: [0, '60%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 24,
              color: '#444'
            },
            formatter: function (v) {
              let a = '--';
              if (v === undefined || v === null || isNaN(v)) v = a;
              return [v, '{x|km/h}'].join('\n');
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
          name: '转速',
          type: 'gauge',
          min: 0,
          max: 3600,
          center: ['17%', '53%'],
          splitNumber: 8,
          radius: '47%',
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
              fontSize: 17,
              color: '#444'
            },
            formatter: function (v) {
              let a = '--';
              if (v === undefined || v === null || isNaN(v)) v = a;
              return [v, '{x|r/min}'].join('\n');
            },
            rich: {
              x: {
                fontSize: 8,
                color: '#999'
              }
            }
          },
          data: [{ value: roundVal, name: '转速' }]
        },
        {
          name: '瞬时油耗',
          type: 'gauge',
          min: 0,
          max: 126,
          center: ['83.5%', '53%'],
          radius: '47%',
          splitNumber: 7,
          silent: true,
          axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              width: 0,
              color: [[1, '#FCAD6A']]
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
          pointer: {           // 指针
            width: 1,
            color: '#4475FD'
          },
          title: {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontSize: 10,
              color: '#999',
              padding: [3, 6],
              backgroundColor: '#F2F2F2',
              borderRadius: 7
            }
          },
          detail: {
            offsetCenter: [0, '60%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 17,
              color: '#444'
            },
            formatter: function (v) {
              let a = '--';
              if (v === undefined || v === null || isNaN(v)) v = a;
              return [v, '{x|l/h}'].join('\n');
            },
            rich: {
              x: {
                fontSize: 8,
                color: '#999'
              }
            }
          },
          data: [{ value: oilVal, name: '瞬时油耗' }]
        },
        {
          name: '速度圆环',
          type: 'gauge',
          min: 0,
          max: 255,
          center: ['50%', '48%'],
          endAngle: speedDeg,    // 控制圆环终点
          splitNumber: 0,
          radius: '66%',
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
          name: '转速圆环',
          type: 'gauge',
          min: 0,
          max: 3600,
          endAngle: roundDeg,
          center: ['17%', '53%'],
          splitNumber: 0,
          radius: '50%',
          silent: true,
          axisLine: {            // 坐标轴线
            lineStyle: {
              width: 2,
              color: [[1, '#5DDFAD']]
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
          name: '油耗圆环',
          type: 'gauge',
          min: 0,
          max: 126,
          endAngle: oilDeg,
          center: ['83%', '53%'],
          splitNumber: 0,
          radius: '50%',
          silent: true,
          axisLine: {            // 坐标轴线
            lineStyle: {
              width: 2,
              color: [[1, '#FCAD6A']]
            }
          },
          pointer: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
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
    this.option = obj;
    return obj;
  }
}