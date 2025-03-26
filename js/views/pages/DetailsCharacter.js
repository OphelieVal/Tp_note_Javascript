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
        let [augForce, augAgilite, augDefense, augPouvoir] = character.evolution;

        let equipementsHTML = character.equipements.length > 0
        ? character.equipements.map(e => {
            let bonusTexte = "";

            for (let cle in e.bonus) {
                bonusTexte += `${cle}: ${e.bonus[cle]}<br>`;
            }
            return `<div class="equipement-card" data-id="${e.id}">
                <img src="${e.img}" alt="${e.nom}" class="equipement-image">
                <div class="equipement-info">
                  <strong>${e.nom}</strong><br>
                  <small>(${e.type})</small><br>
                  <span>Bonus: ${bonusTexte}</span>
                </div>
            </div>
        `}).join("")
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
            star.addEventListener("click", (event) => {
                let rating = event.target.getAttribute("data-value");
                alert(`Vous avez noté ${rating} étoiles !`);
            });
        });

        document.getElementById("fav-btn").addEventListener("click", () => {
            alert("Ajouté aux favoris !");
        });

        document.querySelectorAll(".star").forEach(star => {
            star.addEventListener("click", (event) => {
                let rating = event.target.getAttribute("data-value");
                alert(`Vous avez noté ${rating} étoiles !`);
            });
        });

                // supprimer un élément
                document.querySelectorAll(".equipement-card").forEach((card) => {
                    card.addEventListener("click", async () => {
                    let equipmentId = card.getAttribute("data-id");
                    window.location.hash = `#/equipements/${equipmentId}`;
                    if (confirm("Voulez-vous supprimer cet équipement ?")) {
                        await JsonProvider.deleteEquipment(characterId, equipmentId);
                        card.remove();
                        }
                    });
                });
    }
        
} 
        
