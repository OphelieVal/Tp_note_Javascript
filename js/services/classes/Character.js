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

    ajouter_equipement(val) {
        this._equipements.append(val);
    }

    supprimer_equipement(val){
        this._equipements.remove(val);
    }
  
    get pouvoirs() {
        return this._pouvoirs;
    }

    ajouter_pouvoir(val) {
        this._equipements.append(val);
    }

    supprimer_pouvoir(val){
        this._equipements.remove(val);
    }
}
  