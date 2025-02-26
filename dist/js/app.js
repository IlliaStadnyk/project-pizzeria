import {settings, select, classNames} from "./settings.js";
import Cart from "./components/Cart.js";
import Product from "./components/Product.js";
import Booking from "./components/Booking.js";
import Home from "./components/Home.js";

const app = {
  initPages: function() {
      const thisApp = this;
      // console.log("app initPages");
      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.navLinks = document.querySelectorAll(select.nav.links);
      const idFromHash = window.location.hash.replace('#/','');

      let pageMatchingHash = thisApp.pages[0].id;
      for (let page of thisApp.pages) {
          if(page.id === idFromHash) {
              pageMatchingHash = page.id;
              break;
          }
      }
      thisApp.activatePage(pageMatchingHash);
      for (let item of thisApp.navLinks) {
          item.addEventListener("click", function(event) {
              const clickedElement = this;
              event.preventDefault();
              const id = clickedElement.getAttribute("href").replace('#','');
              console.log(id);
              thisApp.activatePage(id);
              // change URL hash
              window.location.hash = '#/'+id;
          })
      }

  },
  initBooking: function() {
    const thisApp = this;
    thisApp.booking = document.querySelector(select.containerOf.booking);

    new Booking(thisApp.booking);
  },
  initHomePage: function() {
      const thisApp = this;
      thisApp.homePage = document.querySelector(select.containerOf.homePage);

      new Home(thisApp.homePage);

      thisApp.homePage.addEventListener("redirect-page", function(event) {
          // console.log("redirect page", event.target.getAttribute("id"));
          event.preventDefault();
          const id = event.target.getAttribute("id");
          console.log(id);
          thisApp.activatePage(id);
          window.location.hash = '#/'+id;
      })
  },
  activatePage: function(pageId) {
    const thisApp = this;

    for(let page of thisApp.pages) {
        page.classList.toggle(classNames.pages.active, page.id === pageId);
    }

    for(let link of thisApp.navLinks) {
        link.classList.toggle(classNames.nav.active, link.getAttribute('href') === '#'+pageId);
    }
  },
  initMenu: function () {
      const thisApp = this;
      for (let productData in thisApp.data.products) {
        new Product(
          thisApp.data.products[productData].id,
          thisApp.data.products[productData]
        );
      }
    },

  initCart: function () {
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
      thisApp.productList= document.querySelector(select.containerOf.menu);
      thisApp.productList.addEventListener("add-to-cart", (e) => {
        console.log(e.detail.product);
        app.cart.add(e.detail.product);
      })
    },

  initData: function () {
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
      fetch(url)
        .then(function (rawResponse) {
          return rawResponse.json();
        })
        .then(function (parsedResponse) {
          thisApp.data.products = parsedResponse;
          thisApp.initMenu();
        });
    },

  init: function () {
        const thisApp = this;
        thisApp.initHomePage();
        thisApp.initPages()
        thisApp.initData();
        thisApp.initCart();
        thisApp.initBooking()
  },
};

app.init();