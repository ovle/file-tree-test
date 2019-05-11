import React from 'react';
import './App.css';
import appConfig from "./appConfig";
import withApi from "./components/fileTree/TreeApiWrapper";
import withState from "./components/fileTree/TreeStateWrapper";
import FileTree from "./components/fileTree/FileTree";
import ls from "local-storage";


const STATE_STORAGE_KEY = "STATE_STORAGE_KEY";

const localStorage = {
   get: () => ls.get(STATE_STORAGE_KEY),
   set: (state) => { ls.set(STATE_STORAGE_KEY, state) },
   clear: () => { ls.clear(); }
};

let stateConfig = { stateStorage: localStorage };

const WrappedTree = withApi(appConfig.defaultUrl, withState(stateConfig, FileTree));


const App = () => (
    <div className="App">
        <WrappedTree/>
    </div>
);

export default App;
