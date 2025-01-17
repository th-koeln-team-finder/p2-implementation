import type { Language } from './en'

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
    validation: {
      nice: 'Alle Menschen sind nett',
      age: 'Das Alter muss auf dem Geburtsdatum basieren',
    },
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

    issueList:{
      showMore: 'mehr anzeigen',
      showLess: 'weniger anzeigen',
      issueTitle: 'Issues für Neueinsteiger',
    },
    skillScale: {
      skillTitle:'benötige Fähigkeiten',
    },

    skills: {
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
    createProject:{
      stepper:{
        back:'Zurück',
        next:'Weiter',
        reset:'Zurücksetzen',
        done:'Fertig',
      },

    },
  },
  brainstorm: {
    makeActionButton: 'Erstelle das Projekt',
    headingResources: 'Links & andere Ressourcen',
    comments: {
      loginCommentWarning: 'Sie müssen sich anmelden, um zu kommentieren',
      empty: 'Es gibt noch keine Kommentare',
      heading: 'Kommentare',
      inputPlaceholder: 'Kommentar hinterlassen...',
      inputSubmitButton: 'Kommentieren',
      sortButtonLabel: 'Sortieren nach',
      sortOptionPinned: 'Angepinnt',
      sortOptionMostRecent: 'Neueste',
      sortOptionMostPopular: 'Beliebteste',
      reply: 'Antworten',
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
    },
  },
  validation: {
    inProgress: 'Validiere...',
    required: 'Dieses Feld ist erforderlich',
    email: 'Dieses Feld muss eine gültige E-Mail-Adresse sein',
    usernameTaken: 'Dieser Benutzername ist bereits vergeben',
    minLengthX:
      'Dieses Feld muss mindestens {amount, plural, =1 {ein Zeichen} other {# Zeichen}} lang sein',
    number: 'Dieses Feld muss eine Zahl sein',
    positive: 'Dieses Feld muss eine positive Zahl sein',
    date: 'Dieses Feld muss ein gültiges Datum sein',
  },
  errors: {
    genericPageError: 'Oops, da ist etwas schiefgelaufen',
    auth: {
      configuration: 'Es gibt ein Problem mit der Konfiguration',
      accessDenied:
        'Es gab ein Problem beim Authentifizieren: Zugriff verweigert',
      verification: 'Es gab ein Problem beim Überprüfen der Authentifizierung',
      default: 'Es gab ein Problem beim Authentifizieren',
    },
  },
  utils: {
    weekdays: {
      monday: 'Mo',
      tuesday: 'Di',
      wednesday: 'Mi',
      thursday: 'Do',
      friday: 'Fr',
      saturday: 'Sa',
      sunday: 'So',
    },
  },
}
