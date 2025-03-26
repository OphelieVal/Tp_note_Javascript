import JsonProvider from "../../services/provider/JsonProvider.js";
import Utils from "../../services/outils/Utils.js"; 
import { Character } from "../../services/classes/Character.js";
import { Favoris } from "../../services/classes/Favoris.js";

export default class DetailsCharacter{
    async render() {
        let request = Utils.parseRequestURL();
        let characterId = request.id;
        console.log("ID du personnage :", characterId);
        let character = await JsonProvider.getCharacter(characterId);
        console.log("Personnage récupéré :", character);
        if (!character) {
            return `<h2>Personnage non trouvé</h2>`;
        }

        let { force, agilite, defense, pouvoir } = character.statistiques;
        let { augForce, augAgilite, augDefense, augPouvoir } = character.evolution;
        
        let equipementsHTML = character.equipements.length > 0
            ? character.equipements.map(e => `<li><strong>${e.nom}</strong> (${e.type}, Bonus: ${e.bonus})</li>`).join("")
            : "<li>Aucun équipement</li>";

        let pouvoirsHTML = character.pouvoirs.length > 0
            ? character.pouvoirs.map(p => `<li><strong>${p.nom}</strong>: ${p.description}</li>`).join("")
            : "<li>Aucun pouvoir</li>";

        let currentRating = character.note || 0;
        
        let view = `
            <head>
                <link rel="stylesheet" href="js/views/static/css/detailsCharacter.css">
            </head>
            <h2>${character.name}</h2>
            <section id="character">
                <img src="${character.img}" alt="Image de ${character.name}">
                <div id="rating">
                    ${[1, 2, 3, 4, 5].map(i => 
                        `<span class="star" data-value="${i}">⭐</span>`
                    ).join('')}
                </div>
                <p><strong>Race :</strong> ${character.race}</p>
                <p><strong>Classe :</strong> ${character.classe}</p>
                <p><strong>Niveau :</strong> ${character.niveau}</p>

                <h3>Statistiques</h3>
                <ul>
                    <li><strong>Force :</strong> ${force}</li>
                    <li><strong>Agilité :</strong> ${agilite}</li>
                    <li><strong>Défense :</strong> ${defense}</li>
                    <li><strong>Pouvoir :</strong> ${pouvoir}</li>
                </ul>

                <hr />

                <h3>Expérience et Évolution</h3>
                <p><strong>Expérience :</strong> ${character.experience}</p>
                <p><strong>Niveau suivant :</strong> ${character.niveau_suivant}</p>
                <p><strong>Augmentations :</strong></p>
                <ul>
                    <li><strong>Force :</strong> +${augForce}</li>
                    <li><strong>Agilité :</strong> +${augAgilite}</li>
                    <li><strong>Défense :</strong> +${augDefense}</li>
                    <li><strong>Pouvoir :</strong> +${augPouvoir}</li>
                </ul>
 
                <hr />

                <h3>Équipements</h3>
                <ul>${equipementsHTML}</ul>

                <hr />

                <h3>Pouvoirs</h3>
                <ul>${pouvoirsHTML}</ul>

                <button id="fav-btn" data-id="${character.id}">Ajouter aux favoris</button>
            </section>
        `;
        return view;
        
        };

        async afterRender() {
            let btnFavori = document.getElementById("fav-btn");
            let characterId = btnFavori.getAttribute("data-id");
        
            function majBoutonFavori() {
                btnFavori.textContent = Favoris.estFavori(characterId) ? "Retirer des favoris" : "Ajouter aux favoris";
            }
        
            majBoutonFavori();
        
            btnFavori.addEventListener("click", () => {
                if (Favoris.estFavori(characterId)) {
                    Favoris.retirerFavori(characterId);
                    window.location.hash = "#/Favourite";
                } else {
                    Favoris.ajouterFavori(characterId);
                }
                majBoutonFavori();
            });
        
            document.querySelectorAll(".star").forEach(star => {
                star.addEventListener("click", async (event) => {
                    let rating = event.target.getAttribute("data-value");
                    
                    // Afficher un message d'alerte à l'utilisateur
                    alert(`Vous avez noté ${rating} étoiles !`);
            
                    let characterId = request.id;
                    let character = await JsonProvider.getCharacter(characterId);
            
                    // Mettre à jour la note dans l'objet du personnage
                    character.note = parseInt(rating);
            
                    // Créer un objet de mise à jour avec les nouvelles informations
                    const updatedCharacter = {
                        ...character, // On garde toutes les autres propriétés du personnage
                        note: character.note // Mise à jour de la note
                    };
            
                    // Mettre à jour le personnage dans la base de données (ou API)
                    await JsonProvider.updateCharacter(characterId, updatedCharacter);
            
                    // Mettre à jour l'affichage des étoiles en fonction de la note
                    document.querySelectorAll(".star").forEach(starElement => {
                        starElement.classList.remove("filled"); // Réinitialiser toutes les étoiles
            
                        if (parseInt(starElement.getAttribute("data-value")) <= parseInt(rating)) {
                            // Ajouter la classe "filled" aux étoiles jusqu'à la note sélectionnée
                            starElement.classList.add("filled");
                        }
                    });
                });
            });
        }
        
} 
        
