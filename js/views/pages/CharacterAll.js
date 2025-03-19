// Listing des personnages du data.json
import CharacterProvider from "../../services/CharacterProvider.js";
import DetailsCharacter from "./DetailsCharacter.js";
export default class CharacterAll {
    async render(){
        let characters = await CharacterProvider.fetchCharacters(20);
        console.log(characters);

        let view = `
        <h2>Les personnages</h2>
        <ul id='character_liste'>
        ${characters.map(character=>
            `
            <img src="${character.img}" alt="image du character">
            <a href="/character/${character.id}">${character.name}</a>
            <p>Niveau : ${character.niveau}</p>
            `
        ).join('\n')}
        </ul>
        `;
        return view;
    }
}