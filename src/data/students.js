/**
 * students.js
 * Données des apprenants inscris au centre de formation CONTROLE.
 * Chaque apprenant possède ses informations générales et un historique de connexions.
 * Pour modifier un apprenant, il suffit d'éditer les champs ci-dessous.
 */

export const students = [
  {
    id: 1,
    name: "Ahmed Benali",
    training: "Développement Web",
    trainer: "Jean Dupont",
    company: "Innov'Web",
    presence: "95%",
    progress: "78%",
    totalTime: "52h 15min",
    connections: [
      { date: "25/06/2026", login: "08:30", logout: "12:00", duration: "3h30" },
      { date: "26/06/2026", login: "09:00", logout: "12:30", duration: "3h30" },
      { date: "29/06/2026", login: "08:45", logout: "17:15", duration: "8h30" },
      { date: "30/06/2026", login: "09:00", logout: "11:45", duration: "2h45" }
    ]
  },
  {
    id: 2,
    name: "Marie Dubois",
    training: "UX/UI Design",
    trainer: "Sophie Martin",
    company: "Digital Agency",
    presence: "92%",
    progress: "85%",
    totalTime: "44h 10min",
    connections: [
      { date: "24/06/2026", login: "09:15", logout: "12:15", duration: "3h00" },
      { date: "25/06/2026", login: "14:00", logout: "17:30", duration: "3h30" },
      { date: "26/06/2026", login: "09:00", logout: "12:00", duration: "3h00" },
      { date: "29/06/2026", login: "08:30", logout: "16:30", duration: "8h00" }
    ]
  },
  {
    id: 3,
    name: "Thomas Martin",
    training: "Marketing Digital",
    trainer: "Marc Dubois",
    company: "Digital Agency",
    presence: "88%",
    progress: "60%",
    totalTime: "36h 45min",
    connections: [
      { date: "23/06/2026", login: "10:00", logout: "12:00", duration: "2h00" },
      { date: "24/06/2026", login: "10:00", logout: "15:00", duration: "5h00" },
      { date: "26/06/2026", login: "09:30", logout: "11:30", duration: "2h00" },
      { date: "29/06/2026", login: "09:00", logout: "16:00", duration: "7h00" }
    ]
  },
  {
    id: 4,
    name: "Sarah Meziane",
    training: "Administration Système & Cloud",
    trainer: "François Laurent",
    company: "Tech Solutions",
    presence: "98%",
    progress: "90%",
    totalTime: "68h 30min",
    connections: [
      { date: "25/06/2026", login: "08:00", logout: "12:00", duration: "4h00" },
      { date: "25/06/2026", login: "13:30", logout: "17:30", duration: "4h00" },
      { date: "26/06/2026", login: "08:15", logout: "12:15", duration: "4h00" },
      { date: "29/06/2026", login: "08:00", logout: "18:00", duration: "10h00" },
      { date: "30/06/2026", login: "08:30", logout: "12:30", duration: "4h00" }
    ]
  },
  {
    id: 5,
    name: "Lucas Bernard",
    training: "Data Science",
    trainer: "Amine Benjelloun",
    company: "DataCorp",
    presence: "85%",
    progress: "52%",
    totalTime: "31h 20min",
    connections: [
      { date: "22/06/2026", login: "14:00", logout: "17:00", duration: "3h00" },
      { date: "24/06/2026", login: "09:00", logout: "12:00", duration: "3h00" },
      { date: "26/06/2026", login: "13:30", logout: "16:30", duration: "3h00" },
      { date: "29/06/2026", login: "09:00", logout: "15:00", duration: "6h00" }
    ]
  },
  {
    id: 6,
    name: "Yasmine Khelil",
    training: "Développement Web",
    trainer: "Jean Dupont",
    company: "Innov'Web",
    presence: "94%",
    progress: "75%",
    totalTime: "49h 50min",
    connections: [
      { date: "25/06/2026", login: "08:30", logout: "12:15", duration: "3h45" },
      { date: "26/06/2026", login: "09:00", logout: "12:00", duration: "3h00" },
      { date: "29/06/2026", login: "08:45", logout: "17:00", duration: "8h15" },
      { date: "30/06/2026", login: "09:00", logout: "12:00", duration: "3h00" }
    ]
  },
  {
    id: 7,
    name: "Nicolas Petit",
    training: "Gestion de Projet",
    trainer: "Catherine Mercier",
    company: "EcoSystem France",
    presence: "90%",
    progress: "70%",
    totalTime: "40h 00min",
    connections: [
      { date: "23/06/2026", login: "09:00", logout: "12:00", duration: "3h00" },
      { date: "25/06/2026", login: "13:30", logout: "16:30", duration: "3h00" },
      { date: "26/06/2026", login: "09:00", logout: "12:00", duration: "3h00" },
      { date: "29/06/2026", login: "08:30", logout: "16:30", duration: "8h00" }
    ]
  },
  {
    id: 8,
    name: "Clara Martinez",
    training: "UX/UI Design",
    trainer: "Sophie Martin",
    company: "Digital Agency",
    presence: "96%",
    progress: "82%",
    totalTime: "46h 15min",
    connections: [
      { date: "24/06/2026", login: "09:00", logout: "12:30", duration: "3h30" },
      { date: "25/06/2026", login: "14:00", logout: "17:00", duration: "3h00" },
      { date: "26/06/2026", login: "09:00", logout: "12:00", duration: "3h00" },
      { date: "29/06/2026", login: "08:30", logout: "17:00", duration: "8h30" }
    ]
  }
];
