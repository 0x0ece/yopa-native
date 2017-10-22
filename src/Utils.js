import yaml from 'js-yaml';
import { DocumentPicker, FileSystem } from 'expo';

import { Group, Service } from './Models';


const Utils = {

  LOCAL_STORE: 'data.yml',

  serializeStore(store) {
    const services = store.services || [];
    const groups = store.groups || [];
    return yaml.safeDump({
      version: 1,
      services: services.map(s => s.serialize()),
      groups: groups.map(g => g.serialize()),
    });
  },

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

};

export default Utils;
