import { LoadingPage } from './pages/Loading'
import { HomePage } from './pages/Home'
import { GamePage } from './pages/Game'
import { ScoresPage } from './pages/Scores'
import { InstructionsPage } from './pages/Instructions'

export default {
  boot: () => {
    return new Promise(resolve => {
      // tmp!
      // On the future with this we can get fetch some data from
      // the server, like the scores or some data needed for the multi
      // player...
      resolve()
    })
  },
  root: 'home',
  routes: [
    {
      path: 'loading',
      component: LoadingPage,
    },
    {
      path: 'home',
      component: HomePage,
    },
    {
      path: 'game',
      component: GamePage,
    },
    {
      path: 'game/:type',
      on: (page, { type }) => {
        return new Promise((resolve, reject) => {
          if (typeof type == 'string') {
            page.tipeOfGame = type
            resolve()
          } else {
            reject('bad type of game')
          }
        })
      },
      component: GamePage,
    },
    {
      path: 'scores',
      component: ScoresPage,
    },
    {
      path: 'scores/:scoreNumber',
      on: (page, { scoreNumber }) => {
        const score = parseInt(scoreNumber)
        return new Promise((resolve, reject) => {
          if (typeof score == 'number' && score !== 0) {
            page.newScore = score
            resolve()
          } else {
            reject('bad score number')
          }
        })
      },
      component: ScoresPage,
    },
    {
      path: 'instructions',
      component: InstructionsPage,
    },
    {
      path: '*',
      component: HomePage,
    },
  ],
}
