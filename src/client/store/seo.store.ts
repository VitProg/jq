import { IConfigStore, IRootStore, ISeoStore } from './types'
import { action, autorun, makeAutoObservable, makeObservable, runInAction } from 'mobx'
import { store } from './index'


const joinTitle = (...titles: (string | undefined | null)[]) => titles.filter(Boolean).join(' | ')
const joinKeywords = (...keyword: (string | undefined | null)[]) => keyword.filter(Boolean).join(', ')

export class SeoStore implements ISeoStore {
  constructor (readonly configStore: IConfigStore) {
    makeAutoObservable(this, {
      setBase: action.bound,
      setTitle: action.bound,
      addTitle: action.bound,
      setKeywords: action.bound,
      addKeyword: action.bound,
      setDescription: action.bound,
      setPageSeo: action.bound,
      clear: action.bound,
    })

    autorun(() => {
      if (!this.initialized) {
        this.init()
      }

      this.elTitle!.innerText = joinTitle(this.baseTitle, ...this.title)
      this.elMetaDescription!.content = (this.baseDescription ? this.baseDescription + '. ' : '') + this.description
      this.elMetaKeywords!.content = joinKeywords(...(this.baseKeywords ? this.baseKeywords : []), ...this.keywords)
      console.log('update seo')
    }, {
      delay: 200
    })

    setTimeout(() => {
      this.setBase({
        title: store.configStore.seoBaseTitle,
        description: store.configStore.seoBaseDescription,
        keywords: store.configStore.seoBaseKeywords,
      })
    })
  }

  private elTitle: HTMLTitleElement | undefined
  private elMetaKeywords: HTMLMetaElement | undefined
  private elMetaDescription: HTMLMetaElement | undefined

  private initialized = false
  private init() {
    this.initialized = true

    const elTitle = document.head.querySelector('title')
    if (elTitle) {
      this.elTitle = elTitle
    } else {
      this.elTitle = document.createElement('title')
      document.head.appendChild(this.elTitle)
    }

    const elMetaKeywords = document.head.querySelector<HTMLMetaElement>('meta[name="keywords"]')
    if (elMetaKeywords) {
      this.elMetaKeywords = elMetaKeywords
    } else {
      this.elMetaKeywords = document.createElement('meta')
      this.elMetaKeywords.name = 'keywords'
      this.elMetaKeywords.content = ''
      document.head.appendChild(this.elMetaKeywords)
    }

    const elMetaDescription = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (elMetaDescription) {
      this.elMetaDescription = elMetaDescription
    } else {
      this.elMetaDescription = document.createElement('meta')
      this.elMetaDescription.name = 'description'
      this.elMetaDescription.content = ''
      document.head.appendChild(this.elMetaDescription)
    }
  }

  baseTitle: string | undefined
  baseKeywords: string[] | undefined = undefined
  baseDescription: string | undefined = undefined

  title: string[] = []
  keywords: string[] = []
  description: string = ''

  setBase (data: { title?: string; keywords?: string[]; description?: string }): void {
    this.baseTitle = data.title
    this.baseKeywords = data.keywords
    this.baseDescription = data.description ?? ''
  }

  setTitle(...titles: (string | undefined | null)[]): void {
    this.title = [...titles].filter(Boolean) as string[]
  }

  setKeywords(...keywords: (string | undefined | null)[]): void {
    this.keywords = [...keywords].filter(Boolean) as string[]
  }

  setDescription(description: string | undefined | null): void {
    this.description = description ?? ''
  }

  setPageSeo (data: { title?: string[]; keywords?: string[]; description?: string }): void {
    if (data.title) {
      this.setTitle(...data.title)
    }

    if (data.keywords) {
      this.setKeywords(...data.keywords)
    }

    if (data.description) {
      this.setDescription(data.description)
    }
  }

  addKeyword(...keywords: (string | undefined | null)[]): void {
    this.keywords = [...this.keywords, ...keywords].filter(Boolean) as string[]
  }

  addTitle(...titles: (string | undefined | null)[]): void {
    this.title = [...this.title, ...titles].filter(Boolean) as string[]
  }

  clear(): void {
    this.title = []
    this.description = ''
    this.keywords = []
  }


}
