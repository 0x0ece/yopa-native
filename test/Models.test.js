import { Group, Service } from '../src/Models';

const GROUP_PREDEF = { group: 'Important', icon: 'star', defaultSecurityLevel: 0 };

const GROUP_USER_NOT_INIT = { group: 'MyGroup' };
const GROUP_USER_MEM = { group: 'MyGroup', storePassphrase: false };
const GROUP_USER_MEM_UNLOCKED = { group: 'MyGroup', storePassphrase: false, inputPassphrase: 'y' };
const GROUP_USER_ENC = { group: 'MyGroup', passphrase: 'x' };
const GROUP_USER_ENC_UNLOCKED = { group: 'MyGroup', passphrase: 'x', inputPassphrase: 'y' };
const GROUP_USER_DEV = { group: 'MyGroup', passphrase: 'x', deviceSecurity: true };
const GROUP_USER_DEV_UNLOCKED = { group: 'MyGroup', passphrase: 'x', deviceSecurity: true, inputPassphrase: 'y' };

const GROUP_ERASED = GROUP_USER_MEM; // erase === paranoic locked

const GROUPS_USER_INIT = [
  GROUP_USER_MEM,
  GROUP_USER_MEM_UNLOCKED,
  GROUP_USER_ENC,
  GROUP_USER_ENC_UNLOCKED,
  GROUP_USER_DEV,
  GROUP_USER_DEV_UNLOCKED,
];
const GROUPS_USER = [
  GROUP_USER_NOT_INIT,
  GROUP_USER_MEM,
  GROUP_USER_MEM_UNLOCKED,
  GROUP_USER_ENC,
  GROUP_USER_ENC_UNLOCKED,
  GROUP_USER_DEV,
  GROUP_USER_DEV_UNLOCKED,
];

it('Group default can be instantiated', () => {
  const model = new Group();
  expect(model).toBeTruthy();

  expect(model.group).toBe(Group.DEFAULT_GROUP);
  expect(model.icon).toBe(Group.DEFAULT_ICON);
  expect(model.storePassphrase).toBe(undefined);
  expect(model.defaultSecurityLevel).toBe(undefined);
  expect(model.isDefaultGroup()).toBe(true);
  expect(model.isInitialized()).toBe(false);
  expect(model.getSecurityLevel()).toBe(-1);
});

it('Group pre-defined can be instantiated', () => {
  const model = new Group(GROUP_PREDEF);
  expect(model).toBeTruthy();

  expect(model.group).toBe('Important');
  expect(model.icon).toBe('star');
  expect(model.storePassphrase).toBe(undefined);
  expect(model.defaultSecurityLevel).toBe(0);
  expect(model.isDefaultGroup()).toBe(false);
  expect(model.isInitialized()).toBe(false);
  expect(model.getSecurityLevel()).toBe(-1);
});

it('Group user-defined can be instantiated', () => {
  const model = new Group(GROUP_USER_NOT_INIT);
  expect(model).toBeTruthy();

  expect(model.group).toBe('MyGroup');
  expect(model.icon).toBe(Group.DEFAULT_ICON);
  expect(model.storePassphrase).toBe(undefined);
  expect(model.defaultSecurityLevel).toBe(undefined);
  expect(model.isDefaultGroup()).toBe(false);
  expect(model.isInitialized()).toBe(false);
  expect(model.getSecurityLevel()).toBe(-1);
});

it('Group default can be serialized', () => {
  const model = new Group();
  const serialized = model.serialize();
  const newModel = new Group(serialized);
  expect(newModel).toEqual(model);
});

it('Groups can be serialized', () => {
  const ALL = GROUPS_USER + [
    GROUP_PREDEF,
  ];
  for (const g of ALL) {
    const model = new Group(g);
    const serialized = model.serialize();
    const newModel = new Group(serialized);
    model.defaultSecurityLevel = undefined; // not serialized
    model.inputPassphrase = ''; // not serialized
    expect(newModel).toEqual(model);
  }
});

it('Groups can be erased', () => {
  const expected = new Group(GROUP_ERASED); // always locked
  for (const g of GROUPS_USER) {
    const model = new Group(g);
    const newModel = model.updateErase();
    expect(newModel).toEqual(expected);
  }
});

it('Groups can be updated to paranoic', () => {
  const expected = new Group(GROUP_USER_MEM); // always locked
  for (const g of GROUPS_USER) {
    const model = new Group(g);
    const newModel = model.updateSecurityLevelMemory();
    expect(newModel).toEqual(expected);
  }

  for (const g of GROUPS_USER_INIT) {
    const model = new Group(g);
    const newModel = model.updateSecurityLevelMemory('y');
    expect(newModel).toEqual(expected);
  }

  // group is unlocked when also initialized
  const expectedUnlocked = new Group(GROUP_USER_MEM_UNLOCKED);
  const model = new Group(GROUP_USER_NOT_INIT);
  const newModel = model.updateSecurityLevelMemory('y');
  expect(newModel).toEqual(expectedUnlocked);
});

// it('Groups can be updated to armored', () => {
//   const expected = new Group(GROUP_USER_ENC);
//   for (g of GROUPS_USER) {
//     const model = new Group(g);
//     const newModel = model.updateSecurityLevelEncrypted();
//     expect(newModel).toEqual(expected);
//   }
// });

// it('Groups can be updated to device security', () => {
//   const expected = new Group(GROUP_USER_MEM);  // always locked
//   for (g of GROUPS_USER) {
//     const model = new Group(g);
//     const newModel = model.updateSecurityLevelDevice();
//     expect(newModel).toEqual(expected);
//   }
// });


it('Service can be instantiated', () => {
  const model = new Service();
  expect(model).toBeTruthy();
});
