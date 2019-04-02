module.exports = {
  // publicPath: 'mock-data/public',
  'routes': {
    // passport
    'login': {
      url: '/weixin/user!switchCompany.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/login.json',
    },
    'registUserByWeiXinUserInfo': {
      url: '/weixin/ma/login!register.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/register.json',
    },
    'uploadAvatar': {
      url: '/file!uploadFiles.do?moduleId=user_manage',
      method: 'post',
      isArray: false
    },
    'getCurrentUser': {
      url: '/nosecurity/weixin/user!getUserInfo.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/getUserInfo.json',
    },
    'getProfilePlatforms': {
      url: '/nosecurity/weixin/user!listCompanies.do',
      method: 'get',
      isArray: true,
      json: 'mock-data-json/platforms.json',
    },
    'addPlatform': {
      url: '/weixin/ma/login!bind.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/addPlatform.json',
    },
    'removePlatform': {
      url: '/weixin/user!unBind.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/unBind.json',
    },
    // 报告
    'getReportList': {
      url: '/business/subsc_file!listLinkedByPage.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/getReportList.json',
      paginationQueryConfig: {
        pageIndex: 'pager.pageNo',
        pageSize: 'pager.pageSize',
        startIndex: 1,
        listName: 'list'
      }
    },
    'getReportTypes': {
      url: '/business/subsc_template!listTemplateTypeByCompany.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/getReportTypes.json',
    },
    // 'getOneReport': {
    //   url: '/business/subsc_file!listLinkedByPage.do',
    //   method: 'get',
    //   isArray: true
    // },
    // 车辆详情-实时
    'getRealTimeInfo': {
      url: '/business/can_bus!listAnalysisCodes.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/realTimeInfo.json',
    },
    // 车辆详情-实时
    'getCarDetailInfo': {
      url: '/business/device!findByDid.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/carDetailInfo.json',
    },
    // 车辆详情-实时-电池电压温度列表
    'getBatteryList': {
      url: '/business/can_battery!listAllBatteryInfo.do',
      method: 'post',
      isArray: true,
      json: 'mock-data-json/listAllBatteryInfo.json',
    },
    // 车辆详情-实时-驱动电机工况
    'getDriveMotorList': {
      url: '/business/can_bus!listByCarId.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/warnInfoEnergy2.json',
    },
    // 车辆详情-实时
    'getWarnInfo': {
      url: '/business/can_bus!listByCarId.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/warnInfo.json',
    },

    // 'canBusListByCarId': {
    //   url: '/business/can_bus!listByCarId.do',
    //   method: 'post',
    //   isArray: false,
    //   json: 'mock-data-json/canBusListByCarId.json',
    //   renderFn: function(dataRes, req, res, ext) {
    //     // console.log('req',req)Z
    //     console.log('req.query',req.query)
    //     var typeCode = req.query.typeCode;
    //     console.log('typeCode',typeCode)
    //     if (typeCode) {
    //       res.status(200).send(data[typeCode]);
    //     }
    //   }
    // },
    // 车辆详情-画像
    'getPortraitScore': {
      url: '/business/device_stats!listByCarId.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/portraitScore.json',
    },
    'getCitiesProportion': {
      url: '/sas/car_tags!listByCar.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/listByCar.json',
    },
    'getPortraitDayNight': {
      url: '/sas/car_analysis!runPeriodAnalysis.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/runPeriodAnalysis.json',
    },
    'getPortraitAltitude': {
      url: '/sas/car_analysis!elevationAnalysis.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/elevationAnalysis.json',
    },
    'getPortraitData': {
      url: '/sas/capacity_stats!carAnalysis.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/capacityStats.json',
    },
    // 车辆列表
    'getList': {
      url: '/business/device!listBySQL.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/list.json',
      paginationQueryConfig: {
        pageIndex: 'pager.pageNo',
        pageSize: 'pager.pageSize',
        startIndex: 0,
        listName: 'mapList'
      }
    },
    // 品牌列表
    'getBrands': {
      url: '/common/car_brand!combo.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/car-brands.json',
    },
    // 型号列表
    'getTypes': {
      url: '/common/car_type!combo.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/typeList.json',
    },
    // 搜索列表
    'getSearchList': {
      url: '/business/car_info!listByVinOrLpn.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/searchList.json',
    },
    // 我的-修改用户名
    'updateUserName': {
      url: '/manage/user!save.do',
      method: 'post',
      isArray: false
    },
    // 'uploadFile': {
    //   url: '/file!uploadFiles.do',
    //   method: 'post',
    //   isArray: false
    // },
    'submitSuggest': {
      url: '/business/feedback!save.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/submitSuggest.json',
    },
    'getSubscribeConfig': {
      url: '/business/subsc_template!listByCurCompany.do',
      method: 'get',
      isArray: false
    },
    // 行程
    'getTripIndex': {
      url: '/sas/car_analysis!findRunInfo.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/findRunInfo.json',
    },
    'getTripIndexCreated': {
      url: '/business/car_info!get.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/carInfo.json',
    },
    'getTripIndexList': {
      url: '/sas/car_analysis!listRunRecord.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/listRunRecord.json',
    },
    'getTripMonth': {
      url: '/trip/getTripMonth',
      method: 'get',
      isArray: false
    },
    'getTripMonthList': {
      url: '/business/location_summary!findByMonth.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/findByMonth.json',
    },
    'getTripDayTime': {
      url: '/business/location_summary!findRunDetailByDaily.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/tripDayTime.json',
    },
    'getTripDayMap': {
      url: '/business/location!listByDid.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/tripDayMap.json',
    },
    'getMonthProvince': {
      url: '/sas/capacity_monthly!provinceTopAnalysis.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/provinceTopAnalysis.json',
    },
    'getMonthCity': {
      url: '/sas/capacity_monthly!cityTopAnalysis.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/cityTopAnalysis.json',
    },
    'getFindByDay': {
      url: '/business/driving_behavior_summary!findByDay.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/findByDay.json',
    },
    'getTimeAddress': {
      url: '/map/map!getAddressFromLonAndLat.do',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/getTimeAddress.json',
    },
    'editSubscribeConfig': {
      url: '/business/link_template_user!setWeixin.do',
      method: 'post',
      isArray: false
    },
    // 车辆概况
    'getCarSituation': {
      url: '/business/server_summary!onlineInfo.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/onlineInfo.json',
    },
    'getProvinceCarInfo': {
      url: '/business/device!findCountByProvince.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/findCountByProvince.json',
    },
    'getCarConfigurationInfo': {
      url: '/business/component!installByCarBrandDate.do',
      // url: '/business/component!installByCarBrandDate.do?dateType=2',
      method: 'get',
      isArray: false,
      json: 'mock-data-json/installByCarBrandDate.json',
    },
    'getCarModelsInfo': {
      url: '/sas/car_operation!listGroupByCarType.do',
      method: 'post',
      isArray: false,
      json: 'mock-data-json/listGroupByCarType.json',
    }
  }
}