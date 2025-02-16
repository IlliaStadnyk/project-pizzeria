import {templates, select} from "../settings.js";
import AmountWidget from "./AmountWidget.js";
class Booking {
    constructor(booking) {
        const thisBooking = this;
        const element = booking;
        thisBooking.render(element);
        thisBooking.initWidget();
    }

    render(element) {
        const thisBooking = this;
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;

        const bookingHTML = templates.bookingWidget();
        thisBooking.dom.wrapper.innerHTML = bookingHTML;

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    }
    initWidget() {
        const thisBooking = this;
        console.log('thisBooking.dom.peopleAmount', thisBooking.dom.peopleAmount);
        thisBooking.amountPeopleWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    }
}

export default Booking;