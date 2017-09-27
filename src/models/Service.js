function Service(service) {
  this.id = service.service+service.username || '';
  this.key = this.id;
  this.service = service.service || '';
  this.username = service.username || '';
  this.group = service.group || 'default';
  this.counter = service.counter || 0;
  this.icon = service.icon || '';
  this.display = service.display || this.service;
  this.description = service.description || '';
}

// Service.prototype.display = function() {
// };

export default Service;
