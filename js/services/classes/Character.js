export class Character {
    static cleStockage = "characters"; // localStorage

    constructor(id, name, img, race, classe, niveau, statistiques, experience, evolution, niveau_suivant, equipements, pouvoirs) {
      this._id = id;
      this._name = name;
      this._img = img; // str du chemin
      this._race = race;
      this._classe = classe;
      this._niveau = niveau;
      this._statistiques = statistiques; // tableau d'int de la forme [force, agilite, defense, pouvoir]
      this._experience = experience;
      this._evolution = evolution; // tableau d'int de la forme [force, agilite, defense, pouvoir]
      this._niveau_suivant = niveau_suivant;
      this._equipements = equipements; // liste d'objet Equipement
      this._pouvoirs = pouvoirs; // liste d'objet Pouvoir
    }
    
    get id() {
        return this._id;
    }
  
    get name() {
        return this._name;
    }

    get img() {
        return this._img;
    }
  
    get race() {
        return this._race;
    }
  
    get classe() {
        return this._classe;
    }
  
    get niveau() {
        return this._niveau;
    }

    set niveau(val) {
        this._niveau = val;
    }
  
    get statistiques() {
        // tableau d'int de la forme [force, agilite, defense, pouvoir]      
        return this._statistiques;
    }

    set statistiques(val) {
        // tableau d'int de la forme [force, agilite, defense, pouvoir]
        this._statistiques = val;
    }
  
    get experience() {
        return this._experience;
    }

    set experience(val) {
        this._experience = val;
    }
  
    get evolution() {
        // tableau d'int de la forme [force, agilite, defense, pouvoir]
        return this._evolution;
    }

    set evolution(tuple) {
        // tableau d'int de la forme [force, agilite, defense, pouvoir]
        this._evolution = tuple;
    }

    get niveau_suivant(){
        return this._niveau_suivant;
    }

    set niveau_suivant(val){
        this._niveau_suivant = val;
    }
  
    get equipements() {
        return this._equipements;
    }

    ajouter_equipement(val) {
        this._equipements.append(val);
    }
    
    get pouvoirs() {
        return this._pouvoirs;
    }

    ajouter_pouvoir(val) {
        this._pouvoirs.append(val);
    }

    supprimer_pouvoir(val){
        this._pouvoirs.remove(val);
    }


    static getCharacters() {
        return JSON.parse(localStorage.getItem(this.cleStockage)) || [];
    }


    //pour le localStorage

    sauvegarder() {
        let characters = Character.getCharacters();
        const index = characters.findIndex(c => c.id === this.id);
        if (index !== -1) {
            characters[index] = this; 
            localStorage.setItem(Character.cleStockage, JSON.stringify(characters));
        }
    }

    static ajouterCharacter(character) {
        let characters = this.getCharacters();
        if (!characters.some(c => c.id === character.id)) {
            characters.push(character);
            localStorage.setItem(this.cleStockage, JSON.stringify(characters));
        }
    }

    static supprimerCharacter(id) {
        let characters = this.getCharacters();
        characters = characters.filter(c => c.id !== id);
        localStorage.setItem(this.cleStockage, JSON.stringify(characters));
    }

    static supprimerEquipement(caracId, equipId) {
        let characters = this.getCharacters();
        let character = characters.find(c => c.id === caracId);
        if (character) {
            character._equipements = character._equipements.filter(equipement => equipement.id !== equipId);
            character.sauvegarder();
        }
        
    }

    static mettreAJourCharacter(updatedCharacter) {
        let characters = this.getCharacters();
        const index = characters.findIndex(c => c.id === updatedCharacter.id);
        if (index !== -1) {
            characters[index] = updatedCharacter;
            localStorage.setItem(this.cleStockage, JSON.stringify(characters));
        }
    }
}
  