export const currentTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return { year, month, day, hours, minutes, seconds, milliseconds };
};

export const morganTime = () => {
  const { year, month, day, hours, seconds, minutes } = currentTime();
  return `[${year}/${month}/${day} ${hours}:${minutes}:${seconds}]`;
};

export const morganDay = () => {
  const { year, month, day } = currentTime();
  return `${year}-${month}-${day}`;
};
