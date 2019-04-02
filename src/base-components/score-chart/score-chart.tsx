import Taro, { Component } from '@tarojs/taro'
import * as echarts from '../../plugins/ec-canvas/echarts';
import TaroEchart from '../taro-echart/taro-echart'

import './score-chart.scss'
interface ScoreChartPropTypes {
  score?: number
}

export default class ScoreChart extends Component<ScoreChartPropTypes> {
  static defaultProps = {
    score: 0
  };

  state = {
    ec: {
      lazyLoad: true,
    },
  }
  chart = null;

  componentWillReceiveProps (nextProps) {
    let score = nextProps.score;
    let scoreColor = score > 59 ? '#10D988' : '#F3C414';
    let color = [scoreColor, '#eee'];
    this.initoption(score, color)
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
    chart.setOption(this.getOption(0, []));
    this.chart = chart;
    return chart;
  }

  getOption (score, color) {
    return {
      color: color,
      series: [
        {
          name: '综合得分',
          type: 'pie',
          silent: true,
          center: ['40%', '50%'],
          radius: ['65%', '75%'],
          labelLine: {
            show: false
          },
          label: {
            show: true,
            position: 'center',
            formatter: (p) => {
              if (p.name) {
                return [`{x|${p.value}} {y|分}`, '{z|综合得分}'].join('\n');
              } else {
                return '';
              }
            },
            padding: [20, 0, 0, 0],
            rich: {
              x: {
                color: '#eee',
                fontSize: 48,
                fontFamily: 'Arial'
              },
              y: {
                color: '#333',
                fontSize: 12,
                padding: [0, 0, 26, 0]
              },
              z: {
                color: '#555',
                fontSize: 10
              }
            }
          },
          data: [
            { name: '得分', value: score },
            { name: '', value: (100 - score) }
          ]
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