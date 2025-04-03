export class Character {
    constructor(id, name, img, race, classe, niveau, note, statistiques, experience, evolution, niveau_suivant, equipements, pouvoirs) {
      this._id = id;
      this._name = name;
      this._img = img; // str du chemin
      this._race = race;
      this._classe = classe;
      this._niveau = niveau;
      this._note = note;
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

    get note() {
        return this._note;
    }

    set note(val) {
        this._note = val;
    }
  
    get statistiques() {
        // tableau d'int de la forme [force, agilite, defense, pouvoir]      
        return this._statistiques;
    }

    set statistiques(tuple) {
        // tableau d'int de la forme [force, agilite, defense, pouvoir]
        this._statistiques = tuple;
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
  
    get pouvoirs() {
        return this._pouvoirs;
    }

    ajouter_pouvoir(pouvoir) {
        if (!this.pouvoirs) {
            this.pouvoirs = [];
        }
        if (!this.pouvoirs.some(p => p.id === pouvoir.id)) {
            this.pouvoirs.push(pouvoirs); // Ajoutez l'équipement
        } else {
            console.log("L'pouvoirs est déjà ajouté.");
        }
    }

    supprimer_pouvoir(pouvoirId){
        this._pouvoirs = this._pouvoirs.filter(p => p._id !== pouvoirId);
        this.saveToLocalStorage();    }

    ajouter_equipement(equipement) {
        if (!this.equipements) {
            this.equipements = []; 
        }
        if (!this.equipements.some(e => e.id === equipement.id)) {
            this.equipements.push(equipement);
        } else {
            console.log("L'équipement est déjà ajouté.");
        }
    }
 
    supprimer_equipement(equipmentId) {
        this._equipements = this._equipements.filter(e => e._id !== equipmentId);
        this.saveToLocalStorage();
    }
    
    saveToLocalStorage() {
        let storedCharacters = JSON.parse(localStorage.getItem("characters")) || [];
        let index = storedCharacters.findIndex(c => Number(c._id) === Number(this._id));
        
        const characterData = {
            _id: this._id,
            _name: this._name,
            _img: this._img,
            _race: this._race,
            _classe: this._classe,
            _niveau: this._niveau,
            _statistiques: this._statistiques,
            _experience: this._experience,
            _evolution: this._evolution,
            _niveau_suivant: this._niveau_suivant,
            _equipements: this._equipements, 
            _pouvoirs: this._pouvoirs 
        };
    
        if (index !== -1) {
            storedCharacters[index] = characterData; 
        } else {
            storedCharacters.push(characterData); 
        }
    
        localStorage.setItem("characters", JSON.stringify(storedCharacters));
    }
    }
        
  