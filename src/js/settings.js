export const select = {
    templateOf: {
        menuProduct: '#template-menu-product',
        cartProduct: '#template-cart-product', // CODE ADDED
        bookingWidget: '#template-booking-widget',
        homePage: '#template-home-page',
    },
    containerOf: {
        menu: '#product-list',
        cart: '#cart',
        pages: '#pages',
        booking: '.booking-wrapper',
        homePage: '.home-page',
    },
    all: {
        menuProducts: '#product-list > .product',
        menuProductsActive: '#product-list > .product.active',
        formInputs: 'input, select',
    },
    menuProduct: {
        clickable: '.product__header',
        form: '.product__order',
        priceElem: '.product__total-price .price',
        imageWrapper: '.product__images',
        amountWidget: '.widget-amount',
        cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
        amount: {
            input: 'input.amount', // CODE CHANGED
            linkDecrease: 'a[href="#less"]',
            linkIncrease: 'a[href="#more"]',
        },
        datePicker: {
            wrapper: '.date-picker',
            input: `input[name="date"]`,
        },
        hourPicker: {
            wrapper: '.hour-picker',
            input: 'input[type="range"]',
            output: '.output',
        },
    },
    booking: {
        peopleAmount: '.people-amount',
        hoursAmount: '.hours-amount',
        tables: '.floor-plan .table',
        floorPlan: '.floor-plan',
        orderConfirmation: '.booking-form',
        phone: '[name="phone"]',
        address: '[name="address"]',
        starter: '[name="starter"]',
    },
    nav: {
        links: '.main-nav a',
    },
    // CODE ADDED START
    cart: {
        productList: '.cart__order-summary',
        toggleTrigger: '.cart__summary',
        totalNumber: `.cart__total-number`,
        totalPrice:
            '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
        subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
        deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
        form: '.cart__order',
        formSubmit: '.cart__order [type="submit"]',
        phone: '[name="phone"]',
        address: '[name="address"]',
    },
    cartProduct: {
        amountWidget: '.widget-amount',
        price: '.cart__product-price',
        edit: '[href="#edit"]',
        remove: '[href="#remove"]',
    },
    homePage: {
        startImage: '.start__img',
        socialPhoto: '.social-photo .social-photo-gallery',
    }
    // CODE ADDED END
};

export const classNames = {
    menuProduct: {
        wrapperActive: 'active',
        imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
        wrapperActive: 'active',
    },
    // CODE ADDED END
    booking: {
        loading: 'loading',
        tableBooked: 'booked',
        selected: 'selected',
    },
    nav: {
        active: 'active',
    },
    pages: {
        active: 'active',
    }
};

export const settings = {
    amountWidget: {
        defaultValue: 1,
        defaultMin: 1,
        defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
        defaultDeliveryFee: 20,
    },
    // CODE ADDED END
    db: {
        url: '//localhost:3132',
        products: 'products',
        orders: 'orders',
        bookings: 'bookings',
        events: 'events',
        images: 'images',
        dateStartParamKey: 'date_gte',
        dateEndParamKey: 'date_lte',
        notRepeatParam: 'repeat=false',
        repeatParam: 'repeat_ne=false',
    },
    hours: {
        open: 12,
        close: 24,
    },
    datePicker: {
        maxDaysInFuture: 14,
    },
    booking: {
        tableIdAttribute: 'data-table',
        table: 'table',
    },
    home:{
        images: [
            "images/home/assets/pizza-4.jpg",
            "images/home/assets/pizza-5.jpg",
            "images/home/assets/pizza-6.jpg",
            "images/home/assets/pizza-7.jpg",
            "images/home/assets/pizza-8.jpg",
            "images/home/assets/pizza-9.jpg"
        ]
    }
};

export const templates = {
    menuProduct: Handlebars.compile(
        document.querySelector(select.templateOf.menuProduct).innerHTML
    ),
    cartProduct: Handlebars.compile(
        document.querySelector(select.templateOf.cartProduct).innerHTML
    ),
    bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML),
    homePage: Handlebars.compile(document.querySelector(select.templateOf.homePage).innerHTML),
};