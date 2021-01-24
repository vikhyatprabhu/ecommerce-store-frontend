import {
    createStyles,
    FormControl,
    makeStyles,
    Theme
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";
const SORT_VALUES = [
  { value: "", labelText: "None" },
  { value: "averageRating,asc", labelText: "Average Rating - Low to High" },
  { value: "averageRating,desc", labelText: "Average Rating - High to Low" },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 250,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const SortByRating: React.FC<SortByRatingProps> = ({
  ratingSortFilter,
  handleSortFilterChange,
}) => {
  const classes = useStyles();
  let menuItems = SORT_VALUES.map((item) => (
    <MenuItem key={item.value} value={item.value}>
      {item.labelText}
    </MenuItem>
  ));

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="rating-sort-label">Sort By Rating</InputLabel>
      <Select labelId="rating-sort-label" id="sortfilter-select" value={ratingSortFilter} onChange={handleSortFilterChange}>
        {menuItems}
      </Select>
    </FormControl>
  );
};

interface SortByRatingProps {
  ratingSortFilter: string;
  handleSortFilterChange: (
    event: React.ChangeEvent<{ value: unknown }>
  ) => void;
}

export default SortByRating;
