

export interface IRootStore {
  readonly ui: IUIStore
}

interface IBaseStore {
  readonly root: IRootStore
}

export interface IUIStore extends IBaseStore {
  readonly loading: boolean
  setLoading(value: boolean): void
}
