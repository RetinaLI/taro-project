import ajaxProvider from '../providers/ajax';

import fault1 from '../assets/realtime/fault1.png';
import faultRed1 from '../assets/realtime/fault1_red.png';
import fault2 from '../assets/realtime/fault2.png';
import faultRed2 from '../assets/realtime/fault2_red.png';
import fault3 from '../assets/realtime/fault3.png';
import faultRed3 from '../assets/realtime/fault3_red.png';
import fault4 from '../assets/realtime/fault4.png';
import faultRed4 from '../assets/realtime/fault4_red.png';
import fault5 from '../assets/realtime/fault5.png';
import faultRed5 from '../assets/realtime/fault5_red.png';
import fault6 from '../assets/realtime/fault6.png';
import faultRed6 from '../assets/realtime/fault6_red.png';
import engine1 from '../assets/realtime/engine1.png';
import engine2 from '../assets/realtime/engine2.png';
import engine3 from '../assets/realtime/engine3.png';
import engine4 from '../assets/realtime/engine4.png';
import engine5 from '../assets/realtime/engine5.png';
import carbodyDoorOff from '../assets/realtime/carbody_door_off.png';
import carbodyDoorOn from '../assets/realtime/carbody_door_on.png';
import carbodyHandOff from '../assets/realtime/carbody_hand_off.png';
import carbodyHandOn from '../assets/realtime/carbody_hand_on.png';
import carbodyLockOff from '../assets/realtime/carbody_lock_off.png';
import carbodyLockOn from '../assets/realtime/carbody_lock_off.png';
import carbodyAirOff from '../assets/realtime/carbody_air_off.png';
import carbodyAirOn from '../assets/realtime/carbody_air_on.png';
import carbodyLoadOff from '../assets/realtime/carbody_load_off.png';
import carbodyLoadOn from '../assets/realtime/carbody_load_on.png';

class CarService {
  // 车辆列表
  async getList (params = {}) {
    let result = await ajaxProvider.request('getList', params);
    return result;
  }

  async getBrands () {
    let result = await ajaxProvider.request('getBrands');
    return result;
  }

  async getTypes (params) {
    let result = await ajaxProvider.request('getTypes', params);
    return result.list;
  }

  async getSearchList (params) {
    let result = await ajaxProvider.request('getSearchList', params);
    return result;
  }

  async getBatteryList (params) {
    let result = await ajaxProvider.request('getBatteryList', params);
    return result;
  }

  async getDriveMotorList (params) {
    let result = await ajaxProvider.request('getDriveMotorList', params);
    return result;
  }

  async getEnergyWranInfo(params) {
    let result = await ajaxProvider.request('getEnergyWranInfo', params);
    return result;
  }

  async getPortraitData(params) {
    let result = await ajaxProvider.request('getPortraitData', params);
    return result;
  }

  async getDetail() {

  }

  // import fault1 from '/assets/realtime/fault1.png';

