import {select, settings, templates} from "../settings.js";
import {utils} from "../utils.js";

class Home{
    constructor(){
        const thisHome = this;
        thisHome.getData();
    }

    render(){
        const thisHome = this;

        const generalHTML = templates.homePage(thisHome.images);
        console.log(1);
        thisHome.element = utils.createDOMFromHTML(generalHTML);
        const homeContainer = document.querySelector(select.containerOf.homePage);
        console.log(homeContainer);
        homeContainer.appendChild(thisHome.element);
    }
    getData() {
        const thisHome = this;
        thisHome.images = {};
        const url = settings.db.url + '/' + settings.db.images;
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(images => {
                thisHome.images.socialPhotos = images;
                console.log(thisHome.images);
                thisHome.render();
            })
            .catch(error => console.error(error));
    }
}

export default Home;