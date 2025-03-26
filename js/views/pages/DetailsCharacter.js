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

        let [force, agilite, defense, pouvoir] = character.statistiques;
        let [augForce, augAgilite, augDefense, augPouvoir] = character.evolution
        
        let equipementsHTML = character.equipements.length > 0
            ? character.equipements.map(e => `
                <div class="equipement-card" data-id="${e.id}">
                    <img src="${e.img}" alt="${e.nom}" class="equipement-img">
                    <span class="remove-equipement" data-id="${e.id}">❌</span>
                    <p>${e.nom}</p>
                </div>
            `).join("")
            : "<p>Aucun équipement</p>";

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

                <div id="equipement-popup" class="popup hidden">
                    <div class="popup-content">
                        <span id="close-popup">❌</span>
                        <img id="popup-img" src="" alt="">
                        <h3 id="popup-nom"></h3>
                        <p id="popup-type"></p>
                        <p id="popup-bonus"></p>
                    </div>
                </div>

                <hr />

                <h3>Pouvoirs</h3>
                <ul>${pouvoirsHTML}</ul>

                <button id="fav-btn" data-id="${character.id}">Ajouter aux favoris</button>
            </section>
        `;
        return view;
        
        };

        async afterRender() {
            let request = Utils.parseRequestURL();
            let characId = request.id;
            let character = await JsonProvider.getCharacter(characId);

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
                star.addEventListener("click", (event) => {
                    let rating = event.target.getAttribute("data-value");
                    alert(`Vous avez noté ${rating} étoiles !`);
                });
            });

            document.querySelectorAll(".remove-equipement").forEach(cross => {
                cross.addEventListener("click", async (event) => {
                    let equipId = event.target.getAttribute("data-id");
                    character.supprimer_equipement(equipId);
                    JsonProvider.updateCharacter(character);
                    const card = event.target.closest(".equipement-card");
                    if (card) card.remove();

                    const container = document.querySelector(".equipement-container");
                    if (this.character.equipements.length === 0 && container) {
                        container.innerHTML = "<p>Aucun équipement</p>";
                    }
                    alert("Équipement retiré !");
                });
            });
        
            
            document.querySelectorAll(".equipement-img").forEach(img => {
                img.addEventListener("click", (event) => {
                    let equipId = event.target.closest(".equipement-card").getAttribute("data-id");
                    let equipement = character.equipements.find(e => e.id == equipId);
                    if (equipement) {
                        document.getElementById("popup-img").src = equipement.img;
                        document.getElementById("popup-nom").textContent = equipement.nom;
                        document.getElementById("popup-type").textContent = `Type : ${equipement.type}`;
                        document.getElementById("popup-bonus").textContent = `Bonus : ${equipement.bonus}`;
                        document.getElementById("equipement-popup").classList.remove("hidden");
                    }
                });
            });
            
            document.getElementById("close-popup").addEventListener("click", () => {
                document.getElementById("equipement-popup").classList.add("hidden");
            });
            
        }
        
} 
        
