import VNode from '../vdom/vnode.js'
import { getValue } from '../../utils/objectUtils.js'

/**
 * 分析局部变量 env
 * @param {string} instructions
 * @param {string} value
 * @param {number} index
 * @return {{}}
 */
function analysisEnv(instructions, value, index) {
  console.log(instructions)
  if (/([a-zA-Z0-9_$]+)/.test(instructions)) {
    instructions = instructions.trim()
    instructions = instructions.substring(1, instructions.length - 1)
  }
  console.log(instructions)
  let keys = instructions.split(',')
  if (keys.length === 0) {
    throw new Error('v-for指令格式不正确')
  }
  let obj = {}
  if (keys.length >= 1) {
    obj[keys[0].trim()] = value
  }
  if (keys.length >= 2) {
    obj[keys[1].trim()] = index
  }
  return obj
}

/**
 * 分析指令
 * @param {MiniVue} vm
 * @param {string} instructions
 * @param {HTMLElement} elem
 * @param {VNode} parent
 */
function analysisInstructions(vm, instructions, elem, parent) {
  let insSet = getVirtualNodeData(instructions)
  let dataSet = getValue(vm._data, insSet[2])
  if (!dataSet) {
    throw new Error('v-for指令对应的数据不存在')
  }
  let resultSet = []
  for (let i = 0; i < dataSet.length; i++) {
    let tempDom = document.createElement(elem.nodeName)
    tempDom.innerHTML = elem.innerHTML
    let env = analysisEnv(insSet[0], dataSet[i], i)
    // console.log(env)
    // console.log(dataSet)
    tempDom.setAttribute('env', JSON.stringify(env))
    // console.log(JSON.parse(JSON.stringify(env)))
    parent.elem.appendChild(tempDom)
    resultSet.push(tempDom)
  }
  return resultSet
}

/**
 * v-for指令初始化 根据模板创建一个虚拟的父级节点
 * @param {MiniVue} vm
 * @param {HTMLElement} elem
 * @param {VNode} parent
 * @param {string} instructions
 */
export function vforInit(vm, elem, parent, instructions) {
  let virtualNode = new VNode(elem.nodeName, 0, elem, parent, [], '', getVirtualNodeData(instructions))
  virtualNode.instructions = instructions
  parent.elem.removeChild(elem)
  parent.elem.appendChild(document.createTextNode(''))
  let resultSet = analysisInstructions(vm, instructions, elem, parent)
  return virtualNode
}

/**
 * 获取虚拟节点的数据
 * @param {string} instructions
 */
function getVirtualNodeData(instructions) {
  let insSet = instructions.trim().split(' ')
  if (insSet.length !== 3 || insSet[1] !== 'in' && insSet[1] !== 'of') {
    throw new Error('v-for指令格式不正确')
  }
  return insSet
}
