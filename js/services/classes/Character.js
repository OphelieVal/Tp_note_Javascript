export class Character {
    constructor(id, name, img, race, classe, niveau, statistiques, experience, evolution, niveau_suivant, equipements_id, pouvoirs_id) {
      this._id = id;
      this._name = name;
      this._img = img; // str du chemin
      this._race = race;
      this._classe = classe;
      this._niveau = niveau;
      this._statistiques = statistiques; // tuple d'int de la forme ("force", "agilite", "defense", "pouvoir")
      this._experience = experience;
      this._evolution = evolution; // tuple d'int de la forme ("force", "agilite", "defense", "pouvoir")
      this._niveau_suivant = niveau_suivant;
      this._equipements_id = equipements_id; // liste d'int
      this._pouvoirs_id = pouvoirs_id; // liste d'int
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
        // tuple d'int de la forme ("force", "agilite", "defense", "pouvoir")      
        return this._statistiques;
    }

    set statistiques(tuple) {
        // tuple d'int de la forme ("force", "agilite", "defense", "pouvoir")
        this._statistiques = tuple;
    }
  
    get experience() {
        return this._experience;
    }

    set experience(val) {
        this._experience = val;
    }
  
    get evolution() {
        // tuple d'int de la forme ("force", "agilite", "defense", "pouvoir")
        return this._evolution;
    }

    set evolution(tuple) {
        // tuple d'int de la forme ("force", "agilite", "defense", "pouvoir")
        this._evolution = tuple;
    }

    get niveau_suivant(){
        return this._niveau_suivant;
    }

    set niveau_suivant(val){
        this._niveau_suivant = val;
    }
  
    get equipements_id() {
        return this._equipements_id;
    }

    ajouter_equipement(val) {
        this._equipements_id.append(val);
    }

    supprimer_equipement(val){
        this._equipements_id.remove(val);
    }
  
    get pouvoirs_id() {
        return this._pouvoirs_id;
    }

    ajouter_pouvoir(val) {
        this._equipements_id.append(val);
    }

    supprimer_pouvoir(val){
        this._equipements_id.remove(val);
    }
}
  