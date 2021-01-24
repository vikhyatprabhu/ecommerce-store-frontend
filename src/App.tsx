import { Button, LinearProgress } from "@material-ui/core";
import { useEffect, useState } from "react";

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
  let [currentPage , setCurrentPage] = useState<number>(0);
  let [hasPages , setHasPages] = useState(false);
  const handleSortFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setRatingSortFilter(event.target.value as string);
  };

  const handleFetchMore= async () =>{
    try{
    let nextPage = currentPage+1;
    let apiOutput = await fetch("https://shrouded-crag-39023.herokuapp.com/api/v1/books?page="+nextPage); 
    let data = await apiOutput.json();
    console.log(data);
    let currentBooks: Book[] = data.content;
    setHasPages(!data.last);
    setCurrentPage(data.number);
    setBooks([...books,...currentBooks]);
    } catch {
      setLoading(false);
      setError(true);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiOutput = await fetch("https://shrouded-crag-39023.herokuapp.com/api/v1/books");
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
        <Grid item>
          <SortByRating
            ratingSortFilter={ratingSortFilter}
            handleSortFilterChange={handleSortFilterChange}
          />
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
          <Button disabled={!hasPages} onClick={handleFetchMore} size="large" variant="contained" color="primary">
            Load More
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
