import JsonProvider from "../../services/provider/JsonProvider.js";
import Utils from "../../services/outils/Utils.js"; 
import { Character } from "../../services/classes/Character.js";
import { Favoris } from "../../services/classes/Favoris.js";
import { Notation } from "../../services/classes/Notation.js";
import Swal from "../../../node_modules/sweetalert2/src/sweetalert2.js";

export default class DetailsCharacter{
    async render() {
        let request = Utils.parseRequestURL();
        let characterId = request.id;
        console.log("ID du personnage :", characterId);
        let character = await JsonProvider.getCharacter(characterId);
        console.log("Personnage récupéré :", character);
        if (!character) {
            return `<h2 class="title">Personnage non trouvé</h2>`;
        }

        let [force, agilite, defense, pouvoir] = [character.statistiques[0], character.statistiques[1], character.statistiques[2], character.statistiques[3]];


        let [augForce, augAgilite, augDefense, augPouvoir] = [character.evolution[0], character.evolution[1], character.evolution[2], character.evolution[3]];

        let equipementsHTML = (character.equipements && character.equipements.length > 0)
        ? character.equipements
            .filter(e => e !== undefined)
            .map(e => {
              return `<div class="equipement-card" data-id="${e.id}">
                        <img src="${e.img}" alt="${e.nom}" class="equipement-image" loading="lazy">
                        <div class="equipement-info">
                          <strong>${e.nom}</strong>
                        </div>
                      </div>`
            }).join("")    + `<div class="equipement-card add-equipement">
            <div class="equipement-add">+</div>
            <div class="equipement-info">
                <strong>Ajouter un équipement</strong>
            </div>
        </div>`
            : "<p>Aucun équipement</p>";
        let pouvoirsHTML = (character.pouvoirs)
            ? character.pouvoirs.map(p => `<li><strong>${p.nom}</strong>: ${p.description}</li>`).join("")
            : "<li>Aucun pouvoir</li>";

        let currentRating = Notation.getNote(characterId);

        console.log(currentRating);
        
        let view = `
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <head>
                <link rel="stylesheet" href="js/views/static/css/detailsCharacter.css">
                <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
            </head>
            <h2 class="title">${character.name}</h2>
            <section id="character">
                <img src="${character.img}" alt="Image de ${character.name}" loading="lazy">
                <!-- Système de notation -->
                <div id="rating">
                    ${[1, 2, 3, 4, 5].map(i => 
                        `<span class="star ${i <= currentRating ? 'filled' : ''}" data-value="${i}">★</span>`
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

            
            <!-- Popup caché par défaut -->
            <div id="popup-overlay" class="popup-overlay" style="display: none;">
                <div class="popup-content">
                    <h2 id="popup-title"></h2>
                    <p id="popup-details"></p>
                    <button id="popup-delete-btn">Supprimer</button>
                    <button id="popup-close-btn">Fermer</button>
                </div>
            </div>

            <!-- Popup pour ajouter un équipement -->
    <div id="add-equipement-popup" class="popup-overlay" style="display: none;">
        <div class="popup-content">
            <h2>Ajouter un équipement</h2>
            <div id="equipement-list" class="equipement-list"></div>
            <button id="popup-add-close-btn">Fermer</button>
        </div>
    </div>
        `;
        return view;
        
        };

