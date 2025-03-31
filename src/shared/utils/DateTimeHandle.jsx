export const formatDate = (createdAt) => {
  const date = new Date(createdAt);
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};