  // 车辆详情-实时
  async getRealTimeInfo (params = {}) {
    let result = await ajaxProvider.request('getRealTimeInfo', params);
    let list = result.list;
    let codeMap = [
      {
        code: '1010097',
        img: fault1,
        imgRed: faultRed1,
        txt: '空滤正常',
        txtRed: '空滤阻塞报警',
        isRed: false
      },
      {
        code: '1010098',
        img: fault2,
        imgRed: faultRed2,
        txt: '水温正常',
        txtRed: '水温过高报警',
        isRed: false
      },
      {
        code: '2003',
        img: fault3,
        imgRed: faultRed3,
        txt: '天线正常',
        txtRed: 'GNSS天线未接或被剪断',
        isRed: false
      },
      {
        code: '8020026',
        img: fault4,
        imgRed: faultRed4,
        txt: '制动液位正常',
        txtRed: '制动液位低报警',
        isRed: false
      },
      {
        code: '8020069',
        img: fault5,
        imgRed: faultRed5,
        txt: '冷却液位正常',
        txtRed: '冷却液位低报警',
        isRed: false
      },
      {
        code: '8020066',
        img: fault6,
        imgRed: faultRed6,
        txt: '转向液位正常',
        txtRed: '转向液位低报警',
        isRed: false
      },
      {
        code: '1010008',
        name: '机油液位',
        value: '--',
        img: engine1
      },
      {
        code: '1010069',
        name: '蓄电池电压',
        value: '--',
        img: engine2
      },
      {
        code: '1010006',
        name: '机油温度',
        value: '--',
        img: engine3
      },
      {
        code: '1010020',
        name: '尿素液位',
        value: '--',
        img: engine4
      },
      {
        code: '1010068',
        name: '冷却液位',
        value: '--',
        img: engine5
      },
      {
        code: '8080027',
        name: '车门状态',
        value: '',
        imgOff: carbodyDoorOff,
        imgOn: carbodyDoorOn,
        isOn: false
      },
      {
        code: '1010038',
        name: '手刹状态',
        value: '',
        imgOff: carbodyHandOff,
        imgOn: carbodyHandOn,
        isOn: false
      },
      {
        code: '8080025',
        name: '门锁状态',
        value: '',
        imgOff: carbodyLockOff,
        imgOn: carbodyLockOn,
        isOn: false
      },
      {
        code: '2020001',
        name: '空调状态',
        value: '',
        imgOff: carbodyAirOff,
        imgOn: carbodyAirOn,
        isOn: false
      },
      {
        code: '8080023',
        name: '车载状态',
        value: '',
        imgOff: carbodyLoadOff,
        imgOn: carbodyLoadOn,
        isOn: false
      },
      {
        code: '1010027',
        name: '速度',
        value: '--'
      },
      {
        code: '1020002',
        name: '油耗',
        value: '--'
      },
      {
        code: '80802298',
        name: '转速',
        value: '--'
      },
      {
        code: oilCode,
        name: '油量',
        value: '--'
      },
      {
        code: '1010010',
        name: '水温',
        value: '--'
      },
      {
        code: '1110045',
        name: 'SOC',
        value: '--'
      },
      {
        code: '1120080',
        name: '档位',
        value: ''
      },
      {
        code: '1110043',
        name: '总电压',
        value: '--'
      },
      {
        code: '1110044',
        name: '总电流',
        value: '--'
      },
    ];
    let faultsCode = ['1010097', '1010098', '2003', '8020026', '8020069', '8020066'];
    let engineCode = ['1010008', '1010069', '1010006', '1010020', '1010068'];
    let carBodyInfo = ['8080027', '1010038', '8080025', '2020001', '8080023'];
    let oilCode = ['8020016', '8020078', '8020080', '8020017', '8020007', '8020079'];
    let dashBoard = ['1010027', '1020002', '80802298', oilCode, '1010010', '1110045', '1120080', '1110043', '1110044'];
    let voltage = [];
    let data = [];
    data = codeMap.map(v => {
      if(typeof(v.code) != 'string') {
        for (let item of oilCode) {
          let oilItem = list.find(o => o.code === item);
          if(oilItem) {
            if(oilItem.value != '') {
              v.value = +oilItem.value;
              v.code = oilItem.code;
              break;
            } else {
              v.code = '8020079';
              v.value = ''
            }
            v.value = (item.value === "" || item.value == null) ? '--' : Math.round(item.value);
          }
        }
      } else {
        let item = list.find(m => m.code === v.code);
        if (item) {
          if (faultsCode.indexOf(v.code) > -1) {
            if (item.value === "1") v.isRed = true;
          }
          if (engineCode.indexOf(v.code) > -1) {
            if (item.code === '1010006') {
              if (item.sendTime) {
                let sendTime = new Date(Date.parse(item.sendTime.replace(/-/g, '/'))).getTime();
                // 机油温度大于三十一分钟显示0
                if ((result.info - sendTime) > 1860*1000) {
                  item.value = '';
                }
              } else {
                item.value = '';
              }
            }
            v.value = (item.value === "" || item.value == null) ? '--' : Math.round(item.value) + item.unit;
          }
          if (carBodyInfo.indexOf(v.code) > -1) {
            if (item.value === '0') {
              v.value = 'OFF';
              v.isOn = false;
            } else {
              v.value = 'ON';
              v.isOn = true;
            }
            if(item.code === '8080025') {
              if(item.value === '0') {
                v.value = 'ON';
                v.isOn = true;
              }else {
                v.value = 'OFF';
                v.isOn = false;
              }
            }
            if (item.code === "8080023") {
              switch (item.value) {
                case "0":
                  v.value = '空载';
                  v.isOn = true;
                  break;
                case "1":
                  v.value = '半载';
                  v.isOn = true;
                  break;
                case "2":
                  v.value = '重载';
                  v.isOn = false;
                  break;
                case "3":
                  v.value = '超载';
                  v.isOn = false;
                  break;
              }
            }
          }
          if (dashBoard.indexOf(v.code) > -1) {
            //1010027速度 1020002瞬时油耗 80802298转速 1010010水温
            if (item.code === '1010027' || '1020002' || '80802298' || '1010010') {
              if (item.sendTime) {
                let lastLocaTime = new Date(Date.parse(item.sendTime.replace(/-/g, '/'))).getTime();
                // 大于三十一分钟显示0
                if ((result.info - lastLocaTime) > 1860*1000) {
                  item.value = '';
                }
              } else {
                item.value = '';
              }
            }
            v.value = (item.value === "" || item.value == null) ? '--' : Math.round(item.value);
            if (item.code === '1120080') {
              v.value = (item.content === "" || item.content == null) ? '' : item.content;
            }
          }
        }
      }
      return v;
    });
    let obj = {
      faults: data.slice(0, 6),
      engine: data.slice(6, 11),
      carBodyInfo: data.slice(11, 16),
      dashBoard: data.slice(16)
    };
    return obj;
  }
  async getCarDetailInfo (params = {}) {
    let result = await ajaxProvider.request('getCarDetailInfo', params);
    if(!result.data) return {lastTimeShow: 0};
    let d = result.data.location;
    let carInfo = {
      mileage: d.mileage,
      address: result.data.location.address,
      timeUp: result.info,
      acc: d.acc,   // 0关 1开
      latitude: d.latitude,
      longitude: d.longitude,
      vin: result.data.carInfo.framenum,
      lastTimeShow: d.sendTime || 0,
      lpn: result.data.carInfo.lpn,
      id: result.data.carInfo.id,
      protocol: result.data.protocol
    }
    return carInfo;
  }
  async getWarnInfo(params = {}) {
    let result = await ajaxProvider.request('getWarnInfo', params);
    let arr = result.list.filter(v => v.isAlarm);
    return {
      list: arr
    };
  }
  // 车辆详情-画像
  async getPortraitScore (params = {}) {
    let r = await ajaxProvider.request('getPortraitScore', params);
    let obj = {
      score: r.data.totalGrade || 0,
      stars: [
        { name: '行驶里程', value: Math.round(r.data.mileageGrade / 20) },
        { name: '行驶时长', value: Math.round(r.data.runTimeGrade / 20) },
        { name: '夜间出行', value: Math.round(r.data.nightGrade / 20) },
        { name: '利用率', value: Math.round(r.data.useRateGrade / 20) }
      ]
    }
    return obj;
  }
  async getCitiesProportion (params = {}) {
    let result = await ajaxProvider.request('getCitiesProportion', params);
    return result;
  }
  async getPortraitDayNight (params = {}) {
    let result = await ajaxProvider.request('getPortraitDayNight', params);
    return {
      data: result
    };
  }
  async getPortraitAltitude (params = {}) {
    let result = await ajaxProvider.request('getPortraitAltitude', params);
    let {plain, hill, mountain, highland} = result.map;
    let sum = Number(plain) + Number(hill) + Number(mountain) + Number(highland);
    let arr = [
      {name: '平原', value: Math.round(plain / sum * 100)},
      {name: '丘陵', value: Math.round(hill / sum * 100)},
      {name: '山地', value: Math.round(mountain / sum * 100)},
      {name: '高原', value: Math.round(highland / sum * 100)}
    ];
    return {
      data: arr
    };
  }
  // 车辆详情-位置详情
  async getLocationPageInfo (params = {}) {
    let r1 = await ajaxProvider.request('getCarDetailInfo', {did: params.did});
    let r2 = await ajaxProvider.request('getRealTimeInfo', {carId: params.carId});
    let d = r1.data.location;
    if(!d) return {lastTimeShow: 0};
    let carInfo = {
      mileage: d.mileage,
      address: d.address,
      acc: d.acc,   // 0关 1开
      latitude: d.latitude,
      longitude: d.longitude,
      vin: r1.data.carInfo.framenum,
      lastTimeShow: d.sendTime,
      lpn: r1.data.carInfo.lpn,
      id: r1.data.carInfo.id,
      speed: 0
    };
    let speedItem = r2.list.find(v => v.code === '1010027');
    carInfo.speed = speedItem && Math.round(speedItem.value);
    return carInfo;
  }

