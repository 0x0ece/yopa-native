import { combineReducers } from 'redux';
import {
  ADD_SERVICE,
  DEL_SERVICE,
  CREATE_DEFAULT_GROUPS,
  UNLOCK_GROUP,
  RELOAD_ALL,
} from './actions';

import Group from '../models/Group';


function secrets(state = {}, action) {
  switch (action.type) {
    case ADD_SERVICE:
      return {
        ...state,
        services: [
          ...state.services,
          action.service,
        ],
      };
    case DEL_SERVICE:
      return {
        ...state,
        services: state.services.filter(s => s.id !== action.service.id),
      };

    case CREATE_DEFAULT_GROUPS:
      return {
        ...state,
        groups: [
          ...state.groups,
          new Group({ group: 'Important', icon: 'star' }),
          new Group({ group: 'Banks', icon: 'account-balance' }),
        ],
      };

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

    default:
      return state;
  }
}


const secretApp = combineReducers({
  secrets,
});

export default secretApp;
