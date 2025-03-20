// Listing des personnages du data.json
import CharacterProvider from "../../services/provider/CharacterProvider.js";
import DetailsCharacter from "./DetailsCharacter.js";
export default class CharacterAll {
    async render(){
        let data = await CharacterProvider.fetchCharacters();
        let { charactersAll, equipementsAll, pouvoirsAll } = data;

        let view = `
        <h2>LES PERSONNAGES</h2>

        <div class="barre_recherche">
            <input type="text" id="recherche" class="recherche" placeholder="Rechercher..." />
            <table class="res_recherche" id="results-table">
                <tbody>
                <!-- Les résultats de la recherche apparaîtront ici -->
                </tbody>
            </table>
        </div>

        <ul id="character_liste">
          ${charactersAll.map(character => {
              return `
                <li>
                  <img src="${character.img}" alt="Image de ${character.name}">
                  <a href="#/character/${character.id}">${character.name}</a>
                  <p>Niveau : ${character.niveau}</p>
                </li>
              `;
            })
            .join('')} 
        </ul>
      `;
        return view;
    }
}