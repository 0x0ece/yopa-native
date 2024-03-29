import yaml from 'js-yaml';
import { DocumentPicker, FileSystem, SecureStore } from 'expo';

import Config from './Config';
import { Group, Service } from './Models';


const Utils = {

  LOCAL_STORE: 'data.yml',

  /*
   * Redux store
   */

  serializeStore(store) {
    const services = store.services || [];
    const groups = store.groups || [];
    return yaml.safeDump({
      version: 1,
      services: services.map(s => s.serialize()),
      groups: groups.map(g => g.serialize()),
    });
  },

  /*
   * SecureStore
   */

  async savePassphraseToSecureStoreAsync(group, passphrase) {
    return new Promise((resolve, reject) => {
      SecureStore.setItemAsync(group.id, passphrase)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  async loadPassphraseFromSecureStoreAsync(group) {
    return new Promise((resolve, reject) => {
      SecureStore.getItemAsync(group.id)
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  async deletePassphraseFromSecureStoreAsync(group) {
    return new Promise((resolve, reject) => {
      SecureStore.deleteItemAsync(group.id)
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  deleteAllPassphrasesFromSecureStore(groups) {
    groups.forEach((g) => {
      if (g.deviceSecurity) {
        Utils.deletePassphraseFromSecureStoreAsync(g);
      }
    });
  },

  /*
   * FileSystem
   */

  async saveDataToStoreAsync(store) {
    return new Promise((resolve, reject) => {
      const file = FileSystem.documentDirectory + Utils.LOCAL_STORE;
      const content = Utils.serializeStore(store);
      FileSystem.writeAsStringAsync(file, content)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  async loadDataFromStoreAsync() {
    return new Promise((resolve, reject) => {
      const file = FileSystem.documentDirectory + Utils.LOCAL_STORE;
      FileSystem.readAsStringAsync(file)
        .then((txt) => {
          const data = yaml.safeLoad(txt);
          if (Utils.checkRestoredData(data)) {
            const models = {
              ...data,
              services: (data.services || []).map(s => new Service(s)),
              groups: (data.groups || []).map(g => new Group(g)),
            };
            resolve(models);
          } else {
            reject('The YAML file provided does not contain the required fields');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },


  checkRestoredData(data) {
    if (data.version && data.version === 1 &&
      data.groups && data.groups.find(g => (new Group(g)).isDefaultGroup()) !== undefined &&
      data.services && data.services.length > 0
    ) {
      return true;
    }
    return false;
  },

  async deleteDataFromStoreAsync() {
    return new Promise((resolve, reject) => {
      const file = FileSystem.documentDirectory + Utils.LOCAL_STORE;
      FileSystem.deleteAsync(file)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /*
   * DocumentPicker
   */

  async getRemoteDocumentAsync() {
    return new Promise((resolve, reject) => {
      DocumentPicker.getDocumentAsync({ type: 'text/*' })
        .then((result) => {
          if (result.type === 'success') {
            const fileSrc = result.uri;
            const fileDst = FileSystem.documentDirectory + Utils.LOCAL_STORE;
            FileSystem.downloadAsync(fileSrc, fileDst)
              .then((data) => {
                resolve(data);
              })
              .catch((error) => {
                reject(error);
              });
          }
        });
    });
  },

  /*
   * Group utils
   */

  getGroupSecurityLevels() {
    const optionsAll = [
      {
        title: 'Paranoid',
        desc: [
          'Never store the master password.',
          "Type it every time to unlock - MemPa won't check if it's correct or not.",
        ],
      },
      {
        title: 'Armored',
        desc: [
          'Store the master password encrypted.',
          'Type it every time to unlock.',
        ],
      },
      {
        title: 'Secure',
        desc: [
          'Store the master password in the device secure storage.',
          'Use your fingerprint to unlock.',
        ],
      },
    ];
    return Config.DeviceSecurity ? optionsAll : optionsAll.slice(0, -1);
  },

  updateGroup(group, passphrase, securityLevel) {
    switch (securityLevel) {
      case Group.SEC_LEVEL_MEMORY:
        return group.updateSecurityLevelMemory(passphrase);
      case Group.SEC_LEVEL_ENCRYPTED:
        return group.updateSecurityLevelEncrypted(passphrase);
      case Group.SEC_LEVEL_DEVICE: {
        const g = group.updateSecurityLevelDevice(passphrase);
        Utils.savePassphraseToSecureStoreAsync(g, passphrase);
        return g;
      }
      default:
        return null;
    }
  },

};

export default Utils;
