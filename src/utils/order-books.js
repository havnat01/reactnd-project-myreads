const byShelf = (booksList) => {
  let newBookList = {};

  booksList.forEach((book) => {
    newBookList[book.shelf] = newBookList[book.shelf] || [];
    newBookList[book.shelf].push(book);
  });

  return newBookList;
};

export default { byShelf };
