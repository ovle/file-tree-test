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
   reset: () => { ls.clear(); }
};

let stateConfig = {
    stateStorage: null,
    updateOnExpand: false   //todo no full support
};

//todo fix performance on large number of files
const WrappedTreeWithStorage = withApi(appConfig.defaultUrl, withState(stateConfig, FileTree));
const WrappedTree = withApi(appConfig.defaultUrl, withState({}, FileTree));

const App = () => (
    <div className="App">
        <div style={{"height" : "800px"}}>
            <WrappedTreeWithStorage />
        </div>
        {/*<div style={{"height" : "400px"}}>*/}
            {/*<WrappedTree/>*/}
        {/*</div>*/}
    </div>
);

export default App;
