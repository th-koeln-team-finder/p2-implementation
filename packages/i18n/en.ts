export const en = {
  general: {
    save: 'Save',
    cancel: 'Cancel',
  },
  test: {
    dataTitle: 'Test Data',
    normalHeading: 'Normal Heading',
    normalFont: 'Normal Font',
    otherHeading: 'Other Heading',
    otherFont: 'Other Font',
    toProjectPage: 'To project page',
    actions: {
      addItem: 'Add Item',
      removeAll: 'Remove All',
    },
  },
  help: {
    title: 'Help',
  },
}

type PathOf<T> = {
  // @ts-ignore
  [K in keyof T]: T[K] extends object ? `${K}.${PathOf<T[K]>}` : K
}[keyof T]

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

export type FullLanguage = typeof en
export type Language = RecursivePartial<typeof en>
export type LangKey = PathOf<typeof en>
