import seedrandom from 'seedrandom';
import { encode, decode } from '@msgpack/msgpack';

export default class prng {
  constructor(options = {}) {
    this.rng = seedrandom(options.seed, {
      state:
        options.state || options.base64State
          ? this._decodeB64State(options.base64State)
          : true
    });
  }

  state() {
    return this.rng.state();
  }

  _decodeB64State(compactState) {
    return decode(
      new Uint8Array([...atob(compactState)].map(char => char.charCodeAt(0)))
    );
    //return decode(atob(compactState).charCodeAt(0));
  }

  base64State() {
    //console.log(encode(this.state()));
    //console.log(btoa(String.fromCharCode(...encode(this.state()))))
    return btoa(String.fromCharCode(...encode(this.state())));
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  randomWeightedIndex(array) {
    const sumWeights = array.reduce((a, c) => a + c);
    const pick = this.rng() * sumWeights;
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
      if (sum >= pick) return i;
    }
  }
}
