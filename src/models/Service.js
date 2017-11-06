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
    this.copied = service.copied || false;
  }

  getIconUrl() {
    return this.icon.startsWith('http') ? this.icon : `https://${this.icon}/favicon.ico`;
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
    if (!group.isUnlocked()) {
      return 'xxx-xxx-xxx-xxx';
    }
    return Crypto.computeSecret(this.username, group.inputPassphrase,
      this.counter, this.service, this.extra);
  }

  getSecretPreview(group) {
    if (this.copied) {
      return 'copied';
    }
    return group.isUnlocked() ? 'XXX-...' : 'xxx-....';
  }
}

export default Service;
