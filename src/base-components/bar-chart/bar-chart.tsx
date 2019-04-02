import Taro, { Component } from '@tarojs/taro'
import {View} from '@tarojs/components'
import * as echarts from '../../plugins/ec-canvas/echarts';
import TaroEchart from '../taro-echart/taro-echart'

import './bar-chart.scss'
interface BarChartPropTypes {
  obj?: object
}

export default class BarChart extends Component<BarChartPropTypes> {
  static defaultProps = {
    obj: null
  };

  state = {
    ec: {
      lazyLoad: true,
    },
  }
  // option = {};
  chart = null;

  componentWillReceiveProps (nextProps) {
    let obj = nextProps.obj;
    this.initOption(obj.xAxisData, obj.seriesData, obj.name)
  }

  componentDidMount () {
    this.refs.chart.init((...args) => {
      this.initChart(...args);
    });
  }

  render () {
    return(
      <TaroEchart
        ref="chart"
        lazyLoad={true}
        // onInit={this.initChart}
      >
      </TaroEchart>
    );
  }

  initChart (canvas, width, height) {
    let chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    this.chart = chart;
    return chart;
  }

  initOption (xAxisData, seriesData, name) {
    let option = this.getBarOption(xAxisData, seriesData, name);
    if (this.chart) {
      this.chart.setOption(option);
    }
    return option;
  }

  getBarOption (xAxisData, seriesData, name) {
    return {
      title: {
        text: name || '暂无数据',
        textStyle: {
          fontSize: 14,
          color: '#333',
          align: 'center',
          fontWeight: 'bloder'
        },
        top: '8%',
        left: 'center'
      },
      backgroundColor: '#fff',
      animation: false,
      tooltip: {
        show: false,
        trigger: 'axis'
      },
      grid: {
        top: '30%',
        left:'15%',
        right:'15%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#eee'
          }
        },
        axisLabel: {
          color: '#333',
          fontSize: 12
        },
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        name: '占比(%)',
        nameTextStyle: {
          color: '#999'
        },
        axisLabel: {
          color: '#999',
          fontSize: 12,
          interval: 'auto'
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      series: [
        {
          type: 'bar',
          silent: true,
          itemStyle: {
            barBorderRadius: 5,
            normal: {
              label: {
                show: true,
                position: 'top',
                formatter: '{c}%'
              }
            }
          },
          barWidth: 10,
          data: seriesData
        }
      ]
    };
  }
}