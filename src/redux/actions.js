/*
 * action types
 */

export const ADD_SERVICE = 'ADD_SERVICE';
export const DEL_SERVICE = 'DEL_SERVICE';
export const UPDATE_SERVICE = 'UPDATE_SERVICE';
export const COPY_SERVICE_SECRET = 'COPY_SERVICE_SECRET';

export const CREATE_DEFAULT_GROUPS = 'CREATE_DEFAULT_GROUPS';
export const ADD_GROUP = 'ADD_GROUP';
export const DELETE_GROUP = 'DELETE_GROUP';
export const INIT_GROUP = 'INIT_GROUP';
export const RENAME_GROUP = 'RENAME_GROUP';
export const UNLOCK_GROUP = 'UNLOCK_GROUP';

export const RELOAD_ALL = 'RELOAD_ALL';
export const ERASE_ALL = 'ERASE_ALL';

/*
 * action creators
 */

export function addService(service) {
  return { type: ADD_SERVICE, service };
}

export function delService(service) {
  return { type: DEL_SERVICE, service };
}

export function updateService(service) {
  return { type: UPDATE_SERVICE, service };
}

export function copyServiceSecret(service) {
  return { type: COPY_SERVICE_SECRET, service };
}

export function addGroup(group) {
  return { type: ADD_GROUP, group };
}

export function deleteGroup(group) {
  return { type: DELETE_GROUP, group };
}

export function initGroup(group) {
  return { type: INIT_GROUP, group };
}

export function renameGroup(id, group) {
  return { type: RENAME_GROUP, id, group };
}

export function unlockGroup(group) {
  return { type: UNLOCK_GROUP, group };
}

export function createDefaultGroups() {
  return { type: CREATE_DEFAULT_GROUPS };
}

export function reloadAll(data) {
  return { type: RELOAD_ALL, data };
}

export function eraseAll() {
  return { type: ERASE_ALL };
}
