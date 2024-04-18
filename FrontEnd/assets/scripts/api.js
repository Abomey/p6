const URL = "http://localhost:5678/api";

/**
 * Fonction permettant de récupérer des données depuis l'API.
 * @param {string} endpoint
 * @returns {Array} Tableau de données
 */
async function getData(endpoint) {
    // Récupération des données.
    const response = await fetch(URL + endpoint);
    // Si la réponse est de status 200-299, on extrait le contenu du JSON.
    
    if (response.ok) {
        const data = await response.json();
        //console.log(data)
        return data;
    // Sinon, on lance une erreur.
    } else {
        throw Error("Une erreur est survenue lors de la récupération des données.");
    }
    
}


/**
 * Fonction permettant de supprimer un élément (via l'API).
 * @param {string} endpoint
 */
async function deleteElement(endpoint) {
    // Récupération du jeton d'autorisation.
    const token = localStorage.getItem("token");
    // Si un jeton est présent, on supprime l'élément.
    if (token) {
        try {
            const response = await fetch(URL + endpoint, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            throw Error(`Une erreur est survenue lors de la suppression d'un élément: ${error.message}`);
        }
    // Sinon, on lance une erreur.
    } else {
        throw Error("Une erreur est survenue. Aucun jeton d'authentification/autorisation n'a été fournie.")
    }
}

// @TODO : Créer la fonction d'envoi d'un élément (work), comme par exemple une méthode postElement

async function postElement(endpoint, data) {
        // Récupération du jeton d'autorisation.
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await fetch(URL + endpoint, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    
                    },
                    body: data // Les data correspondent à un formulaire.
                })
                return await response.json();
            } catch (error) {
                console.error(error);
            }
        }
}

export { getData, deleteElement, postElement };