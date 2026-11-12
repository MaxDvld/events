/*
 * Services/cron.service.js — tâches planifiées (le "réveil" du back)
 * -------------------------------------------------------------------
 * node-cron lance une fonction tout seul, à heure fixe, sans aucun clic.
 *
 * '0 9 * * *' se lit de gauche à droite :
 *   minute 0 | 9 heures | tous les jours du mois | tous les mois | tous les jours de la semaine
 *   → "tous les jours à 9h00"
 * Pour tester sans attendre : '* * * * *' = toutes les minutes.
 */
import cron from 'node-cron'
import participantsModel from '../Models/participants.model.js'
import mailService from './mail.service.js'

// Rappel par email 2 jours avant chaque événement.
// Rangé dans une fonction : le réveil ne démarre QUE quand index.js l'appelle.
function startReminderCron() {
    cron.schedule('0 9 * * *', async () => {
        try {
            // Tous les participants des événements qui ont lieu dans 2 jours (avec email, titre, date, lieu)
            const participantReminders = await participantsModel.getReminders()
            // Un mail par ligne : reminder = une ligne du tableau, ex. { us_email, ev_title, ev_date, ev_location }
            for (const reminder of participantReminders) {
                await mailService.eventReminder(reminder.us_email, reminder.ev_title, reminder.ev_date, reminder.ev_location, reminder.ev_id)
            }
        } catch (error) {
            console.error(error)
        }
    })
}

// TEST du prof : envoie l'email de bienvenue toutes les 5 secondes, pour vérifier que cron + mail marchent.
// '*/5 * * * * *' = 6 cases → la 1re case = les SECONDES ("toutes les 5 secondes").
// Adapté : à la place de l'adresse du prof, on s'envoie le mail à soi-même (MAIL_FROM du .env).
// ⚠️ 720 mails par heure ! Ne l'active que quelques secondes, puis Ctrl+C.
function testCron() {
    cron.schedule('*/5 * * * * *', () => {
        mailService.welcome(process.env.MAIL_FROM);
    });
}

export default { startReminderCron, testCron }
