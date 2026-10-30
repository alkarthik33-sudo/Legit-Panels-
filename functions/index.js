const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

exports.testBackend = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Please log in first."
    );
  }

  return {
    success: true,
    message: "LEGIT PANELS backend is connected!",
    uid: request.auth.uid
  };
});
