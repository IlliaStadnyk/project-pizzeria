import {select, templates, classNames} from "../settings.js";
import {utils} from "../utils.js";
import AmountWidget from "./AmountWidget.js";
class Product {
    constructor(id, data) {
        const thisProduct = this;
        thisProduct.id = id;
        thisProduct.data = data;
        thisProduct.renderInMenu();
        thisProduct.getElements();
        thisProduct.initAccordion();
        thisProduct.initOrderForm();
        thisProduct.initAmountWidget();
        thisProduct.processOrder();
    }

    renderInMenu() {
        const thisProduct = this;

        const generateHTML = templates.menuProduct(thisProduct.data);
        // console.log(thisProduct.data);
        thisProduct.element = utils.createDOMFromHTML(generateHTML);
        const menuContainer = document.querySelector(select.containerOf.menu);
        menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
        const thisProduct = this;

        thisProduct.accordionTrigger = thisProduct.element.querySelector(
            select.menuProduct.clickable
        );
        thisProduct.form = thisProduct.element.querySelector(
            select.menuProduct.form
        );
        thisProduct.formInputs = thisProduct.form.querySelectorAll(
            select.all.formInputs
        );
        thisProduct.cartButton = thisProduct.element.querySelector(
            select.menuProduct.cartButton
        );
        thisProduct.priceElem = thisProduct.element.querySelector(
            select.menuProduct.priceElem
        );
        thisProduct.imageWrapper = thisProduct.element.querySelector(
            select.menuProduct.imageWrapper
        );
        thisProduct.amountWidgetElem = thisProduct.element.querySelector(
            select.menuProduct.amountWidget
        );
    }

    initAmountWidget() {
        const thisProduct = this;
        thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
        thisProduct.amountWidgetElem.addEventListener('updated', () => {
            thisProduct.processOrder();
        });
    }

    initAccordion() {
        const thisProduct = this;
        thisProduct.accordionTrigger.addEventListener('click', function (event) {
            event.preventDefault();
            const activeProduct = document.querySelector('.product.active');
            if (activeProduct && activeProduct !== thisProduct.element) {
                activeProduct.classList.toggle('active');
            }
            thisProduct.element.classList.toggle('active');
        });
    }

    initOrderForm() {
        const thisProduct = this;

        thisProduct.form.addEventListener('submit', function (event) {
            event.preventDefault();
            thisProduct.processOrder();
        });

        for (let input of thisProduct.formInputs) {
            input.addEventListener('change', function () {
                thisProduct.processOrder();
            });
        }

        thisProduct.cartButton.addEventListener('click', function (event) {
            event.preventDefault();
            thisProduct.processOrder();
            thisProduct.addToCart();
        });
    }
    processOrder() {
        const thisProduct = this;
        const formData = utils.serializeFormToObject(thisProduct.form);

        let price = thisProduct.data.price;
        for (let paramId in thisProduct.data.params) {
            const param = thisProduct.data.params[paramId];
            for (let optionId in param.options) {
                const option = param.options[optionId];
                const pictureOfOption = thisProduct.imageWrapper.querySelector(
                    `img.${paramId}-${optionId}`
                );
                const optionSelected =
                    formData[paramId] && formData[paramId].includes(optionId);
                if (optionSelected) {
                    if (pictureOfOption) {
                        pictureOfOption.classList.add(
                            classNames.menuProduct.imageVisible
                        );
                    }
                    if (!option.default) {
                        price += option.price;
                    }
                } else {
                    if (pictureOfOption) {
                        pictureOfOption.classList.remove(
                            classNames.menuProduct.imageVisible
                        );
                    }
                    if (option.default) {
                        price -= option.price;
                    }
                }
            }
        }
        thisProduct.priceSingle = price;
        price *= thisProduct.amountWidget.value;
        thisProduct.priceElem.innerHTML = price;
        // console.log('---------------------------------------------------');
    }
    addToCart() {
        const thisProduct = this;
        // app.cart.add(thisProduct.prepareCartProduct());
        const event = new CustomEvent('add-to-cart', {
            bubbles: true,
            detail: {
                product: thisProduct.prepareCartProduct(),
            }
        });

        thisProduct.element.dispatchEvent(event);
    }
    prepareCartProduct() {
        const thisProduct = this;
        const productSummary = {};
        productSummary.id = thisProduct.id;
        productSummary.name = thisProduct.data.name;
        productSummary.amount = thisProduct.amountWidget.value;
        productSummary.params = thisProduct.prepareCartProductParams();
        productSummary.priceSingle = thisProduct.priceSingle;
        productSummary.price = productSummary.priceSingle * productSummary.amount;
        return productSummary;
    }
    prepareCartProductParams() {
        const thisProduct = this;

        const formData = utils.serializeFormToObject(thisProduct.form);
        const params = {};

        // for very category (param)
        for (let paramId in thisProduct.data.params) {
            const param = thisProduct.data.params[paramId];

            // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
            params[paramId] = {
                label: param.label,
                options: {},
            };

            // for every option in this category
            for (let optionId in param.options) {
                const option = param.options[optionId];
                const optionSelected =
                    formData[paramId] && formData[paramId].includes(optionId);

                if (optionSelected) {
                    params[paramId].options[optionId] = option.label;
                }
            }
        }
        return params;
    }
}

export default Product;