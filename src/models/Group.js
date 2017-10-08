class Group {
  constructor(group) {
    this.id = group.group || '';
    this.key = this.id;
    this.group = group.group || '';
    this.passphrase = group.passphrase || '';
    this.unlocked = group.unlocked || false;
    this.inputPassphrase = group.inputPassphrase || '';
    this.icon = group.icon || 'folder';
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
