export const product = async (limit = 10, skip = 0) => {
  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
  );
  const data = await response.json();
  return data;
};
