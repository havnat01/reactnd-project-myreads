import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import MyReads from "./pages/my-reads";
import Search from "./pages/search";
import "./App.css";

class BooksApp extends React.Component {
  state = {
    booksOnShelf: [],
  };

  mapBookByID = (books) =>
    books.map((book) => ({ id: book.id, shelf: book.shelf }));

  updateBooksOnShelf = (books) => {
    this.setState({ booksOnShelf: this.mapBookByID(books) });
  };

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <MyReads updateBooksOnShelf={this.updateBooksOnShelf} />
              )}
            />
            <Route
              exact
              path="/search"
              render={(route) => (
                <Search
                  route={route}
                  updateBooksOnShelf={this.updateBooksOnShelf}
                  booksOnShelf={this.state.booksOnShelf}
                />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default BooksApp;
