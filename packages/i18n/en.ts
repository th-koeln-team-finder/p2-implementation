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
    validation: {
      nice: 'All people are nice',
      age: 'The age must be correct based on the date of birth',
    },
    actions: {
      addItem: 'Add Item',
      removeAll: 'Remove All',
    },
  },
  brainstorm: {
    makeActionButton: 'Create the project',
    headingResources: 'Links & Other Resources',
    comments: {
      loginCommentWarning: 'You need to login to comment',
      empty: "There aren't any comments yet",
      heading: 'Comments',
      inputPlaceholder: 'Add a comment...',
      inputSubmitButton: 'Comment',
      sortButtonLabel: 'Sort by',
      sortOptionPinned: 'Pinned',
      sortOptionMostRecent: 'Most recent',
      sortOptionMostPopular: 'Most popular',
      reply: 'Reply',
    },
  },
  help: {
    title: 'Help',
  },
  auth: {
    register: {
      button: 'Register',
      formTitle: 'Register',
      formDescription: 'Create a new account',
      username: 'Username',
      email: 'Email',
      submitButton: 'Register',
      alreadyHaveAccount: 'Already have an account?',
    },
    login: {
      button: 'Login',
      formTitle: 'Login',
      formDescription: 'Sign in to your account',
      email: 'Email',
      submitButton: 'Login',
    },
    logout: {
      button: 'Logout',
    },
  },
  validation: {
    inProgress: 'Validating...',
    required: 'This field is required',
    email: 'This field must be a valid email',
    usernameTaken: 'This username is already taken',
    minLengthX:
      'This field must be at least {amount, plural, =1 {one character} other {# characters}} long',
    number: 'This field must be a number',
    positive: 'This field must be a positive number',
    date: 'This field must be a valid date',
  },
  errors: {
    genericPageError: 'Oops something went wrong',
    auth: {
      configuration: 'There is an issue with the configuration',
      accessDenied:
        'There was a problem when trying to authenticate: Access Denied',
      verification: 'There was a problem when trying to verify authentication',
      default: 'There was a problem when trying to authenticate',
    },
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
