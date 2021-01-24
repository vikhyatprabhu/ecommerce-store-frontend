import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import StarsIcon from "@material-ui/icons/Stars";
import React from "react";
import { Book } from "../../models/models";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: 20,
      maxWidth: 500,
      height: "100%",
    },
    media: {
      height: 80,
      paddingTop: "56.25%", // 16:9
    },
  })
);

const BookCard: React.FC<BookProps> = ({ book, showQuantity , handleAddToCart , handleRemoveFromCart }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader title={book.title} subheader={book.authors} />
      <CardMedia
        className={classes.media}
        image={book.imageUrl}
        title={book.title}
      />
      <CardContent>
        <Grid container direction="row" justify="space-around">
          <Grid item>
            <span>
              {Math.round(book?.average_rating * 10) / 10}
              <StarsIcon /> ( {book.ratings_count} ){" "}
            </span>
            <Typography variant="body2" color="textSecondary" component="p">
              {"Price : Rs." + book.price}
            </Typography>
          </Grid>
          { showQuantity?(
          <Grid item>
            <Button
              size="small"
              disableElevation
              variant="contained"
              onClick={() => handleRemoveFromCart(book.bookID)}
            >
              -
            </Button>
            <p>{book.quantity}</p>
            <Button
              size="small"
              disableElevation
              variant="contained"
              onClick={() => handleAddToCart(book)}
            >
              +
            </Button>
          </Grid>
          ) : null}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddToCart(book)}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

interface BookProps {
  book: Book;
  showQuantity : boolean;
  handleAddToCart: (clickedBook: Book) => void;
  handleRemoveFromCart: (id: number) => void;
}

export default BookCard;
