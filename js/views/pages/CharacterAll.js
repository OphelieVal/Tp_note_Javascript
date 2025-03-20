// Listing des personnages du data.json
import CharacterProvider from "../../services/provider/JsonProvider.js";
import DetailsCharacter from "./DetailsCharacter.js";
export default class CharacterAll {
    async render(){
        let data = await CharacterProvider.fetchCharacters();
        let { charactersAll, equipementsAll, pouvoirsAll } = data;

        let view = `
        <h2>LES PERSONNAGES</h2>
        <ul id="character_liste">
          ${charactersAll.map(character => {
              return `
              <a href="#/character/${character.id}" class="character-link">
                <li class="character-item" data-id="${character.id}">
                  <img src="${character.img}" alt="Image de ${character.name}">
                  <p>${character.name}</p>
                  <p>Niveau : ${character.niveau}</p>
                </li>
              </a>
              `;
            })
            .join('')} 
        </ul>
      `;
        return view;
    };

    async afterRender() {
      document.querySelectorAll(".character-item").forEach(item => {
          item.addEventListener("click", (event) => {
              if (!event.target.classList.contains("character-link")) {
                  let characterId = item.getAttribute("data-id");
                  window.location.hash = `#/character/${characterId}`;
              }
          });
      });
  }
}