import { Favoris } from "../../services/classes/Favoris.js";
import JsonProvider from "../../services/provider/JsonProvider.js";

export default class Favourite{
    async render (){
        let favoris = Favoris.getFavoris();

        if (favoris.length === 0) {
            return `<h2 class="title">Vous n'avez pas de personnages favoris pour le moment ... </h2>`;
        }

        try {
            let { charactersAll } = await JsonProvider.fetchCharacters();
            console.log("📜 Liste complète des personnages :", charactersAll);

            let favorisCharacters = charactersAll.filter(c => favoris.includes(String(c.id)));
            console.log("🌟 Personnages favoris :", favorisCharacters);


            let charactersHTML = favorisCharacters.map(character => {
                return `
                <a href="#/character/${character.id}" class="character-link">
                <li class="character-item" data-id="${character.id}">
                  <img src="${character.img}" alt="Image de ${character.name}">
                  <p>${character.name}</p>
                  <p>Niveau : ${character.niveau}</p>
                </li>
              </a>
              `;
            }).join("");

            return `
                <head>
                    <link rel="stylesheet" href="js/views/static/css/favourite.css">
                </head>
                <h2 class="title"> RETROUVEZ VOS PERSONNAGES FAVORIS ! </h2>
                <div id="favourites-list">${charactersHTML}</div>
            `;
        } catch (err) {
            console.error("❌ Erreur lors du chargement des favoris :", err);
            return `<h2 class="title">⭐ Liste des favoris</h2><p>Erreur lors du chargement des favoris.</p>`;
        }
    }

    async afterRender() {
        document.querySelectorAll(".remove-fav-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                let characterId = event.target.getAttribute("data-id");
                Favoris.retirerFavori(characterId);
                alert("Personnage retiré des favoris !");
                location.reload(); // Recharge la page pour mettre à jour la liste
            });
        });
    }
}
