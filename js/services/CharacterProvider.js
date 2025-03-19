import { ENDPOINT } from "../config.js";
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
            return json;
        } catch (err) {
            console.log('Error getting documents',err);
        }
    }

    static getCharacter = async (id) => {
        const options = {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            }
        };
        try{
            const response = await fetch(`${ENDPOINT}`/+id,options);
            const json = await (response.json());
            return json;
        } catch (err) {
            console.log('Error getting documents',err);
        }
    }
}