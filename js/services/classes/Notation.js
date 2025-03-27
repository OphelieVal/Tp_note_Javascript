export class Notation {
    static cleStockage = "notationsPersonnages";

    static getNotations() {
        return JSON.parse(localStorage.getItem(this.cleStockage)) || {};
    }

    static getNote(id) {
        let notations = this.getNotations();
        return notations[id] || 0;
    }
    
    static ajouterNote(id, note) {
        let notations = this.getNotations();
        notations[id] = note;
        localStorage.setItem(this.cleStockage, JSON.stringify(notations));
    }
}
