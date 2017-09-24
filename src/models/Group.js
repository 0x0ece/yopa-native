function Group(group) {
  this.id = group.group || '';
  this.group = group.group || '';
  this.passphrase = group.passphrase || '';
  this.unlocked = group.unlocked || false;
  this.inputPassphrase = group.inputPassphrase || '';
}

// Group.prototype.display = function() {
// };

export default Group;
