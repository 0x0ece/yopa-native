import { combineReducers } from 'redux';
import {
  ADD_SERVICE,
  DEL_SERVICE,
  UNLOCK_GROUPS,
  RELOAD_ALL,
} from './actions';


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

    case UNLOCK_GROUPS:
      return {
        ...state,
        groups: state.groups.map((g) => {
          if (g.id === action.group.id) {
            return {
              ...g,
              ...action.group,
            };
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
