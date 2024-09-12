/**
 * 获取属性值
 * @param obj 对象
 * @param name 属性名 (a.b.c 的格式)
 * @return {*}
 */
export function getValue(obj, name) {
  if (!obj) {
    return obj
  }
  let nameList = name.split('.')
  let temp = obj
  for (let i = 0; i < nameList.length; i++) {
    if (temp[nameList[i]] != null) {
      temp = temp[nameList[i]]
    } else {
      return undefined
    }
  }
  return temp
}

/**
 * 设置属性值
 * @param {Object} obj 对象
 * @param {string} name 属性名 (a.b.c 的格式)
 * @param value 值
 */
export function setValue(obj, name, value) {
  if (!obj) return
  let attrList = name.split('.')
  let temp = obj
  for (let i = 0; i < attrList.length - 1; i++) {
    if (temp[attrList[i]]) {
      temp = temp[attrList[i]]
    } else {
      return
    }
  }
  if (temp[attrList[attrList.length - 1]] != null) {
    temp[attrList[attrList.length - 1]] = value
  }
}
