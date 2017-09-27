import yaml from 'js-yaml';
import { DocumentPicker, FileSystem } from 'expo';

import { Group, Service } from './Models';


const Utils = {

  LOCAL_STORE: 'data.yml',

  async loadDataFromStoreAsync() {
    return new Promise((resolve, reject) => {
      const file = FileSystem.documentDirectory + Utils.LOCAL_STORE;
      FileSystem.readAsStringAsync(file)
        .then((txt) => {
          const data = yaml.safeLoad(txt);
          const models = {
            ...data,
            services: data.services.map(s => new Service(s)),
            groups: data.groups.map(g => new Group(g)),
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
