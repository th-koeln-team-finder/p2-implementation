export const projectsData = [
  {
    name: 'Testing Project',
    descriptionText: 'Lorem ipsum dolor sit amet',
    description: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: "PetPal is a smart pet care assistant that helps pet owners track their pet's health, schedule vet appointments, and receive reminders for feeding and grooming. It also integrates with IoT devices like smart feeders and collars.  ",
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: '**Motivation**: Pets are beloved family members, but keeping track of their needs can be challenging. PetPal aims to make pet care more manageable and ensure pets stay happy and healthy.',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    tags: ['web-app'],
    skills: [
      {
        skill: 'sustainability',
        level: 4,
      },
      {
        skill: 'environment',
        level: 2,
      },
      {
        skill: 'mobile-app',
        level: 2,
      },
      {
        skill: 'data-visualization',
        level: 4,
      },
      {
        skill: 'green-tech',
        level: 4,
      },
    ],
    status: 'open' as const,
    isPublic: true,
    allowApplications: true,
  },
  {
    name: 'Testing Project 2',
    descriptionText: 'Lorem ipsum dolor sit amet',
    description: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: "PetPal is a smart pet care assistant that helps pet owners track their pet's health, schedule vet appointments, and receive reminders for feeding and grooming. It also integrates with IoT devices like smart feeders and collars.  ",
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: '**Motivation**: Pets are beloved family members, but keeping track of their needs can be challenging. PetPal aims to make pet care more manageable and ensure pets stay happy and healthy.',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
            textFormat: 0,
            textStyle: '',
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    tags: ['web-app'],
    skills: [
      {
        skill: 'development',
        level: 4,
      },
      {
        skill: 'javascript',
        level: 2,
      },
      {
        skill: 'react',
        level: 2,
      },
      {
        skill: 'projektmanagement',
        level: 4,
      },
    ],
    /*resources: [
      'https://www.petpal.com',
      'https://github.com/opencollabhub',
      'https://discord.gg/opencollabhub',
  ],
  timetable: [
      {
          date: 'Montags 10:00',
          description: 'Wöchentliches Check-in',
      },
      {
          date: 'Donnerstags 14:00',
          description: 'Dev Sync Meeting',
      },
  ],*/
    /*tags: [
    'sustainability',
    'environment',
    'mobile-app',
    'data-visualization',
    'green-tech',
  ],*/
    status: 'open' as const,
    isPublic: true,
    allowApplications: true,
  },
]

const skills = new Set(projectsData.flatMap((e) => e.skills))
const tags = new Set(projectsData.flatMap((e) => e.tags))
export const uniqueProjectSkills = Array.from(skills)
export const uniqueProjectTags = Array.from(tags)
