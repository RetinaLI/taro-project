/**
 * 时间秒数格式化
 * @param s 时间戳（单位：秒）
 * @returns {*} 格式化后的时分秒
 */
let secToTime = (s) => {
  let t;
  if (s > -1) {
    let hour = Math.floor(s / 3600);
    let min = Math.floor(s / 60) % 60;
    // let sec = s % 60;
    // if (hour < 10) {
    //   t = '0' + hour + '时';
    // } else {
    //   t = hour + '时';
    // }
    t = hour + '时';
    if (min < 10) {
      t += '0';
    }
    t += min + '分';
    // if (sec < 10) {
    //   t += '0';
    // }
    // t += sec.toFixed(2);
  }
  return t;
};

export default secToTime;
