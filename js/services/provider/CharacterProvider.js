import { ENDPOINT } from "../../config.js";
import { Character } from "../classes/Character.js";
import { Equipement } from "../classes/Equipement.js";
import { Pouvoir } from "../classes/Pouvoir.js";

export default class CharacterProvider {

    // récupère tous les personnages
    static fetchCharacters = async (limit = 10) => {
        const options = {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            }
        };
        try {
            const response = await fetch(`${ENDPOINT}?_limit=${limit}`,options);
            const json = await (response.json());
            
            let equipements = [];
            let pouvoirs = [];
            let characters = [];

            json.equipements.forEach(equip_data => {
                let equip = new Equipement(equip_data.id, equip_data.nom, equip_data.type, equip_data.bonus);
                equipements.push(equip);
            });

            json.pouvoirs.forEach(pouvoir_data => {
                let pouv = new Pouvoir(pouvoir_data.id, pouvoir_data.nom, pouvoir_data.description);
                pouvoirs.push(pouv);
            });

            json.characters.forEach(character_data => {
                let equipements_obj = character_data.equipements_ids.map(id => {
                    return equipements.find(e => e.id === id);
                });
                  
                let pouvoirs_obj = character_data.pouvoirs_ids.map(id => {
                    return pouvoirs.find(p => p.id === id);
                });

                let carac = new Character(
                    character_data.id,
                    character_data.name,
                    character_data.img,
                    character_data.race,
                    character_data.classe,
                    character_data.niveau,
                    [character_data.statistiques.force, character_data.statistiques.agilite, character_data.statistiques.defense, character_data.statistiques.pouvoir],
                    character_data.experience,
                    [character_data.evolution.augmentation.force, character_data.evolution.augmentation.agilite, character_data.evolution.augmentation.defense, character_data.evolution.augmentation.pouvoir],
                    character_data.evolution.niveau_suivant,
                    equipements_obj,
                    pouvoirs_obj);
                characters.push(carac);
            });
            return {characters, equipements, pouvoirs};
        } catch (err) {
            console.log('Error getting documents',err);
        }
    }
}