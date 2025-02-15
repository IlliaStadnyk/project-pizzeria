import {select, templates, classNames, settings} from "../settings.js";
import {utils} from "../utils.js";
import CartProduct from "./CartProduct.js";

class Cart {
    constructor(element) {
        const thisCart = this;

        thisCart.products = [];
        thisCart.getElements(element);
        thisCart.initActions();
    }
    getElements(element) {
        const thisCart = this;

        thisCart.dom = {};

        thisCart.dom.wrapper = element;

        thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
            select.cart.toggleTrigger
        );
        thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(
            select.cart.deliveryFee
        );
        thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(
            select.cart.subtotalPrice
        );
        thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(
            select.cart.totalPrice
        );
        thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(
            select.cart.totalNumber
        );
        thisCart.dom.productList = thisCart.dom.wrapper.querySelector(
            select.cart.productList
        );
        thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
        thisCart.dom.phone = thisCart.dom.wrapper.querySelector(
            select.cart.phone
        );
        thisCart.dom.address = thisCart.dom.wrapper.querySelector(
            select.cart.address
        );
    }
    initActions() {
        const thisCart = this;
        thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
            event.preventDefault();
            thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
        });
        thisCart.dom.productList.addEventListener('updated', function () {
            thisCart.update();
        });
        thisCart.dom.productList.addEventListener('remove', function (event) {
            thisCart.remove(event.detail.cartProduct);
        });
        thisCart.dom.form.addEventListener('submit', function (event) {
            event.preventDefault();
            thisCart.sendOrder();
        });
    }
    sendOrder() {
        const thisCart = this;
        const url = settings.db.url + '/' + settings.db.orders;
        const payload = {};
        payload.address = thisCart.dom.address.value;
        payload.phone = thisCart.dom.phone.value;
        payload.totalPrice = parseInt(thisCart.dom.totalPrice[0].textContent, 10);
        payload.subtotalPrice = parseInt(
            thisCart.dom.subtotalPrice.textContent,
            10
        );
        payload.totalNumber = parseInt(thisCart.dom.totalNumber.textContent, 10);
        payload.deliveryFee = parseInt(thisCart.dom.deliveryFee.textContent, 10);
        payload.products = [];
        for (let prod of thisCart.products) {
            payload.products.push(prod.getData());
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };

        fetch(url, options)
            .then(function (response) {
                return response.json();
            })
            .then(function (parsedResponse) {
                console.log(parsedResponse);
            });
    }
    remove(cartProduct) {
        let thisCart = this;
        cartProduct.dom.wrapper.remove();
        const indexOfCartProduct = thisCart.products.indexOf(cartProduct);
        if (indexOfCartProduct !== -1) {
            thisCart.products.splice(indexOfCartProduct, 1);
        }
        thisCart.update();
    }
    add(menuProduct) {
        const thisCart = this;
        const generateHTML = templates.cartProduct(menuProduct);
        const generatedDOM = utils.createDOMFromHTML(generateHTML);
        thisCart.dom.productList.appendChild(generatedDOM);
        thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
        // console.log(menuProduct);
        thisCart.update();
    }

    update() {
        const thisCart = this;
        let deliveryFee = settings.cart.defaultDeliveryFee;
        let totalNumber = 0;
        let subtotalPrice = 0;

        if (thisCart.products.length === 0) {
            deliveryFee = 0;
        }
        thisCart.dom.deliveryFee.innerHTML = deliveryFee;

        for (const product of thisCart.products) {
            totalNumber += product.amount;
            subtotalPrice += product.price;
            // console.log(product);
        }
        thisCart.totalPrice = subtotalPrice;
        thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
        for (let totalPriceHtml of thisCart.dom.totalPrice) {
            totalPriceHtml.innerHTML = subtotalPrice + deliveryFee;
        }
        thisCart.dom.totalNumber.innerHTML = totalNumber;
    }
}

export default Cart;