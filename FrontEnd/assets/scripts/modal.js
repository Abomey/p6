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

    // Sélection du bouton "Valider"
    const validerButton = document.getElementById("button-valider-closemodal");
    
    // Ajout d'un écouteur d'événements de clic au bouton "Valider"
    validerButton.addEventListener("click", function() {
        // Fermeture de la modal en appelant la fonction closeModal avec l'identifiant de la modal
        closeModal("#add-work-modal");
        closeModal("#edition-modal")

    });
}

/**
 * Fonction permettant de fermer une modale à partir de son identifiant.
 * @param {string} id Identifiant de la modale à fermer
 */
function closeModal(id) {
    // Récupération de la modale que l'on souhaite fermer.
    const modal = document.querySelector(id);
    // Modification de l'affichage pour masquer la modal.
    modal.style.display = "none";
    // Rétablissement du scroll
    document.body.style.overflow = "auto";
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
    return `<figure data-id=${work.id}>
        <img src="${work.imageUrl}" alt="${work.title}">
        <i class="fa-solid fa-trash-can" data-id=${work.id}></i>
    </figure>`;
}

/**
 * Fonction permettant d'ajouter les évènements de suppression sur les icones de corbeilles.
 */
function deleteEvents() {
    const trashes = document.querySelectorAll(".fa-trash-can");
    trashes.forEach(trash => {
        trash.addEventListener("click", async () => {
            const id = trash.dataset.id;
            
            await deleteWork(id);
            
        })
    })
}

/*
 * Fonction permettant de supprimer un projet.
 * @param {number} id Identifiant du projet
 */
async function deleteWork(id) {
    
    const response = await deleteElement(`/works/${id}`);

    if (response.status === 204){
        data.works = data.works.filter(work => work.id != id);
        refreshWorks(data.works)
    }
}

/**
 * Fonction permettant de rafraîchir la liste des projets dans la galerie principale et dans la modal.
 * @param {Array} works Tableau de projets à afficher
 */
function refreshWorks(works) {
    renderWorks(works); // Rafraîchissement de la galerie principale
    renderWorksInModal(works); // Rafraîchissement de la galerie dans la modal
    deleteEvents();
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



// Sélection de l'élément avec la classe "modal-content" 
const form = document.querySelector("#add-work-form");
const handleSubmit = function(event) {
    event.preventDefault(); // Pour empêcher le comportement par défaut (soit le rechargement de la page)
    const formData = new FormData(form);// Création un formulaire de données 
    addProject(formData).then(() => {
        form.reset();

            // Code de remise à zéro de l'aperçu de l'image
        const imagePreview = document.getElementById("preview-img"); // Idéalement, donner un id à l'élément img de prévisualisation
        imagePreview.classList.add("masked");

        const previewplaceholder = document.getElementById("preview-placeholder");
        previewplaceholder.classList.remove("masked"); // Affiche

        const addButton = document.getElementById("btn-add");
        const textfileinput = document.getElementById("textFileInput")
        
        addButton.classList.remove("masked");
        textfileinput.classList.remove("hidden");

    })


};
form.addEventListener("submit", handleSubmit);

// Sélection de l'élément de formulaire permettant de charger un fichier d'image.
const fileInput = document.getElementById("file");
// Ajout d'un écouteur d'événements qui déclenche la fonction processImage lorsque l'utilisateur sélectionne un fichier.
fileInput.addEventListener("change", () => {
    processImage(fileInput);
});
    


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
        errorMessage.textContent = "Le fichier est trop volumineux. Veuillez sélectionner un fichier de taille inférieure à 4 Mo.";
        errorMessage.style.color = "red";
        errorMessage.style.marginTop = "10px";
        document.getElementById("error-message").appendChild(errorMessage);
    } else {
        let reader = new FileReader();
        const addButton = document.getElementById("btn-add");
        const textfileinput = document.getElementById("textFileInput")
        addButton.classList.add("masked");
        textfileinput.classList.add("hidden");

       
        reader.addEventListener("load", function(event) {
            const url = event.target.result;
            const image = document.getElementById("preview-img");
            const previewplaceholder = document.getElementById("preview-placeholder");
            image.src = url;
            image.classList.remove('masked');
            previewplaceholder.classList.add("masked");

            
        })


        reader.readAsDataURL(file);
    }
}


/**
 * Cette fonction est appelée lorsque le DOM est chargé, elle configure les écouteurs d'événements pour mettre à jour l'état du bouton "Valider" en fonction des entrées de l'utilisateur.
 */
document.addEventListener("DOMContentLoaded", function() {
    // Sélection des éléments du formulaire
    const titleInput = document.querySelector("#add-work-form input[name='title']");
    const categorySelect = document.querySelector("#add-work-form select[name='category']");
    const fileInput = document.getElementById("file");
    const validerButton = document.getElementById("button-valider-closemodal");

    // Fonction pour mettre à jour l'état du bouton en fonction de la saisie dans le champ de titre, la sélection de la catégorie et l'ajout d'une image
    function updateButtonState() {
        // Vérification si du texte est saisi dans le champ de titre
        const isTitleEntered = titleInput.value.trim() !== "";
        // Vérification si une catégorie est sélectionnée
        const isCategorySelected = categorySelect.value !== "";
        // Vérification si un fichier a été ajouté dans le champ d'ajout d'image
        const isImageAdded = fileInput.files.length > 0;

        // Vérification si toutes les conditions sont remplies pour activer le bouton "Valider"
        if (isTitleEntered && isCategorySelected && isImageAdded) {
            // Activation du bouton "Valider"
            validerButton.style.backgroundColor = "#1D6154"; // Bouton vert
            validerButton.style.pointerEvents = "auto"; // Activation des événements de pointeur
            validerButton.style.cursor = "pointer"; // Curseur de pointeur
            validerButton.disabled = false;
        } else {
            // Désactivation du bouton "Valider"
            validerButton.style.backgroundColor = "#A7A7A7"; // Bouton grisé
            validerButton.style.pointerEvents = "none"; // Désactivation des événements de pointeur
            validerButton.style.cursor = "not-allowed"; // Curseur non autorisé
            validerButton.disabled = true;
        }
    }

    // Ajout d'écouteurs d'événements pour les changements dans le champ de titre, le menu déroulant des catégories et le chargement de l'image
    titleInput.addEventListener("input", updateButtonState); // Événement lors de la saisie dans le champ de titre
    categorySelect.addEventListener("change", updateButtonState); // Événement lors de la sélection d'une catégorie
    fileInput.addEventListener("change", updateButtonState); // Événement lors du chargement d'une image
});

export { openModal, renderWorksInModal, renderOptions, deleteEvents, };

