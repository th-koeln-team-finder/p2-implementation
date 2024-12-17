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
  projects: {
    title: 'Projekte',
    location: 'Location',
    join: 'Join the team',
    links: 'Links and other resources',
    issuesTitle:'open issues for starters',

    skills: {
      title: 'Skills needed',
      toggleLess: 'Show less',
      toggleMore: 'Show more',
    },
    text: {
      desc: 'EN Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.',
    },
    team: {
      title: 'Team Members',
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
  users: {
    title: 'Profile',
    lastActivity: 'Last activity',
    skills: 'Skills',
    previouslyWorkedOn: 'Previously worked on',
    loadMoreProjects: 'Mehr Projekte laden',
    follow: 'Follow',
    friendly: 'Friendly',
    veryFriendly: 'Very friendly',
    ratingText: 'people have rated the person as “very friendly”',
  },
  validation: {
    inProgress: 'Validating...',
    required: 'This field is required',
    email: 'This field must be a valid email',
    usernameTaken: 'This username is already taken',
    minLengthX:
      'This field must be at least {amount, plural, =1 {one character} other {# characters}} long',
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
