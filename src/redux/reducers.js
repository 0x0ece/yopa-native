import { combineReducers } from 'redux';
import {
  ADD_SERVICE,
  DEL_SERVICE,
  UNLOCK_GROUP,
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

    case UNLOCK_GROUP:
      return {
        ...state,
        groups: state.groups.map((g) => {
          if (g.group === action.group.group) {
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
