class Group {
  constructor(group) {
    // serialized
    this.group = group.group || '';
    this.icon = group.icon || 'folder';
    this.deviceSecurity = group.deviceSecurity;
    this.passphrase = group.passphrase || '';
    this.storePassphrase = group.storePassphrase;

    // ui
    this.id = group.group || '';
    this.key = this.id;
    this.defaultSecurityLevel = group.defaultSecurityLevel || 0;

    // internal state
    this.inputPassphrase = group.inputPassphrase || '';
  }

  getNavTitle() {
    if (!this.isInitialized()) {
      return `${this.group} - Setup`;
    }
    return `${this.group} ${this.isUnlocked() ? '🔐' : '🔒'}`;
  }

  getSecurityLevel() {
    // TODO(ec): assign constants, guarantee that we never get -1
    if (this.storePassphrase === false) {
      return 0;
    }
    if (this.deviceSecurity === true) {
      return 2;
    }
    if (this.passphrase) {
      return 1;
    }
    return -1;
  }

  isInitialized() {
    return (!!this.passphrase) || (this.storePassphrase === false) || (!!this.deviceSecurity);
  }

  isUnlocked() {
    return (!!this.inputPassphrase);
  }

  serialize() {
    const ser = {
      group: this.group,
    };

    if (this.icon !== 'folder') {
      ser.icon = this.icon;
    }

    if (this.passphrase === '') {
      ser.storePassphrase = false;
    } else {
      ser.passphrase = this.passphrase;
    }

    if (this.deviceSecurity) {
      ser.deviceSecurity = true;
    }

    return ser;
  }
}

export default Group;
