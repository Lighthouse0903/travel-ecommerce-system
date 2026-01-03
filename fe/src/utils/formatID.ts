export const shortCode = (id: string) => {
  return id?.slice(0, 8).toUpperCase();
};
