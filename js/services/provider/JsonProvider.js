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
                    return equipementsAll.find(e => Number(e.id) === Number(id));
                });

                let pouvoirs_obj = character_data.pouvoirs_ids.map(id => {
                    return pouvoirsAll.find(p => Number(p.id) === Number(id));
                });

                let carac = new Character(
                    character_data.id,
                    character_data.name,
                    character_data.img,
                    character_data.race,
                    character_data.classe,
                    character_data.niveau,
                    character_data.note,
                    [character_data.statistiques.force, character_data.statistiques.agilite, character_data.statistiques.defense, character_data.statistiques.pouvoir],
                    character_data.experience,
                    [character_data.evolution.augmentation.force, character_data.evolution.augmentation.agilite, character_data.evolution.augmentation.defense, character_data.evolution.augmentation.pouvoir],
                    character_data.evolution.niveau_suivant,
                    equipements_obj,
                    pouvoirs_obj);
                charactersAll.push(carac);
            });
            console.log(charactersAll);
        
            return {charactersAll, equipementsAll, pouvoirsAll};
        } catch (err) {
            console.log('Error getting documents',err);
        }
    };

    static getCharacter = async (id) => {
        let { charactersAll, equipementsAll, pouvoirsAll} = await this.fetchCharacters();

        if (!charactersAll) {
            throw new Error("charactersAll est indéfini !");
        }

        let character = charactersAll.find(c => Number(c.id) === Number(id));

        return character;
            
    }; catch (err) {
        console.error('Error getting character details', err);
    };

    static updateCharacter = async (character) => {
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: character.id,
                name: character.name,
                img: character.img,
                race: character.race,
                classe: character.classe,
                niveau: character.niveau,
                note: character.note,
                statistiques: {
                    force: character.statistiques.force,
                    agilite: character.statistiques.agilite,
                    defense: character.statistiques.defense,
                    pouvoir: character.statistiques.pouvoir
                },
                experience: character.experience,
                evolution: {
                    niveau_suivant: character.niveau + 1,
                    augmentation: {
                        force: character.evolution.augmentation.force,
                        agilite: character.evolution.augmentation.agilite,
                        defense: character.evolution.augmentation.defense,
                        pouvoir: character.evolution.augmentation.pouvoir
                    }
                },
                equipements_ids: character.equipements.map(e => e.id),
                pouvoirs_ids: character.pouvoirs.map(p => p.id)
            })
        };
    
        try {
            const response = await fetch(`${ENDPOINT}characters/${character.id}`, options);
            if (!response.ok) throw new Error("Échec de la mise à jour du personnage");
            console.log(`Personnage ${character.name} mis à jour avec succès`);
        } catch (err) {
            console.error("Erreur lors de la mise à jour du personnage", err);
        }
    };
    

}
