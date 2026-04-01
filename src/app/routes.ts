import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import SongList from "./pages/SongList";
import SongEditor from "./pages/SongEditor";
import SongViewer from "./pages/SongViewer";
import SongRoute from "./pages/SongRoute";
import MyChords from "./pages/MyChords";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

import RootLayout from "./components/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "songs",
        Component: SongList,
      },
      {
        path: "my-chords",
        Component: MyChords,
      },
      {
        path: "song/:id",
        Component: SongRoute,
      },
      {
        path: "editor/:id",
        Component: SongEditor,
      },
      {
        path: "view/:id",
        Component: SongViewer,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "help",
        Component: Help,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ]
  }
]);