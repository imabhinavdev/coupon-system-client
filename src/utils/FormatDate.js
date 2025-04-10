export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, add 1
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
