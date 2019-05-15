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

//todo separate 'opened' state part from 'files info' state part
// to restore tree structure without storage?
let stateConfig = {
    stateStorage: localStorage,
    updateOnExpand: false
};

//todo fix performance on large number of files
const WrappedTreeWithStorage = withApi(appConfig.defaultUrl, withState(stateConfig, FileTree));
const WrappedTree = withApi(appConfig.defaultUrl, withState({}, FileTree));

const App = () => (
    <div className="App">
        <div style={{"height" : "400px"}}>
            <WrappedTreeWithStorage />
        </div>
        <div style={{"height" : "400px"}}>
            <WrappedTree style={{"height" : "400px"}}/>
        </div>
    </div>
);

export default App;
