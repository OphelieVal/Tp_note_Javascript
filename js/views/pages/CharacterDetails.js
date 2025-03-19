// Détail d'un personnage avec possibilité de notation et de mise en favoris

import Utils from "../../services/Utils.js";
import CharacterProvider from "../../services/CharacterProvider.js";

export default class CharacterDetails {
    async render() {
        let request = Utils.parseRequestURL();
        let character = await CharacterProvider.getCharacter
    }
}