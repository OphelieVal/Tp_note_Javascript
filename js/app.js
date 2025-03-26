import Favourite from "./views/pages/Favourite.js";
import CharacterAll from "./views/pages/CharacterAll.js";
import Utils from "./services/outils/Utils.js";
import DetailsCharacter from "./views/pages/DetailsCharacter.js";
import JsonProvider from "./services/provider/JsonProvider.js";

const routes = {
    '/' : CharacterAll,
    '/characters' : CharacterAll,
    "/character/:id": DetailsCharacter,
    '/favourite' : Favourite
};

const router = async () => {
    const content = document.querySelector('#content');

    let request = Utils.parseRequestURL();
    console.log(request);
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '');

    let page = routes[parsedURL] ? new routes[parsedURL] : new CharacterAll;
    console.log(page);
    content.innerHTML = await page.render();

    if (page instanceof CharacterAll) {
        let data = await JsonProvider.fetchCharacters();
        page.renderBarreRecherche(data.charactersAll);
    }

    if (page instanceof DetailsCharacter) {
        content.innerHTML = await page.render();
        await page.afterRender();
    }
}

window.addEventListener('hashchange',router)
window.addEventListener('load',router);