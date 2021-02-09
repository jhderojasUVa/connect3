import { Lightning } from '@lightningjs/sdk'

export class Toast extends Lightning.Component {
  static _template() {
    return {
      w: 500,
      h: 150,
      alpha: 0,
      Background: {
        texture: Lightning.Tools.getRoundRect(
          500,
          150,
          5,
          3,
          0xffffffff, // stroke color
          true,
          0xff000000 // stroke fill
        ),
      },
      ToastText: {
        x: 10,
        y: 75,
        w: 450,
        mountY: 0.5,
        text: {
          text: '',
          textAlign: 'center',
          fontFace: 'Jura',
          maxLines: 3,
          fontSize: 24,
        },
      },
    }
  }

  set data(val) {
    this.tag('ToastText').text.text = val
    this.animate()
  }

  animate() {
    this.patch({
      smooth: {
        alpha: [1, { duration: 0.8 }],
      },
    })

    setTimeout(() => {
      this.patch({
        smooth: {
          alpha: [0, { duration: 0.8 }],
        },
      })
    }, 4500)
  }
}
