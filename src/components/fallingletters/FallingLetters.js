import { Lightning } from '@lightningjs/sdk'

export class FallingLetters extends Lightning.Component {
  static _template() {
    return {
      Letters: {
        flex: {
          direction: 'column',
          padding: 30,
          wrap: true,
        },
        flexItem: {
          margin: 20,
        },
        children: [],
      },
    }
  }

  set data(val) {
    // set the letters in a bad way
    // todo: refactor because string is also an array!
    let tmparray = []

    this._data = val

    for (let i = 0; i < val.length; i++) {
      tmparray.push(val[i])
    }

    this.tag('Letters').children = tmparray.map(letter => {
      return {
        alpha: 0,
        text: {
          text: letter,
          fontStyle: 'bold',
          fontSize: 210,
          shadow: true,
        },
      }
    })

    setTimeout(() => {
      this.animateLetters()
    }, 500)
  }

  animateLetters() {
    // this will animate the letters
    this.tag('Letters').children.forEach((letter, index) => {
      let timeRandom = Math.floor(Math.random() * 2)
      let scaleFinishRandom = Math.floor(Math.random() * 1.2)
      const animation = letter.animation({
        duration: timeRandom,
        repeat: 1,
        stopMethod: 'reverse',
        actions: [
          {
            p: 'scale',
            v: {
              0: 4,
              0.3: 1,
              0.5: 1.3,
              0.7: 0.8,
              1: scaleFinishRandom + 0.7,
            },
          },
          {
            p: 'alpha',
            v: {
              0: 0,
              0.3: 1,
              1: 1,
            },
          },
        ],
      })

      const foreverAnimation = letter.animation({
        duration: 10,
        repeat: -1,
        actions: [
          {
            p: 'scale',
            v: {
              0: scaleFinishRandom + 0.7,
              0.5: scaleFinishRandom - 0.2,
              1: scaleFinishRandom + 0.7,
            },
          },
        ],
      })

      animation.start()
      setTimeout(() => {
        foreverAnimation.play()
      }, 4000)
    })
  }
}
