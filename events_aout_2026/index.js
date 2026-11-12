import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './Routes/auth.route.js'
import checkToken from './Middlewares/auth.middleware.js';
import eventRoutes from './Routes/events.route.js'
import userRoutes from './Routes/users.route.js'
import commentRoutes from './Routes/comments.route.js'
import participantRoutes from './Routes/participants.route.js'
import cronService from './Services/cron.service.js'

dotenv.configDotenv();
const app = express();

app.use(express.json());
// Autoriser la connexion de mon front à mon back
app.use(cors());


app.use("/auth", authRoutes);
app.use("/events", checkToken, eventRoutes)
app.use("/users", checkToken, userRoutes)
app.use("/participants", checkToken, participantRoutes)
app.use("/comments", checkToken, commentRoutes)


app.use('/', (req, res) => {
    res.json({status : "Ok"});
});

// Démarre le réveil : mail de rappel 2 jours avant chaque événement (tous les jours à 9h)
cronService.startReminderCron();
// Test du prof (mail toutes les 5 secondes) : enlève les // pour l'activer, puis remets-les vite !
// cronService.testCron();
console.log("Cron started");

app.listen(process.env.SERVER_PORT, () => {
    console.log("http://127.0.0.1:"+process.env.SERVER_PORT);
});