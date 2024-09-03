import { initMixin } from './init.js'
import { renderMixin } from './render.js'


function MiniVue(options) {
  this._init(options)
}

initMixin(MiniVue)
renderMixin(MiniVue)

export default MiniVue
