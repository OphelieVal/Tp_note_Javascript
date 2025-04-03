export class Pouvoir {
    constructor(id, nom, description, img) {
      this._id = id;
      this._nom = nom;
      this._description = description;
      this._img = img;
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

    get img() {
        return this._img;
    }
}
  