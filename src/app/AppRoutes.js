import * as React from "react";
import { Route, Switch } from "react-router-dom";

//Routes
import Albums from '../routes/allAlbums';
import AlbumDetails from '../routes/albumDetails';
// import UsersContainer from '../routes/UsersContainer';

export function AppRoutes() {
  return (
    <Switch>
        <Route exact path="/albumDetails/:id" component={AlbumDetails} />
        <Route exact path="/albums" component={Albums} />
        <Route exact path="/" component={Albums} />
    </Switch>
  )
}