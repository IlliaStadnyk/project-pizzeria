import {select, settings, templates} from "../settings.js";

class Home{
    constructor(element) {
        const thisHome = this;
        // thisHome.getData();
        thisHome.render(element);
        thisHome.getElements(element);
        thisHome.iniAction();
        // thisHome.getData();
    }

    render(element) {
        const thisHome = this;
        thisHome.dom = {};
        thisHome.dom.wrapper = element;
        thisHome.socialPhotos = settings.home.images;
        const generalHTML = templates.homePage({socialPhotos: settings.home.images});
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

                // window.location.replace("http://localhost:3000/#/"+img.id);
                img.dispatchEvent(event);
            })
        }


    }
}

export default Home;