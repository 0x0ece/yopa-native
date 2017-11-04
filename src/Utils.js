import yaml from 'js-yaml';
import { DocumentPicker, FileSystem, SecureStore } from 'expo';

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
          const models = {
            ...data,
            services: (data.services || []).map(s => new Service(s)),
            groups: (data.groups || []).map(g => new Group(g)),
          };
          resolve(models);
        })
        .catch((error) => {
          reject(error);
        });
    });
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
