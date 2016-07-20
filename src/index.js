"use strict";

const events = require("events");

class WebMIDIEmitter extends events.EventEmitter {
  constructor(access, deviceNameMatcher) {
    super();

    this.access = access;
    this.deviceName = "";
    this._deviceNameMatcher = deviceNameMatcher;

    this._setupInputPort();
    this._setupOutputPort();

    this.access.addEventListener("statechange", (e) => {
      if (e.port.name === this.deviceName) {
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
      this.input = getPort(this.access.inputs, this._deviceNameMatcher);
      if (this.input) {
        this.deviceName = this.input.name;
        this.input.onmidimessage = (e) => {
          this.emit("data", e.data);
        };
      }
    }
    return this.input;
  }

  _setupOutputPort() {
    if (!this.output) {
      this.output = getPort(this.access.outputs, this._deviceNameMatcher);
      if (this.output) {
        this.deviceName = this.output.name;
      }
    }
    return this.output
  }
}

function getPort(map, deviceNameMatcher) {
  return Array.from(map.values()).filter(device => !!device.name.match(deviceNameMatcher))[0] || null;
}

module.exports = WebMIDIEmitter;
