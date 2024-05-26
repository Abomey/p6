const URL = "http://localhost:5678/api";

/**
 * Fonction permettant de récupérer des données depuis l'API.
 * Envoie une requête GET à l'API pour récupérer des données.

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
 *  Envoie une requête DELETE à l'API pour supprimer un élément en utilisant le jeton d'authentification.

 * @param {string} endpoint
 *
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
            });
            return response 
        } catch (error) {
            throw Error(`Une erreur est survenue lors de la suppression d'un élément: ${error.message}`);
        }
    // Sinon, on lance une erreur.
    } else {
        throw Error("Une erreur est survenue. Aucun jeton d'authentification/autorisation n'a été fournie.")
    }
}


// Envoie une requête POST à l'API pour ajouter un élément en utilisant le jeton d'authentification.

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
                let responseCode = response.status;
                if (responseCode === 201) {
                    return await response.json(); 
                }
                return ""; 

            } catch (error) {
                console.error(error);
            }
        }
}

export { getData, deleteElement, postElement };