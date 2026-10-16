/**
 * hub-namespace.js — Core Namespace and Service Directory
 * Part of Luxottica BigQuery Training Hub Architecture.
 *
 * Ensures all functional subsystems can communicate through a central `window.Hub`
 * registry while maintaining backward compatibility with legacy global calls.
 */

window.Hub = window.Hub || {
  version: "2.5.0-modular",
  modules: {},
  state: {
    role: "student", // 'student' | 'trainer'
    activeBlock: "cover",
    theme: "light",
    roomCode: "default",
    connectedStudents: []
  },
  
  // Service registration
  register(name, moduleApi) {
    this.modules[name] = moduleApi;
  },

  get(name) {
    return this.modules[name];
  }
};
