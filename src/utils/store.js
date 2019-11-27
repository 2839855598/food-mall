/* localStorage的存储和读取*/
// seller为所有商家， 具体id为 具体商家
export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__;
  if(!seller) {
    seller = {};
    seller[id] = {};
  } else {
    // 存储的值都为String，需要转为对象
    seller = JSON.parse(seller);
    if(!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  // 存储的值必须为字符串类型
  window.localStorage.__seller__ = JSON.stringify(seller);
}

// defaults是读取不到时候的默认值
export function loadFromLocal(id, key, defaults) {
  let seller = window.localStorage.__seller__;
  if(!seller) {
    return defaults;
  }
  seller = JSON.parse(seller);
  if(!seller[id]) {
    return defaults;
  }
  let value = seller[id][key];
  if(!value) {
    return defaults;
  }
  return value;
}
