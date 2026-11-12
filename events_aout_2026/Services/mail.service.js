// nodemailer : outil qui permet au back d'envoyer des emails
import nodemailer from 'nodemailer';
// dotenv : permet de lire le fichier .env (où sont rangés les réglages SMTP)
import dotenv from 'dotenv';
dotenv.config();


/*
 * createTransport = "ouvre une connexion configurée vers le serveur SMTP".
 * On le crée une seule fois au chargement du module (pas à chaque mail).
 * = le "facteur" qui se connecte au serveur d'emails (ici Gmail) avec nos identifiants
 *
 * Gmail :
 *   host smtp.gmail.com, port 587, secure: false → STARTTLS
 *   auth.user = ton Gmail
 *   auth.pass = mot de passe d'APPLICATION (pas le mdp du compte) : 16 lettres, sans espaces
 *
 * Variante équivalente avec le raccourci Nodemailer :
 *   nodemailer.createTransport({
 *     service: "gmail",
 *     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
 *   })
 */
// création d'un transporteur pour envoyer des emails
// (le prof l'appelle "tranporter" : j'ai corrigé en "transporter", partout pareil)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Email de bienvenue, envoyé après une inscription (appelé dans register du auth.contoller)
async function welcome(receverEmail) {

    const mail = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: receverEmail,
        subject: 'Bienvenue sur notre plateforme',
        text: `Bienvenue sur notre plateforme`,
        html: `
        <p>Bienvenue sur notre plateforme</p>
        <a href="${process.env.FRONTEND_URL}/login">Se connecter</a>
        `,
    });

    console.log("mail sent successfully");
    return mail;
}

// Email "mot de passe oublié" (appelé dans forgotPassword du auth.contoller)
async function resetPassword(receverEmail, resetToken) {

    /*
   * sendMail envoie un vrai message via Gmail.
   * - text : version plain texte (clients mail simples)
   * - html : version avec un vrai lien cliquable
   * Le lien contient déjà le token, ex. :
   *   http://localhost:5173/reset-password?token=a1b2c3...
   *
   * "to" doit être l'email du user en base (celui qui a demandé le reset).
   * Tu peux t'envoyer un mail à toi-même pour tester.
   */
    const mail = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: receverEmail,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Clique ici pour réinitialiser ton mot de passe : ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        html: `
        <p>Clique ici pour réinitialiser ton mot de passe :
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Réinitialiser</a>
        </p>
        `,
    });

    console.log("mail sent successfully");
    return mail;
}

// Email de confirmation d'inscription à un événement (appelé dans insert du participants.controller)
async function eventConfirm(receverEmail, eventName, eventDate, eventLocation) {

    // Adapté : eventDate arrive comme un objet Date. Affiché tel quel, ça donnerait
    // "Sat Aug 29 2026 00:00:00 GMT+0200 (heure d'été d'Europe centrale)".
    // toLocaleDateString('fr-FR') l'écrit "29/08/2026".
    const dateFr = new Date(eventDate).toLocaleDateString('fr-FR');

    const mail = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: receverEmail,
        subject: 'Confirmation de votre inscription à l\'événement',
        text: `Vous êtes inscrit à l'événement ${eventName} le ${dateFr} à ${eventLocation}`,
        html: `
        <p>Vous êtes inscrit à l'événement ${eventName} le ${dateFr} à ${eventLocation}</p>
        `,
    });

    console.log("mail sent successfully");
    return mail;
}

// Email de rappel 2 jours avant l'événement (appelé par le cron dans cron.service.js)
// eventID = l'id de l'événement, pour le lien "Voir l'événement" (le prof l'appelle rappelEvent)
async function eventReminder(receverEmail, eventName, eventDate, eventLocation, eventID) {

    // Adapté : eventDate arrive comme un objet Date. Affiché tel quel, ça donnerait
    // "Sat Aug 29 2026 00:00:00 GMT+0200 (heure d'été d'Europe centrale)".
    // toLocaleDateString('fr-FR') l'écrit "29/08/2026".
    const dateFr = new Date(eventDate).toLocaleDateString('fr-FR');

    const mail = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: receverEmail,
        subject: 'Rappel de votre événement',
        text: `Rappel de l'événement ${eventName} le ${dateFr} à ${eventLocation}`,
        html: `
        <p>Rappel de l'événement ${eventName} le ${dateFr} à ${eventLocation}</p>
        <a href="${process.env.FRONTEND_URL}/event/${eventID}">Voir l'événement</a>
        `,
    });

    console.log("mail sent successfully");
    return mail;
}
export default {
    resetPassword,
    welcome,
    eventConfirm,
    eventReminder
};
