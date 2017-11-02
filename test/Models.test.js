import { Group, Service } from '../src/Models';

const GROUP_PREDEF = { group: 'Important', icon: 'star', defaultSecurityLevel: 0 };

const GROUP_USER_NOT_INIT = { group: 'MyGroup' };
const GROUP_USER_MEM = { group: 'MyGroup', storePassphrase: false };
const GROUP_USER_MEM_UNLOCKED = { group: 'MyGroup', storePassphrase: false, inputPassphrase: 'x' };
const GROUP_USER_ENC = { group: 'MyGroup', passphrase: '_enc_x' };
const GROUP_USER_ENC_UNLOCKED = { group: 'MyGroup', passphrase: '_enc_x', inputPassphrase: 'x' };
const GROUP_USER_DEV = { group: 'MyGroup', passphrase: '_enc_x', deviceSecurity: true };
const GROUP_USER_DEV_UNLOCKED = { group: 'MyGroup', passphrase: '_enc_x', deviceSecurity: true, inputPassphrase: 'x' };

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


// mock Crypto to avoid randomness issues
jest.mock('../src/Crypto', () => ({
  encryptPassphrase(value) {
    return `_enc_${value}`;
  },
}));


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
  const ALL = [
    GROUP_PREDEF,
    GROUP_USER_NOT_INIT,
    GROUP_USER_MEM,
    GROUP_USER_MEM_UNLOCKED,
    GROUP_USER_ENC,
    GROUP_USER_ENC_UNLOCKED,
    GROUP_USER_DEV,
    GROUP_USER_DEV_UNLOCKED,
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

it('Group nav title', () => {
  const model1 = new Group();
  const title1 = model1.getNavTitle();

  const model2 = new Group(GROUP_USER_MEM);
  const title2 = model2.getNavTitle();

  const model3 = new Group(GROUP_USER_MEM_UNLOCKED);
  const title3 = model3.getNavTitle();

  expect(title1).not.toEqual(title2);
  expect(title2).not.toEqual(title3);
  expect(title3).not.toEqual(title1);
});

it('Group prompt title', () => {
  const model1 = new Group();
  const title1 = model1.getPromptTitle();

  const model2 = new Group(GROUP_PREDEF);
  const title2 = model2.getPromptTitle();

  expect(title1).not.toEqual(title2);
});

it('Group security level', () => {
  let model;

  model = new Group(GROUP_USER_MEM);
  expect(model.getSecurityLevel()).toBe(Group.SEC_LEVEL_MEMORY);
  model = new Group(GROUP_USER_MEM_UNLOCKED);
  expect(model.getSecurityLevel()).toBe(Group.SEC_LEVEL_MEMORY);

  model = new Group(GROUP_USER_ENC);
  expect(model.getSecurityLevel()).toBe(Group.SEC_LEVEL_ENCRYPTED);
  model = new Group(GROUP_USER_ENC_UNLOCKED);
  expect(model.getSecurityLevel()).toBe(Group.SEC_LEVEL_ENCRYPTED);

  model = new Group(GROUP_USER_DEV);
  expect(model.getSecurityLevel()).toBe(Group.SEC_LEVEL_DEVICE);
  model = new Group(GROUP_USER_DEV_UNLOCKED);
  expect(model.getSecurityLevel()).toBe(Group.SEC_LEVEL_DEVICE);
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

  // explicitly pass a passphrase:
  // - group not init should update and be unlocked
  // - all other cases should update and be locked
  for (const g of GROUPS_USER_INIT) {
    const model = new Group(g);
    const newModel = model.updateSecurityLevelMemory('x');
    expect(newModel).toEqual(expected);
  }

  // group not init should update and be unlocked
  const expectedUnlocked = new Group(GROUP_USER_MEM_UNLOCKED);
  const model = new Group(GROUP_USER_NOT_INIT);
  const newModel = model.updateSecurityLevelMemory('x');
  expect(newModel).toEqual(expectedUnlocked);
});

it('Groups can be updated to armored', () => {
  const expected = new Group(GROUP_USER_ENC);
  const expectedUnlocked = new Group(GROUP_USER_ENC_UNLOCKED);
  const GROUPS_USER_NO_PASS = [
    // GROUP_USER_NOT_INIT,
    // GROUP_USER_MEM,
    // GROUP_USER_MEM_UNLOCKED,
    GROUP_USER_ENC,
    GROUP_USER_ENC_UNLOCKED,
    GROUP_USER_DEV,
    GROUP_USER_DEV_UNLOCKED,
  ];
  for (const g of GROUPS_USER_NO_PASS) {
    const model = new Group(g);
    const newModel = model.updateSecurityLevelEncrypted();
    expect(newModel).toEqual(expected);
  }

  const GROUPS_USER_PASS = [
    GROUP_USER_NOT_INIT,
    GROUP_USER_MEM,
    GROUP_USER_MEM_UNLOCKED,
    GROUP_USER_ENC,
    GROUP_USER_ENC_UNLOCKED,
    GROUP_USER_DEV,
    GROUP_USER_DEV_UNLOCKED,
  ];
  for (const g of GROUPS_USER_PASS) {
    const model = new Group(g);
    const newModel = model.updateSecurityLevelEncrypted('x');
    expect(newModel).toEqual(expectedUnlocked);
  }
});

it('Groups can be updated to device security', () => {
  const expected = new Group(GROUP_USER_DEV);
  const expectedUnlocked = new Group(GROUP_USER_DEV_UNLOCKED);
  const GROUPS_USER_NO_PASS = [
    // GROUP_USER_NOT_INIT,
    // GROUP_USER_MEM,
    // GROUP_USER_MEM_UNLOCKED,
    GROUP_USER_ENC,
    GROUP_USER_ENC_UNLOCKED,
    GROUP_USER_DEV,
    GROUP_USER_DEV_UNLOCKED,
  ];
  for (const g of GROUPS_USER_NO_PASS) {
    const model = new Group(g);
    const newModel = model.updateSecurityLevelDevice();
    expect(newModel).toEqual(expected);
  }

  const GROUPS_USER_PASS = [
    GROUP_USER_NOT_INIT,
    GROUP_USER_MEM,
    GROUP_USER_MEM_UNLOCKED,
    GROUP_USER_ENC,
    GROUP_USER_ENC_UNLOCKED,
    GROUP_USER_DEV,
    GROUP_USER_DEV_UNLOCKED,
  ];
  for (const g of GROUPS_USER_PASS) {
    const model = new Group(g);
    const newModel = model.updateSecurityLevelDevice('x');
    expect(newModel).toEqual(expectedUnlocked);
  }
});


it('Service can be instantiated', () => {
  const model = new Service();
  expect(model).toBeTruthy();
});
