# web-midi-emitter
[![Build Status](http://img.shields.io/travis/mohayonao/web-midi-emitter.svg?style=flat-square)](https://travis-ci.org/mohayonao/web-midi-emitter)
[![NPM Version](http://img.shields.io/npm/v/web-midi-emitter.svg?style=flat-square)](https://www.npmjs.org/package/web-midi-emitter)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> easy Web MIDI message handler


## Installation

```
npm install --save web-midi-emitter
```

## API

### WebMIDIEmitter
- `constructor(access, deviceNameMatcher)`
  - `access: MIDIAccess`
  - `deviceNameMatcher: string or RegExp`

#### Instance methods
- `send(data: number[], [ timestamp: number ]): void`
  - send midi data to the midi device
- `clear(): void`

#### Events
- `statechange`
  - emitted when change the state of the midi device
- `midimessage`
  - emitted when receive midi data from the midi device

## How to use

```js
const WebMIDIEmitter = require("web-midi-emitter");

window.navigator.requestMIDIAccess().then((access) => {
  const device = new WebMIDIEmitter(access, "Launch Control");

  device.on("statechange", (e) => {
    console.log(e);
  });

  device.on("midimessage", (e) => {
    console.log(e.data);
  });

  device.send([ 0x90, 0x64, 0x7f ]);
});
```

## License

MIT
