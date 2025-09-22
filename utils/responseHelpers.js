// utils/responseHelper.js

// return sendSuccess(res, { general_message: "User registered successfully", data: { user } }, 201);
function sendSuccess(res, { general_message = null, data = null } = {}, status = 200) {
  const body = { success: true };
  if (general_message) body.general_message = general_message;
  if (data) body.data = data;
  return res.status(status).json(body);
}

// return sendError(res, err.message, err.status || 500);
function sendError(res, message = "Something went wrong", status = 400) {
  return res.status(status).json({ success: false, message });
}

module.exports = { sendSuccess, sendError };