  // 车辆详情-行程
  async getTripIndex(params = {}) {
    let result = await ajaxProvider.request('getTripIndex', params);
    return result;
  }
  async getTripIndexCreated(params = {}) {
    let result = await ajaxProvider.request('getTripIndexCreated', params);
    return result;
  }
  async getTripIndexList(params = {}) {
    let result = await ajaxProvider.request('getTripIndexList', params);
    return result;
  }
  async getTripMonth(params = {}) {
    let result = await ajaxProvider.request('getTripMonth', params);
    return result;
  }
  async getTripMonthList(params = {}) {
    let result = await ajaxProvider.request('getTripMonthList', params);
    return result;
  }
  async getTripDayMap(params = {}) {
    let result = await ajaxProvider.request('getTripDayMap', params);
    return result;
  }
  async getTripDayTime(params = {}) {
    let result = await ajaxProvider.request('getTripDayTime', params);
    return result;
  }
  async getFindByDay(params = {}) {
    let result = await ajaxProvider.request('getFindByDay', params);
    return result;
  }
  async getMonthProvince (params = {}) {
    let result = await ajaxProvider.request('getMonthProvince', params);
    let obj = {
      provinceCount: result.totalCount,
      list: result.listPair
    };
    return obj;
  }
  async getMonthCity (params = {}) {
    let result = await ajaxProvider.request('getMonthCity', params);
    let obj = {
      cityCount: result.totalCount,
      list: result.listPair
    };
    return obj;
  }
  async getTimeAddress (params = {}) {
    let result = await ajaxProvider.request('getTimeAddress', params);
    return result;
  }
}

export default new CarService();
