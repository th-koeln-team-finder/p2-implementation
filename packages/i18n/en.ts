export const en = {
  general: {
    save: 'Save',
    search: 'Suchen',
    cancel: 'Cancel',
    delete: 'Delete',
    continue: 'Continue',
    add: 'Add',
    remove: 'Remove',
    notSupported: 'Not supported',
  },
  components: {
    fileUpload: {
      placeholderText: 'Drag and drop a file here or click to browse',
      selectedFileHeader: 'Selected files',
      noFilesSelected: 'No files selected',
      finishedText: 'Finished',
      noPreviewAvailable: 'No preview',
      errorFileIsTooLarge: 'File is too large',
    },
  },
  test: {
    dataTitle: 'Test Data',
    normalHeading: 'Normal Heading',
    normalFont: 'Normal Font',
    otherHeading: 'Other Heading',
    otherFont: 'Other Font',
    toProjectPage: 'To project page',
    validation: {
      nice: 'All people are nice',
      age: 'The age must be correct based on the date of birth',
    },
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
  users: {
    title: 'Page',
    lastActivity: 'Last activity',
    skills: 'Skills',
    previouslyWorkedOn: 'Previously worked on',
    loadMoreProjects: 'Mehr Projekte laden',
    follow: 'Follow',
    friendly: 'Friendly',
    veryFriendly: 'Very friendly',
    ratingText: 'people have rated the person as “very friendly”',
    editProfile: 'Edit profile',
    settings: {
      title: 'User settings',
      profile: 'Profile',
      account: 'Account',
      security: 'Security',
      dangerZone: 'Danger Zone',
      deleteAccount: 'Delete account',
      skills: {
        title: 'Skills',
        add: 'Add skill',
        addEntered: 'Add entered term as skill',
        remove: 'Remove skill',
        search: 'Search skill',
        noResults: 'No results',
      },
      deleteAreYouSure: 'Are you sure you want to delete your account?',
      bio: 'Bio',
      username: 'Username',
      language: 'Language',
      isPublic: 'Publicly visible',
      url: 'URL',
      location: 'Location',
      profilePicture: 'Profile picture',
      email: 'Email',
      password: 'Password',
      allowInvites: 'Allow invites for new projects',
      notifications: {
        title: 'Notifications',
        activate: 'Activate notifications',
        project: 'Project notifications',
        profile: 'Profile notifications',
        selectType: 'Select notification type',
        joinedProjectUpdated: 'One of my projects was updated',
        newMemberJoined: 'New member joined one of my projects',
        memberLeft: 'Member left one of my projects',
        newProjectApplication: 'New application for one of my projects',
        bookmarkedProjectUpdated: 'One of my bookmarked projects was updated',
        newFollower: 'New follower',
        newInvite: 'New invite to a project',
        newSkillEvaluation: 'New skill evaluation',
      }
    }
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
    url: 'This field must be a valid URL',
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
