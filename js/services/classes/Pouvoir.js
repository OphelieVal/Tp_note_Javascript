export class Pouvoir {
    constructor(id, nom, description) {
      this._id = id;
      this._nom = nom;
      this._description = description;
    }
  
    get id() {
        return this._id;
    }
  
    get nom() {
        return this._nom;
    }
  
    get description() {
        return this._description;
    }  
}
  