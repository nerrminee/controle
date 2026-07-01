/**
 * planning.js
 * Données du planning pédagogique importées depuis le fichier Excel.
 * Élève : ALEXANDRE MAXIME | Code : 252220767 | Formation : LOGISTIQUE (BAC PRO)
 * Contrat : 01/09/2025 au 15/05/2026
 *
 * Remarque : Les colonnes "Adresse IP", "Heure d'entrée", "Heure de sortie"
 * et "Temps de connexion" ne figurent pas dans le fichier source — elles sont
 * laissées vides conformément aux consignes.
 */

// Informations générales de l'apprenant
export const planningInfo = {
  eleve: "Alexandre Maxime",
  code: "252220767",
  formation: "Logistique (Bac Pro)",
  contratDebut: "01/09/2025",
  contratFin: "15/05/2026",
  totalSemaines: 37,
  semainesEcole: 13,
  semainesEntreprise: 24,
  joursFeeries: 7
};

// Tableau complet des entrées du planning (une ligne par entrée du fichier Excel)
export const planning = [

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 1 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 1, semaine: 1,
    date: "01/09/2025", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Le double du bon de commande : rôle et contenu ; [G1] La formation du contrat de transport ; [G1] Marchandises conditionnées : typologie ; [G1] Pictogrammes de manutention (fragile, haut/bas...) ; [G1] Les palettes : types et normes (Europe, perdue)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 2, semaine: 1,
    date: "02/09/2025", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Les documents de transport : lettre de voiture, CMR ; [G1] L'exécution du contrat de transport ; [G1] Denrées périssables : contraintes spécifiques ; [G1] Pictogrammes de danger (ADR/SGH) ; [G1] Les rolls et caisses palettes",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 3, semaine: 1,
    date: "03/09/2025", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 4, semaine: 1,
    date: "04/09/2025", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Le bon de livraison : mentions obligatoires ; [G1] Les prestations de base et prestations annexes ; [G1] Marchandises en vrac : manutention adaptée ; [G1] Exercice d'identification de pictogrammes ; [G1] Supports perdus / consignés / échangés nombre pour nombre",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 5, semaine: 1,
    date: "05/09/2025", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Le bon de réception : exercice de remplissage ; [G1] Les conditions de paiement : étude de cas ; [G1] Étude de cas : choix du mode de stockage selon la marchandise ; [G1] Quiz récapitulatif pictogrammes ; [G1] Exercice pratique : choix du support adapté",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 2 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 6, semaine: 2,
    date: "08/09 → 12/09/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 3 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 7, semaine: 3,
    date: "15/09 → 19/09/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 4 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 8, semaine: 4,
    date: "22/09/2025", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Matériels de manutention manuelle (transpalette manuel, diable) ; [G1] Les précautions de manipulation manuelle ; [G1] Comparer marchandises annoncées et commandées ; [G1] La dépalettisation des produits ; [G1] Accueillir le conducteur : procédure",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 9, semaine: 4,
    date: "23/09/2025", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Matériels de manutention mécanisée : présentation ; [G1] Postures et gestes professionnels (PRAP) ; [G1] Comparer marchandises annoncées et livrées ; [G1] Le dépotage de conteneur ; [G1] Vérifier la conformité de la livraison",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 10, semaine: 4,
    date: "24/09/2025", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Critères de choix du matériel selon la tâche ; [G1] La circulation sur les quais et zones d'activité ; [G1] Contrôler l'état apparent des colis ; [G1] Le reconditionnement en unités de stockage ; [G1] Réaliser les opérations de déchargement",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 11, semaine: 4,
    date: "25/09/2025", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Visite/étude des équipements de l'entrepôt type ; [G1] Les protocoles de sécurité en entreprise ; [G1] Les techniques de comptage ; [G1] Exercice pratique de reconditionnement ; [G1] Accepter ou refuser la marchandise (réserves)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 12, semaine: 4,
    date: "26/09/2025", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Exercice : associer matériel et type de marchandise ; [G1] Mise en situation : analyse d'une situation à risque ; [G1] Exercice pratique de contrôle réception ; [G1] Évaluation formative : process de reconditionnement ; [G1] Saisir les informations et remettre la zone en état",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 5 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 13, semaine: 5,
    date: "29/09 → 03/10/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 6 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 14, semaine: 6,
    date: "06/10 → 10/10/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 7 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 15, semaine: 7,
    date: "13/10/2025", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Préparer / reconditionner les marchandises ; [G2] Le bon de commande client ; [G2] Les plans de circulation dans l'entrepôt ; [G2] Les règles de constitution d'une palette ; [G2] Les différents types d'emballages",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 16, semaine: 7,
    date: "14/10/2025", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Identifier les adresses de mise à disposition ; [G2] Le bon de préparation de commande ; [G2] Les plans de stockage et d'adressage ; [G2] Stabilité : poids et répartition de la charge ; [G2] Le calage des colis/produits",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 17, semaine: 7,
    date: "15/10/2025", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Préparer le matériel nécessaire au transfert ; [G2] Le terminal embarqué : fonctionnement ; [G2] Les circuits de prélèvement optimisés ; [G2] Le plan de palettisation : lecture ; [G2] Le cerclage et le filmage",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 18, semaine: 7,
    date: "16/10/2025", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Participer aux opérations de stockage ; [G2] Les tarifs et grilles tarifaires ; [G2] Méthodes : picking par commande / par lot ; [G2] Calcul du volume et du poids d'une palette ; [G2] Ruban adhésif, agrafes : usages",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 19, semaine: 7,
    date: "17/10/2025", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G1] Valider les informations relatives au stockage ; [G2] Exercice : lecture d'un bon de préparation ; [G2] Exercice pratique : tracer un circuit de prélèvement ; [G2] Exercice pratique de palettisation ; [G2] Exercice pratique d'emballage",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 8 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 20, semaine: 8,
    date: "20/10 → 24/10/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 9 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 21, semaine: 9,
    date: "27/10 → 31/10/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 10 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 22, semaine: 10,
    date: "03/11/2025", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G2] La valorisation du stock ; [G2] La confidentialité des données ; [G2] Suivre ou établir le circuit de préparation ; [G2] Accueillir les conducteurs ; [G3] Les donneurs d'ordre et expéditeurs",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 23, semaine: 10,
    date: "04/11/2025", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G2] Stocks actifs, dormants et stocks morts ; [G2] La préservation des intérêts de l'entreprise ; [G2] Prélever les produits demandés ; [G2] Contrôler les expéditions ; [G3] Les transporteurs",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 24, semaine: 10,
    date: "05/11/2025", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G2] Les méthodes de comptage d'inventaire ; [G2] La posture professionnelle attendue ; [G2] Constituer une unité de charge stable ; [G2] Éditer les documents de transport ; [G3] Les commissionnaires et mandataires de transport",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 25, semaine: 10,
    date: "06/11/2025", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G2] Le calcul et l'analyse des écarts ; [G2] Étude de cas : dilemme éthique en entrepôt ; [G2] Réaliser un inventaire et signaler les anomalies ; [G2] Réaliser les opérations de chargement ; [G3] Les prestataires logistiques et intégrateurs",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 26, semaine: 10,
    date: "07/11/2025", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G2] Le cycle de vie du produit ; [G2] Débat / mise en situation collective ; [G2] Emballer, peser, étiqueter et transférer la commande ; [G2] Remettre la zone d'expédition en état ; [G3] Schéma récapitulatif de la chaîne logistique",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 11 — ENTREPRISE (Férié 11/11)
  // ════════════════════════════════════════════════════════════════
  {
    id: 27, semaine: 11,
    date: "10/11 → 14/11/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: "11 novembre",
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 12 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 28, semaine: 12,
    date: "17/11 → 21/11/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 13 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 29, semaine: 13,
    date: "24/11/2025", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G3] L'organigramme de l'entreprise ; [G3] Les espaces logistiques : quais, zones de stockage ; [G3] Les moyens nécessaires à la réception ; [G3] La distinction entre anomalie et litige ; [G3] L'ordonnancement des préparations",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 30, semaine: 13,
    date: "25/11/2025", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G3] Les liaisons fonctionnelles ; [G3] Les équipements de quai (niveleur, sas, rampe) ; [G3] Les documents nécessaires à la réception ; [G3] Le contenu des réserves ; [G3] L'élaboration du bon de préparation",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 31, semaine: 13,
    date: "26/11/2025", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G3] Les liaisons hiérarchiques ; [G3] Les outils de saisie : scanners, RFID ; [G3] Les étiquettes et la fiche article ; [G3] Relever les anomalies et avaries ; [G3] Les modes de préparation par priorité",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 32, semaine: 13,
    date: "27/11/2025", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G3] Les principaux services logistiques ; [G3] Le plan de circulation et la signalisation ; [G3] L'ordonnancement des réceptions ; [G3] Préparer un dossier litige ; [G3] Les modes de préparation par lots",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 33, semaine: 13,
    date: "28/11/2025", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G3] Les postes de travail dans l'entrepôt ; [G3] Les équipements de sécurité de l'entrepôt ; [G3] Exercice : planifier une journée de réception ; [G3] Suivre un dossier litige jusqu'à sa clôture ; [G3] Les supports de préparation (RFID, voice picking)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 14 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 34, semaine: 14,
    date: "01/12 → 05/12/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 15 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 35, semaine: 15,
    date: "08/12 → 12/12/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 16 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 36, semaine: 16,
    date: "15/12/2025", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G3] Types et silhouettes de véhicules routiers ; [G3] Géographie des transports en France ; [G3] Définition et objectifs du tableau de bord ; [G3] Les consignes de travail et fiches de procédure ; [G4] Les zones de réserve et de prélèvement",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 37, semaine: 16,
    date: "16/12/2025", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G3] Les carrosseries et leurs usages ; [G3] Géographie des transports en Union Européenne ; [G3] Le taux de rupture et le taux de retard ; [G3] Les protocoles de sécurité ; [G4] Les flux de marchandises",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 38, semaine: 16,
    date: "17/12/2025", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G3] Calcul du poids maximum autorisé et charge utile ; [G3] La réalisation de tournées de livraison ; [G3] Le nombre de litiges et le taux de satisfaction client ; [G3] Les normes qualité en logistique ; [G4] Les flux d'informations",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 39, semaine: 16,
    date: "18/12/2025", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G3] Les conteneurs : types et volumes ; [G3] Le plan de chargement du véhicule ; [G3] Le taux d'occupation de l'entrepôt ; [G3] Les règles d'hygiène ; [G4] L'implantation horizontale et verticale",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 40, semaine: 16,
    date: "19/12/2025", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G3] L'intermodalité dans le transport ; [G3] Exercice pratique : optimiser une tournée ; [G3] Construire un tableau de bord simple ; [G3] Étude de cas : audit qualité simplifié ; [G4] La sécurité et la sûreté de la zone de stockage",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 17 — ENTREPRISE (Férié 25/12)
  // ════════════════════════════════════════════════════════════════
  {
    id: 41, semaine: 17,
    date: "22/12 → 26/12/2025", jour: "Lun → Ven", type: "ENTREPRISE", ferie: "25 décembre",
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 18 — ENTREPRISE (Férié 1/1)
  // ════════════════════════════════════════════════════════════════
  {
    id: 42, semaine: 18,
    date: "29/12 → 02/01/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: "1er janvier",
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 19 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 43, semaine: 19,
    date: "05/01/2026", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G4] Les rayonnages : types et usages ; [G4] L'adressage des emplacements ; [G4] Le taux de rotation ; [G4] Les mouvements de stock ; [G4] L'achat des supports de charge",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 44, semaine: 19,
    date: "06/01/2026", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G4] Les palettiers ; [G4] Méthode d'affectation : emplacements identifiés ; [G4] Le taux de couverture et le taux de service ; [G4] Le stock potentiel : réservé, en commande, reliquat ; [G4] La location des supports de charge",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 45, semaine: 19,
    date: "07/01/2026", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G4] Calculs et choix d'échelles et de lisses ; [G4] Méthode d'affectation : emplacements banalisés ; [G4] La consommation moyenne ; [G4] Délai d'acquisition, stock minimum, stock maximum ; [G4] La consignation des supports de charge",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 46, semaine: 19,
    date: "08/01/2026", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G4] Les accessoires de stockage ; [G4] Méthode d'affectation : emplacements aléatoires ; [G4] Le stock moyen ; [G4] Le coût de possession et le coût d'acquisition ; [G4] Le suivi administratif des emballages",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 47, semaine: 19,
    date: "09/01/2026", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G4] Exercice : dimensionner un palettier ; [G4] La réimplantation des stocks ; [G4] Les écarts d'inventaire : calcul ; [G4] La quantité économique à commander ; [G4] Le suivi physique des emballages",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 20 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 48, semaine: 20,
    date: "12/01 → 16/01/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 21 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 49, semaine: 21,
    date: "19/01 → 23/01/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 22 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 50, semaine: 22,
    date: "26/01/2026", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G4] La réglementation sur les déchets ; [G4] Identifier la zone de stockage adaptée ; [G5] Les conditions requises pour conduire un chariot ; [G5] Le rôle de la CARSAT",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 51, semaine: 22,
    date: "27/01/2026", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G4] La nature des déchets en entrepôt ; [G4] Affecter les marchandises aux zones de stockage ; [G5] La responsabilité civile du conducteur ; [G5] Le rôle de l'INRS",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 52, semaine: 22,
    date: "28/01/2026", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G4] Le tri sélectif des déchets ; [G4] Déclencher le réapprovisionnement ; [G5] La responsabilité pénale du conducteur ; [G5] Le rôle de l'inspection du travail",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 53, semaine: 22,
    date: "29/01/2026", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G4] La réutilisation et la valorisation ; [G4] Préparer l'inventaire ; [G5] L'autorisation de conduite délivrée par l'employeur ; [G5] Les recommandations CNAMTS (R489)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 54, semaine: 22,
    date: "30/01/2026", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G4] Exercice : organiser une collecte de déchets ; [G4] Analyser et corriger les écarts ; [G5] Étude de cas réglementaire ; [G5] Synthèse des organismes de prévention",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 23 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 55, semaine: 23,
    date: "02/02 → 06/02/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 24 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 56, semaine: 24,
    date: "09/02 → 13/02/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 25 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 57, semaine: 25,
    date: "16/02/2026", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] L'accidentabilité au travail en logistique ; [G5] Présentation catégorie 1 : transpalette à conducteur porté ; [G5] Le circuit hydraulique ; [G5] Les indicateurs du tableau de bord",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 58, semaine: 25,
    date: "17/02/2026", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] Les situations de danger grave et imminent ; [G5] Présentation catégorie 3 : chariot frontal ; [G5] La batterie et les risques associés ; [G5] Les types de batteries et leur choix",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 59, semaine: 25,
    date: "18/02/2026", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] La stabilité du chariot : notion de pivot et moment ; [G5] Présentation catégorie 5 : chariot à mât rétractable ; [G5] Le système de freinage ; [G5] Motorisation thermique vs électrique",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 60, semaine: 25,
    date: "19/02/2026", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] La plaque de charge et le diagramme de capacité ; [G5] Rôle de chaque catégorie dans la manutention ; [G5] Les pneumatiques ; [G5] La maintenance de premier niveau",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 61, semaine: 25,
    date: "20/02/2026", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] Distances de freinage et temps de réaction ; [G5] Exercice : associer chariot et tâche ; [G5] La plaque de charge et hauteurs caractéristiques ; [G5] Exercice pratique de vérification avant utilisation",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 26 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 62, semaine: 26,
    date: "23/02 → 27/02/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 27 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 63, semaine: 27,
    date: "02/03 → 06/03/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 28 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 64, semaine: 28,
    date: "09/03/2026", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] Les vérifications de sécurité avant utilisation ; [G5] Les EPI liés à la manutention ; [G5] Prise en charge du chariot catégorie 1 ; [G5] Prise en charge du chariot catégorie 3",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 65, semaine: 28,
    date: "10/03/2026", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] L'installation au poste de conduite ; [G5] La signalisation et son rôle ; [G5] Circulation à vide et chargé ; [G5] Circulation et positionnement",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 66, semaine: 28,
    date: "11/03/2026", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] Les manœuvres du chariot ; [G5] Les pictogrammes de manutention ; [G5] Prise et levage d'une charge ; [G5] Gerbage et dégerbage en pile",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 67, semaine: 28,
    date: "12/03/2026", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] La faisabilité de la prise d'une charge ; [G5] Les symboles des produits dangereux ; [G5] Immobilisation et stationnement ; [G5] Gerbage et dégerbage en palettier",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 68, semaine: 28,
    date: "13/03/2026", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] Le signalement d'anomalies ; [G5] Quiz récapitulatif EPI ; [G5] Évaluation pratique blanche catégorie 1 ; [G5] Chargement/déchargement d'un véhicule par le côté",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 29 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 69, semaine: 29,
    date: "16/03 → 20/03/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 30 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 70, semaine: 30,
    date: "23/03 → 27/03/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 31 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 71, semaine: 31,
    date: "30/03/2026", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] Prise en charge du chariot catégorie 5 ; [G6] Les composantes de la communication ; [G6] L'écoute active ; [G6] La préparation de la communication téléphonique",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 72, semaine: 31,
    date: "31/03/2026", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] Circulation en espace restreint ; [G6] Le contexte de la communication ; [G6] Les signes verbaux et non-verbaux ; [G6] L'accueil téléphonique",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 73, semaine: 31,
    date: "01/04/2026", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] Mise en stock à hauteur (jusqu'à 6m) ; [G6] L'argumentation et la qualité du message ; [G6] L'empathie et l'assertivité ; [G6] La prise en compte de la demande",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 74, semaine: 31,
    date: "02/04/2026", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] Déstockage en hauteur ; [G6] Le registre de langue ; [G6] Le travail en équipe ; [G6] Le transfert d'appel et la prise de message",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 75, semaine: 31,
    date: "03/04/2026", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G5] Évaluation pratique blanche catégorie 5 ; [G6] La dimension interculturelle et la confidentialité ; [G6] La gestion du stress en situation professionnelle ; [G6] Mise en situation : appel client/fournisseur",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 32 — ENTREPRISE (Férié 6/4)
  // ════════════════════════════════════════════════════════════════
  {
    id: 76, semaine: 32,
    date: "06/04 → 10/04/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: "6 avril",
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 33 — ENTREPRISE
  // ════════════════════════════════════════════════════════════════
  {
    id: 77, semaine: 33,
    date: "13/04 → 17/04/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: null,
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 34 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 78, semaine: 34,
    date: "20/04/2026", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[G6] La rédaction de courriels professionnels ; [G6] Les types de réseaux : Internet, Intranet, Extranet ; [G6] Les principales règles du classement ; [G6] Accueillir ou contacter l'interlocuteur",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 79, semaine: 34,
    date: "21/04/2026", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[G6] La rédaction de télécopies ; [G6] L'EDI (échange de données informatisé) ; [G6] L'archivage papier ; [G6] Identifier le besoin de l'interlocuteur",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 80, semaine: 34,
    date: "22/04/2026", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[G6] La prise de notes efficace ; [G6] Les règles et droits d'accès aux données ; [G6] L'archivage numérique ; [G6] Collecter et transmettre des informations",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 81, semaine: 34,
    date: "23/04/2026", jour: "Jeudi", type: "ÉCOLE", ferie: null,
    contenu: "[G6] Exercice de rédaction d'un mail de réclamation ; [G6] Les agendas partagés ; [G6] Exercice pratique de classement ; [G6] Formuler une réponse orale ou écrite",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 82, semaine: 34,
    date: "24/04/2026", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[G6] Relecture et correction de courriers professionnels ; [G6] Les plateformes de travail collaboratif ; [G6] Synthèse : cycle de vie d'un document logistique ; [G6] Rendre compte à sa hiérarchie",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 35 — ENTREPRISE (Férié 1/5)
  // ════════════════════════════════════════════════════════════════
  {
    id: 83, semaine: 35,
    date: "27/04 → 01/05/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: "1er mai",
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 36 — ENTREPRISE (Férié 8/5)
  // ════════════════════════════════════════════════════════════════
  {
    id: 84, semaine: 36,
    date: "04/05 → 08/05/2026", jour: "Lun → Ven", type: "ENTREPRISE", ferie: "8 mai",
    contenu: "Période en entreprise (suivi par le tuteur)",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },

  // ════════════════════════════════════════════════════════════════
  // SEMAINE 37 — ÉCOLE
  // ════════════════════════════════════════════════════════════════
  {
    id: 85, semaine: 37,
    date: "11/05/2026", jour: "Lundi", type: "ÉCOLE", ferie: null,
    contenu: "[PSE] La démarche de résolution de problème ; [EVAL] Méthodologie de la fiche d'activité professionnelle ; [EVAL] Révision QCM : réglementation et sécurité ; [EVAL] Méthodologie de l'étude de cas E2",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 86, semaine: 37,
    date: "12/05/2026", jour: "Mardi", type: "ÉCOLE", ferie: null,
    contenu: "[PSE] L'analyse par le risque ; [EVAL] Rédaction fiche n°1 : réception ; [EVAL] Révision QCM : plaque de charge ; [EVAL] Entraînement : cas flux entrants",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 87, semaine: 37,
    date: "13/05/2026", jour: "Mercredi", type: "ÉCOLE", ferie: null,
    contenu: "[PSE] L'analyse par le travail ; [EVAL] Rédaction fiche n°2 : préparation/expédition ; [EVAL] Révision QCM : diagramme de capacité ; [EVAL] Entraînement : cas flux sortants",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 88, semaine: 37,
    date: "14/05/2026", jour: "Jeudi", type: "FÉRIÉ", ferie: "Ascension",
    contenu: "FÉRIÉ — pas de cours",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  },
  {
    id: 89, semaine: 37,
    date: "15/05/2026", jour: "Vendredi", type: "ÉCOLE", ferie: null,
    contenu: "[PSE] Agir face à une situation d'urgence ; [EVAL] Relecture et entraînement à l'oral E31 ; [EVAL] Correction et points de vigilance E32 ; [EVAL] Sujet blanc E2 complet",
    ip: "", heureEntree: "", heureSortie: "", tempsConnexion: ""
  }
];
