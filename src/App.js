import { Lightning, Utils, Routes } from '@lightningjs/sdk'

export default class App extends Routes.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
     
    }
  }

  _init() {
   
  }
}
