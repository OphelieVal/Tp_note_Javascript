import JsonProvider from "../../services/provider/JsonProvider.js";

export default class CharacterFight {
    constructor() {
        this.selectedCharacters = [null, null];
    }

    async render() {
        let data = await JsonProvider.fetchCharacters();
        let { charactersAll } = data;

        let view = `
        <head>
        </head>
        <h2>CHOISISSEZ DEUX PERSONNAGES</h2>
        <div id="selection-container">
          <div class="character-slot" data-index="0">
            <p>Personnage 1</p>
            <button class="select-button">+</button>
            <div class="dropdown hidden">
              <label for="personnages-0">Choisir un personnage :</label>
              <select id="personnages-0"></select>
            </div>
          </div>
          <div class="character-slot" data-index="1">
            <p>Personnage 2</p>
            <button class="select-button">+</button>
            <div class="dropdown hidden">
              <label for="personnages-1">Choisir un personnage :</label>
              <select id="personnages-1"></select>
            </div>
          </div>
        </div>
        <button id="fight-button" disabled>Combattre</button>
        <div id="fight-result"></div>
        `;
        return view;
    }

    async afterRender() {

        async function remplirMenuDeroulant()  {
            const dropdowns = document.querySelectorAll('.dropdown select'); 

            let data = await JsonProvider.fetchCharacters();
            let { charactersAll } = data;
            
            

            dropdowns.forEach(select => {
                const emptyOption = document.createElement("option");
                emptyOption.value = "";  
                emptyOption.textContent = " "; 
                select.appendChild(emptyOption);
                
                charactersAll.forEach(character => {
                    const option = document.createElement("option");
                    option.value = character.id; 
                    option.textContent = character.name; 
                    select.appendChild(option);
                });
            });
        }
        await remplirMenuDeroulant();
        this.setupEventListeners();
    }

    setupEventListeners() {
      const buttons = document.querySelectorAll('.select-button');
      buttons.forEach(button => {
          button.addEventListener('click', (event) => {
              const index = event.target.closest('.character-slot').getAttribute('data-index');
              this.toggleDropdown(index);
          });
      });
  
      const btnFight = document.getElementById('fight-button');
      btnFight.addEventListener('click', function() {
        this.fight();
      }.bind(this));

      const selects = document.querySelectorAll('select');
      selects.forEach(select => {
          select.addEventListener('change', (event) => {
              const index = event.target.closest('.character-slot').getAttribute('data-index');
              const selectedValue = event.target.value;
  
              // Vérifier si le personnage est déjà sélectionné dans l'autre slot
              const otherIndex = index === "0" ? "1" : "0";
              if (this.selectedCharacters[otherIndex] === selectedValue) {
                  alert("Ce personnage est déjà sélectionné !");
                  event.target.value = ""; // Réinitialise la sélection
                  return;
              }
              this.selectedCharacters[index] = selectedValue;
              this.toggleFightButton();
          });
      });
    }

    toggleDropdown(index) {
        const dropdown = document.querySelector(`.character-slot[data-index="${index}"] .dropdown`);
        dropdown.classList.toggle('hidden');
    }

