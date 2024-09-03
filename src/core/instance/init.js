import { constructProxy } from './proxy.js'
import { initMount, mount } from './mount.js'

let uid = 0

export function initMixin(MiniVue) {
  MiniVue.prototype._init = function(options) {
    const vm = this
    vm.uid = uid++
    vm.isMiniVue = true
    // 初始化data
    if (options && options.data) {
      vm._data = constructProxy(vm, options.data, '')
    }
    // 初始化created方法
    // 初始化method
    // 初始化computed
    // 初始化el并挂载
    if (options && options.el) {
      initMount(MiniVue)
      const rootDom = document.querySelector(options.el)
      mount(vm, rootDom)
    }
  }
}
