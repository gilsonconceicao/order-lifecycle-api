const removeSpecialCharacters = (value: string) => {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
};

export {removeSpecialCharacters};