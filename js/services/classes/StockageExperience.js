export class StockageExperience {
    static cleStockage = "experienceAccumulee";

    // Récupère l'expérience stockée pour un personnage donné
    static getExperience(id) {
        let experiences = JSON.parse(localStorage.getItem(this.cleStockage)) || {};
        return experiences[id] || 0;
    }

    // Ajoute de l'expérience à un personnage et vérifie s'il doit monter de niveau
    static ajouterExperience(id, experience, personnage) {
        let experiences = JSON.parse(localStorage.getItem(this.cleStockage)) || {};
        experiences[id] = (experiences[id] || 0) + experience;

        const seuilNiveau = personnage.niveau * 2000;
        
        if (experiences[id] >= seuilNiveau) {
            experiences[id] -= seuilNiveau; // Réinitialiser l'expérience accumulée après passage de niveau
            personnage.niveau += 1;

            // Appliquer les augmentations de stats
            personnage.statistiques.force += personnage.evolution[0];
            personnage.statistiques.agilite += personnage.evolution[1];
            personnage.statistiques.defense += personnage.evolution[2];
            personnage.statistiques.pouvoir += personnage.evolution[3];

            // Mettre à jour le niveau et les stats dans le JSON via l'API
            JsonProvider.updateCharacter(personnage);
        }

        // Sauvegarde dans localStorage
        localStorage.setItem(this.cleStockage, JSON.stringify(experiences));
    }
}
