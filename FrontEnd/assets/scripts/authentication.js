
async function login(email, password) {
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    if (response.ok) {
        const { token } = await response.json();
        // Enregistrement du jeton d'authentification dans le localStorage.
        localStorage.setItem("token", token);
    } else {
        throw Error("L'email et/ou le mot de passe fourni est invalide.");
    }
}

function logout() {
    localStorage.removeItem("token");
}

function getToken() {
    return localStorage.getItem("token");
}

function setToken(token) {
    localStorage.setItem("token", token);
}

export { login, logout, getToken, setToken };