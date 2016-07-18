"use strict";

const events = require("events");

class WebMIDIEmitter extends events.EventEmitter {
  constructor(access, deviceName) {
    super();

    this.access = access;
    this.deviceName = deviceName;

    this._setupInputPort();
    this._setupOutputPort();

    this.access.addEventListener("statechange", (e) => {
      if (e.port.name === deviceName) {
        this._setupInputPort();
        this._setupOutputPort();
        this.emit("statechange", e);
      }
    });
  }

  write(data) {
    if (this.output) {
      this.output.send(data);
    }
  }

  _setupInputPort() {
    if (!this.input) {
      this.input = getPort(this.access.inputs, this.deviceName);
      if (this.input) {
        this.input.onmidimessage = (e) => {
          this.emit("data", e.data);
        };
      }
    }
    return this.input;
  }

  _setupOutputPort() {
    if (!this.output) {
      this.output = getPort(this.access.outputs, this.deviceName);
    }
    return this.output
  }
}

function getPort(map, deviceName) {
  return Array.from(map.values()).filter(device => device.name === deviceName)[0] || null;
}

module.exports = WebMIDIEmitter;
