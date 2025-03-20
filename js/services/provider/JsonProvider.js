import { ENDPOINT } from "../../config.js";
import { Character } from "../classes/Character.js";
import { Equipement } from "../classes/Equipement.js";
import { Pouvoir } from "../classes/Pouvoir.js";

export default class JsonProvider {

    // renvoie une liste avec des objets Character, une avec des objets Equipements et une avec des objets Pouvoir
    static fetchCharacters = async () => {
        const options = {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            }
        };
        try {
            const responseChars = await fetch(`${ENDPOINT}characters`,options);
            const charsJSON = await responseChars.json();

            const responseEquip = await fetch(`${ENDPOINT}equipements`,options);
            const equipJSON = await responseEquip.json();

            const responsePouv = await fetch(`${ENDPOINT}pouvoirs`,options);
            const pouvJSON = await responsePouv.json();

            let equipementsAll = [];
            let pouvoirsAll = [];
            let charactersAll = [];

            equipJSON.forEach(equip_data => {
                let equip = new Equipement(equip_data.id, equip_data.nom, equip_data.type, equip_data.bonus);
                equipementsAll.push(equip);
            });

            pouvJSON.forEach(pouvoir_data => {
                let pouv = new Pouvoir(pouvoir_data.id, pouvoir_data.nom, pouvoir_data.description);
                pouvoirsAll.push(pouv);
            });

            charsJSON.forEach(character_data => {
                let equipements_obj = character_data.equipements_ids.map(id => {
                    return equipementsAll.find(e => e.id === String(id));
                });
                  
                let pouvoirs_obj = character_data.pouvoirs_ids.map(id => {
                    return pouvoirsAll.find(p => p.id === String(id));
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
                charactersAll.push(carac);
            });
        
            return {charactersAll, equipementsAll, pouvoirsAll};
        } catch (err) {
            console.log('Error getting documents',err);
        }
    };

    static getCharacter = async (id) => {
        const options = {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            }
        };
        try {
            const responseChar = await fetch(`${ENDPOINT}characters/${id}`, options);
            const characterData = await responseChar.json();

            const responseEquip = await fetch(`${ENDPOINT}equipements`, options);
            const equipJSON = await responseEquip.json();

            const responsePouv = await fetch(`${ENDPOINT}pouvoirs`, options);
            const pouvJSON = await responsePouv.json();

            let equipements_obj = characterData.equipements_ids
                .map(equipId => equipJSON.find(e => e.id === equipId))
                .filter(e => e !== undefined)  // Supprime les équipements inexistants
                .map(equip => new Equipement(equip.id, equip.nom, equip.type, equip.bonus));

            let pouvoirs_obj = characterData.pouvoirs_ids
                .map(pouvId => pouvJSON.find(p => p.id === pouvId))
                .filter(p => p !== undefined)  // Supprime les pouvoirs inexistants
                .map(pouv => new Pouvoir(pouv.id, pouv.nom, pouv.description));

            // Création de l'objet Character avec les données adaptées
            return new Character(
                characterData.id,
                characterData.name,
                characterData.img,
                characterData.race,
                characterData.classe,
                characterData.niveau,
                [
                    characterData.statistiques.force,
                    characterData.statistiques.agilite,
                    characterData.statistiques.defense,
                    characterData.statistiques.pouvoir
                ],
                characterData.experience,
                [
                    characterData.evolution.augmentation.force,
                    characterData.evolution.augmentation.agilite,
                    characterData.evolution.augmentation.defense,
                    characterData.evolution.augmentation.pouvoir
                ],
                characterData.evolution.niveau_suivant,
                equipements_obj,
                pouvoirs_obj
            );
    } catch (err) {
        console.error('Error getting character details', err);
    };
    }
}
