import type { Language } from './en'

export const de: Language = {
  general: {
    save: 'Speichern',
    cancel: 'Abbrechen',
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
    issuesTitle: 'Offene Issues für neue Mitglieder',
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
  validation: {
    inProgress: 'Validiere...',
    required: 'Dieses Feld ist erforderlich',
    email: 'Dieses Feld muss eine gültige E-Mail-Adresse sein',
    usernameTaken: 'Dieser Benutzername ist bereits vergeben',
    minLengthX:
      'Dieses Feld muss mindestens {amount, plural, =1 {ein Zeichen} other {# Zeichen}} lang sein',
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
}
