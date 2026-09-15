const canManageTasks = (user) => ["ADMIN", "MANAGER"].includes(user.role);
const canReview = (user) => ["ADMIN", "MANAGER"].includes(user.role);
module.exports = { canManageTasks, canReview };
