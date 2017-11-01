import Crypto from '../Crypto';
import Group from './Group';

class Service {
  constructor(service = {}) {
    this.id = service.service + service.username || '';
    this.key = this.id;
    this.service = service.service || '';
    this.username = service.username || '';
    this.group = service.group || Group.DEFAULT_GROUP;
    this.counter = service.counter || 0;
    this.icon = service.icon || this.service;
    this.description = service.description || '';
  }

  serialize() {
    const ser = {
      service: this.service,
      username: this.username,
      counter: this.counter,
    };

    if (this.group !== Group.DEFAULT_GROUP) {
      ser.group = this.group;
    }

    if (this.description !== '') {
      ser.description = this.description;
    }

    if (this.icon !== '') {
      ser.icon = this.icon;
    }

    return ser;
  }

  getSecret(group) {
    const s = this;
    const g = group || this.props.group;
    return Crypto.computeSecret(s.username, g.inputPassphrase, s.counter, s.service, s.extra);
  }
}

export default Service;
