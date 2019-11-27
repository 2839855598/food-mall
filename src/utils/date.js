// 格式化日期
export function formatDate(date, formatType) {
  // 如果格式是 yyyy 则显示 2015
  // 如果格式是 yy 则显示 15
  if(/(y+)/i.test(formatType)) {
    formatType = formatType.replace( RegExp.$1, (date.getFullYear() + '')
      .slice(4 - RegExp.$1.length));
  }

  const match = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for(let item in match) {
    let reg = null;
    // 日期转为字符串
    let str = match[item] + '';
    // 除了M和m，其他都可以大小写，比如 DD/dd,  HH/hh, SS/ss
    if(item === 'M+' || item === 'm+') {
      reg = new RegExp('('+item+')');
    } else {
      reg = new RegExp('('+item+')', 'i');
    }
    formatType = formatType.replace(reg, str.length === 1 ? toTwo(str) : str )
  }
  return  formatType;
}

function toTwo (str) {
  return ('00'+ str).slice(str.length);
}
