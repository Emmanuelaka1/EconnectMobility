import { WeekDto } from "../api/dataContratDto";

export const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] as const;

export const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"] as const;

const weeks = [] as WeekDto[];

export const toISODate = (dt: Date): string => dt.toLocaleDateString("en-CA");

export function toISOString(date: string | Date): string {
  if (typeof date === "string") 
    date = new Date(date);
  
  return date.toISOString();
}

export function formatDate(date: string | Date): string {
  if(date=== undefined) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // mois commence à 0
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export function getWeekCurrent() {
  const d = new Date();

  // Trouver le lundi
  const jourSemaine = d.getDay(); // 0=dimanche, 1=lundi...
  const diffLundi = (jourSemaine + 6) % 7; // distance jusqu'au lundi
  const lundi = new Date(d);
  lundi.setDate(d.getDate() - diffLundi);

  // Trouver le dimanche
  const dimanche = new Date(lundi);
  dimanche.setDate(lundi.getDate() + 6);

  return {
    dateStart: formatDate(lundi),
    dateEnd: formatDate(dimanche),
    formatted: formatWeekRange(formatDate(lundi), formatDate(dimanche)),
  };
}

export function getMonthDates(date: Date = new Date()) {
    const currentDay = toISODate(date);
    const start = toISODate(new Date(date.getFullYear(), date.getMonth(), 1));
    const end = toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    return { currentDay, start, end };
}


export function formatWeekRange(startDate: string, endDate: string): string {
  // Tableaux pour jours et mois en français
  const debut = new Date(startDate);
  const fin = new Date(endDate);

  const debutStr = `${jours[debut.getDay()]} ${debut.getDate()} ${mois[debut.getMonth()]}`;
  const finStr = `${jours[fin.getDay()]} ${fin.getDate()} ${mois[fin.getMonth()]} ${fin.getFullYear()}`;

  return `Du ${debutStr} - ${finStr}`;
}

export function getWeekCode(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Ajuster au jeudi de la semaine courante (ISO 8601)
  const dayNum = d.getUTCDay() || 7; // dimanche = 0 → 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  // Calculer le début de l'année
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Numéro de semaine ISO
  const weekNum = Math.ceil(((Number(d) - Number(yearStart)) / 86400000 + 1) / 7);

  // Format "SNN-YYYY"
  return `S${String(weekNum).padStart(2, "0")}-${d.getUTCFullYear()}`;
}

export function getWeeksOfYear(year: number) {
 let id = 0; // or use a unique value if needed
  if (weeks.length > 0) return weeks;

  // Commencer au 1er janvier
  const current = new Date(Date.UTC(year, 0, 1));
  // Aller jusqu'au premier lundi
  const dayNum = current.getUTCDay() || 7; // 0=dimanche -> 7
  if (dayNum !== 1) current.setUTCDate(current.getUTCDate() + (8 - dayNum));

  // Boucler jusqu'à la fin de l'année
  while (current.getUTCFullYear() === year) {
    const monday = new Date(current);
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);

    // Calculer code semaine ISO
    const d = new Date(monday);
    const dayOfWeek = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayOfWeek);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil(((Number(d) - Number(yearStart)) / 86400000 + 1) / 7);

    // Format "SNN-YYYY"
    const weekCode = `S${String(weekNum).padStart(2, "0")}-${d.getUTCFullYear()}`;
    // Ajouter l'objet
    weeks.push({
      id: ++id, // ou utilisez un identifiant unique si nécessaire
      week : weekCode,
      dateStart: formatDate(monday), // yyyy-MM-dd
      dateEnd: formatDate(sunday),
    });

    // Semaine suivante
    current.setUTCDate(current.getUTCDate() + 7);
  }

  return weeks;
}

export function getNextWeek(week:string): WeekDto | undefined {
    const currentWeek = weeks.find(w => w.week === week);
  if (!currentWeek) return undefined;

  const currentIndex = weeks.indexOf(currentWeek);
  return weeks[currentIndex + 1];
}

export function getPreviousWeek(week:string): WeekDto | undefined {
  const currentWeek = weeks.find(w => w.week === week);
  if (!currentWeek) return undefined;

  const currentIndex = weeks.indexOf(currentWeek);
  return weeks[currentIndex - 1];
}

export function toISOWeek(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((Number(d) - Number(yearStart)) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}