import ENV from "../config/env.js";

const clog = (message, callback) => {
  if (ENV.ENV === "DEV") {
    console.log(message);
  }
  if (typeof callback === "function") callback;
};

const cerror = (errorMessage, callback) => {
  console.error(errorMessage);
  if (typeof callback === "function") callback;
};

export { clog, cerror };
