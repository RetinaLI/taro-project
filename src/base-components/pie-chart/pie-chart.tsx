import Taro, { Component } from '@tarojs/taro'
import * as echarts from '../../plugins/ec-canvas/echarts';
import TaroEchart from '../taro-echart/taro-echart'

import './pie-chart.scss'
interface PieChartPropTypes {
  obj?: object
}

export default class PieChart extends Component<PieChartPropTypes> {
  static defaultProps = {
    obj: {}
  };

  state = {
    ec: {
      lazyLoad: true,
    },
  }
  chart = null;

  componentWillReceiveProps (nextProps) {
    let obj = nextProps.obj;
    this.initoption(obj.name, obj.data)
  }

  componentWillMount () {
  }

  componentDidMount () {
    // setTimeout(() => {
      this.refs.chart.init((...args) => {
        this.initchart(...args);
      });
    // }, 0)
  }

  render () {
    return(
      <TaroEchart
        ref="chart"
        lazyLoad={true}
        className="chart-pie"
      >
      </TaroEchart>
    );
  }

  initchart (canvas, width, height) {
    let chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    chart.setOption(this.getOption('', []));
    this.chart = chart;
    return chart;
  }

  getOption (name, data) {
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
      animation: false,
      backgroundColor: '#fff',
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{b}: {c}"
      },
      color: ['#4F91FF', '#FFBC52', '#3DE3A3', '#22BFFF', '#21CC6D'],
      series: [
        {
          type: 'pie',
          radius: ['40%', '45%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: true,
          silent: true,
          label: {
            normal: {
              show: true,
              padding: [0, 0],		// 控制标签移动
              formatter: '{num|{d}%} {time|{b}}',
              rich: {			// 富文本
                num: {
                  fontSize: 12,
                  color: '#333',
                  lineHeight: 20,
                  align: 'center'
                },
                time: {
                  fontSize: 12,
                  lineHeight: 20,
                  color: '#999',
                  align: 'center'
                }
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: true,
              smooth: false,
              length: 15,					// 第一条导视线长度
              length2: 15,				// 第二条导视线长度
              lineStyle: {
                color: '#999',
                width: 0.5
              }
            }
          },
          data: data || [{name: '暂无数据', value: 100}]
        }
      ]
    };
  }

  initoption (score, color) {
    let option = this.getOption(score, color)
    if (this.chart) {
      this.chart.setOption(option);
    }
    return option;
  }
}