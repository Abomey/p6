import { getData, deleteElement } from "./api.js";
import { logout, getToken } from "./authentication.js";
import { openModal, renderWorksInModal, renderOptions, addDeleteEvents, addFormEvent } from "./modal.js";


// Objet global contenant tous les projets et catégories.
export const data = {
    works: [],
    categories: []
};

document.addEventListener("DOMContentLoaded", async () => {
    // Si le jeton d'authentification est présent, on affiche le site en mode édition.
    const token = getToken();
    token && renderEditionMode();
    try {
        // Récupération des projets.
        data.works = await getWorks();
        // Récupération des catégories.
        data.categories = await getCategories();
        // Affichage des projets.
        renderWorks(data.works);
        // Affichage des catégories si non connecté.
        !token && renderCategories(data.categories);
    } catch(error) {
        console.error(error);
    }
});

/**
 * Fonction permettant d'afficher les projets au sein de la gallerie.
 * @param {Array} works Tableau de projets à afficher
 */
export function renderWorks(works) {
    const gallery = document.querySelector(".gallery");
    // Vidage de la gallerie en utilisant une chaine de caratères vide.
    gallery.innerHTML = "";
    for (let work of works) {
        // Génération de l'HTML représentant l'affichage du projet (en cours au sein de la boucle).
        const figure = generateWorkHTML(work);
        // Ajout de l'HTML à la gallerie.
        gallery.innerHTML += figure;
    }
}

/**
 * Fonction permettant de générer le HTML d'affichage d'un projet.
 * @param {Object} work Objet représentant un projet
 * @returns {string} HTML représentant l'affichage du projet passé en paramètre
 */
function generateWorkHTML(work) {
    return `			
    <figure>
    <img src="${work.imageUrl}" alt="${work.title}">
    <figcaption>${work.title}</figcaption>
    </figure>`;
}

/**
 * Fonction permettant d'afficher les boutons de catégories.
 * @param {Array} categories Tableau de catégories à afficher                               
 */
function renderCategories(categories) {
    const filters = document.querySelector(".filters");
    filters.innerHTML += generateCategoryHTML({ id: 0, name: "Tous" }, true);

    for (let category of categories) {
        const button = generateCategoryHTML(category);
        filters.innerHTML += button;
    }

    // Ajoute des gestionnaires d'événements pour chaque bouton de catégorie
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            toggleActiveFilter(button);
            const id = Number(button.dataset.id);
            filterWorksByCategory(id);
        });
    });
}

/**
 * Fonction permettant de mettre en avant le filtre sélectionné.
 * @param {Element} button Bouton (HTML) de filtre
 */
function toggleActiveFilter(button) {
    const active = document.querySelector(".filter-btn-active");
    active.classList.remove("filter-btn-active");
    button.classList.add("filter-btn-active");
}

/**
 * Fonction permettant de générer le HTML d'affichage d'un bouton de catégorie.
 * @param {Object} category Objet représentant une catégorie.
 * @returns {string} HTML représentant l'affichage d'un bouton de catégorie.
 */
function generateCategoryHTML(category, active = false) {
    return `
    <button class="${active ? "filter-btn filter-btn-active" : "filter-btn"}" data-id="${category.id}">
        ${category.name}
    </button>`;
}

/**
 * Fonction permettant de filtrer les projets par catégorie.$
 * @param {number} id Identifiant représentant la catégorie (avec laquelle on veut filtrer).
 */
function filterWorksByCategory(id) {
    if (!id) {
        renderWorks(data.works);
    } else {
        // Filtrer les projets par catégorie
        const works = data.works.filter(work => work.categoryId === id);
        renderWorks(works);
    }
}


/**
 * Fonction permettant de récupérer les projets.
 * @returns {Array} Tableau de projets
 */
export async function getWorks() {
    try {
        return await getData("/works")
    } catch (error) {
        console.error(error);
        throw Error("Une erreur est survenue lors de la récupération des projets.");
    }
}

/**
 * Fonction permettant de récupérer les catégories.
 * @returns {Array} Tableau de catégories
 */
async function getCategories() {
    try {
        return await getData("/categories");
    } catch (error) {
        console.error(error);
        throw Error("Une erreur est survenue lors de la récupération des catégories.");
    }
}


/**
 * Fonction permettant d'afficher le site en mode édition.
 */

function renderEditionMode() {
    // Affichage et modification des éléments s'affichant au chargement de la page.
    document.querySelector("#login-action").textContent = "logout";
    document.querySelector("#edition-header").style.display = "block";
    const openModalButton = document.querySelector("#open-modal");
    const openAddModalButton = document.querySelector("#add-open-modal");
    openModalButton.style.display = "inline-block";
    openModalButton.addEventListener("click", () => {
        openModal("#edition-modal");
        // (Ré-)affichage des projets au sein de la modale.
        renderWorksInModal(data.works);
        addDeleteEvents();
    });

    openAddModalButton.addEventListener("click", () => {
        openModal("#add-work-modal");
        renderOptions(data.categories);
        addFormEvent();
    });
}


