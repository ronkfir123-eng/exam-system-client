export default class User {
  constructor(name, tz, password, role, id = null) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.tz = tz;
    this.password = password;
    this.role = role;
  }
}