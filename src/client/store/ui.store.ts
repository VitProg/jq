import { IRootStore, IUIStore } from './types'
import { makeAutoObservable } from 'mobx'
import { createMuiTheme, Theme } from '@material-ui/core'


export class UIStore implements IUIStore {
  constructor () {
    this.theme = createMuiTheme({
      palette: {
        type: 'light'
      }
    })

    makeAutoObservable(this, {})
  }

  loading = false

  theme!: Theme

  darkMode = !!(localStorage.getItem('dark-mode') ?? false)

  setDarkMode (value: boolean): void {
    if (this.darkMode !== value) {
      this.darkMode = value
      localStorage.setItem('dark-mode', value ? '1' : '')
      this.theme = createMuiTheme({
        palette: {
          type: this.darkMode ? 'dark' : 'light'
        }
      })
    }
  }


  setLoading (value: boolean): void {
    this.loading = value
  }


}
