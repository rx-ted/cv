import type { Locale } from "./schema-legacy"

type Words = {
  present: string
  page: string
  of: string
  nationality: string
  placeOfBirth: string
  dateOfBirth: string
  drivingLicense: string
  address: string
  referencesOnRequest: string
  skillLevels: [string, string, string, string, string]
  languageLevels: [string, string, string, string, string]
  details: string
  /** Cover letters: "Dear", the no-name addressee, the sign-off and the subject label. */
  dear: string
  hiringManager: string
  sincerely: string
  regarding: string
}

export const WORDS: Record<Locale, Words> = {
  en: {
    present: "Present",
    page: "Page",
    of: "of",
    nationality: "Nationality",
    placeOfBirth: "Place of birth",
    dateOfBirth: "Date of birth",
    drivingLicense: "Driving license",
    address: "Address",
    referencesOnRequest: "References available upon request",
    skillLevels: ["Novice", "Beginner", "Skillful", "Experienced", "Expert"],
    languageLevels: [
      "Basic",
      "Conversational",
      "Proficient",
      "Fluent",
      "Native",
    ],
    details: "Details",
    dear: "Dear",
    hiringManager: "Dear Hiring Manager",
    sincerely: "Sincerely",
    regarding: "Re:",
  },
  pt: {
    present: "Atual",
    page: "Página",
    of: "de",
    nationality: "Nacionalidade",
    placeOfBirth: "Local de nascimento",
    dateOfBirth: "Data de nascimento",
    drivingLicense: "Carta de condução",
    address: "Morada",
    referencesOnRequest: "Referências disponíveis mediante pedido",
    skillLevels: [
      "Iniciante",
      "Básico",
      "Competente",
      "Experiente",
      "Especialista",
    ],
    languageLevels: [
      "Básico",
      "Conversação",
      "Proficiente",
      "Fluente",
      "Nativo",
    ],
    details: "Detalhes",
    dear: "Caro(a)",
    hiringManager: "Exmos. Senhores",
    sincerely: "Com os melhores cumprimentos",
    regarding: "Assunto:",
  },
  "pt-BR": {
    present: "Atual",
    page: "Página",
    of: "de",
    nationality: "Nacionalidade",
    placeOfBirth: "Local de nascimento",
    dateOfBirth: "Data de nascimento",
    drivingLicense: "Carteira de motorista",
    address: "Endereço",
    referencesOnRequest: "Referências disponíveis mediante solicitação",
    skillLevels: [
      "Iniciante",
      "Básico",
      "Competente",
      "Experiente",
      "Especialista",
    ],
    languageLevels: [
      "Básico",
      "Conversação",
      "Proficiente",
      "Fluente",
      "Nativo",
    ],
    details: "Dados",
    dear: "Prezado(a)",
    hiringManager: "Prezada equipe de recrutamento",
    sincerely: "Atenciosamente",
    regarding: "Assunto:",
  },
  es: {
    present: "Actualidad",
    page: "Página",
    of: "de",
    nationality: "Nacionalidad",
    placeOfBirth: "Lugar de nacimiento",
    dateOfBirth: "Fecha de nacimiento",
    drivingLicense: "Permiso de conducir",
    address: "Dirección",
    referencesOnRequest: "Referencias disponibles a petición",
    skillLevels: [
      "Novato",
      "Principiante",
      "Competente",
      "Experimentado",
      "Experto",
    ],
    languageLevels: [
      "Básico",
      "Conversacional",
      "Competente",
      "Fluido",
      "Nativo",
    ],
    details: "Datos",
    dear: "Estimado/a",
    hiringManager: "Estimado equipo de selección",
    sincerely: "Atentamente",
    regarding: "Asunto:",
  },
  fr: {
    present: "Aujourd'hui",
    page: "Page",
    of: "sur",
    nationality: "Nationalité",
    placeOfBirth: "Lieu de naissance",
    dateOfBirth: "Date de naissance",
    drivingLicense: "Permis de conduire",
    address: "Adresse",
    referencesOnRequest: "Références disponibles sur demande",
    skillLevels: ["Novice", "Débutant", "Compétent", "Expérimenté", "Expert"],
    languageLevels: [
      "Notions",
      "Conversation",
      "Courant",
      "Bilingue",
      "Langue maternelle",
    ],
    details: "Coordonnées",
    dear: "Bonjour",
    hiringManager: "Madame, Monsieur",
    sincerely: "Cordialement",
    regarding: "Objet :",
  },
  "zh-CN": {
    present: "至今",
    page: "第",
    of: "页，共",
    nationality: "国籍",
    placeOfBirth: "出生地",
    dateOfBirth: "出生日期",
    drivingLicense: "驾照",
    address: "地址",
    referencesOnRequest: "如需可提供推荐人",
    skillLevels: ["入门", "初级", "熟练", "精通", "专家"],
    languageLevels: ["基础", "会话", "熟练", "流利", "母语"],
    details: "详细信息",
    dear: "尊敬的",
    hiringManager: "尊敬的招聘经理",
    sincerely: "此致",
    regarding: "关于：",
  },
  de: {
    present: "Heute",
    page: "Seite",
    of: "von",
    nationality: "Nationalität",
    placeOfBirth: "Geburtsort",
    dateOfBirth: "Geburtsdatum",
    drivingLicense: "Führerschein",
    address: "Adresse",
    referencesOnRequest: "Referenzen auf Anfrage",
    skillLevels: ["Anfänger", "Grundkenntnisse", "Gut", "Sehr gut", "Experte"],
    languageLevels: [
      "Grundkenntnisse",
      "Konversation",
      "Gut",
      "Fließend",
      "Muttersprache",
    ],
    details: "Kontakt",
    dear: "Guten Tag",
    hiringManager: "Sehr geehrte Damen und Herren",
    sincerely: "Mit freundlichen Grüßen",
    regarding: "Betreff:",
  },
}

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  pt: "Português (Portugal)",
  "pt-BR": "Português (Brasil)",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  "zh-CN": "简体中文",
}
