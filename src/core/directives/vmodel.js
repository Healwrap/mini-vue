import { setValue } from '../../utils/objectUtils.js'

/**
 * v-model指令
 * @param {MiniVue} vm
 * @param {HTMLElement} elem
 * @param {string} prop
 */
export function vmodel(vm, elem, prop) {
  elem.onchange = function() {
    setValue(vm._data, prop, elem.value)
  }
}
