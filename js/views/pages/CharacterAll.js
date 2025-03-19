// Listing des personnages du data.json
import CharacterProvider from "../../services/provider/CharacterProvider.js";
import DetailsCharacter from "./DetailsCharacter.js";
export default class CharacterAll {
    async render(){
        let data = await CharacterProvider.fetchCharacters();
        console.log(data);
        let { charactersAll, equipementsAll, pouvoirsAll } = data;
        console.log(charactersAll);

        let view = `
        <h2>Les personnages</h2>
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