# Tp_note_Javascript  
Groupe Info2.1A : Naima Akhtar, Ophélie Valin  

## Data.json  
Basé sur Solo Leveling  

## Commandes utiles

- pour lancer le json à partir de la racine : `npx json-server --watch data/data.json --static ./img`
- pour lancer l'application : php -S localhost:8000

## Fonctionnalités implémentées

- listing personnages
- pagination
- lazy loading
- barre de recherche
- détail d'un personnage
- favoris
- notation
- combat entre 2 personnages :
    - évolution possible en cas de victoire (expérience gagnée)

## Modules

Classes : 
- Character + Equipement + Pouvoir: Objet avec gestion des équipements et des pouvoirs
- Favoris : stockage des favoris en localstorage
- Notation : stockage de la notation en localstorage (si vide -> on prend en compte la notation du json)  

Outils :
- Utils : gestion de l'url  

Provider :
- JsonProvider : récupération des données du Json et mise à jour de celui-ci
