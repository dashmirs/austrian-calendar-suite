// Lightweight i18n: 12 languages, German default
export type Lang =
  | "de" | "en" | "sq" | "it" | "fr" | "es" | "tr" | "hr" | "sr" | "pl" | "ro" | "ar";

export const LANGUAGES: { code: Lang; name: string; flag: string }[] = [
  { code: "de", name: "Deutsch", flag: "🇦🇹" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sq", name: "Shqip", flag: "🇦🇱" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
  { code: "sr", name: "Српски", flag: "🇷🇸" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

type Dict = Record<string, string>;

const de: Dict = {
  appTitle: "Österreichischer Kalender",
  today: "Heute",
  newAppointment: "Neuer Termin",
  appointments: "Termine",
  holidays: "Feiertage",
  namenstag: "Namenstag",
  language: "Sprache",
  settings: "Einstellungen",
  title: "Titel",
  description: "Beschreibung",
  date: "Datum",
  time: "Uhrzeit",
  reminder: "Erinnerung",
  save: "Speichern",
  cancel: "Abbrechen",
  delete: "Löschen",
  noAppointments: "Keine Termine an diesem Tag",
  workFree: "Arbeitsfrei",
  observance: "Brauchtum",
  reminderMinutes: "Minuten vorher",
  none: "Keine",
  at: "um",
  monthly: "Monat",
  selectDate: "Datum wählen",
  // Holiday names
  neujahr: "Neujahr",
  heiligeDreiKoenige: "Heilige Drei Könige",
  ostermontag: "Ostermontag",
  staatsfeiertag: "Staatsfeiertag",
  christiHimmelfahrt: "Christi Himmelfahrt",
  pfingstmontag: "Pfingstmontag",
  fronleichnam: "Fronleichnam",
  mariaeHimmelfahrt: "Mariä Himmelfahrt",
  nationalfeiertag: "Nationalfeiertag",
  allerheiligen: "Allerheiligen",
  mariaeEmpfaengnis: "Mariä Empfängnis",
  christtag: "Christtag",
  stefanitag: "Stefanitag",
  palmsonntag: "Palmsonntag",
  gruendonnerstag: "Gründonnerstag",
  karfreitag: "Karfreitag",
  ostersonntag: "Ostersonntag",
  pfingstsonntag: "Pfingstsonntag",
  valentinstag: "Valentinstag",
  florianitag: "Florianitag",
  reformationstag: "Reformationstag",
  martinstag: "Martinstag",
  leopolditag: "Leopolditag",
  nikolaus: "Nikolaus",
  heiligabend: "Heiliger Abend",
  silvester: "Silvester",
};

const en: Dict = {
  ...de,
  appTitle: "Austrian Calendar",
  today: "Today",
  newAppointment: "New appointment",
  appointments: "Appointments",
  holidays: "Holidays",
  namenstag: "Name day",
  language: "Language",
  settings: "Settings",
  title: "Title",
  description: "Description",
  date: "Date",
  time: "Time",
  reminder: "Reminder",
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  noAppointments: "No appointments on this day",
  workFree: "Work-free",
  observance: "Observance",
  reminderMinutes: "minutes before",
  none: "None",
  at: "at",
  monthly: "Month",
  selectDate: "Select date",
};

const sq: Dict = {
  ...de,
  appTitle: "Kalendari Austriak",
  today: "Sot",
  newAppointment: "Termin i ri",
  appointments: "Terminet",
  holidays: "Festat",
  namenstag: "Dita e emrit",
  language: "Gjuha",
  settings: "Cilësimet",
  title: "Titulli",
  description: "Përshkrimi",
  date: "Data",
  time: "Ora",
  reminder: "Kujtues",
  save: "Ruaj",
  cancel: "Anulo",
  delete: "Fshij",
  noAppointments: "Pa termine në këtë ditë",
  workFree: "Pa punë",
  observance: "Zakon",
  reminderMinutes: "minuta më parë",
  none: "Asnjë",
  at: "në",
  monthly: "Muaji",
  selectDate: "Zgjidh datën",
};

const it: Dict = { ...en, appTitle: "Calendario Austriaco", today: "Oggi", newAppointment: "Nuovo appuntamento", appointments: "Appuntamenti", holidays: "Festività", namenstag: "Onomastico", language: "Lingua", settings: "Impostazioni", title: "Titolo", description: "Descrizione", date: "Data", time: "Ora", reminder: "Promemoria", save: "Salva", cancel: "Annulla", delete: "Elimina", noAppointments: "Nessun appuntamento", workFree: "Festivo", observance: "Ricorrenza", reminderMinutes: "minuti prima", none: "Nessuno", at: "alle", monthly: "Mese", selectDate: "Scegli data" };
const fr: Dict = { ...en, appTitle: "Calendrier Autrichien", today: "Aujourd'hui", newAppointment: "Nouveau rendez-vous", appointments: "Rendez-vous", holidays: "Fêtes", namenstag: "Fête du prénom", language: "Langue", settings: "Paramètres", title: "Titre", description: "Description", date: "Date", time: "Heure", reminder: "Rappel", save: "Enregistrer", cancel: "Annuler", delete: "Supprimer", noAppointments: "Aucun rendez-vous", workFree: "Férié", observance: "Tradition", reminderMinutes: "minutes avant", none: "Aucun", at: "à", monthly: "Mois", selectDate: "Choisir date" };
const es: Dict = { ...en, appTitle: "Calendario Austriaco", today: "Hoy", newAppointment: "Nueva cita", appointments: "Citas", holidays: "Festivos", namenstag: "Onomástico", language: "Idioma", settings: "Ajustes", title: "Título", description: "Descripción", date: "Fecha", time: "Hora", reminder: "Recordatorio", save: "Guardar", cancel: "Cancelar", delete: "Eliminar", noAppointments: "Sin citas", workFree: "Festivo", observance: "Conmemoración", reminderMinutes: "minutos antes", none: "Ninguno", at: "a las", monthly: "Mes", selectDate: "Elegir fecha" };
const tr: Dict = { ...en, appTitle: "Avusturya Takvimi", today: "Bugün", newAppointment: "Yeni randevu", appointments: "Randevular", holidays: "Tatiller", namenstag: "İsim günü", language: "Dil", settings: "Ayarlar", title: "Başlık", description: "Açıklama", date: "Tarih", time: "Saat", reminder: "Hatırlatıcı", save: "Kaydet", cancel: "İptal", delete: "Sil", noAppointments: "Randevu yok", workFree: "Tatil", observance: "Anma", reminderMinutes: "dakika önce", none: "Yok", at: "saat", monthly: "Ay", selectDate: "Tarih seç" };
const hr: Dict = { ...en, appTitle: "Austrijski kalendar", today: "Danas", newAppointment: "Novi termin", appointments: "Termini", holidays: "Praznici", namenstag: "Imendan", language: "Jezik", settings: "Postavke", title: "Naslov", description: "Opis", date: "Datum", time: "Vrijeme", reminder: "Podsjetnik", save: "Spremi", cancel: "Odustani", delete: "Obriši", noAppointments: "Nema termina", workFree: "Neradni", observance: "Običaj", reminderMinutes: "minuta prije", none: "Nema", at: "u", monthly: "Mjesec", selectDate: "Odaberi datum" };
const sr: Dict = { ...en, appTitle: "Аустријски календар", today: "Данас", newAppointment: "Нови термин", appointments: "Термини", holidays: "Празници", namenstag: "Имендан", language: "Језик", settings: "Подешавања", title: "Наслов", description: "Опис", date: "Датум", time: "Време", reminder: "Подсетник", save: "Сачувај", cancel: "Откажи", delete: "Обриши", noAppointments: "Нема термина", workFree: "Нерадни", observance: "Обичај", reminderMinutes: "минута пре", none: "Нема", at: "у", monthly: "Месец", selectDate: "Изабери датум" };
const pl: Dict = { ...en, appTitle: "Kalendarz Austriacki", today: "Dziś", newAppointment: "Nowe spotkanie", appointments: "Spotkania", holidays: "Święta", namenstag: "Imieniny", language: "Język", settings: "Ustawienia", title: "Tytuł", description: "Opis", date: "Data", time: "Godzina", reminder: "Przypomnienie", save: "Zapisz", cancel: "Anuluj", delete: "Usuń", noAppointments: "Brak spotkań", workFree: "Wolne", observance: "Obchody", reminderMinutes: "minut przed", none: "Brak", at: "o", monthly: "Miesiąc", selectDate: "Wybierz datę" };
const ro: Dict = { ...en, appTitle: "Calendar Austriac", today: "Azi", newAppointment: "Programare nouă", appointments: "Programări", holidays: "Sărbători", namenstag: "Onomastica", language: "Limba", settings: "Setări", title: "Titlu", description: "Descriere", date: "Data", time: "Ora", reminder: "Memento", save: "Salvează", cancel: "Anulează", delete: "Șterge", noAppointments: "Nicio programare", workFree: "Liber", observance: "Comemorare", reminderMinutes: "minute înainte", none: "Niciuna", at: "la", monthly: "Luna", selectDate: "Alege data" };
const ar: Dict = { ...en, appTitle: "التقويم النمساوي", today: "اليوم", newAppointment: "موعد جديد", appointments: "المواعيد", holidays: "العطلات", namenstag: "عيد الاسم", language: "اللغة", settings: "الإعدادات", title: "العنوان", description: "الوصف", date: "التاريخ", time: "الوقت", reminder: "تذكير", save: "حفظ", cancel: "إلغاء", delete: "حذف", noAppointments: "لا توجد مواعيد", workFree: "عطلة", observance: "مناسبة", reminderMinutes: "دقيقة قبل", none: "بدون", at: "في", monthly: "الشهر", selectDate: "اختر التاريخ" };

export const TRANSLATIONS: Record<Lang, Dict> = { de, en, sq, it, fr, es, tr, hr, sr, pl, ro, ar };

export const DATE_LOCALE: Record<Lang, string> = {
  de: "de-AT", en: "en-GB", sq: "sq-AL", it: "it-IT", fr: "fr-FR", es: "es-ES",
  tr: "tr-TR", hr: "hr-HR", sr: "sr-RS", pl: "pl-PL", ro: "ro-RO", ar: "ar-SA",
};
