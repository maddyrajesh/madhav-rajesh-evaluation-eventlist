class Controller {
    #model;
    #view;
    constructor(model, view) {
      this.#model = model;
      this.#view = view;
      this.initApp();
    }
  
    initApp() {
      this.fetchEvents();
      this.setUpEvents();
    }
  
    setUpEvents() {
      this.#view.addEventBtn.addEventListener("click", () => {
        const formRow = this.#view.renderFormRow();
        this.#view.toggleForm(formRow, true);
        this.setUpFormEvents(formRow, 'add');
      });
  
      this.#view.eventTableBody.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        if (!row) return;
        const eventId = row.id;
  
        if (e.target.closest(".delete-btn")) {
          this.deleteEvent(eventId);
        } else if (e.target.closest(".edit-btn")) {
          this.#view.insertFormIntoRow(row);
          this.#view.toggleForm(row, true);
          const event = this.#model.getEvents().find(event => event.id === eventId);
          this.#view.populateFormRow(row, event);
          this.setUpFormEvents(row, 'edit', eventId);
        }
      });
    }
  
    fetchEvents() {
      api.fetchEventsAPI().then((events) => {
        this.#model.setEvents(events);
        events.forEach((event) => {
          this.#view.renderEventElement(event);
        });
      });
    }
  
    validateForm(row) {
      const eventName = row.querySelector('.event-name-input').value.trim();
      const startDate = row.querySelector('.start-date-input').value;
      const endDate = row.querySelector('.end-date-input').value;
  
      if (!eventName || !startDate || !endDate) {
        alert('All fields are required.');
        return false;
      }
  
      if (new Date(startDate) > new Date(endDate)) {
        alert('Start date should not be later than end date.');
        return false;
      }
  
      return true;
    }
  
    setUpFormEvents(row, mode, eventId) {
      const saveBtn = row.querySelector(".save-btn");
      const addBtn = row.querySelector(".add-btn");
      const cancelBtn = row.querySelector(".cancel-btn");
  
      if (mode === 'add') {
        addBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.addEvent(row);
        });
      } else if (mode === 'edit') {
        saveBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.updateEvent(row, eventId);
        });
      }
  
      cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.#view.toggleForm(row, false);
        if (mode === 'add') {
          row.remove();
        } else {
          this.#view.clearForm(row);
          this.restoreEventRow(eventId);
        }
      });
    }
  
    addEvent(row) {
      if (!this.validateForm(row)) {
        return;
      }
  
      const newEvent = {
        eventName: row.querySelector(".event-name-input").value,
        startDate: row.querySelector(".start-date-input").value,
        endDate: row.querySelector(".end-date-input").value,
      };
  
      api.postEventAPI(newEvent).then((_newEvent) => {
        this.#model.addEvent(_newEvent);
        this.#view.renderEventElement(_newEvent);
        row.remove();
      });
    }
  
    updateEvent(row, eventId) {
      if (!this.validateForm(row)) {
        return;
      }
  
      const updatedEvent = {
        id: eventId,
        eventName: row.querySelector(".event-name-input").value,
        startDate: row.querySelector(".start-date-input").value,
        endDate: row.querySelector(".end-date-input").value,
      };
  
      api.putEventAPI(eventId, updatedEvent).then((_updatedEvent) => {
        this.#model.updateEvent(_updatedEvent);
        row.innerHTML = `
          <td>${_updatedEvent.eventName}</td>
          <td>${_updatedEvent.startDate}</td>
          <td>${_updatedEvent.endDate}</td>
          <td>
            <button class="edit-btn">
              <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
            </button>
            <button class="delete-btn">
              <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </button>
          </td>
        `;
      });
    }
  
    deleteEvent(eventId) {
      api.deleteEventAPI(eventId).then(() => {
        this.#model.removeEvent(eventId);
        this.#view.removeEventElement(eventId);
      });
    }
  
    restoreEventRow(eventId) {
      const event = this.#model.getEvents().find(event => event.id === eventId);
      const row = document.getElementById(eventId);
      row.innerHTML = `
        <td>${event.eventName}</td>
        <td>${event.startDate}</td>
        <td>${event.endDate}</td>
        <td>
          <button class="edit-btn">
            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
          </button>
          <button class="delete-btn">
            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
          </button>
        </td>
      `;
    }
  }
  