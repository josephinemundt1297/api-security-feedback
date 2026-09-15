const { addFeedback, getFeedbackEntries } = require('../data/feedbackStore');
const { success, failure } = require('../utils/responses');
const { validateFeedback } = require('../validators/feedbackValidator');

// Hier geben wir nur raus, was andere wirklich sehen sollen.
function publicFeedback(entry) {
  return {
    id: entry.id,
    name: entry.name,
    email: entry.email,
    message: entry.message,
    createdAt: entry.createdAt
  };
}

function getAllFeedback(req, res) {
  // Beim Lesen zeigen wir nur die sicheren Feedback-Felder.
  return success(res, 200, getFeedbackEntries().map(publicFeedback));
}

function createFeedback(req, res) {
  const details = validateFeedback(req.body);

  // Wenn etwas falsch ist, speichern wir nichts.
  if (details.length > 0) {
    return failure(res, 400, 'Ungültige Eingabedaten', details);
  }

  // Jetzt bauen wir den sauberen Feedback-Eintrag.
  const entry = addFeedback({
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    message: req.body.message.trim(),
    // Intern okay, aber das schicken wir nicht an den Client zurück.
    internalSource: req.ip
  });

  return success(res, 201, publicFeedback(entry));
}

module.exports = {
  getAllFeedback,
  createFeedback,
  publicFeedback
};
