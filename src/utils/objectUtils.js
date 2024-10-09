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


/**
 * 合并变量
 * @param env1
 * @param env2
 * @return {any[]|{}|*}
 */
export function mergeEnv(env1, env2) {
  if (env1 === null) {
    return clone(env2)
  }
  if (env2 === null) {
    return clone(env1)
  }
  let result = {}
  let env1Keys = Object.getOwnPropertyNames(env1)
  for (let i = 0; i < env1Keys.length; i++) {
    result[env1Keys[i]] = env1[env1Keys[i]]
  }
  let env2Keys = Object.getOwnPropertyNames(env2)
  for (let i = 0; i < env2Keys.length; i++) {
    result[env2Keys[i]] = env2[env2Keys[i]]
  }
  return result
}

/**
 * 克隆
 * @param obj
 * @return {any[]|{}|*}
 */
function clone(obj) {
  if (obj instanceof Array) {
    return cloneArray(obj)
  } else if (obj instanceof Object) {
    return cloneObject(obj)
  } else {
    return obj
  }
}

function cloneObject(obj) {
  let result = {}
  let names = Object.getOwnPropertyNames(obj)
  for (let i = 0; i < names.length; i++) {
    result[names[i]] = clone(obj[names[i]])
  }
  return result
}

function cloneArray(obj) {
  let result = new Array(obj.length)
  for (let i = 0; i < obj.length; i++) {
    result[i] = clone(obj[i])
  }
  return result
}

