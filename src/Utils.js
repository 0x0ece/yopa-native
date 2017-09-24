import yaml from 'js-yaml';
import { DocumentPicker, FileSystem } from 'expo';

import styles from '../styles/Main';


const Utils = {

  LOCAL_STORE: 'data.yml',

  async loadDataFromStoreAsync() {
    return new Promise((resolve, reject) => {
      file = FileSystem.documentDirectory + Utils.LOCAL_STORE;
      FileSystem.readAsStringAsync(file)
        .then((txt) => {
          const data = yaml.safeLoad(txt);
          resolve(data);
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
          if (result.type == 'success') {
            const fileSrc = result.uri;
            const fileDst = FileSystem.documentDirectory + Utils.LOCAL_STORE;
            FileSystem.downloadAsync(fileSrc, fileDst)
              .then((result) => {
                resolve(result);
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
