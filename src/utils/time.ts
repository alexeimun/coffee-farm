const initialTime = Date.now();

function getCurrentTime() {
  const time = Math.floor((Date.now() - initialTime) / 10);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600) % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
export { getCurrentTime };
