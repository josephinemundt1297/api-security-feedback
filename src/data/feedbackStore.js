// Hier merken wir uns Feedback nur kurz im Arbeitsspeicher.
const feedbackEntries = [];
let nextId = 1;

function getFeedbackEntries() {
  return feedbackEntries;
}

function addFeedback(feedback) {
  const entry = {
    id: nextId,
    ...feedback,
    createdAt: new Date().toISOString()
  };

  nextId += 1;
  feedbackEntries.push(entry);
  return entry;
}

module.exports = {
  feedbackEntries,
  getFeedbackEntries,
  addFeedback
};
