import { deleteElement, postElement } from "./api.js";
import { data, getWorks, renderWorks } from "./index.js";


/**
 * Fonction générique permettant d'ouvrir une modale à partir de son identifiant et d'ajouter les évènements de fermeture sur les boutons dédiés.
 */
function openModal(id) {
    // Récupération de la modale que l'on souhaite ouvrir.
    const modal = document.querySelector(id);
    // Modification de l'affichage.
    modal.style.display = "flex";

    // Blocage du scroll (à retirer lors de la fermeture de la modale).
    document.body.style.overflow = "hidden";

    // Ajout de l'événement de clic pour fermer la modal avec la croix "close-modal"
    const closingButtons = modal.querySelectorAll(".close-modal-galerie, .close-modal");
    closingButtons.forEach(button => {
        button.addEventListener("click", function() {
            modal.style.display = "none";
            // Rétablissement du scroll
            document.body.style.overflow = "auto";
        });
    })

    

}


/**
 *  Fonction permettant d'afficher les projets au sein de la gallerie de la modale.
 */
function renderWorksInModal(works) {
    const modalGallery = document.querySelector(".modal-gallery");
    // Vidage de la galerie en utilisant une chaîne de caractères vide.
    modalGallery.innerHTML = "";
    for (let work of works) {
        // Génération de l'HTML représentant l'affichage du projet (en cours au sein de la boucle).
        const figure = generateWorkHTMLInModal(work);
        // Ajout de l'HTML à la galerie.
        modalGallery.innerHTML += figure;
    }
}


/**
 *  Fonction permettant de générer le code HTML nécessaire pour afficher un travail spécifique dans la galerie modale
 */
function generateWorkHTMLInModal(work) {
    return `<figure>
        <img src="${work.imageUrl}" alt="${work.title}">
        <i class="fa-solid fa-trash-can" data-id=${work.id}></i>
    </figure>`;
}

/**
 * Fonction permettant d'ajouter les évènements de suppression sur les icones de corbeilles.
 */
function addDeleteEvents() {
    const trashes = document.querySelectorAll(".fa-trash-can");
    trashes.forEach(trash => {
        trash.addEventListener("click", async () => {
            const id = trash.dataset.id;
            try {
                await deleteWork(id);
                refreshWorks(data.works);
            } catch (error) {
                alert(error.message);
            }
          
        })
    })
}


/**
 * Fonction permettant de supprimer un projet.
 * @param {number} id Identifiant du projet
 */
async function deleteWork(id) {
    try {
        await deleteElement(`/works/${id}`)
        data.works = data.works.filter(work => work.id !== id);
    } catch (error) {
        console.error(error);
        throw Error("Une erreur est survenue lors de la suppression d'un projet.")
    }
}


/**
 * Fonction permettant de rafraichir la liste des projets (dans la gallerie et la modale).
 * @param {Array} works Tableau de projet à afficher
 */
function refreshWorks(works) {
    renderWorks(works);
    renderWorksInModal(works);
}


/**
 * Fonction permettant d'afficher les différentes options de catégorie dans le formulaire d'ajout.
 */
function renderOptions(categories) {
    const selectElement = document.getElementById("categorie-select");
    selectElement.innerHTML = "";
    for (let category of categories) {
        const option = generateOptionHTML(category);
        selectElement.innerHTML += option;
    }

}

/**
 * Fonction permettant de générer le code HTML d'une option (pour un <select>)
 */
function generateOptionHTML(category) {
    return `<option value=${category.id}>${category.name}</option>`;
}

/**
 * Fonction permettant d'ajouter un projet.
 */
async function addProject(formData) {
    // Création un formulaire de données :
    const work = await postElement("/works", formData); // Envoi des données à l'API 
    data.works.push(work); // Ajout du projet au tableau de données :
    refreshWorks(data.works);
}

/**
 * Fonction permettant d'ajouter l'évènement de soumission (pour ajout de projet) au formulaire dédié.
 */
function addFormEvent() {
    // Sélection de l'élément avec la classe "modal-content" ( anciennement add-project)
    const form = document.querySelector("#add-work-form");
    form.addEventListener("submit", event => {
        event.preventDefault(); // Pour empêcher le comportement par défaut (soit le rechargement de la page)
        const formData = new FormData(form);// Création un formulaire de données 
        addProject(formData).then(() => {
            form.reset();
        })
    });
    // Sélection de l'élément de formulaire permettant de charger un fichier d'image.
    const fileInput = document.getElementById("file");
    // Ajout d'un écouteur d'événements qui déclenche la fonction processImage lorsque l'utilisateur sélectionne un fichier.
    fileInput.addEventListener("change", () => {
        processImage(fileInput);
    });
}


/**
 * Fonction qui traite le fichier d'image sélectionné par l'utilisateur.
 * Vérifie la taille du fichier et affiche une erreur si elle dépasse la limite de 4 Mo.
 * Cache le bouton d'ajout d'image et affiche l'image sélectionnée.
 */
function processImage(fileInput) {
    // Récupération de la première image :
    const file = fileInput.files[0];
    const maxSize = 4 * 1024 * 1024;
    if (file && file.size > maxSize) {
        // @TODO : Afficher une erreur si le fichier est trop volumineux.
        errorMessage.textContent = "Le fichier est trop volumineux. Veuillez sélectionner un fichier de taille inférieure à 4 Mo.";
        errorMessage.style.color = "red";
        errorMessage.style.marginTop = "10px";
        document.getElementById("error-message").appendChild(errorMessage);
    } else {
        const reader = new FileReader();
        // @TODO : Cacher le bouton d'ajout.
        const addButton = document.getElementById("btn-add");
        addButton.style.display = "none";
        // @TODO : Afficher l'image.
        reader.addEventListener("load", function(event) {
            const url = event.target.result;
            const image = document.getElementById("preview-img");
            image.src = url;
            image.style.width = "130px";
            image.style.height = "170px";
        })
        reader.readAsDataURL(file);
    }
}



export { openModal, renderWorksInModal, renderOptions, addDeleteEvents, addFormEvent };

