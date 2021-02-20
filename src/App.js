import { Utils, Router } from '@lightningjs/sdk'
import routes from './routes'
import { Howl, Howler } from 'howler'

export default class App extends Router.App {
  static getFonts() {
    return [
      { family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') },
      { family: 'Indie', url: Utils.asset('fonts/IndieFlower-Regular.ttf') },
      { family: 'Jura', url: Utils.asset('fonts/Jura-VariableFont_wght.ttf') },
    ]
  }

  _setup() {
    Router.startRouter(routes)
  }

  _init() {
    Howler.autoUnlock = false
  }
}
