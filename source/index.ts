import { Plugin, PluginContext } from '@anymotion/core'

import { width } from './width'
import { height } from './height'
import { scale } from './scale'
import { rotate } from './rotate'
import { translate } from './translate'
import { backgroundColor } from './background-color'

const plugin: Plugin = {
  apply: function (ctx: PluginContext): void {
    ctx.registerPropertyDriver(
      width,
      height,
      scale,
      rotate,
      translate,
      backgroundColor,
    )
  }
}

export default plugin
