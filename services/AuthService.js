import User from '../models/User.js';
import StorageService from './StorageService.js';

export class AuthService {
  static register(name, tz, password, role) {
    const users = StorageService.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.tz === tz)) {
      throw new Error("משתמש עם תעודת זהות זו כבר קיים במערכת"); // "User with this TZ already exists"
    }

    const newUser = new User(name, tz, password, role);
    users.push(newUser);
    StorageService.saveUsers(users);
    
    return newUser;
  }

  static login(tz, password) {
    const users = StorageService.getUsers();
    
    // Find matching user
    const user = users.find(u => u.tz === tz && u.password === password);
    
    if (!user) {
      throw new Error("תעודת זהות או סיסמה שגויים"); // "Invalid TZ or password"
    }

    // Save to session so the app remembers who is logged in
    StorageService.setCurrentUser(user);
    return user;
  }

  static logout() {
    StorageService.clearCurrentUser();
    window.location.href = "index.html";
  }

  static getLoggedInUser() {
    return StorageService.getCurrentUser();
  }
}