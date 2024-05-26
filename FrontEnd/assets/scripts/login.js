import { login, logout } from "./authentication.js";

document.addEventListener("DOMContentLoaded", () => {
    logout();
    const form = document.querySelector("#authentication-form");
    form.addEventListener("submit", authenticate);
})

/**
 * Récupère l'email et le mot de passe saisis par l'utilisateur.
 * Appelle la fonction login.
 * Redirige l'utilisateur vers la page d'accueil en cas de succès.
 * Affiche un message d'erreur en cas d’échec.
 */
async function authenticate($event) {
    $event.preventDefault();

    // Récupération de l'email et du mot de passe.
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const email = emailInput.value;
    const password = passwordInput.value;
    // Connexion avec la fonction dédiée.
    try {
        await login(email, password);
        // Redirection vers la page d'accueil.
        redirectTo("./index.html");

    } catch (error) {
        const paragraph = document.querySelector("#authentication-error");
        paragraph.textContent = error.message;
        paragraph.classList.add("textalert");
    }

}

/**
 * Redirige l'utilisateur vers une page spécifiée.
 * Affiche un message d'erreur en cas d'échec
 * Définir la Fonction redirectTo 
 * Redirige l'utilisateur vers une page spécifiée.
 */
function redirectTo(destination) {
    window.location.href = destination;
}