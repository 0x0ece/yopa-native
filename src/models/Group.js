function Group(group) {
  this.id = group.group || '';
  this.key = this.id;
  this.group = group.group || '';
  this.passphrase = group.passphrase || '';
  this.unlocked = group.unlocked || false;
  this.inputPassphrase = group.inputPassphrase || '';
  this.icon = group.icon || 'folder';
}

// Group.prototype.display = function() {
// };

export default Group;
