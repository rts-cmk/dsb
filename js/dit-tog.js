export default class DitTog extends EventTarget{
  static #API_URL = "wss://api.mit-tog.dk/api/ws/";
  #station = null;
  #socket = null;


  Endpoints = {
    DEPARTURE: "departure"
  }

  get API_URL() { return DitTog.#API_URL }

  constructor(station) {
    super();

    this.#station = station;

    const url = new URL( this.Endpoints.DEPARTURE + '/' + station + '/dinstation/', DitTog.#API_URL);

    this.#socket = new WebSocket(url);

    this.#socket.addEventListener("message", event => this.dispatchEvent(new CustomEvent('update', { detail: JSON.parse(event.data) })));
    this.#socket.addEventListener("error", event => this.dispatchEvent(new CustomEvent('error', { detail: event })));
  }

}

/* 
const stations = await (await fetch("stations.json")).json();

const socket = new WebSocket("wss://api.mit-tog.dk/api/ws/departure/RO/dinstation/");

// Listen for messages
socket.addEventListener("message", event => update(JSON.parse(event.data)));

function update(data) {
  console.log(data);

  
} */