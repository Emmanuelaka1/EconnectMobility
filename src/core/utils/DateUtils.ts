export function getMonthDates() {
    const today = new Date();

    // Date du jour (locale)
    const current = today.toLocaleDateString("en-CA"); // yyyy-MM-dd

    // Début du mois (1er jour)
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
      .toLocaleDateString("en-CA");

    // Fin du mois (dernier jour)
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toLocaleDateString("en-CA");

    return { current, start, end };
}


export function formatWeekRange(startDate: string, endDate: string): string {
  // Tableaux pour jours et mois en français
  const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const debut = new Date(startDate);
  const fin = new Date(endDate);

  const debutStr = `${jours[debut.getDay()]} ${debut.getDate()} ${mois[debut.getMonth()]}`;
  const finStr = `${jours[fin.getDay()]} ${fin.getDate()} ${mois[fin.getMonth()]} ${fin.getFullYear()}`;

  return `Du ${debutStr} - ${finStr}`;
}

// Exemple
console.log(formatWeekRange("2025-08-11", "2025-08-17"));
// 👉 "Du Lundi 11 Août - Dimanche 17 Août 2025"