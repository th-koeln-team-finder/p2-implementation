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
    validation: {
      nice: 'Alle Menschen sind nett',
      age: 'Das Alter muss auf dem Geburtsdatum basieren',
    },
    actions: {
      addItem: 'Eintrag hinzufügen',
      removeAll: 'Alle entfernen',
    },
  },
  brainstorm: {
    makeActionButton: 'Erstelle das Projekt',
    headingResources: 'Links & andere Ressourcen',
    comments: {
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
}
