export const addOne = <T>(items: T[] = [], newItem: T) => {
  return [...items, newItem];
};

export const removeOne = <T extends { id: number }>(
  items: T[] = [],
  itemId: number
) => {
  return items.filter((item) => item.id !== itemId);
};

export const updateOne = <T extends { id: number }>(
  items: T[] = [],
  updatedItem: T
) => {
  return items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
};
