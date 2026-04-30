export const getBooleanFilter = (filter: string) => {
  return filter === undefined
    ? undefined
    : String(filter).toLowerCase() === "true";
};