import React, { Component } from "react";
import { Link } from "react-router-dom";
import BookShelf from "../components/book-shelf";
import utils from "../utils";
import { getAll } from "./../BooksAPI";
import PropTypes from "prop-types";

class MyReads extends Component {
  static propTypes = {
    updateBooksOnShelf: PropTypes.func.isRequired,
  };

  state = {
    loaded: true,
    books: {
      currentlyReading: [],
      wantToRead: [],
      read: [],
    },
  };

  flattenBooks = (books) => [].concat(...Object.values(books));

  componentDidMount() {
    this.setState({ loaded: false });
    let books = [];

    getAll()
      .then((data) => {
        books = utils.orderBooks.byShelf(data);
        this.setState({
          loaded: true,
          books: books,
        });
        return data;
      })
      .then((books) => this.props.updateBooksOnShelf(books));
  }

  shelfChange = (book, newShelf) => {
    if (!book || !newShelf || book.shelf === newShelf) return;
    let newBooks = JSON.parse(JSON.stringify(this.state.books));
    const oldShelf = book.shelf;
    const bookPosition = newBooks[oldShelf].findIndex(
      (newBook) => newBook.id === book.id
    );
    if (bookPosition < 0) return;

    newBooks[oldShelf].splice(bookPosition, 1);
    newBooks[newShelf] = newBooks[newShelf] || [];
    book.shelf = newShelf;
    newBooks[newShelf].push(book);

    this.setState({ books: newBooks });
    this.props.updateBooksOnShelf(this.flattenBooks(newBooks));
  };

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <BookShelf
              title="Currently Reading"
              books={this.state.books.currentlyReading}
              loaded={this.state.loaded}
              shelfChange={this.shelfChange}
            />
            <BookShelf
              title="Want to Read"
              books={this.state.books.wantToRead}
              loaded={this.state.loaded}
              shelfChange={this.shelfChange}
            />
            <BookShelf
              title="Read"
              books={this.state.books.read}
              loaded={this.state.loaded}
              shelfChange={this.shelfChange}
            />
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    );
  }
}
export default MyReads;
