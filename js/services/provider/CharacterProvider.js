import JsonProvider from "../../services/provider/JsonProvider.js";
import { Equipement } from "../classes/Equipement.js";

export default class CharacterProvider {

    static getCharacter = async (id) => {
        let {charactersAll, equipementsAll, pouvoirsAll} = JsonProvider.fetchCharacters();
    
        return charactersAll.find(c => c.id == id);

    };

    }
    
    
