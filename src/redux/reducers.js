import { combineReducers } from 'redux';
import {
  ADD_SERVICE,
  DEL_SERVICE,
  UPDATE_SERVICE,
  CREATE_DEFAULT_GROUPS,
  INIT_GROUP,
  UNLOCK_GROUP,
  RELOAD_ALL,
  WIPE_ALL,
} from './actions';

import Group from '../models/Group';
import Utils from '../Utils';


function persistAndReturn(state) {
  Utils.saveDataToStoreAsync(state)
    .catch(() => {
      // ignore error for file not found
    });
  return state;
}

function secrets(state = {}, action) {
  switch (action.type) {
    case ADD_SERVICE:
      return persistAndReturn({
        ...state,
        services: [
          action.service,
          ...state.services,
        ],
      });
    case DEL_SERVICE:
      return persistAndReturn({
        ...state,
        services: state.services.filter(s => s.id !== action.service.id),
      });
    case UPDATE_SERVICE: {
      const newServicesList = state.services.map((item) => {
        if (item.id !== action.service.id) {
          return item;
        }
        return action.service;
      });

      return persistAndReturn({
        ...state,
        services: newServicesList,
      });
    }

    case CREATE_DEFAULT_GROUPS:
      return persistAndReturn({
        ...state,
        groups: [
          ...state.groups,
          new Group({ group: 'Important', icon: 'star', defaultSecurityLevel: 0 }),
          new Group({ group: 'Banks', icon: 'account-balance', defaultSecurityLevel: 0 }),
        ],
      });

    case INIT_GROUP:
      return persistAndReturn({
        ...state,
        groups: state.groups.map((g) => {
          if (g.id === action.group.id) {
            return new Group({
              ...g,
              ...action.group,
            });
          }
          return g;
        }),
      });
    case UNLOCK_GROUP:
      return {
        ...state,
        groups: state.groups.map((g) => {
          if (g.id === action.group.id) {
            return new Group({
              ...g,
              ...action.group,
            });
          }
          return g;
        }),
      };

    case RELOAD_ALL:
      return {
        ...state,
        ...action.data,
      };
    case WIPE_ALL:
      return persistAndReturn({
        ...state,
        groups: state.groups.map(g => (
          new Group({
            ...g,
            inputPassphrase: '',
            passphrase: '',
            deviceSecurity: false,
            storePassphrase: false,
          })
        )),
      });

    default:
      return state;
  }
}


const secretApp = combineReducers({
  secrets,
});

export default secretApp;
