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
    if (temp[nameList[i]]) {
      temp = temp[nameList[i]]
    } else {
      return undefined
    }
  }
  return temp
}
