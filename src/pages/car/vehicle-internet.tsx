import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CarService from '../../services/car'
import config from '../../config';
import { connect } from 'react-redux';

import { Picker } from 'taro-ui'
import './vehicle-internet.scss'
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

interface VehicleInternet {
  props: IProps;
}

// @connect({
//   platform (state) {
//     return state.profile.platform;
//   }
// })


class VehicleInternet extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '车辆列表',
    usingComponents: {
    }
  }

  state = {
    contentHight: 600,
    showEnd: false,
    // canReachSearchBottom: true,
    carsList: [],
    showList: true,
    multiArray: [['品牌'], ['型号']],
    multiIndex: [0, 0],
    showLoadingIcon: true,
    defaultImage: 'default',
    imgUrl: config.carThumbnailPrevPath
  }

  multiValue = [];
  multiTypeArr = [];
  canUseReachBottom = true;
  pageIndex = 0;
  pageSize = 10;
  currentCarBrand;
  currentCarType;
  brandiId = 0;
  totalPage = 0;
  loadingData = false;
  brandKeyArr = [];
  brandValArr = [];
  userSelectBrand;
  userSelectType;

  mixins = [];
  multiLoading = false;

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps);
  }

  componentWillMount () {
  }

  componentDidMount () {
  }
  componentWillUnmount () { }

  async componentDidShow () {
  }

  componentDidHide () { }

  render () {
    return (
      <View className="container">
        <View class="weui-flex search-box" >
          {/* <Picker class="multiSelector" mode="multiSelector" value = "{{multiIndex}}" range = {this.state.multiArray} onChange={this.bindMultiPickerChange} @columnchange='bindMultiPickerColumnChange' @cancel="cancelChange">
            <label class="box">
              <span class="label brands">{{ multiArray[0][multiIndex[0]]}}<span class="arrow"></span> </span>
              <span class="label types">{{ multiArray[1][multiIndex[1]] }}<span class="arrow"></span></span>
            </label>
          </Picker> */}
          {/* <navigator url="search" class="search"> */}
            {/* <View class="placeholder">
              <Image src="../../assets/cars/search@2x.png" class='search-icon'></Image>
            </View> */}
          {/* </navigator> */}
        </View>
      </View>
    )
  }

  async bindMultiPickerChange (e) {
    this.multiIndex = e.detail.value;
    this.pageIndex = 0;
    if (e.detail.value[0] === 0 && e.detail.value[1] === 0) {
      this.currentCarBrand = null;
      this.currentCarType = null;
    };

    if (e.detail.value[0] === 0) {
      this.currentCarBrand = null;
    } else {
      this.currentCarBrand = this.brandValArr[e.detail.value[0]];
    }
    if (e.detail.value[1] === 0) {
      this.currentCarType = null;
    } else {
      this.currentCarType = this.multiValue[e.detail.value[1]];
    }

    this.userSelectBrand = this.currentCarBrand;
    this.userSelectType = this.currentCarType;
    await this.getList();
  },

  async getList() {
    if (this.loadingData) return;
    this.loadingData = true;
    let result = await CarService.getList({
      'pager.pageNo': this.pageIndex,
      'pager.pageSize': this.pageSize,
      'Q_t.carInfo.carType.carBrand.id_L_EQ': this.currentCarBrand,
      'Q_t.carInfo.carType.id_L_EQ': this.currentCarType,
    });

    this.totalPage = Math.ceil(result.totalCount / this.pageSize);

    if (result.mapList && result.mapList.length > 0) {
      this.state.showList = true;
      let temArr = result.mapList;
      temArr.forEach((val) => {
         // 车牌号优化
        let lpn = val.lpn;
        if (lpn) {
          let char1 = lpn.slice(0, 2);
          let char2 = lpn.substr(2);
          val.lpn = char1 + ' ' + char2;
        }
        val.errNum = 0;

        // vin优化
        let framenum = val.framenum;
        if (framenum) {
          val.framenum = framenum.slice(-8);
        }

        // 匹配车辆图片
        if (val.carBrandId && val.carTypeId) {
          val.carTypeId = val.carBrandId + '-' + val.carTypeId;
        }

        let nowTime = new Date().getTime();
        let lastLocaTime = 0;
        if (val.sendTime) {
          lastLocaTime = new Date(Date.parse(val.sendTime.replace(/-/g, '/'))).getTime();
          val.sendTime = lastLocaTime;
        } else if (val.LASTTIME) {
          lastLocaTime = new Date(Date.parse(val.LASTTIME.replace(/-/g, '/'))).getTime();
          val.sendTime = lastLocaTime;
        } else {
          return;
        }

        let timeAgo = nowTime - val.sendTime;
        if (timeAgo < 0) {
          val.sendTime = '1秒前';
          return;
        }
        let years = Math.floor(timeAgo / (1000 * 60 * 60 * 24 * 365));
        let days = Math.floor(timeAgo / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeAgo % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeAgo % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeAgo % (1000 * 60)) / 1000);
        if (years > 0) {
          val.sendTime = years + '年前';
        } else if (years <= 0 && days > 0) {
          val.sendTime = days + '天前';
        } else if (years <= 0 && days <= 0 && hours > 0) {
          val.sendTime = hours + '小时前';
        } else if (years <= 0 && days <= 0 && hours <= 0 && minutes > 0) {
          val.sendTime = minutes + '分钟前';
        } else {
          val.sendTime = seconds + '秒前';
        }

      });
      if (this.pageIndex === 0) {
        this.state.carsList = temArr;
      } else {
        let arr = [...this.state.carsList, ...temArr];
        this.state.carsList = arr;
      };
      this.pageIndex++;
      if (this.pageIndex >= this.totalPage) {
        this.canUseReachBottom = false;
        this.state.showEnd = true;
        // this.$apply();
      } else {
        this.canUseReachBottom = true;
        this.state.showEnd = false;
      }

    } else {
      this.loadingData = false;
      this.state.showList = false;
    };
    this.loadingData = false;
    {/* this.$apply(); */}
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default VehicleInternet as ComponentClass<PageOwnProps, PageState>
