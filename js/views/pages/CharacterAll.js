import JsonProvider from "../../services/provider/JsonProvider.js";
export default class CharacterAll {
  constructor() {
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.charactersAll = [];
  }

  async render() {
    try {
      let data = await JsonProvider.fetchCharacters();
      this.charactersAll = data.charactersAll;

      let view = `
        <h2 class="title">LES PERSONNAGES</h2>
        <div class="barre_recherche">
          <input type="text" id="recherche" class="recherche" placeholder="Rechercher..." />
        </div>
        <ul id="character_liste">
          ${this.renderPage()}
        </ul>
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item">
              <a href="#" class="page-link" id="prevPage">Précédent</a>
            </li>
            <li class="page-item">
              <span class="page-link" id="pageNumber">${this.currentPage}</span>
            </li>
            <li class="page-item">
              <a href="#" class="page-link" id="nextPage">Suivant</a>
            </li>
          </ul>
        </nav>
      `;
      return view;
    } catch (error) {
      console.error("Erreur lors du chargement des personnages :", error);
      return `<p>Erreur lors du chargement des personnages.</p>`;
    }
  }

  renderPage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const charactersToShow = this.charactersAll.slice(startIndex, endIndex);

    return charactersToShow
      .map(character => {
        return `
          <a href="#/character/${character.id}" class="character-link">
            <li class="character-item" data-id="${character.id}">
              <img loading="lazy" src="${character.img}" alt="Image de ${character.name}">
              <p>${character.name}</p>
              <p>Niveau : ${character.niveau}</p>
            </li>
          </a>
        `;
      })
      .join('');
  }

  updatePagination() {
    document.querySelector("#character_liste").innerHTML = this.renderPage();
    document.querySelector("#pageNumber").textContent = this.currentPage;

    // Mise à jour de l'état des liens de pagination
    document.querySelector("#prevPage").classList.toggle("disabled", this.currentPage === 1);
    const totalPages = Math.ceil(this.charactersAll.length / this.itemsPerPage);
    document.querySelector("#nextPage").classList.toggle("disabled", this.currentPage >= totalPages);
  }

  renderBarreRecherche(characters) {
    const recherche = document.getElementById("recherche");
    const characterListe = document.querySelector("#character_liste");

    if (!recherche || !characterListe) {
      console.error("La barre de recherche ou la liste de personnages n'est pas présente dans le DOM.");
      return;
    }

    recherche.addEventListener("input", (event) => {
      const query = event.target.value.trim().toLowerCase();
      
      // Si la recherche est vide, on restaure la pagination
      if (!query) {
        // Appel de la fonction updatePagination ou re-render de la page
        this.updatePagination();
        return;
      }
      
      const resultat = characters.filter(char =>
        char.name.toLowerCase().includes(query)
      );
    
      if (resultat.length > 0) {
        characterListe.innerHTML = resultat.map(char => {
          return `
            <a href="#/character/${char.id}" class="character-link">
              <li class="character-item" data-id="${char.id}">
                <img loading="lazy" src="${char.img}" alt="Image de ${char.name}">
                <p>${char.name}</p>
                <p>Niveau : ${char.niveau}</p>
              </li>
            </a>
          `;
        }).join("");
      } else {
        characterListe.innerHTML = "<p>Aucun personnage trouvé.</p>";
      }
    });
    
  }

  async afterRender() {
    // Attacher les événements de pagination
    document.querySelector("#prevPage").addEventListener("click", (event) => {
      event.preventDefault();
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePagination();
      }
    });

    document.querySelector("#nextPage").addEventListener("click", (event) => {
      event.preventDefault();
      const totalPages = Math.ceil(this.charactersAll.length / this.itemsPerPage);
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.updatePagination();
      }
    });

    // Délégation d'événement pour le clic sur un personnage
    document.querySelector("#character_liste").addEventListener("click", (event) => {
      const item = event.target.closest(".character-item");
      if (item) {
        const characterId = item.getAttribute("data-id");
        window.location.hash = `#/character/${characterId}`;
      }
    });

    // Appeler renderBarreRecherche ici, car le DOM est maintenant complet
    this.renderBarreRecherche(this.charactersAll);
  }
}
