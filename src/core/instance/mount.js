import VNode from '../vdom/vnode.js'
import { getTemplateToVNode, getVNodeToTemplate, prepareRender } from './render.js'
import { vmodel } from '../directives/vmodel.js'
import { vforInit } from '../directives/vfor.js'

/**
 * 获取节点文本
 * @param {HTMLElement} elem
 * @return {string}
 */
function getNodeText(elem) {
  if (elem.nodeType === 3) {
    return elem.nodeValue
  } else {
    return ''
  }
}

/**
 * 合并环境变量
 * @param env1
 * @param env2
 * @return {any[]|{}|*}
 */
function mergeEnv(env1, env2) {
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

/**
 * 构建虚拟节点
 * @param {MiniVue} vm
 * @param {HTMLElement} elem
 * @param {VNode} parent
 * @return {VNode}
 */
function constructVNode(vm, elem, parent) {
  let vnode = analysisAttr(vm, elem, parent)
  if (vnode === null || vnode === undefined) {
    let children = []
    let text = getNodeText(elem)
    let data = null
    let nodeType = elem.nodeType
    let tag = elem.nodeName
    vnode = new VNode(tag, nodeType, elem, parent, children, text, data)
    if (elem.nodeType === 1 && elem.getAttribute('env')) {
      vnode.env = mergeEnv(vnode.env, JSON.parse(elem.getAttribute('env')))
      console.log(JSON.parse(elem.getAttribute('env')))
    } else {
      vnode.env = mergeEnv(vnode.env, parent ? parent.env : {})
    }
  }
  let childs = vnode.elem.childNodes
  for (let i = 0; i < childs.length; i++) {
    let childNodes = constructVNode(vm, childs[i], vnode)
    if (childNodes instanceof VNode) {
      vnode.children.push(childNodes)
    } else {
      vnode.children = vnode.children.concat(childNodes)
    }
  }
  return vnode
}

/**
 * 分析属性
 * @param {MiniVue} vm
 * @param {HTMLElement} elem
 * @param {VNode} parent
 */
function analysisAttr(vm, elem, parent) {
  if (elem.nodeType === 1) {
    let attrNames = elem.getAttributeNames()
    if (attrNames.indexOf('v-model') > -1) {
      vmodel(vm, elem, elem.getAttribute('v-model'))
    }
    if (attrNames.indexOf('v-for') > -1) {
      return vforInit(vm, elem, parent, elem.getAttribute('v-for'))
    }
  }
}

/**
 * 初始化挂载
 * @param {Function} MiniVue
 */
export function initMount(MiniVue) {
  MiniVue.prototype.$mount = function(el) {
    let vm = this
    let elem = document.querySelector(el)
    mount(vm, elem)
  }
}

/**
 * 挂载
 * @param {MiniVue} vm
 * @param {HTMLElement} elem
 */
export function mount(vm, elem) {
  // 挂载节点
  vm._vnode = constructVNode(vm, elem, null)
  // 预备渲染（简历渲染索引）
  prepareRender(vm, vm._vnode)
  console.log(getVNodeToTemplate())
  console.log(getTemplateToVNode())
}
