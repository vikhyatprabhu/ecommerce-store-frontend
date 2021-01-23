import { LinearProgress } from "@material-ui/core";
import { useEffect, useState } from "react";

import BookCard from "./components/BookCard/BookCard";
import { Book } from "./models/models";
import Grid from '@material-ui/core/Grid';

function App() {
  let [books , setBooks]  = useState<Book[]>([] );
  let [isLoading , setLoading] = useState(true);
  let [isError , setError] = useState(false);
  useEffect(() => {
    const fetchData = async() => {

      let apiOutput = await  fetch("https://s3-ap-southeast-1.amazonaws.com/he-public-data/books8f8fe52.json");
      let currentBooks : Book[] = await apiOutput.json()
      let booksWithUrls : Book[] = currentBooks.map(book => ({ ...book , imageURL : "https://s3-ap-southeast-1.amazonaws.com/he-public-data/indexa51d5d7.jpeg"}) )
      setLoading(false);
      setBooks(booksWithUrls);
    }
    fetchData();
  }, []);
  
  if (isLoading) return <LinearProgress />;
  if (isError || books.length === 0) return <div>Something went wrong ...</div>;
  return (
    <div className="App">
       <Grid container spacing={3}>
        {books?.map(item => (
          <Grid  item key={item.bookID} xs={12} sm={4}>
            <BookCard book={item}  />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default App;
