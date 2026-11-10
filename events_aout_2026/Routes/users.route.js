// express : le framework qui fait tourner le serveur
import e from "express";
// Le controller : il contient les fonctions qui font le vrai travail (getAll, getById, getMe...)
import userController from '../Controllers/users.controller.js'

// Router = une liste de routes (adresses) pour les utilisateurs
// Dans index.js, ce router est branché sur "/users" (et protégé par checkToken)
// Donc router.get("/") correspond à l'adresse complète "/users"
const router = e.Router();

// GET /users => récupérer TOUS les utilisateurs
router.get("/", userController.getAll);

// GET /users/me => récupérer l'utilisateur CONNECTÉ (le back lit qui tu es dans le token)
// ⚠️ Doit être AU-DESSUS de "/:id" : Express lit les routes de haut en bas et prend la 1re qui correspond.
// Sinon "/users/me" serait pris par "/:id" avec id = "me"
router.get("/me", userController.getMe);

// GET /users/12 => récupérer l'utilisateur n°12 (":id" = partie variable de l'adresse)
router.get("/:id", userController.getByUserId);

router.patch("/resetPassword", userController.resetPassword);

// PATCH /users/me => modifier MON profil (l'utilisateur connecté)
router.patch("/me", userController.update);

// POST /users => créer un nouvel utilisateur
router.post("/", userController.insert);

// DELETE /users/12 => supprimer l'utilisateur n°12
router.delete("/:id", userController.deleteUser);

// On exporte le router pour le brancher dans index.js
export default router;