    async afterRender() {
        
        let btnFavori = document.getElementById("fav-btn");
        let characterId = btnFavori.getAttribute("data-id");
    
        function majBoutonFavori() {
            btnFavori.textContent = Favoris.estFavori(characterId) ? "Retirer des favoris" : "Ajouter aux favoris";
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

                    Notation.ajouterNote(characterId, rating);

                    document.querySelectorAll(".star").forEach(starElement => {
                        starElement.classList.remove("filled");
                        if (parseInt(starElement.getAttribute("data-value")) <= parseInt(rating)) {
                            starElement.classList.add("filled");
                        }
                    });


                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Vous avez noté ${rating} étoiles`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
            });
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

        let storedCharacters = JSON.parse(localStorage.getItem("characters")) || [];
        console.log(storedCharacters)
        let character = await JsonProvider.getCharacter(characterId);
    
        console.log(character)

         let popupOverlay = document.getElementById("popup-overlay");
         let popupTitle = document.getElementById("popup-title");
         let popupDetails = document.getElementById("popup-details");
         let popupDeleteBtn = document.getElementById("popup-delete-btn");
         let popupCloseBtn = document.getElementById("popup-close-btn");
 
         console.log("Popup overlay :", popupOverlay);
         
         function closePopup() {
             popupOverlay.style.display = "none";
         }
         popupCloseBtn.addEventListener("click", closePopup);
 
         document.querySelectorAll(".equipement-card").forEach((card) => {
             card.addEventListener("click", async () => {
                console.log("Carte cliquée", card);
                 let equipmentId = card.getAttribute("data-id");
                 let equipment = character.equipements.find(e => e.id === equipmentId);
                 console.log(equipment)
                 if (!equipment) return;
 
                 popupTitle.textContent = equipment.nom;
                 
                 let bonusText = "";
                 for (let cle in equipment.bonus) {
                     bonusText += `${cle}: ${equipment.bonus[cle]}<br>`;
                 }
                 popupDetails.innerHTML = `
                     <strong>Type :</strong> ${equipment.type}<br>
                     <strong>Bonus :</strong><br>
                     ${bonusText}
                 `;
 
                 popupOverlay.style.display = "block";
 
                 popupDeleteBtn.onclick = async () => {
                     if (confirm(`Voulez-vous supprimer l'équipement "${equipment.nom}" ?`)) {
                        character.supprimer_equipement(equipmentId);
                         card.remove();
                         closePopup();
                         character = await JsonProvider.getCharacter(characterId);

                     }
                 };
             });
         });
             // Gestion de l'ajout d'équipement
    const addEquipementPopup = document.getElementById("add-equipement-popup");
    const equipementList = document.getElementById("equipement-list");
    console.log("Élément equipementList :", equipementList);
    const addEquipementCloseBtn = document.getElementById("popup-add-close-btn");

    // Fonction pour charger les équipements disponibles
async function loadAvailableEquipements() {
    console.log("loadAvailableEquipements() appelée");
    try {
        const { equipementsAll } = await JsonProvider.fetchCharacters();
        console.log("Équipements récupérés :", equipementsAll); // Vérifiez les données récupérées
        equipementList.innerHTML = equipementsAll.map(equip => `
            <div class="available-equipement" data-id="${equip.id}">
                <img src="${equip.img}" alt="${equip.nom}" loading="lazy">
                <div>
                    <strong>${equip.nom}</strong>
                    <p>Type: ${equip.type}</p>
                </div>
            </div>
        `).join("");
        console.log("HTML généré pour les équipements :", equipementList.innerHTML); // Vérifiez le HTML généré
    } catch (error) {
        console.error("Erreur lors du chargement des équipements :", error);
    }
}
    

    // Ouvrir le popup d'ajout
    document.querySelectorAll(".add-equipement").forEach(btn => {
        btn.addEventListener("click", async () => {
            await loadAvailableEquipements();
            addEquipementPopup.style.display = "block";
        });
    });

    // Fermer le popup d'ajout
    addEquipementCloseBtn.addEventListener("click", () => {
        addEquipementPopup.style.display = "none";
    });

    // Ajouter un équipement sélectionné
    equipementList.addEventListener("click", async (e) => {
        try {
            console.log("Événement déclenché :", e); // Vérifiez si l'événement est bien passé
            console.log("Élément cliqué :", e.target); // Vérifiez l'élément cliqué
            const equipCard = e.target.closest(".available-equipement");
            if (!equipCard) {
                console.log("Aucune carte d'équipement sélectionnée");
                return;
            }
    
            const equipId = equipCard.getAttribute("data-id");
            console.log("ID de l'équipement sélectionné :", equipId);
    
            const { equipementsAll } = await JsonProvider.fetchCharacters();
            console.log("Équipements disponibles :", equipementsAll);
    
            if (!equipementsAll || equipementsAll.length === 0) {
                console.log("Aucun équipement disponible");
                return;
            }
    
            const equipToAdd = equipementsAll.find(e => e.id === equipId);
            console.log("Équipement à ajouter :", equipToAdd);
    
            if (equipToAdd) {
                console.log("Équipement à ajouter :", equipToAdd);

                character.ajouter_equipement(equipToAdd);
                character.saveToLocalStorage(); // Assurez-vous que cette méthode existe dans votre classe Character
                console.log("Personnage sauvegardé :", JSON.parse(localStorage.getItem("characters")));
                addEquipementPopup.style.display = "none";
                window.location.reload(); // Recharger pour voir les changements
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'équipement :", error);
        }
    });
     }
 }
        
