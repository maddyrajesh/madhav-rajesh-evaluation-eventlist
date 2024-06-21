const API_URL = "http://localhost:3000/events";

const api = (() => {
  const fetchEventsAPI = async () => {
    return fetch(API_URL).then((res) => res.json());
  };

  const postEventAPI = async (newEvent) => {
    return fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    }).then((res) => res.json());
  };

  const putEventAPI = async (id, updatedEvent) => {
    return fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    }).then((res) => res.json());
  };

  const patchEventAPI = async (id, updatedEvent) => {
    return fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    }).then((res) => res.json());
  };

  const deleteEventAPI = async (id) => {
    return fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  return {
    fetchEventsAPI,
    postEventAPI,
    putEventAPI,
    patchEventAPI,
    deleteEventAPI,
  };
})();
