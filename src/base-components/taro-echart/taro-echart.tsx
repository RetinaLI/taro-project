import Taro, { Component } from '@tarojs/taro'
import {Canvas, View} from '@tarojs/components'
import WxCanvas from '../../plugins/ec-canvas/wx-canvas'
import * as echarts from '../../plugins/ec-canvas/echarts'

import './taro-echart.scss'
interface TaroEchartPropTypes {
  lazyLoad?: boolean,
  onInit?: (canvas: any, width: number, height: number) => {},
}

let uuid = 1;

export default class TaroEchart extends Component<TaroEchartPropTypes> {
  static defaultProps = {
    lazyLoad: false,
    onInit: () => {}
  };
  static propTypes = {
    // onInit: PropTypes.any,
  };

  state = {
    showCanvas: false,
    canvasId: 'aaa' + Date.now() + (++uuid),
    showMask: true
  };
  canvas?: any;
  chart: any;

  init(callback?: Function) {
    this.setState({
      showCanvas: true
    }, () => {
      let query;
      if (process.env.TARO_ENV === 'h5') {
        query = Taro.createSelectorQuery().in(this);
      } else {
        query = Taro.createSelectorQuery().in(this.$scope);
      }
      let canvasId = this.state.canvasId;
      query.select('#' + canvasId).boundingClientRect().exec(res => {
        console.info('res.width', res[0].width)
        console.info('res.height', res[0].height)
        if (!res || !res[0]) return;
        const canvasWidth = res[0].width;
        const canvasHeight = res[0].height;
        if (process.env.TARO_ENV === 'h5') {
          this.canvas = document.getElementById(canvasId);
          this.canvas.setChart = () => {};
          // console.info(this.canvas.offsetWidth, this.canvas.offsetHeight);
        } else {
          const ctx = Taro.createCanvasContext(this.state.canvasId, this.$scope);
          this.canvas = new WxCanvas(ctx);
        }
        echarts.setCanvasCreator(() => {
          return this.canvas;
        });

        if (typeof callback === 'function') {
          this.chart = callback(this.canvas, canvasWidth, canvasHeight);
        } else if (!this.props.lazyLoad && this.props.onInit) {
          this.chart = this.props.onInit(this.canvas, canvasWidth, canvasHeight);
        } else {
          // this.$emit('ready', canvas, res.width, res.height, (chart) => {
          //   this.chart = chart;
          // });
        }
      });
    });
  }

  componentWillMount () {
    this.setState({
      showCanvas: false
    });
    if (this.props.lazyLoad) {
    } else {
      setTimeout(() => {
        this.init();
      }, 1);
    }
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  touchStart(e){
    if (this.canvas) {
      this.canvas.emitEvent('touchstart', [e]);
    }
  }
  touchMove(e){
    if (this.canvas) {
      this.canvas.emitEvent('touchmove', [e]);
    }
  }
  touchEnd(e){
    if (this.canvas) {
      this.canvas.emitEvent('touchend', [e]);
    }
  }
  press(e){
    if (this.canvas) {
      this.canvas.emitEvent('press', [e]);
    }
  }

  render () {
    const id = this.state.canvasId;

    if (this.state.showCanvas) {
      if (process.env.TARO_ENV === 'h5') {
        return <canvas id={id}  className='ec-canvas'></canvas>;
      } else {
        return (
          <View className="charts-box">
            <Canvas
              className="ec-canvas" canvasId={id}
              id={id}
              // onTouchStart={this.touchStart.bind(this)}
              // onTouchMove={this.touchMove.bind(this)}
              // onTouchEnd={this.touchEnd.bind(this)}
              // onLongPress={this.press.bind(this)}
            />
          </View>
        )
      }
    }
  }
}