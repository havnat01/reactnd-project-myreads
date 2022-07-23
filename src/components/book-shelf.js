import React from "react";
import Book from "./book";

const BookShelf = ({ title, books, loaded, shelfChange }) => {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {!loaded && <p>Loading...</p>}
          {loaded && (!books || (books && books.length <= 0)) && (
            <p>No books to show</p>
          )}
          {loaded &&
            books &&
            books.length > 0 &&
            books.map((book) => {
              return (
                <li key={book.id}>
                  <Book book={book} shelfChange={shelfChange}/>
                </li>
              );
            })}
        </ol>
      </div>
    </div>
  );
};

export default BookShelf;
