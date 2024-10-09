import VNode from '../vdom/vnode.js'
import { getTemplateToVNode, getVNodeToTemplate, prepareRender, getVNodeByTemplate, clearMap } from './render.js'
import { vmodel } from '../directives/vmodel.js'
import { vforInit } from '../directives/vfor.js'
import { mergeEnv } from '../../utils/objectUtils.js'

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
    } else {
      vnode.env = mergeEnv(vnode.env, parent ? parent.env : {})
    }
  }
  let childs = vnode.nodeType === 0 ? vnode.parent.elem.childNodes : vnode.elem.childNodes
  let len = vnode.nodeType === 0 ? vnode.parent.elem.childNodes.length : vnode.elem.childNodes.length
  for (let i = 0; i < len; i++) {
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
  MiniVue.prototype.$mount = function (el) {
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
  // 预备渲染（建立渲染索引）
  prepareRender(vm, vm._vnode)
  console.log(getVNodeToTemplate())
  console.log(getTemplateToVNode())
}

export function rebuild(vm, template) {
  let vnodes = getVNodeByTemplate(template)
  for (let i = 0; i < vnodes.length; i++) {
    vnodes[i].parent.elem.innerHTML = ''
    vnodes[i].parent.elem.appendChild(vnodes[i].elem)
    let result = constructVNode(vm, vnodes[i].elem, vnodes[i].parent)
    vnodes[i].parent.children = [result]
    clearMap()
    prepareRender(vm, vm._data)
  }
}
