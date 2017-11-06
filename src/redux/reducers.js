import { combineReducers } from 'redux';
import {
  ADD_SERVICE,
  DEL_SERVICE,
  UPDATE_SERVICE,
  COPY_SERVICE_SECRET,
  CREATE_DEFAULT_GROUPS,
  ADD_GROUP,
  DELETE_GROUP,
  INIT_GROUP,
  RENAME_GROUP,
  UNLOCK_GROUP,
  RELOAD_ALL,
  ERASE_ALL,
} from './actions';

import { Group, Service } from '../Models';
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
    case COPY_SERVICE_SECRET: {
      const newServicesList = state.services.map((item) => {
        if (item.id === action.service.id) {
          return action.service;
        } else if (item.copied) {
          return new Service({
            ...item,
            copied: false,
          });
        }
        return item;
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
          new Group({ group: 'Financial', icon: 'account-balance', defaultSecurityLevel: 0 }),
        ],
      });

    case ADD_GROUP:
      return persistAndReturn({
        ...state,
        groups: [
          ...state.groups,
          // always add at the end, because groups[0] must be the default group
          action.group,
        ],
      });
    case DELETE_GROUP:
      return persistAndReturn({
        ...state,
        groups: state.groups.filter(g => g.id !== action.group.id),
        services: state.services.filter(s => s.group !== action.group.id),
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
    case RENAME_GROUP:
      return persistAndReturn({
        ...state,
        groups: state.groups.map((g) => {
          if (g.id === action.id) {
            return new Group({
              ...g,
              ...action.group,
            });
          }
          return g;
        }),
        services: state.services.map((s) => {
          if (s.group === action.id) {
            return new Service({
              ...s,
              group: action.group.id,
            });
          }
          return s;
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
    case ERASE_ALL:
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
