import Taro, { Component } from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem, Label} from '@tarojs/components'
import * as echarts from '../../plugins/ec-canvas/echarts';
import TaroEchart from '../../base-components/taro-echart/taro-echart'
import { geoJson } from '../../plugins/ec-canvas/china';

import './map-list.scss'
interface MapListPropTypes {
  mapList?: object,
  mapData?: object,
  isCities?: boolean
}

export default class MapList extends Component<MapListPropTypes> {
  static defaultProps = {
    mapList: [],
    mapData: [],
    isCities: false
  }
  state = {
    ec: {
      lazyLoad: true,
      // onInit: this.initMapChart
    },
    list: [],
    mapScaleShow: false
  }
  mapOption = {};
  mapChart = null;


  componentWillReceiveProps (nextProps) {
    // console.log('map-list', this.props, nextProps);
    this.convertData(nextProps.mapData);
    this.initData(nextProps.mapList)
  }

  componentWillMount () {
    this.initMapOption();
  }

  componentDidMount () {
    this.refs.mapChart.init((...args) => {
      this.initMapChart(...args);
      this.convertData(this.props.mapData);
      this.initData(this.props.mapList)
    });
  }

  componentWillUnmount () {

  }

  componentDidShow () {

  }

  componentDidHide () {

  }

  render () {
    let { mapList, isCities } = this.props;
    let { list } = this.state;
    let renderList = null;
    if (list.length > 0) {
      if (list[0].length < 12 && mapList.length > 0) {
        renderList = (
          <View className="map-list-item">
            {list[0].map((item, index) =>
              <View id="item" className={`item ${index < 3 ? 'top3' : ''} ${isCities ? 'cities' : ''}`} key={index}>
                {index < 9
                  ? <b>{'0' + (index + 1)}.</b>
                  : <b>{ index + 1}.</b>
                }
                <label>{ item.name }</label>
                <text>{item.value}</text>
              </View>
            )}
          </View>
        )
      } else if (list.length > 1) {
        let $view = list.map((v, i) =>{
            let $items = v.map((item, index) =>
              <View id="item" className={`item ${index < 3 && i == 0 ? 'top3' : ''} ${isCities ? 'cities' : ''}`} key={index}>
                {index < 9 && i === 0
                  ? <b>{'0' + (index + 1 + i * 12)}.</b>
                  : <b>{ index + 1 + i * 12}.</b>
                }
                <Label className="list-name">{item.name}</Label>
                {!isCities && <Text className="list-num">{item.value}</Text>}
              </View>
            );
            return <SwiperItem key={i} className="map-list-item">
              {$items}
            </SwiperItem>
          }
        )
        renderList = (
          <View className="loop">
            <Swiper
              className="swiper"
              indicatorColor="rgba(68,117,253,0.2)"
              indicatorActiveColor="#4475FD"
              indicatorDots
              // autoplay
              // interval
              // duration
              >
              {$view}
            </Swiper>
          </View>
        )
      }
    }

    return(
      <View className="box">
        <View className="map-box">
          <TaroEchart
            ref="mapChart"
            lazyLoad={true}
            className="map-canvas"
            // onInit={this.initMapChart}
          >
          </TaroEchart>
          {this.state.mapScaleShow && <View className="map-scale">
            <Text className="low">低</Text>
            <i></i>
            <Text>高</Text>
          </View>}
        </View>
        <View className="map-list">
          {renderList}
        </View>
      </View>
    );
  }

  initMapChart (canvas, width, height) {
    echarts.registerMap('china', geoJson);
    let mapChart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(mapChart);
    this.mapChart = mapChart;
    return mapChart;
  }

  initMapOption () {
    let mapOption = {
      backgroundColor: 'rgba(0,0,0,0)',
      tooltip: {
        show: false
      },
      visualMap: {
        show: false,
        min: 0,
        max: 0,
        text: ['高', '低'],
        orient: 'horizontal',
        right: 40,
        itemWidth: 3,
        itemHeight: 25,
        padding: [5, 9],
        backgroundColor: 'rgba(68,117,253,0.05)',
        inRange: {
          color: ['rgba(68,117,253,0.1)', '#4475FD']
        },
        outOfRange: {
          colorAlpha: 0
        }
      },
      series: [
        {
          type: 'map',
          mapType: 'china',
          top: 10,
          bottom: 30,
          itemStyle: {
            normal: {
              areaColor: 'rgba(68,117,253,0.2)',
              borderWidth: 0
            },
            emphasis: {
              areaColor: 'rgba(68,117,253,0.2)'
            }
          },
          silent: true,
          data: [],
          markPoint: {
            label: {
              show: true,
              position: 'right',
              formatter: '{b}',
              fontSize: 9,
              lineHeight: 12,
              color: '#555',
              padding: [2, 5],
              backgroundColor: '#fff',
              borderRadius: 10
            },
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: 'blue'
            },
            data: []
          }
        }
      ]
    };
    this.mapOption = mapOption;
    return mapOption;
  }

  initData (mapList) {
    let list = mapList.map(v => {
      return {
        name: v.city || v.key || v.name,
        value: v.count || v.value
      }
    }).sort((a, b) => b.value - a.value);
    list = this.convertProvinceName(this.splitArr(list));
    this.setState({
      list: list
    })
  }

  convertData (data) {
    let d = [];
    let markPointData = [];
    d = this.convertProvinceName(data);
    d.sort((a, b) => b.value - a.value);
    let c = [];
    if (!this.props.isCities) {
      c = d.slice(0, 3);
    } else {
      c = d;
    }
    markPointData = c.map(v => {
      v.coord = geoJson.features.find(x => x.properties.name === v.name).properties.cp;
      return v;
    });

    let mapScaleShow = true;
    this.setState({
      mapScaleShow
    })
    if (d.length > 0) {
      this.mapOption.visualMap.max = d[0].value;
      this.mapOption.visualMap.min = d[d.length - 1].value;
    }
    this.mapOption.series[0].data = d;
    this.mapOption.series[0].markPoint.data = markPointData;
    if (this.mapChart) {
      this.mapChart.setOption(this.mapOption);
    }

    if (d.length < 2) {
      this.mapOption.visualMap.show = false;
    }
    if (!this.props.isCities) {
      data = this.splitArr(d);
    }
  }

  // 改省份名
  convertProvinceName (data) {
    return JSON.parse(JSON.stringify(data).replace(/[省|市|自治区|壮族自治区|回族自治区|维吾尔自治区|特别行政区]/g, ''));
  }

  // 按个数分割成二维数组
  splitArr (list, n) {
    let x = n || 12;
    let arr = [];
    list.forEach((v, i) => {
      let n = Math.floor(i / x);
      if (!Array.isArray(arr[n])) {
        arr[n] = [];
      }
      arr[n].push(v);
    });
    return arr;
  }

}