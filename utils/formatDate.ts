function formatDateTime(date: Date) {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0"); // число с ведущим нулём
  const month = String(d.getMonth() + 1).padStart(2, "0"); // месяц (0-11, поэтому +1)
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0"); // часы 0-23
  const minutes = String(d.getMinutes()).padStart(2, "0"); // минуты 0-59

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export default formatDateTime;
