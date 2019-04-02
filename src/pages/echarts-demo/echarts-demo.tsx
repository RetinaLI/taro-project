import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import * as echarts from '../plugins/ec-canvas/echarts';
import TaroEchart from '../components/taro-echart/taro-echart'
import './index.scss'
// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion
type PageOwnProps = {

}

type PageState = {
}

type IProps = PageOwnProps & PageState;

interface Index {
  props: IProps;
}
let chart = null;
function initChart(canvas, width, height) {
  // console.info(e);
  console.info(canvas);
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    legend: {
      data: ['热度', '正面', '负面']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '热度',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: [300, 270, 340, 344, 300, 320, 310],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '正面',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true
          }
        },
        data: [120, 102, 141, 174, 190, 250, 220],
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
      {
        name: '负面',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'left'
          }
        },
        data: [-20, -32, -21, -34, -90, -130, -110],
        itemStyle: {
          // emphasis: {
          //   color: '#67e0e3'
          // }
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

class Index extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: 'echarts-demo',
    usingComponents: {
      // 'ec-canvas': '../components/taro-echart/ec-canvas'
    }
  }

  state = {
    ec: {
      onInit: initChart,
      // lazyLoad: true
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }

  componentWillMount () {
  }

  componentDidMount () {
    this.refs.aaa.init(initChart);
  }
  componentWillUnmount () { }

  async componentDidShow () {
  }

  componentDidHide () { }

  render () {
    return (
      <View className="container">
        <View className="echart-wrapper" ref="ccc">
          <TaroEchart
            ref="aaa"
            lazyLoad={true}
            // onInit={this.initChart}
          >
          </TaroEchart>
        </View>
      </View>
    )
  }

  initChart (canvas: any, width: number, height: number) {
    // console.info(e);
    initChart(canvas, width, height);
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
