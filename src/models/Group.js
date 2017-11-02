import Crypto from '../Crypto';

class Group {
  constructor(group = {}) {
    // serialized
    this.group = group.group || Group.DEFAULT_GROUP;
    this.icon = group.icon || Group.DEFAULT_ICON;
    this.deviceSecurity = group.deviceSecurity || false;
    this.passphrase = group.passphrase || '';
    this.storePassphrase = group.storePassphrase;

    // ui
    this.id = this.group;
    this.key = this.group;
    this.defaultSecurityLevel = group.defaultSecurityLevel;

    // internal state
    this.inputPassphrase = group.inputPassphrase || '';
  }

  getNavTitle() {
    if (!this.isInitialized()) {
      return `${this.group} - Setup`;
    }
    return `${this.group} ${this.isUnlocked() ? '🔐' : '🔒'}`;
  }

  getPromptTitle() {
    return this.isDefaultGroup() ? 'Master password' : `Master password for ${this.group}`;
  }

  getSecurityLevel() {
    // TODO(ec): guarantee that we never get -1
    if (this.storePassphrase === false) {
      return Group.SEC_LEVEL_MEMORY;
    }
    if (this.deviceSecurity === true) {
      return Group.SEC_LEVEL_DEVICE;
    }
    if (this.passphrase) {
      return Group.SEC_LEVEL_ENCRYPTED;
    }
    return -1;
  }

  isDefaultGroup() {
    return this.group === Group.DEFAULT_GROUP;
  }

  isInitialized() {
    return (!!this.passphrase)
      || (this.storePassphrase === false)
      || (this.deviceSecurity === true);
  }

  isUnlocked() {
    return (!!this.inputPassphrase);
  }

  serialize() {
    const ser = {
      group: this.group,
    };

    if (this.icon !== Group.DEFAULT_ICON) {
      ser.icon = this.icon;
    }

    if (this.storePassphrase === false) {
      ser.storePassphrase = false;
    } else {
      if (this.passphrase !== '') {
        ser.passphrase = this.passphrase;
      }

      if (this.deviceSecurity) {
        ser.deviceSecurity = true;
      }
    }

    return ser;
  }

  updateErase() {
    return new Group({
      ...this,
      deviceSecurity: false,
      inputPassphrase: '',
      passphrase: '',
      storePassphrase: false,
    });
  }

  updateSecurityLevelMemory(passphrase = '') {
    // when we transition to paranoic, we always want to lock the group,
    // i.e. inputPassphrase = ''
    // the only exception is when the group is inizialized, where we
    // immediately store the passphrase
    const inputPassphrase = this.isInitialized() ? '' : passphrase;

    return new Group({
      ...this,
      deviceSecurity: false,
      inputPassphrase,
      passphrase: '',
      storePassphrase: false,
    });
  }

  updateSecurityLevelEncrypted(passphrase = '') {
    return new Group({
      ...this,
      deviceSecurity: false,
      inputPassphrase: passphrase,
      passphrase: passphrase ? Crypto.encryptPassphrase(passphrase) : this.passphrase,
      storePassphrase: undefined,
    });
  }

  updateSecurityLevelDevice(passphrase = '') {
    return new Group({
      ...this,
      deviceSecurity: true,
      inputPassphrase: passphrase,
      passphrase: passphrase ? Crypto.encryptPassphrase(passphrase) : this.passphrase,
      storePassphrase: undefined,
    });
  }
}

Group.DEFAULT_GROUP = '_default_';
Group.DEFAULT_ICON = 'folder';

Group.SEC_LEVEL_MEMORY = 0;
Group.SEC_LEVEL_ENCRYPTED = 1;
Group.SEC_LEVEL_DEVICE = 2;

export default Group;
