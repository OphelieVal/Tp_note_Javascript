export class Equipement {
    constructor(id, nom, type, bonus) {
      this._id = id;
      this._nom = nom;
      this._type = type;
      this._bonus = bonus; // dictionnaire du type { "attaque" : 50, "agilite" : 15, etc}, les noms des clées varient selon la personne
    }
  
    get id() {
        return this._id;
    }
  
    get nom() {
        return this._nom;
    }
  
    get type() {
        return this._type;
    }
  
    get bonus() {
        return this._bonus;
    }
}
  