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
                let equip = new Equipement(equip_data.id, equip_data.nom, equip_data.type, equip_data.bonus, equip_data.img);
                equipementsAll.push(equip);
            });

            pouvJSON.forEach(pouvoir_data => {
                let pouv = new Pouvoir(pouvoir_data.id, pouvoir_data.nom, pouvoir_data.description);
                pouvoirsAll.push(pouv);
            });

            charsJSON.forEach(character_data => {
                let equipements_obj = character_data.equipements_ids
                    .map(id => equipementsAll.find(e => Number(e.id) === Number(id)));

                let pouvoirs_obj = character_data.pouvoirs_ids.map(id => {
                    return pouvoirsAll.find(p => Number(p.id) === Number(id));
                });
                let carac = new Character(
                    character_data.id || "0",
                    character_data.name || "Nom inconnu",
                    character_data.img || "",
                    character_data.race || "Race inconnue",
                    character_data.classe || "Classe inconnue",
                    character_data.niveau || 0,
                    [
                        character_data.statistiques?.force || 0,
                        character_data.statistiques?.agilite || 0,
                        character_data.statistiques?.defense || 0,
                        character_data.statistiques?.pouvoir || 0
                    ],
                    character_data.experience || 0,
                    [
                        character_data.evolution?.augmentation?.force || 0,
                        character_data.evolution?.augmentation?.agilite || 0,
                        character_data.evolution?.augmentation?.defense || 0,
                        character_data.evolution?.augmentation?.pouvoir || 0
                    ],
                    character_data.evolution?.niveau_suivant || 0,
                    equipements_obj || [],
                    pouvoirs_obj || []
                );
                charactersAll.push(carac);
           
            });
            console.log(pouvoirsAll);
            return {charactersAll, equipementsAll, pouvoirsAll};
        } catch (err) {
            console.log('Error getting documents',err);
        }
    };
 
    static getCharacter = async (id) => {
        let stored = localStorage.getItem("characters");
        if (stored) {
          let characters = JSON.parse(stored);
          let characterData = characters.find(c => Number(c._id) === Number(id));
          console.log(characterData)
          if (characterData) {
            let equipements = characterData._equipements.map(e =>
              new Equipement(e._id, e._nom, e._type, e._bonus, e._img)
            );
            let pouvoirs = characterData._pouvoirs.map(p =>
              new Pouvoir(p._id, p._nom, p._description, p._img)
            );
            let character = new Character(
              characterData._id,
              characterData._name,
              characterData._img,
              characterData._race,
              characterData._classe,
              characterData._niveau,
              characterData._statistiques,
              characterData._experience,
              characterData._evolution,
              characterData._niveau_suivant,
              equipements,
              pouvoirs
            )
            if (character) {
                let storedChars = JSON.parse(localStorage.getItem("characters")) || [];
                storedChars = storedChars.filter(c => c && Number(c._id) !== Number(id));
                storedChars.push(character);
                localStorage.setItem("characters", JSON.stringify(storedChars));
            }
            return character;
            }
        }
        let { charactersAll } = await this.fetchCharacters();
        return charactersAll.find(c => Number(c.id) === Number(id));
    };
};

