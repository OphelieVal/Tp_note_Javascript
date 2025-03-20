// Détail d'un personnage avec possibilité de notation et de mise en favoris
import JsonProvider from "../../services/provider/JsonProvider.js";
import Utils from "../../services/outils/Utils.js"; 
import { Character } from "../../services/classes/Character.js";

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

        let [force, agilite, defense, pouvoir] = character.statistiques;
        let [augForce, augAgilite, augDefense, augPouvoir] = character.evolution
        
        let equipementsHTML = character.equipements.length > 0
            ? character.equipements.map(e => `<li><strong>${e.nom}</strong> (${e.type}, Bonus: ${e.bonus})</li>`).join("")
            : "<li>Aucun équipement</li>";

        let pouvoirsHTML = character.pouvoirs.length > 0
            ? character.pouvoirs.map(p => `<li><strong>${p.nom}</strong>: ${p.description}</li>`).join("")
            : "<li>Aucun pouvoir</li>";

        
        let view = `
            <head>
                <link rel="stylesheet" href="js/views/static/css/detailsCharacter.css">
            </head>
            <h2>${character.name}</h2>
            <section id="character">
                <img src="${character.img}" alt="Image de ${character.name}">
                <!-- Système de notation -->
                <div id="rating">
                    <span class="star" data-value="1">⭐</span>
                    <span class="star" data-value="2">⭐</span>
                    <span class="star" data-value="3">⭐</span>
                    <span class="star" data-value="4">⭐</span>
                    <span class="star" data-value="5">⭐</span>
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

                <h3>Pouvoirs</h3>
                <ul>${pouvoirsHTML}</ul>

                <button id="fav-btn">Ajouter aux favoris</button>
            </section>
        `;
        return view;
        
        };

    async afterRender() {
        document.getElementById("fav-btn").addEventListener("click", () => {
            alert("Ajouté aux favoris !");
        });

        document.querySelectorAll(".star").forEach(star => {
            star.addEventListener("click", (event) => {
                let rating = event.target.getAttribute("data-value");
                alert(`Vous avez noté ${rating} étoiles !`);
            });
        });
    }
        
} 
        
