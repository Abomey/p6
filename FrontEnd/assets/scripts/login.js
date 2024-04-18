import { login, logout } from "./authentication.js";

document.addEventListener("DOMContentLoaded", () => {
    logout();
    const form = document.querySelector("#authentication-form");
    form.addEventListener("submit", authenticate);
})

/**
 * 
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
    }

}

/**
 * 
 */
function redirectTo(destination) {
    window.location.href = destination;
}