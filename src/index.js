"use strict";

const events = require("events");

class WebMIDIEmitter extends events.EventEmitter {
  constructor(access, deviceNameMatcher) {
    super();

    this.access = access;
    this.input = null;
    this.output = null;

    this._setupInputPort(deviceNameMatcher);
    this._setupOutputPort(deviceNameMatcher);

    this.access.addEventListener("statechange", (e) => {
      if (this.input === null) {
        this._setupInputPort(deviceNameMatcher);
      }
      if (this.output === null) {
        this._setupOutputPort(deviceNameMatcher);
      }
      if (e.port === this.input || e.port === this.output) {
        this.emit("statechange", e);
      }
    });
  }

  send(...args) {
    if (this.output) {
      this.output.send(...args);
    }
  }

  clear() {
    if (this.output) {
      this.output.clear();
    }
  }

  _setupInputPort(deviceNameMatcher) {
    this.input = getPort(this.access.inputs, deviceNameMatcher);
    if (this.input !== null) {
      this.input.onmidimessage = (e) => {
        this.emit("midimessage", e);
      };
    }
    return this.input;
  }

  _setupOutputPort(deviceNameMatcher) {
    this.output = getPort(this.access.outputs, deviceNameMatcher);
    return this.output
  }
}

function getPort(map, deviceNameMatcher) {
  return Array.from(map.values()).filter(device => !!device.name.match(deviceNameMatcher))[0] || null;
}

module.exports = WebMIDIEmitter;
