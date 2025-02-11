export const en = {
  general: {
    save: 'Save',
    cancel: 'Cancel',
  },
  components: {
    wysiwyg: {
      heading1: 'Heading 1',
      heading2: 'Heading 2',
      heading3: 'Heading 3',
      heading4: 'Heading 4',
      heading5: 'Heading 5',
      heading6: 'Heading 6',
      paragraph: 'Paragraph',
    },
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
    apply: {
      title: 'Join the Team',
      infoTitle: 'About you',
      applyTitle: 'Your application documents',
      messageTitle: 'Your message',
      form: {
        firstName: 'First Name',
        placeholderFirstName: 'Enter your first name...',
        lastName: 'Last Name',
        placeholderLastName: 'Enter your last name...',
        mail: 'Email',
        placeholderMail: 'Enter your email...',
        phone: 'Phone Number',
        placeholderPhone: 'Enter your phone number...',
        fileUpload: 'Upload your portfolio, CV, etc.',
        message: 'Is there anything else you would like to tell us?',
        placeholderMessage: 'Enter your message...',
        submit: 'Send Request',
      },
    },
  },
  brainstorm: {
    makeActionButton: 'Create the project',
    deleteActionButton: 'Delete',
    headingResources: 'Links & Other Resources',
    emptyResources: 'No links or resources available...',
    createButton: 'Start brainstorming',
    createFormTitle: 'Create a Brainstorm',
    createForm: {
      labelTitle: 'Title',
      placeholderTitle: 'Write title here...',
      labelDescription: 'Description',
      placeholderDescription: 'Write description here...',
      labelTags: 'Tags',
      placeholderTags: 'Add tags...',
      loadingTags: 'Loading tags...',
      emptyTags: 'No tags found',
      addResourceButton: 'Add Resource',
      resourceTypeSelectLink: 'https://',
      resourceTypeSelectFile: 'File',
      resourceLabelName: 'Resource Name',
      resourceLabelData: 'Resource Data',
      resourcePlaceholderName: 'Enter name here...',
      resourcePlaceholderLink: 'Enter url...',
      resourcePlaceholderFile: 'Select file...',
      whiteboardNotice:
        'Once you have published your brainstorm you will be able to work on the whiteboard.',
      publishButton: 'Publish Brainstorm',
    },
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
  tag: {
    createNewTag: "New: ''{tagName}''",
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
    url: 'This field must be a valid URL',
    fileIsTooLarge: 'File is too large',
    wrongFileType: 'This file type is not supported',
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
