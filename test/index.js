"use strict";

const assert = require("assert");
const test = require("eatest");
const sinon = require("sinon");
const WebMIDITestAPI = require("web-midi-test-api");
const WebMIDIEmitter = require("../src");

test.fork("device is already connected", () => {
  return WebMIDITestAPI.requestMIDIAccess().then((access) => {
    const device = WebMIDITestAPI.createMIDIDevice({ name: "Test Device" });
    const emitter = new WebMIDIEmitter(access, /Test Device/);
    const onmidimessage = sinon.spy();
    const send = sinon.spy();

    emitter.on("midimessage", onmidimessage);
    device.inputs[0].onmidimessage = send;

    assert(emitter instanceof WebMIDIEmitter);
    assert(emitter.input !== null);
    assert(emitter.output !== null);

    device.outputs[0].send([ 0x90, 0x64, 0x7f ]);
    assert(onmidimessage.callCount === 1);
    assert.deepEqual(onmidimessage.args[0][0].data, [ 0x90, 0x64, 0x7f ]);

    emitter.send([ 0xb0, 0x01, 0x7f ]);
    assert(send.callCount === 1);
    assert.deepEqual(send.args[0][0].data, [ 0xb0, 0x01, 0x7f ]);
  });
});

test.fork("device will be connected after", () => {
  return WebMIDITestAPI.requestMIDIAccess().then((access) => {
    const emitter = new WebMIDIEmitter(access, /Test Device/);
    const onmidimessage = sinon.spy();
    const send = sinon.spy();

    assert(emitter.input === null);
    assert(emitter.output === null);

    const device = WebMIDITestAPI.createMIDIDevice({ name: "Test Device" });

    emitter.on("midimessage", onmidimessage);
    device.inputs[0].onmidimessage = send;

    assert(emitter instanceof WebMIDIEmitter);
    assert(emitter.input !== null);
    assert(emitter.output !== null);

    device.outputs[0].send([ 0x90, 0x64, 0x7f ]);
    assert(onmidimessage.callCount === 1);
    assert.deepEqual(onmidimessage.args[0][0].data, [ 0x90, 0x64, 0x7f ]);

    emitter.send([ 0xb0, 0x01, 0x7f ]);
    assert(send.callCount === 1);
    assert.deepEqual(send.args[0][0].data, [ 0xb0, 0x01, 0x7f ]);
  });
});
