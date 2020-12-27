import { LoadingPage } from './pages/Loading'
import { HomePage } from './pages/Home'
import { GamePage } from './pages/Game'
import { ScoresPage } from './pages/Scores'

export default {
    boot: () => {
        return new Promise(resolve => {
            // tmp!
            resolve()
        })
    },
    root: 'home',
    routes: [
        {
            path: 'loading',
            component: LoadingPage
        },
        {
            path: 'home',
            component: HomePage
        },
        {
            path: 'game',
            component: GamePage
        },
        {
            path: 'scores',
            component: ScoresPage
        },
        {
            path: '*',
            component: HomePage
        }
    ]
}