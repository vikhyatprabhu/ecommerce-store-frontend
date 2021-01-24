import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  createStyles,
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
      maxWidth: 500,
      height: "100%",
    },
    media: {
      height: 100,
      paddingTop: "56.25%", // 16:9
    },
  })
);

const BookCard: React.FC<BookProps> = ({ book }) => {
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
        <span>
          {Math.round(book?.average_rating * 10) / 10}
          <StarsIcon /> ( {book.ratings_count} ){" "}
        </span>
        <Typography variant="body2" color="textSecondary" component="p">
          {"Price : Rs." + book.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

interface BookProps {
  book: Book;
}

export default BookCard;
