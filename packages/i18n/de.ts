import type {Language} from './en'

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
    actions: {
      addItem: 'Eintrag hinzufügen',
      removeAll: 'Alle entfernen',
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
    previously_worked_on: 'Hat zuvor gearbeitet an',
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
