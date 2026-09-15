// So sehen gute Antworten immer gleich aus.
function success(res, statusCode, data) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

// So sehen Fehler immer gleich aus.
function failure(res, statusCode, error, details = []) {
  return res.status(statusCode).json({
    success: false,
    error,
    details
  });
}

module.exports = {
  success,
  failure
};
