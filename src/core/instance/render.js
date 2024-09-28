import { getValue } from '../../utils/objectUtils.js'

const templateToVNode = new Map()
const vNodeToTemplate = new Map()

export function getVNodeToTemplate() {
  return vNodeToTemplate
}

export function getTemplateToVNode() {
  return templateToVNode
}

/**
 * 设置vnode到template的映射关系
 * @param {string} template
 * @param {VNode} vnode
 */
function setVNodeToTemplate(template, vnode) {
  const templateName = getTemplateName(template)
  let templateSet = vNodeToTemplate.get(vnode)
  if (templateSet) {
    templateSet.push(templateName)
  } else {
    vNodeToTemplate.set(vnode, [templateName])
  }
}

/**
 * 设置template到vnode的映射关系
 * @param {string} template
 * @param {VNode} vnode
 */
function setTemplateToVNode(template, vnode) {
  const templateName = getTemplateName(template)
  let vnodeSet = templateToVNode.get(templateName)
  if (vnodeSet) {
    vnodeSet.push(vnode)
  } else {
    templateToVNode.set(templateName, [vnode])
  }
}

/**
 * 获取模板字符串中的内容
 * @param {string} template
 * @return {string}
 */
function getTemplateName(template) {
  let templateName = ''
  const matches = template.match(/{{\s*([\w.]+)\s*}}/)
  if (matches && matches[1] !== '') {
    templateName = matches[1]
  } else {
    templateName = template
  }
  return templateName
}

/**
 * 分析属性
 * @param {MiniVue} vm
 * @param {VNode} vnode
 */
function analysisAttr(vm, vnode) {
  if (vnode.nodeType !== 1) {
    return
  }
  let attrNames = vnode.elem.getAttributeNames()
  if (attrNames.indexOf('v-model') > -1) {
    const template = vnode.elem.getAttribute('v-model')
    setTemplateToVNode(template, vnode)
    setVNodeToTemplate(template, vnode)
  }
}

/**
 *
 * 获取模板对应的数据
 * @param {[]} datas
 * @param {string} template
 */
function getTemplateData(datas, template) {
  for (const data of datas) {
    let temp = getValue(data, template)
    if (temp != null) {
      return temp
    }
  }
  return null
}

/**
 * 分析模板字符串
 * @param {VNode} vnode
 */
function analysisTemplateString(vnode) {
  let templateStringList = vnode.text.match(/{{[^{}]*}}/g)
  if (!templateStringList) return
  for (const template of templateStringList) {
    setTemplateToVNode(template, vnode)
    setVNodeToTemplate(template, vnode)
  }
}

/**
 * 预备渲染
 * @param {MiniVue} vm
 * @param {VNode} vnode
 */
export function prepareRender(vm, vnode) {
  if (vnode == null) {
    return
  }
  // 文本节点
  if (vnode.nodeType === 3) {
    analysisTemplateString(vnode)
  }
  // 虚拟节点
  if (vnode.nodeType === 0) {
    // setTemplateToVNode(vnode.data, vnode)
    // setVNodeToTemplate(vnode.data, vnode)
  }
  // 标签节点
  analysisAttr(vm, vnode)
  if (vnode.nodeType === 1) {
    for (const child of vnode.children) {
      prepareRender(vm, child)
    }
  }
}

/**
 * 混入
 * @param {Function} MiniVue
 */
export function renderMixin(MiniVue) {
  MiniVue.prototype._render = function() {
    renderNode(this, this._vnode)
  }
}

/**
 * 渲染节点
 * @param {MiniVue} vm
 * @param {VNode} vnode
 */
function renderNode(vm, vnode) {
  // 是文本节点，进行渲染处理
  if (vnode.nodeType === 3) {
    let templates = vNodeToTemplate.get(vnode)
    if (templates) {
      let result = vnode.text
      for (const template of templates) {
        const data = [vm._data, vnode.env]
        let templateData = getTemplateData([vm._data, vnode.env], template)
        // debugger
        if (templateData != null) {
          result = result.replace(`{{ ${template} }}`, templateData)
        }
      }
      vnode.elem.nodeValue = result
    }
    // 如果是输入框，进行处理
  } else if (vnode.nodeType === 1 && vnode.tag === 'INPUT') {
    let templates = vNodeToTemplate.get(vnode)
    if (templates) {
      for (const template of templates) {
        let templateData = getTemplateData([vm._data, vnode.env], template)
        if (templateData) {
          vnode.elem.value = templateData
        }
      }
    }
  } else {
    for (const child of vnode.children) {
      renderNode(vm, child)
    }
  }
}

/**
 * 渲染数据
 * @param {MiniVue} vm
 * @param {string} data
 */
export function renderData(vm, data) {
  let vnodes = templateToVNode.get(data)
  if (vnodes != null) {
    for (const vnode of vnodes) {
      renderNode(vm, vnode)
      console.log(vnode)
    }
  }
}

export function getVNodeByTemplate(template) {
  return templateToVNode.get(template)
}


export function clearMap() {
  templateToVNode.clear()
  vNodeToTemplate.clear()
}
