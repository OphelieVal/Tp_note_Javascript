// Listing des personnages du data.json
import CharacterProvider from "../../services/CharacterProvider.js";
export default class CharacterAll {
    async render(){
        let characters = await CharacterProvider.fetchCharacters(20);
        let view = `
        <h2>Les personnages</h2>
        <ul>
        ${characters.map(character=>
            `
            <li>${character.title}</li>
            `
        ).join('\n')}
        </ul>
        `;
        return view;
    }
}