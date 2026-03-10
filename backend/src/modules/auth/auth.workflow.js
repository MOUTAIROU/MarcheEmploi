const EventEmitter = require("events");
const workflow = new EventEmitter();

// Listener pour logs
workflow.on("USER_LOGGED_IN", ({ user }) => {
  console.log(`[LOG] User logged in: ${user.email}`);
});

// Listener pour notifications (exemple)
workflow.on("USER_LOGGED_IN", ({ user }) => {
  // envoyer notification à l'utilisateur ou admin
  // NotificationService.sendLoginAlert(user);
});

// Listener pour statistiques
workflow.on("USER_LOGGED_IN", ({ user }) => {
  // StatsService.incrementLoginCount(user.id);
});

// Listener pour inscription
workflow.on("USER_REGISTERED", ({ user }) => {
    console.log(`[LOG] User logged in: ${user.email}`);
});


module.exports = workflow;
