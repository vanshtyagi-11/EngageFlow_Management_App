const AuditLog = require("../models/auditLogModel");

const audit = (actor, entityType, entityId, action, metadata = {}) =>
  AuditLog.create({ actor, entityType, entityId, action, metadata });
module.exports = audit;
