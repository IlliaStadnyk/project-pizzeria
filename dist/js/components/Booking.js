import { templates, select, settings, classNames } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import { utils } from '../utils.js';
class Booking {
  constructor(booking) {
    const thisBooking = this;
    const element = booking;
    thisBooking.starter = [];
    thisBooking.selectedTable = null;
    thisBooking.render(element);
    thisBooking.initWidget();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;
    const startDateParam =
      settings.db.dateStartParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam =
      settings.db.dateEndParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [startDateParam, endDateParam],
      eventsRepeat: [endDateParam, settings.db.repeatParam],
      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],
    };

    const urls = {
      booking:
        settings.db.url +
        '/' +
        settings.db.bookings +
        '?' +
        params.booking.join('&'),
      eventsCurrent:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.eventsCurrent.join('&'),
      eventsRepeat:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponse) {
        const bookingResponse = allResponse[0];
        const eventsCurrentResponse = allResponse[1];
        const eventsRepeatResponse = allResponse[2];
        return Promise.all([
          bookingResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};
    for (const item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (const item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat === 'daily') {
        for (
          let loopDate = minDate;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            item.hour,
            item.duration,
            item.table
          );
        }
      }
    }
    thisBooking.updateDom();
    // console.log(thisBooking.booked);
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] === 'undefined') {
      thisBooking.booked[date] = {};
    }
    // console.log(hour);
    const startHour = utils.hourToNumber(hour);

    for (
      let hourBlock = startHour;
      hourBlock < startHour + duration;
      hourBlock += 0.5
    ) {
      if (typeof thisBooking.booked[date][hourBlock] === 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  updateDom() {
    const thisBooking = this;
    console.log(2);
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    if(thisBooking.selectedTable){
      const selectedTable = thisBooking.dom.floorPlan.querySelector(`.table[data-table = "${thisBooking.selectedTable}"]`);
      selectedTable.classList.remove('selected');
    }
    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] === 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] ===
        'undefined'
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        // console.log(thisBooking.booked);
        table.classList.add(classNames.booking.tableBooked);
      } else {
        // console.log(22);
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }
  render(element) {
    const thisBooking = this;
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;

    const bookingHTML = templates.bookingWidget();
    thisBooking.dom.wrapper.innerHTML = bookingHTML;
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(
      select.booking.floorPlan
    );
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.tables
    );
    thisBooking.dom.orderConfirmation = thisBooking.dom.wrapper.querySelector(
      select.booking.orderConfirmation
    );
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(
      select.booking.address
    );
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(
      select.booking.phone
    );
    thisBooking.dom.starter = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.starter
    );
    // console.log(thisBooking.dom.starter);
  }
  initWidget() {
    const thisBooking = this;

    thisBooking.amountPeopleWidget = new AmountWidget(
      thisBooking.dom.peopleAmount
    );
    thisBooking.hoursAmountWidget = new AmountWidget(
      thisBooking.dom.hoursAmount
    );
    // console.log(thisBooking.dom.datePicker);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDom();
    });
    thisBooking.dom.floorPlan.addEventListener('click', function (event) {
      thisBooking.initTable(event);
    });
    // console.log(thisBooking.dom.orderConfirmation);
    thisBooking.dom.orderConfirmation.addEventListener(
      'submit',
      function (event) {
        event.preventDefault();
        console.log(1);
        thisBooking.sendOrder();
      }
    );
    for (const item of thisBooking.dom.starter) {
      item.addEventListener('click', function () {
        thisBooking.setStarters(item.value);
      });
    }
  }
  initTable(event) {
    const thisBooking = this;
    const clickedElement = event.target;

    if (clickedElement.classList.contains(settings.booking.table)) {
      const tableId = clickedElement.getAttribute(
        settings.booking.tableIdAttribute
      );

      if (clickedElement.classList.contains(classNames.booking.tableBooked)) {
        alert('Ten stolik jest już zajęty!');
        return;
      }
      if (!clickedElement.classList.contains(classNames.booking.selected)) {
        const previousTable = thisBooking.dom.floorPlan.querySelector(
          `.table[data-table = "${thisBooking.selectedTable}"]`
        );
        if (previousTable) {
          previousTable.classList.remove('selected');
        }
        console.log(previousTable);
        clickedElement.classList.add('selected');
        thisBooking.selectedTable = parseInt(tableId, 10);
      } else {
        clickedElement.classList.remove('selected');
      }

      console.log(thisBooking.selectedTable);
    }
  }

  sendOrder() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.bookings;
    const payload = {};
    payload.date = thisBooking.date;
    payload.hour = thisBooking.hourPicker.value;
    payload.duration = thisBooking.hoursAmountWidget.value;
    payload.table = thisBooking.selectedTable;
    payload.ppl = thisBooking.amountPeopleWidget.value;
    payload.startes = thisBooking.starter;
    payload.phone = thisBooking.dom.phone.value;
    payload.address = thisBooking.dom.address.value;

    console.log(thisBooking.amountPeopleWidget);
    console.log('payload ', payload);

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
        thisBooking.updateDom();
      });
  }

  setStarters(item) {
    const thisBooking = this;
    const waterDom = Array.from(thisBooking.dom.starter).find(el => el.value === 'water');
    console.log(waterDom);
    if (!thisBooking.starter.includes(item)) {
      thisBooking.starter.push(item);
      if(item === 'bread' && !thisBooking.starter.includes('water')) {
        thisBooking.starter.push('water');
        waterDom.checked = true;
      }
    } else {
      const index = thisBooking.starter.indexOf(item);
      if(item === 'bread'){
        thisBooking.starter = [];
        waterDom.checked = false;
      }
      thisBooking.starter.splice(index, 1);
    }
    console.log(thisBooking.starter);
  }
}

export default Booking;
