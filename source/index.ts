import { Plugin, PluginContext } from '@anymotion/core'

import { size } from './size'
import { inset } from './inset'
import { scale } from './scale'
import { rotate } from './rotate'
import { translate } from './translate'
import { backgroundColor } from './background-color'

export type *  from './size'
export type *  from './inset'
export type *  from './scale'
export type *  from './rotate'
export type *  from './translate'
export type *  from './background-color'

const plugin: Plugin = {
  apply: function (ctx: PluginContext): void {
    ctx.registerPropertyDriver(
      size,
      inset,
      scale,
      rotate,
      translate,
      backgroundColor,
    )
  }
}

export default plugin
