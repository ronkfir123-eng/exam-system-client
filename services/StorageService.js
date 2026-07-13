export default class StorageService {
    // helper methods
    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // users
    static getUsers() { return this.get('users') || []; }
    static saveUsers(users) { this.set('users', users); }

    // exams
    static getExams() { return this.get('exams') || []; }
    static saveExams(exams) { this.set('exams', exams); }

    // results
    static getResults() { return this.get('results') || []; }
    static saveResults(results) { this.set('results', results); }

    // current user Session
    static getCurrentUser() { return this.get('currentUser'); }
    static setCurrentUser(user) { this.set('currentUser', user); }
    static clearCurrentUser() { localStorage.removeItem('currentUser'); }
}