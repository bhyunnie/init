const getTimeYYYYMMDD = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = (today.getMonth() + 1).toString();
  let day = today.getDate().toString();

  if (month.length === 1) {
    month = `0${month}`;
  }
  if (day.length === 1) {
    day = `0${day}`;
  }

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const getTimeYYYYMMDDHHMMSS = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  return formattedDate;
};

const secondToHHMM = (second) => {
  const hour = Math.floor(second / 3600);
  const minute = Math.floor(second / 60) % 60;

  return `${hour}-${minute}`;
};

export { getTimeYYYYMMDD, getTimeYYYYMMDDHHMMSS, secondToHHMM };
