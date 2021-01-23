import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  createStyles,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React from "react";
import { Book } from "../../models/models";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 500,
      height:'100%' 
    },
    media: {
      height: 100,
      paddingTop: '56.25%', // 16:9
    }
  }));


const BookCard: React.FC<BookProps> = ({ book }) => {
  const classes = useStyles();
  return (
    <Card className= {classes.root}>
      <CardHeader
        title={book.title}
        subheader={book.authors}
      />
      <CardMedia className={classes.media} image={book.imageURL} title={book.title} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
         {"Price : Rs."+ book.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

interface BookProps {
  book: Book;
}

export default BookCard;
