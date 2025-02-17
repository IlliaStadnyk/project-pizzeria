import {templates, select} from "../settings.js";
import AmountWidget from "./AmountWidget.js";
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";
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
        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper)
        thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper)

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    }
    initWidget() {
        const thisBooking = this;

        thisBooking.amountPeopleWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
        console.log(thisBooking.dom.datePicker);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    }
}

export default Booking;