export class Character {
    constructor(id, name, img, race, classe, niveau, statistiques, experience, evolution, equipements_id, pouvoirs_id) {
      this._id = id;
      this._name = name;
      this._img = img;
      this._race = race;
      this._classe = classe;
      this._niveau = niveau;
      this._statistiques = statistiques;
      this._experience = experience;
      this._evolution = evolution;
      this._equipements_id = equipements_id; 
      this._pouvoirs_id = pouvoirs_id;
    }
}
  