    toggleFightButton() {
        const fightButton = document.getElementById('fight-button');
        // Si les deux personnages sont sélectionnés, activer le bouton
        if (this.selectedCharacters[0] && this.selectedCharacters[1]) {
            fightButton.disabled = false;
        } else {
            fightButton.disabled = true;
        }
    }
    async fight() {
      // Récupération des personnages sélectionnés
      let data = await JsonProvider.fetchCharacters();
      let { charactersAll } = data;
  
      const character1 = charactersAll.find(c => c.id == this.selectedCharacters[0]);
      const character2 = charactersAll.find(c => c.id == this.selectedCharacters[1]);

      console.log("Personnage 1 :", character1);
      console.log("Personnage 2 :", character2);

  
      if (!character1 || !character2) {
          alert("Veuillez sélectionner deux personnages.");
          return;
      }

      console.log(character1.statistiques);
      console.log(character2.statistiques);
  
      // Calcul des stats totales
      const statsTotal1 = 
      Number(character1.statistiques[0]) + 
      Number(character1.statistiques[1]) +
      Number(character1.statistiques[2]) + 
      Number(character1.statistiques[3]);
  
      const statsTotal2 = 
      Number(character2.statistiques[0]) + 
      Number(character2.statistiques[1]) +
      Number(character2.statistiques[2]) + 
      Number(character2.statistiques[3]);
  
      console.log("Stats total 1 :", statsTotal1);                    
      console.log("Stats total 2 :", statsTotal2);

      let gagnant, perdant, expGagnee;
      
      if (statsTotal1 > statsTotal2) {
          gagnant = character1;
          perdant = character2;
      } else if (statsTotal2 > statsTotal1) {
          gagnant = character2;
          perdant = character1;
      } else {
          document.getElementById("fight-result").innerHTML = `<p>Match nul !</p>`;
          return;
      }
  
      // Calcul de l'expérience gagnée (proportionnelle à la différence de stats)
      expGagnee = Math.abs(statsTotal1 - statsTotal2) * 10;
      
      // Affichage du résultat
      document.getElementById("fight-result").innerHTML = `
          <p>${gagnant.name} a gagné le combat !</p>
          <p>Il remporte <strong>${expGagnee} EXP</strong> !</p>
      `;
  }
  
}






      //  let data = await JsonProvider.fetchCharacters();
      //  let { charactersAll, equipementsAll, pouvoirsAll } = data;
//
      //  // Ajout des événements pour afficher/cacher le menu déroulant
      //  this.addDropdownListeners(charactersAll);
//
      //  // Ajout des événements pour la sélection des personnages
      //  document.querySelectorAll(".dropdown-item").forEach(item => {
      //      item.addEventListener("click", (event) => {
      //          let charId = event.target.getAttribute("data-id");
      //          let character = charactersAll.find(c => c.id == charId);
      //          let slotIndex = event.target.closest(".character-slot").getAttribute("data-index");
//
      //          if (this.selectedCharacters.includes(character)) return;
//
      //          // Mettre à jour le personnage sélectionné
      //          this.selectedCharacters[slotIndex] = character;
      //          event.target.closest(".dropdown").classList.add("hidden");
//
      //          // Mettre à jour l'affichage du personnage
      //          let slot = event.target.closest(".character-slot");
      //          slot.innerHTML = `
      //            <p>${character.name}</p>
      //            <img src="${character.img}" alt="${character.name}">
      //            <p>Stats: ${this.calculateStats(character, equipementsAll, pouvoirsAll).stats}</p>
      //            <button class="deselect-button" data-index="${slotIndex}">X</button>
      //          `;
//
      //          // Si deux personnages sont sélectionnés, activer le bouton de combat
      //          if (this.selectedCharacters[0] && this.selectedCharacters[1]) {
      //              document.getElementById("fight-button").disabled = false;
      //          }
//
      //          // Ajouter les listeners de désélection des personnages
      //          this.addDeselectListeners();
      //      });
      //  });
//
      //  // Gérer le clic sur le bouton "Combattre"
      //  document.getElementById("fight-button").addEventListener("click", () => {
      //      let result = this.simulateFight(this.selectedCharacters, equipementsAll, pouvoirsAll);
      //      document.getElementById("fight-result").innerHTML = `<p>${result}</p>`;
      //      this.selectedCharacters = [null, null];
    //      this.render(); // Re-render the page to reset dropdowns
  //      });
  //  }
//
  //  addDropdownListeners(charactersAll) {
  //      // Ajouter l'événement pour afficher/cacher le menu déroulant au clic sur le bouton "+"
  //      document.querySelectorAll(".select-button").forEach(button => {
  //          button.addEventListener("click", (event) => {
  //              let dropdown = event.target.nextElementSibling;
  //              dropdown.classList.toggle("hidden");
  //          });
  //      });
