import {select, settings, templates} from "../settings.js";

class Home{
    constructor(element) {
        const thisHome = this;
        // thisHome.getData();
        thisHome.render(element);
        thisHome.getElements(element);
        thisHome.iniAction();
        thisHome.getData();
    }

    // addPhoto(socialPhotos){
    //     const thisHome = this;
    //     console.log(socialPhotos);
    //
    //
    // }
    getData() {
        const thisHome = this;
        thisHome.images = {};
        const url = settings.db.url + '/' + settings.db.images;
        // console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(images => {
                thisHome.images.socialPhotos = images;
                // console.log(thisHome.images);
            })
            .catch(error => console.error(error));
    }
    render(element) {
        const thisHome = this;
        thisHome.dom = {};
        thisHome.dom.wrapper = element;

        const generalHTML = templates.homePage();
        thisHome.dom.wrapper.innerHTML = generalHTML;

    }
    getElements(){
        const thisHome = this;

        thisHome.dom.startIamge = thisHome.dom.wrapper.querySelectorAll(select.homePage.startImage);
        thisHome.dom.socialPhoto = thisHome.dom.wrapper.querySelector(select.homePage.socialPhotos);
        console.log(thisHome.dom.socialPhoto)
    }
    iniAction(){
        const thisHome = this;
        const event = new CustomEvent('redirect-page',{
            bubbles: true,
        });
        for(const img of thisHome.dom.startIamge){
            img.addEventListener("click", () => {
                window.location.replace("http://localhost:3000/#/"+img.id);
                img.dispatchEvent(event);
            })
        }


    }
}

export default Home;