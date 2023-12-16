import axios from "axios";

const isWakatimeApiKey = (value) => {
  return value.trim() === "" ? true : value.includes("waka_");
};

const isGithubNickname = async (value) => {
  if (value.trim() === "") return true;
  try {
    await axios.get(`https://api.github.com/users/${value}`);
    return true;
  } catch (error) {
    const status = error.response.status;
    if (status === 404) {
      return false;
    }
  }
};

const isNickname = (value) => {
  const regex = /^[a-zA-Z0-9]{2,10}$/;
  return regex.test(value);
};

export default {
  isWakatimeApiKey,
  isGithubNickname,
  isNickname,
};
