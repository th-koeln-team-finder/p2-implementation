import type {Language} from './en'

export const de: Language = {
  general: {
    save: 'Speichern',
    search: 'Suchen',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    continue: 'Fortfahren',
    add: 'Hinzufügen',
    remove: 'Entfernen',
  },
  test: {
    dataTitle: 'Testdaten',
    normalHeading: 'Normaler Titel',
    normalFont: 'Normaler Schriftart',
    otherHeading: 'Andere Titel',
    otherFont: 'Andere Schriftart',
    toProjectPage: 'Zur Projektseite',
    actions: {
      addItem: 'Eintrag hinzufügen',
      removeAll: 'Alle entfernen',
    },
  },
  projects: {
    title: 'Projekte',
    location: 'Standort/Treffpunkt',
    join: 'Team beitreten',
    links: 'Links und andere Ressourcen',
    issuesTitle:'Offene Issues für neue Mitglieder',
    skills:{
      title: 'Deine Fähigkeiten',
      toggleLess: 'Weniger anzeigen',
      toggleMore: 'Mehr anzeigen',
    },
    text: {
      desc: 'DE Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.',
    },
    team: {
      title: 'Team-Mitglieder',
    },
  },
  help: {
    title: 'Hilfe',
  },
  auth: {
    register: {
      button: 'Registrieren',
      formTitle: 'Registrieren',
      formDescription: 'Erstelle ein neues Konto',
      username: 'Benutzername',
      email: 'Email',
      submitButton: 'Registrieren',
      alreadyHaveAccount: 'Bereits ein Konto?',
    },
    login: {
      button: 'Anmelden',
      formTitle: 'Anmelden',
      formDescription: 'Melden Sie sich bei Ihrem Konto an',
      email: 'Email',
      submitButton: 'Anmelden',
    },
    logout: {
      button: 'Abmelden',
    },
  },
  users: {
    title: 'Profil',
    lastActivity: 'Letzte Aktivität',
    skills: 'Skills',
    previouslyWorkedOn: 'Hat zuvor gearbeitet an',
    loadMoreProjects: 'Mehr Projekte laden',
    follow: 'Folgen',
    friendly: 'Freundlich',
    veryFriendly: 'Sehr freundlich',
    ratingText: 'Personen haben die Person als "sehr freundlich" bewertet',
    editProfile: 'Profil bearbeiten',
    settings: {
      title: 'Benutzereinstellungen',
      profile: 'Profil',
      account: 'Konto',
      notifications: 'Benachrichtigungen',
      security: 'Sicherheit',
      dangerZone: 'Gefahrenzone',
      deleteAccount: 'Account löschen',
      removeSkill: 'Remove skill',
      deleteAreYouSure: 'Are you sure you want to delete your account?',
      activateNotifications: 'Benachrichtigungen aktivieren',
      selectNotificationType: 'Benachrichtigungstyp auswählen',
      searchSkills: 'Skill suchen',
    }
  },
  validation: {
    inProgress: 'Validiere...',
    required: 'Dieses Feld ist erforderlich',
    email: 'Dieses Feld muss eine gültige E-Mail-Adresse sein',
    usernameTaken: 'Dieser Benutzername ist bereits vergeben',
    minLengthX:
      'Dieses Feld muss mindestens {amount, plural, =1 {ein Zeichen} other {# Zeichen}} lang sein',
  },
}
