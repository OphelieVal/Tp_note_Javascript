// Listing des personnages du data.json
import JsonProvider from "../../services/provider/JsonProvider.js";


export default class CharacterAll {
    async render(){
        let data = await JsonProvider.fetchCharacters();
        let { charactersAll, equipementsAll, pouvoirsAll } = data;

        let view = `
        <h2>LES PERSONNAGES</h2>
          <div class="barre_recherche">
            <input type="text" id="recherche" class="recherche" placeholder="Rechercher..." />
          </div>
        <ul id="character_liste">
          ${charactersAll.map(character => {
              return `
              <a href="#/character/${character.id}" class="character-link">
                <li class="character-item" data-id="${character.id}">
                  <img src="${character.img}" alt="Image de ${character.name}">
                  <p>${character.name}</p>
                  <p>Niveau : ${character.niveau}</p>
                </li>
              </a>
              `;
            }).join('')} 
        </ul>
      `;
        return view;
    };

    async renderBarreRecherche(characters) {
      // barre de recherche inspirée de : https://codemalin.fr/articles/creer-une-barre-de-recherche-javascript.html
      
      const recherche = document.getElementById('recherche');
      const character_liste = document.querySelector('#character_liste');

      recherche.addEventListener('input', function(event) {
        const query = event.target.value.trim().toLowerCase();
        character_liste.innerHTML = '';
        
        // Récupération des characters correspondant
        const resultat = characters.filter(char => 
        char.name.toLowerCase().includes(query));

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
    })
  }

  async afterRender() {
    document.querySelectorAll(".character-item").forEach(item => {
        item.addEventListener("click", (event) => {
            if (!event.target.classList.contains("character-link")) {
                let characterId = item.getAttribute("data-id");
                window.location.hash = `#/character/${characterId}`;
            }
        });
    });
  }
}
