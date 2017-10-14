class Group {
  constructor(group) {
    // serialized
    this.group = group.group || '';
    this.icon = group.icon || 'folder';
    this.passphrase = group.passphrase || '';
    this.storePassphrase = group.storePassphrase;

    // ui
    this.id = group.group || '';
    this.key = this.id;

    // internal state
    this.inputPassphrase = group.inputPassphrase || '';
  }

  getNavTitle() {
    return `${this.group} ${this.isUnlocked() ? '🔐' : '🔒'}`;
  }

  isInitialized() {
    return (!!this.passphrase) || (this.storePassphrase === false);
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

    return ser;
  }
}

export default Group;
