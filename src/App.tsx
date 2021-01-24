import {
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import BookCard from "./components/BookCard/BookCard";
import { Book } from "./models/models";
import Grid from "@material-ui/core/Grid";
import React from "react";
import SortByRating from "./components/SortByRating/SortByRating";

function App() {
  let [books, setBooks] = useState<Book[]>([]);
  let [isLoading, setLoading] = useState(true);
  let [isError, setError] = useState(false);
  let [ratingSortFilter, setRatingSortFilter] = useState<string>("");
  let [currentPage, setCurrentPage] = useState<number>(0);
  let [hasPages, setHasPages] = useState(false);
  let [searchText, setSearchText] = useState<string>("");

  const handleFetchMore = async () => {
    try {
      let nextPage = currentPage + 1;
      let apiOutput = await fetch(
       buildURLFromState() +
          "&page=" +
          nextPage 
      );
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

  const handleSearch = async () =>{
    setLoading(true)
    let apiOutput = await fetch(buildURLFromState());
    console.log(apiOutput);
    let data = await apiOutput.json();
    console.log(data);
    let currentBooks: Book[] = data.content;
    setLoading(false);
    setHasPages(!data.last);
    setCurrentPage(Number(data.number));
    setBooks(currentBooks);
  }

  const buildURLFromState = () =>{
    let apiUrl = getURL()
    if(searchText !== ""){
      apiUrl= apiUrl+"/search?title="+searchText
    } else {
      apiUrl= apiUrl+"?"
    }
    if(ratingSortFilter !==""){
      apiUrl = apiUrl + "&sort="+ratingSortFilter
    }
    return apiUrl;
  }
  useEffect(() => {
    const fetchSortedData = async () => {
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
      <Grid container direction={"row"} justify="center" spacing={10}>
        <Grid item container>
          <Grid item xs={4} sm={4}>
            <TextField
              label="Search"
              value={searchText}
              onChange = {(event) => setSearchText(event.target.value as string)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={4} sm={4}>
            <SortByRating
              ratingSortFilter={ratingSortFilter}
              handleSortFilterChange={(event) =>
                setRatingSortFilter(event.target.value as string)
              }
            />
          </Grid>
        </Grid>
        <Grid>
          <Grid item container spacing={1}>
            {books?.map((item) => (
              <Grid item key={item.bookID} xs={12} sm={4}>
                <BookCard book={item} />
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

export default App;
function getURL() {
  let url = "http://localhost:8080";
  if (process.env.REACT_APP_BOOKSTORE_SERVICE) {
    url = process.env.REACT_APP_BOOKSTORE_SERVICE;
  }
  return url;
}

