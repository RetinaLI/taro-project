import Taro, { Component } from '@tarojs/taro'
import {View} from '@tarojs/components'
import * as echarts from '../../plugins/ec-canvas/echarts';
import TaroEchart from '../taro-echart/taro-echart'

import './line-chart.scss'
interface LineChartPropTypes {
  xAxisData?: object,
  lineData?: object
}

export default class LineChart extends Component<LineChartPropTypes> {
  static defaultProps = {
    xAxisData: [],
    lineData: []
  };

  // constructor(props, context){
  //   super(props, context);
  // }

  state = {
    ec: {
      lazyLoad: true,
      // onInit: this.lineChart
    },
  }
  lineOption = {};
  lineChart = null;

  componentWillReceiveProps (nextProps) {
    let xAxisData = nextProps.xAxisData;
    let lineData = nextProps.lineData;
    this.initLineOption(xAxisData, lineData)
  }

  componentDidMount () {
    this.refs.lineChart.init((...args) => {
      this.initLineChart(...args);
    });
  }

  render () {
    return(
      <View className="chart-line">
        <TaroEchart
          ref="lineChart"
          lazyLoad={true}
          // onInit={this.initLineChart}
        >
        </TaroEchart>
      </View>
    );
  }

  initLineChart (canvas, width, height) {
    let lineChart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(lineChart);
    // console.info(1);
    lineChart.setOption(this.getOption([], []));
    this.lineChart = lineChart;
    return lineChart;
  }

  getOption (xAxisData, lineData) {
    let lineOption = {
      backgroundColor: '#fff',
      legend: {
        data: ['销量']
      },
      tooltip: {
        show: false
      },
      grid: {
        left: '5%',
        right: '11%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: {
        name: '(月份)',
        nameTextStyle: {
          fontSize: 9,
          padding: [25, 0, 0, 0],
          color: '#bbb'
        },
        type: 'category',
        splitLine: {show: true},
        boundaryGap: false,
        data: xAxisData,
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#999', // 左边线的颜色
            // opacity: 0.2,
            width: '1' // 坐标线的宽度
          }
        },
        axisLabel: {
          textStyle: {
            color: '#666', // 坐标值得具体的颜色
            nameRotate: 15,
            fontSize: 9
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        name: '(数量)',
        nameTextStyle: {
          fontSize: 9,
          // padding: [0, 40, 0, 0],
          color: '#bbb'
        },
        type: 'value',
        max: function(value) {
          return value.max + 30000;
        },
        splitNumber: 7,  // 坐标轴的分割段数
        minInterval: 1,  // 坐标轴最小间隔大小
        splitLine: {show: true}, // 去除网格线
        splitArea: {show: false},
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#999', // 左边线的颜色
            // opacity: 0.2,
            width: '1' // 坐标线的宽度
          }
        },
        axisLabel: {
          formatter: function(value) { return Math.floor(value / 1000) + 'K'; },
          textStyle: {
            color: '#666', // 坐标值得具体的颜色
            fontSize: 9
          }
        },
        axisTick: {
          show: false // 刻度值
        }
      },
      series: [{
        name: '',
        type: 'line',
        stack: '总量',
        symbol: 'none',
        smooth: true,
        silent: true,
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: '{c}'
          }
        },
        itemStyle: {
          label: {
            show: true
          },
          normal: {
            lineStyle: {
              width: 2, // 0.1的线条是非常细的了
              color: '#4475FD' // 折线颜色
            }
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(86,130,254,0.4)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(67,116,252,0)' // 100% 处的颜色
            }],
            globalCoord: true // 缺省为 false
          }
        },
        data: lineData
      }]
    };
    return lineOption;
  }
  initLineOption (xAxisData, lineData) {
    // console.info(2);
    let lineOption = this.getOption(xAxisData, lineData);
    if (this.lineChart) {
      this.lineChart.setOption(lineOption);
    }
    return lineOption;
  }
}