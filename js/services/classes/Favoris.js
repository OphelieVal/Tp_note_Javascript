export class Favoris {
    static cleStockage = "favorisPersonnages"; // Clé pour le localStorage

    static getFavoris() {
        return JSON.parse(localStorage.getItem(this.cleStockage)) || [];
    }

    static estFavori(id) {
        return this.getFavoris().includes(String(id));
    }
    
    static ajouterFavori(id) {
        let favoris = this.getFavoris();
        if (!favoris.includes(String(id))) {
            favoris.push(String(id));
            localStorage.setItem(this.cleStockage, JSON.stringify(favoris));
        }
    }
    
    static retirerFavori(id) {
        let favoris = this.getFavoris().filter(favId => favId !== String(id));
        localStorage.setItem(this.cleStockage, JSON.stringify(favoris));
    }
}