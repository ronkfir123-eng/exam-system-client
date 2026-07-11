export default class User {
    constructor(id, name, tz, password, role) {
        this.id = id; //internal id for the user, not the teudat zehut
        this.name = name;
        this.tz = tz; // teudat zehut for login
        this.password = password;
        this.role = role; // "teacher" or "student"
    }
}