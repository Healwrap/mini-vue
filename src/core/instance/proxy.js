import { renderData } from './render.js'
import { rebuild } from './mount.js'

/**
 * 获取命名空间
 * @param {string} nowNamesapce
 * @param {string} nowProp
 * @return {*|string}
 */
function getNamespace(nowNamesapce, nowProp) {
  if (nowNamesapce == null || nowNamesapce === '') {
    return nowProp
  } else if (nowProp == null || nowProp === '') {
    return nowNamesapce
  } else {
    return nowNamesapce + '.' + nowProp
  }
}

let arrayProto = Array.prototype

/**
 * 代理数组方法
 * @param {MiniVue} vm
 * @param {string} func
 * @param {Object} obj
 * @param {string} namespace
 * @return {*}
 */
function proxyArrayFunction(vm, func, obj, namespace) {
  Object.defineProperty(obj, func, {
    enumerable: true,
    configurable: true,
    value(...args) {
      let original = arrayProto[func]
      const result = original.apply(vm, args)
      console.log('代理数组方法')
      rebuild(vm, getNamespace(namespace, ''))
      renderData(vm, getNamespace(namespace, ''))
      return result
    },
  })
}

/**
 * 创建代理数组
 * @param {MiniVue} vm
 * @param {Array} arr
 * @param {string} namespace
 * @return {*|string}
 */
function constructArrayProxy(vm, arr, namespace) {
  let proxyObj = {
    eleType: 'Array',
    push() {
    },
    pop() {
    },
    shift() {
    },
    unshift() {
    },
    toString() {
      let result = ''
      for (let i = 0; i < arr.length; i++) {
        let temp = JSON.stringify(arr[i])
        if (i !== arr.length - 1) result += temp + ', '
        else result += temp
      }
      return `[${result}]`
    },
  }
  // 代理数组的方法，添加rebuild和renderData
  proxyArrayFunction.call(vm, vm, 'push', proxyObj, namespace)
  proxyArrayFunction.call(vm, vm, 'pop', proxyObj, namespace)
  proxyArrayFunction.call(vm, vm, 'shift', proxyObj, namespace)
  proxyArrayFunction.call(vm, vm, 'unshift', proxyObj, namespace)
  arr.__proto__ = proxyObj
  return arr
}

/**
 * 创建对象代理
 * @param {MiniVue} vm
 * @param {Object} obj
 * @param {string} namespace
 * @return {{}|*}
 */
function constructObjectProxy(vm, obj, namespace) {
  let proxyObj = {}
  for (let prop in obj) {
    // vm下_data的代理
    Object.defineProperty(proxyObj, prop, {
      configurable: true,
      enumerable: true,
      get() {
        return obj[prop]
      },
      set(newValue) {
        // 这里需要跟踪依赖
        console.log('===')
        obj[prop] = newValue
        renderData(vm, getNamespace(namespace, prop))
      },
    })
    // vm的代理
    Object.defineProperty(vm, prop, {
      configurable: true,
      enumerable: true,
      get() {
        return proxyObj[prop]
      },
      set(newValue) {
        proxyObj[prop] = newValue
        renderData(vm, getNamespace(namespace, prop))
      },
    })
    if (obj[prop] instanceof Object) {
      proxyObj[prop] = constructProxy(vm, obj[prop], getNamespace(namespace, prop))
    }
  }
  return proxyObj
}

/**
 * 创建代理
 * @param {MiniVue} vm MiniVue实例
 * @param {Object} obj 对象
 * @param {string} namespace 命名空间
 */
export function constructProxy(vm, obj, namespace) {
  // 递归
  let proxyObj = null
  if (obj instanceof Array) {
    // 判断是否为数组
    proxyObj = new Array(obj.length)
    for (let i = 0; i < obj.length; i++) {
      proxyObj[i] = constructProxy(vm, obj[i], namespace)
    }
    proxyObj = constructArrayProxy(vm, proxyObj, namespace)
  } else if (obj instanceof Object) {
    // 判断为对象
    proxyObj = constructObjectProxy(vm, obj, namespace)
  } else {
    // 如果是基础类型，直接返回
    return obj
  }
  return proxyObj
}
