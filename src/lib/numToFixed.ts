let numToFixed = (num, n = 0) => {
  // 保留一位
  return (Math.round(num * 10) / 10).toFixed(n);
};

export default numToFixed;
