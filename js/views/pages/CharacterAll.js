// Listing des personnages du data.json
import CharacterProvider from "../../services/provider/CharacterProvider.js";
import DetailsCharacter from "./DetailsCharacter.js";
export default class CharacterAll {
    async render(){
        let data = await CharacterProvider.fetchCharacters();
        let { charactersAll, equipementsAll, pouvoirsAll } = data;

        let view = `
        <h2>LES PERSONNAGES</h2>
          <div class="barre_recherche">
            <input type="text" id="recherche" class="recherche" placeholder="Rechercher..." />
          </div>
        ${this.renderBarreRecherche(charactersAll)}
        <ul id="character_liste">
          ${charactersAll.map(character => {
              return `
                <li>
                  <img src="${character.img}" alt="Image de ${character.name}">
                  <a href="#/character/${character.id}">${character.name}</a>
                  <p>Niveau : ${character.niveau}</p>
                </li>
              `;
            }).join('')} 
        </ul>
      `;
    return view;
    }

    // barre de recherche inspirée de : https://codemalin.fr/articles/creer-une-barre-de-recherche-javascript.html
    async renderBarreRecherche(characters) {
   
      const recherche = document.getElementById('recherche');
      const character_liste = document.querySelector('#character_liste');

      recherche.addEventListener('input', function(event) {
        const query = event.target.value.trim().toLowerCase();
        character_liste.innerHTML = '';
        
        if (query.length >= 3) {
          // Récupération des characters correspondant
          const resultat = characters.filter(char => 
            char.name.toLowerCase().includes(query)
        );

          // Affichage des résultats
          if (resultat.length > 0) {
            character_liste.innerHTML = resultat.map(char => 
              `<li>
                  <img src="${char.img}" alt="Image de ${char.name}">
                  <a href="#/character/${char.id}">${char.name}</a>
                  <p>Niveau : ${char.niveau}</p>
              </li>`).join('');
        } else {
          character_liste.innerHTML = "<p>Aucun personnage trouvé.</p>";
        }
    }
    });
  }
}