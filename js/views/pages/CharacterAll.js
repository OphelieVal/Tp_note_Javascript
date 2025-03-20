// Listing des personnages du data.json
import CharacterProvider from "../../services/provider/CharacterProvider.js";
import DetailsCharacter from "./DetailsCharacter.js";
export default class CharacterAll {
    async render(){
        let data = await CharacterProvider.fetchCharacters();
        let { charactersAll, equipementsAll, pouvoirsAll } = data;

        let view = `
        <h2>LES PERSONNAGES</h2>
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
            })
            .join('')} 
        </ul>
      `;
    return view;
    }

    // barre de recherche inspirée de : https://codemalin.fr/articles/creer-une-barre-de-recherche-javascript.html
    async renderBarreRecherche(characters) {
      let view = `
        <div class="barre_recherche">
          <input type="text" id="recherche" class="recherche" placeholder="Rechercher..." />
          <table class="res_recherche" id="res_recherche">
            <tbody></tbody>
          </table>
        </div>
      `;

      document.body.innerHTML += view;

      const barre_recherche = document.getElementById('recherche');
      const res_recherche = document.querySelector('#res_recherche tbody');

      barre_recherche.addEventListener('input', function(event) {
        const query = event.target.value.trim().toLowerCase();
        res_recherche.innerHTML = '';
        
        if (query.length >= 3) {
          // Récupération des characters correspondant
          const resultat = characters.filter(char => 
            char.name.toLowerCase().includes(query)
        );

          // Affichage des résultats
          if (resultat.length > 0) {
            resultat.forEach(item => {
                const row = document.createElement('tr');
                const nomCell = document.createElement('td');
                nomCell.textContent = item.name;
                row.appendChild(nomCell);

                const descCell = document.createElement('td');
                descCell.textContent = item.description;
                row.appendChild(descCell);
            
                res_recherche.appendChild(row);
            });
          } else {
              const row = document.createElement('tr');
              const cell = document.createElement('td');
              cell.colSpan = 2;
              cell.textContent = 'Aucun résultat trouvé.';
              row.appendChild(cell);
              res_recherche.appendChild(row);
          }
        }
      });
    return view;
  }
}