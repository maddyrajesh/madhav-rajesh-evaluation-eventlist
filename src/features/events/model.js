class Model {
    #events;
    constructor() {
      this.#events = [];
    }
  
    setEvents(events) {
      this.#events = events;
    }
  
    get length() {
      return this.#events.length;
    }
  
    getEvents() {
      return [...this.#events];
    }
  
    addEvent(newEvent) {
      this.#events.push(newEvent);
    }
  
    updateEvent(updatedEvent) {
      const index = this.#events.findIndex(event => event.id === updatedEvent.id);
      if (index !== -1) {
        this.#events[index] = updatedEvent;
      }
    }
  
    removeEvent(id) {
      this.#events = this.#events.filter((event) => event.id !== id);
    }
  }
  