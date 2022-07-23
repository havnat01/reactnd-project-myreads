import React from "react";
import noCoverImage from "../images/no_cover.png";
import { update } from "./../BooksAPI";

const Book = ({ book, shelfChange }) => {
  const bookOnChange = (event) => {
    const newShelf = event.target.value;

    update(book, newShelf).then((response) => {
      if (!response || typeof response !== "object") return;

      shelfChange &&
        typeof shelfChange === "function" &&
        shelfChange(book, newShelf);
    });
  };

  if (!book.imageLinks || !book.imageLinks.smallThumbnail)
    book.imageLinks = {
      smallThumbnail: noCoverImage,
    };
  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 193,
            backgroundImage: `url("${book.imageLinks.smallThumbnail}")`,
          }}
        />
        <div className="book-shelf-changer">
          <select defaultValue={book.shelf || "none"} onChange={bookOnChange}>
            <option value="move" disabled>
              Move to...
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">
        {book.authors && book.authors.join(", ")}
      </div>
    </div>
  );
};

export default Book;
