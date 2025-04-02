import JsonProvider from "../../services/provider/JsonProvider.js";
import Swal from "../../../node_modules/sweetalert2/src/sweetalert2.js";


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
            <div class="dropdown hidden">
              <label for="personnages-0">Choisir un personnage :</label>
              <select id="personnages-0"></select>
            </div>
          </div>
          <div class="character-slot" data-index="1">
            <p>Personnage 2</p>
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

      document.getElementById("fight-result").innerHTML = `
          <p>${gagnant.name} a gagné le combat !</p>
          <p>Il remporte <strong>${expGagnee} EXP</strong> !</p>
      `;

      await this.ajouterExperience(gagnant, expGagnee);
  }

  // Fonction pour gérer l'ajout d'expérience et la montée de niveau
  async ajouterExperience(personnage, expGagnee) {
    personnage.experience += expGagnee;
    let expMax = personnage.niveau * 2000;
    

    while (personnage.experience >= expMax) {
      console.log(personnage.experience);
        // ✅ Augmenter le niveau
        personnage.niveau++;

        // ✅ Appliquer les augmentations
        personnage.statistiques[0] += personnage.evolution[0];
        personnage.statistiques[1] += personnage.evolution[1];
        personnage.statistiques[2] += personnage.evolution[2];
        personnage.statistiques[3] += personnage.evolution[3];

        // ✅ Retirer l'expérience utilisée pour monter de niveau
        personnage.experience -= expMax;

        // ✅ Recalculer la nouvelle limite d'expérience
        expMax = personnage.niveau * 2 * 1000;

        Swal.fire({
          title: "Félicitations!",
          text: "Votre personnage a évolué !",
          imageUrl: "../static/img/${personnage.id}",
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: "Custom image"
        });
    }

    // ✅ Mise à jour du personnage dans le JSON via API
    await JsonProvider.updateCharacter(personnage);
    console.log(personnage);
  }
}