//
  //      // Ajouter l'événement pour sélectionner un personnage
  //      document.querySelectorAll(".dropdown-item").forEach(item => {
  //          item.addEventListener("click", (event) => {
  //              let charId = event.target.getAttribute("data-id");
  //              let character = charactersAll.find(c => c.id == charId);
  //              let slotIndex = event.target.closest(".character-slot").getAttribute("data-index");
//
  //              if (this.selectedCharacters.includes(character)) return;
//
  //              // Mettre à jour le personnage sélectionné
  //              this.selectedCharacters[slotIndex] = character;
  //              event.target.closest(".dropdown").classList.add("hidden");
//
  //              // Mettre à jour l'affichage du personnage
  //              let slot = event.target.closest(".character-slot");
  //              slot.innerHTML = `
  //                <p>${character.name}</p>
  //                <img src="${character.img}" alt="${character.name}">
  //                <p>Stats: ${this.calculateStats(character, equipementsAll, pouvoirsAll).stats}</p>
  //                <button class="deselect-button" data-index="${slotIndex}">X</button>
  //              `;
//
  //              // Si deux personnages sont sélectionnés, activer le bouton de combat
  //              if (this.selectedCharacters[0] && this.selectedCharacters[1]) {
  //                  document.getElementById("fight-button").disabled = false;
  //              }
//
  //              // Ajouter les listeners de désélection des personnages
  //              this.addDeselectListeners();
  //          });
  //      });
  //  }
//
  //  addDeselectListeners() {
  //      // Ajouter les événements pour supprimer un personnage sélectionné
  //      document.querySelectorAll(".deselect-button").forEach(button => {
  //          button.addEventListener("click", (event) => {
  //              let index = event.target.getAttribute("data-index");
  //              this.selectedCharacters[index] = null;
//
  //              // Réinitialiser le slot après suppression
  //              let slot = event.target.closest(".character-slot");
  //              slot.innerHTML = `
  //                <p>Personnage ${parseInt(index) + 1}</p>
  //                <button class="select-button">+</button>
  //                <div class="dropdown hidden">
  //                  ${this.renderDropdown()}
  //                </div>
  //              `;
//
  //              // Rappeler afterRender pour réinitialiser les événements
  //              this.afterRender(); // Réactiver les événements après suppression
  //          });
  //      });
  //  }
//
  //  renderDropdown() {
  //      return JsonProvider.fetchCharacters().then(data => {
  //          let { charactersAll } = data;
  //          return charactersAll.map(character => `
  //              <div class="dropdown-item" data-id="${character.id}">${character.name}</div>
  //          `).join('');
  //      });
  //  }
//
  //  simulateFight(characters, equipementsAll, pouvoirsAll) {
  //      let [char1, char2] = characters.map(char => this.calculateStats(char, equipementsAll, pouvoirsAll));
  //      let winner = null;
//
  //      if (char1.stats > char2.stats) {
  //          winner = char1;
  //      } else if (char2.stats > char1.stats) {
  //          winner = char2;
  //      }
//
  //      if (winner) {
  //          let coins = winner.stats * 10;
  //          this.updateCoins(coins);
  //          return `${winner.name} remporte le combat et gagne ${coins} pièces !`;
  //      }
  //      return "Match nul !";
  //  }
//
  //  calculateStats(character, equipementsAll, pouvoirsAll) {
  //      let stats = character.niveau;
//
  //      character.equipements.forEach(equipId => {
  //          let equip = equipementsAll.find(e => e.id == equipId);
  //          if (equip) stats += equip.bonus;
  //      });
//
  //      character.pouvoirs.forEach(pouvoirId => {
  //          let pouvoir = pouvoirsAll.find(p => p.id == pouvoirId);
  //          if (pouvoir) stats += pouvoir.bonus;
  //      });
//
  //      return { name: character.name, stats };
  //  }
//
  //  updateCoins(amount) {
  //      let coins = localStorage.getItem("coins") || 0;
  //      coins = parseInt(coins) + amount;
  //      localStorage.setItem("coins", coins);
  //  }

