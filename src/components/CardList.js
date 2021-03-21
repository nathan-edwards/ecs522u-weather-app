import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import {
  GridList,
  GridListTile,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
}));

export default function CardList(props) {
  const classes = useStyles();
  const data = props.forecast;
  return (
    <div className={classes.root}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <GridList className={classes.gridList} cols={2.5}>
        {data.map((elem) => (
          <GridListTile key={data.indexOf(elem)}>
            <Typography>{elem.time}</Typography>
            <Card>
              <CardContent>
                <Typography>{elem.weather}</Typography>
                <Icon style={{ fontSize: 49 }}> filter_drama </Icon>
                <Typography>{elem.temp}</Typography>
                <Typography>{elem.precip}</Typography>
              </CardContent>
            </Card>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
