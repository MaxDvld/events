// Page "Calendrier" : affiche les événements dans un calendrier (avec FullCalendar v7)
// useState : stocker les événements / useEffect : lancer le chargement à l'ouverture de la page
import { useEffect, useState } from "react";
// Le service qui demande les événements au back (GET /events)
import eventsServices from "../Services/eventsServices";
// useNavigate : changer de page depuis le code (au clic sur un événement)
import { useNavigate } from "react-router";
// Composants MUI pour la mise en page (titre, bouton, cadre)
import { Box, Button, Stack, Typography } from "@mui/material";

// FullCalendar v7 : TOUT est dans le package @fullcalendar/react
// Les styles (CSS) : la base + le thème + ses couleurs. Sans eux, le calendrier est tout moche
import "@fullcalendar/react/skeleton.css"; // ALWAYS NEED SKELETON (toujours obligatoire)
import "@fullcalendar/react/themes/monarch/theme.css"; // YOUR THEME (le thème)
import "@fullcalendar/react/themes/monarch/palettes/purple.css"; // YOUR THEME'S PALETTE (couleurs : blue, green, purple, red, yellow)
// Le composant calendrier
import FullCalendar from "@fullcalendar/react";
// Plugin "thème" : l'apparence du calendrier (monarch)
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
// Plugin "dayGrid" : l'affichage en grille (un mois = des cases par jour)
import dayGridPlugin from "@fullcalendar/react/daygrid";
// Plugin "interaction" : clics, glisser-déposer des événements
import interactionPlugin from "@fullcalendar/react/interaction";
// La langue française (jours, mois, boutons). Adapté : en v7, il faut importer la langue
import frLocale from "@fullcalendar/react/locales/fr";


function CalendarPage() {
  // VARIABLES
  // La liste des événements, vide au départ (un tableau vide [])
  const [events, setEvents] = useState([]);
  // navigate : pour changer de page depuis le code
  const navigate = useNavigate();

  // TRAITEMENTS
  // Va chercher tous les événements au back, les "traduit" pour FullCalendar, puis les range dans "events"
  const fetchEvents = async () => {
    try {
      const response = await eventsServices.getAll();

      // Ex. d'événement du back : { ev_id: 12, ev_title: "Concert", ev_date: "2026-11-14...", ev_location: "Nantes", ... }
      // FullCalendar, lui, attend d'autres noms : { id, title, start }
      // => map "traduit" chaque événement du back au format FullCalendar
      const calendarEvents = response.data.map((event) => ({
        id: event.ev_id,        // le numéro de l'événement
        title: event.ev_title,  // le texte affiché dans la case du jour
        start: event.ev_date,   // le jour où placer l'événement
        allDay: true,           // ev_date est une date sans heure → événement "toute la journée"
        // extendedProps = un "sac" pour NOS infos en plus, que FullCalendar ne connaît pas
        extendedProps: {
            localisation : event.ev_location,
            description : event.ev_description
        },
        // editable: true = on peut faire glisser l'événement vers un autre jour (grâce à interactionPlugin)
        // ⚠️ seulement à l'écran : la nouvelle date n'est PAS enregistrée dans la base (F5 = retour à la vraie date)
        editable: true,
      }));
      // On range les événements DÉJÀ traduits
      setEvents(calendarEvents);
    } catch (error) {
      console.error(error);
    }
  };

  // Appelée par FullCalendar quand on CLIQUE sur un événement : info.event = l'événement cliqué
  // On va sur la page de l'événement. Ex. id 12 → /event/12 (ta route "/event/:id" dans App.jsx)
  const handleEventClick = (info) => {
    navigate(`/event/${info.event.id}`);
  };

  // [] à la fin = on lance fetchEvents UNE seule fois, quand la page s'ouvre
  useEffect(() => {
    fetchEvents();
  }, []);

  // RENDU
  return (
    // Stack = une pile verticale ; spacing={4} = 32 px d'espace entre les blocs
    <Stack spacing={4}>
      {/* En-tête : le titre à gauche, le bouton "Voir la liste" à droite */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap" }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: "primary.light", letterSpacing: "0.22em" }}>
            Agenda
          </Typography>
          <Typography variant="h2" component="h1">Calendrier</Typography>
        </Box>
        <Button variant="text" onClick={() => navigate("/events")}>
          Voir la liste
        </Button>
      </Stack>

      {/* Le cadre autour du calendrier */}
      <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: { xs: 1, md: 2 } }}>
        <FullCalendar
            // plugins = les "modules" branchés sur le calendrier
            // Adapté : themePlugin ajouté (le prof l'importe mais l'avait oublié dans la liste)
            plugins={[themePlugin, dayGridPlugin, interactionPlugin]}
            // Au départ, on affiche le MOIS en grille
            initialView="dayGridMonth"
            // Calendrier en français (lundi en premier, "novembre 2026"...)
            locale={frLocale}
            // Les événements à afficher dans les cases (déjà au format FullCalendar)
            events={events}
            // Au clic sur un événement, FullCalendar appelle handleEventClick
            eventClick={handleEventClick}
            // La hauteur s'adapte au contenu (pas de barre de défilement)
            height="auto"
            // La barre du haut : flèches + "Aujourd'hui" à gauche, le mois au centre, rien à droite
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            buttonText={{ today: "Aujourd'hui" }}
          />
        </Box>
    </Stack>
  );
}

// On exporte la page pour l'utiliser dans App.jsx
export default CalendarPage;
