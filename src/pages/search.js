import React, { Component } from "react";
import { Link } from "react-router-dom";
import Book from "../components/book";
import debounce from "lodash.debounce";
import { search, getAll } from "./../BooksAPI";
import PropTypes from "prop-types";

class Search extends Component {
  static propTypes = {
    updateBooksOnShelf: PropTypes.func.isRequired,
    booksOnShelf: PropTypes.array.isRequired,
  };

  state = {
    query: "",
    books: [],
    loaded: true,
  };

  updateQuery = (event) => {
    event.persist();
    const query = event.target.value;
    this.setState({ query, loaded: false });

    this.props.route.history.push({
      search: `query=${query}`,
    });

    if (query.length < 1) return this.setState({ loaded: true, books: [] });

    query && query.length > 0 && this.searchBooks();
  };

  searchBooks = debounce((query) => {
    query = query || this.state.query;
    if (query.length < 1) return;

    search(query || this.state.query).then((books) =>
      this.categorizeAndSetBooks(books)
    );
  }, 1000);

  categorizeAndSetBooks = (books) => {
    let newBooks = [];
    if (books && typeof books === "object" && !books.error) {
      let booksOnShelf = this.props.booksOnShelf;
      newBooks = [...books];

      if (booksOnShelf) {
        newBooks = newBooks.map((book) => {
          return (
            booksOnShelf.forEach((bookOnShelf) => {
              if (bookOnShelf.id === book.id) {
                book.shelf = bookOnShelf.shelf;
                return book;
              }
            }) || book
          );
        });
      }
    }

    this.setState({ books: newBooks, loaded: true });
  };

  componentDidMount() {
    const query = this.props.route.history.location.search.replace(
      "?query=",
      ""
    );
    if (query && query.length > 0) {
      this.setState({ query });
      this.searchBooks(query);
    }
    if (this.props.booksOnShelf.length === 0) {
      getAll().then((data) => {
        this.props.updateBooksOnShelf(data);
      });
    }
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
    
              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={this.updateQuery}
              value={this.state.query}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {!this.state.loaded && <p>Loading...</p>}
            {this.state.loaded &&
              (!this.state.books ||
                (this.state.books && this.state.books.length <= 0)) && (
                <p>No results</p>
              )}
            {this.state.loaded &&
              this.state.books &&
              this.state.books.length > 0 &&
              this.state.books.map((book) => {
                return (
                  <li key={book.id}>
                    <Book book={book} />
                  </li>
                );
              })}
          </ol>
        </div>
      </div>
    );
  }
}
export default Search;
