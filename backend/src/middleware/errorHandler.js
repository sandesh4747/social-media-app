export function errorHandler(err, req, res, next) {
  // Joi validation error (via express-joi-validation)
  if (err?.error?.isJoi) {
    const message = err.error.details[0].message;
    return res.status(400).json({ message });
  }

  // Other errors
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
}
