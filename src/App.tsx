import {
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Badge,
  Drawer,
} from "@material-ui/core";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import BookCard from "./components/BookCard/BookCard";
import { Book } from "./models/models";
import Grid from "@material-ui/core/Grid";
import React from "react";
import SortByRating from "./components/SortByRating/SortByRating";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebaseconfig";
import Cart from "./components/Cart/Cart";

const firebaseApp = firebase.default.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.default.auth.GoogleAuthProvider(),
};

function App(props: any) {
  const { user, signOut, signInWithGoogle } = props;
  let [books, setBooks] = useState<Book[]>([]);
  let [isLoading, setLoading] = useState(true);
  let [isError, setError] = useState(false);
  let [ratingSortFilter, setRatingSortFilter] = useState<string>("");
  let [currentPage, setCurrentPage] = useState<number>(0);
  let [hasPages, setHasPages] = useState(false);
  let [searchText, setSearchText] = useState<string>("");
  let [cartItems, setCartItems] = useState<Book[]>([] as Book[]);
  const [cartOpen, setCartOpen] = useState(false);

  const getTotalItems = (items: Book[]) =>
    items.reduce((ack: number, item) => ack + item.quantity, 0);

  const handleAddToCart = (clickedBook: Book) => {
    console.log(clickedBook)
    setCartItems((prev) => {
      const isItemInCart = prev.find(
        (item) => item.bookID === clickedBook.bookID
      );
      if (isItemInCart) {
        return prev.map((item) =>
          item.bookID === clickedBook.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...clickedBook, quantity: 1 }];
    });
  };

  console.log(cartItems);

  const handleRemoveFromCart = (id: number) => { 

    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.bookID === id) {
          if (item.quantity === 1) return ack;
          return [...ack, { ...item, quantity: item.quantity - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as Book[])
    );

  };

  const handleFetchMore = async () => {
    try {
      let nextPage = currentPage + 1;
      let apiOutput = await fetch(buildURLFromState() + "&page=" + nextPage);
      let data = await apiOutput.json();
      let currentBooks: Book[] = data.content;
      setHasPages(!data.last);
      setCurrentPage(data.number);
      setBooks([...books, ...currentBooks]);
    } catch {
      setLoading(false);
      setError(true);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    let apiOutput = await fetch(buildURLFromState());
    console.log(apiOutput);
    let data = await apiOutput.json();
    console.log(data);
    let currentBooks: Book[] = data.content;
    setLoading(false);
    setHasPages(!data.last);
    setCurrentPage(Number(data.number));
    setBooks(currentBooks);
  };

  const buildURLFromState = () => {
    let apiUrl = getURL();
    if (searchText !== "") {
      apiUrl = apiUrl + "/search?title=" + searchText;
    } else {
      apiUrl = apiUrl + "?";
    }
    if (ratingSortFilter !== "") {
      apiUrl = apiUrl + "&sort=" + ratingSortFilter;
    }
    return apiUrl;
  };
  useEffect(() => {
    const fetchSortedData = async () => {
      let apiOutput = await fetch(buildURLFromState());
      console.log(apiOutput);
      let data = await apiOutput.json();
      console.log(data);
      let currentBooks: Book[] = data.content;
      currentBooks = currentBooks.map((book) => ({ ...book, quantity: 0 }));
      setLoading(false);
      setHasPages(!data.last);
      setCurrentPage(Number(data.number));
      setBooks(currentBooks);
    };
    setLoading(true);
    fetchSortedData();
  }, [ratingSortFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiOutput = await fetch(getURL());
        console.log(apiOutput);
        let data = await apiOutput.json();
        console.log(data);
        let currentBooks: Book[] = data.content;
        setLoading(false);
        setHasPages(!data.last);
        setCurrentPage(Number(data.number));
        setBooks(currentBooks);
      } catch {
        setLoading(false);
        setError(true);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <LinearProgress />;
  if (isError) return <div>Something went wrong ...</div>;
  if (books.length === 0) return <div> No books Found</div>;
  return (
    <div className="App">
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <Grid container direction={"row"} justify="center" spacing={10}>
        <Grid item container>
          <Grid item xs={3} sm={3}>
            <TextField
              label="Search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value as string)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <SortByRating
              ratingSortFilter={ratingSortFilter}
              handleSortFilterChange={(event) =>
                setRatingSortFilter(event.target.value as string)
              }
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            {user ? (
              <>
               <Button onClick ={()=> setCartOpen(true)}>
                <Badge badgeContent={getTotalItems(cartItems)} color="error" >
                  <AddShoppingCartIcon />
                </Badge>
                </Button>
               
                <Button variant="contained" color="primary" onClick={signOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button onClick={signInWithGoogle}>Sign in with Google</Button>
            )}
          </Grid>
        </Grid>
        <Grid>
          <Grid item container spacing={1}>
            {books?.map((item) => (
              <Grid item key={item.bookID} xs={12} sm={4}>
                <BookCard showQuantity={false} book={item}  handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <Button
            disabled={!hasPages}
            onClick={handleFetchMore}
            size="large"
            variant="contained"
            color="primary"
          >
            Load More
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);

function getURL() {
  let url = "http://localhost:8080";
  if (process.env.REACT_APP_BOOKSTORE_SERVICE) {
    url = process.env.REACT_APP_BOOKSTORE_SERVICE;
  }
  return url;
}
