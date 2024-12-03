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
    join: 'Dem Team beitreten',
    links: 'Links und andere Ressourcen',
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
}
