import { Lightning } from '@lightningjs/sdk'

export class ScoreUser extends Lightning.Component {
  static _template() {
    return {
      h: 80,
      Username: {
        text: {
          fontSize: 50,
          fontFamily: 'Jura',
          text: ''
        }
      },
      Dots: {
        x: 200,
        text: {
          fontSize: 50,
          fontFamily: 'Jura',
          text: '........................'
        }
      },
      Score: {
        x: 600,
        text: {
          fontFamily: 'Jura',
          fontSize: 50,
          text: '0'
        }
      }
    }
  }

  set data(val) {
    this.tag('Username').patch({
      text: {
        textColor: val.color,
        text: val.name
      }
    })
    this.tag('Score').patch({
      text: {
        textColor: val.color,
        text: val.score
      }
    })
  }
}
