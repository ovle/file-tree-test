// @flow

import React, {Component} from "react";
import {FileTreeNodeDto} from "../../model/file";

/**
 * State-aware tree wrapper
 */
const withState = ({stateStorage}, WrappedComponent) => {

    class TreeStateWrapper extends Component {

        constructor(props) {
            super(props);

            let defaultState = {root: null, error: null};
            this.state = stateStorage ? (stateStorage.get() || defaultState) : defaultState;

            //this part of state shouldn't be subject to store
            this.state.loadingFiles = new Set();
        }

        componentDidMount = () => {
            if (this.state.root) return;

            let {fetchRoot} = this.props;
            fetchRoot(
                (root) => {
                    this.setState(() => ({root: root}))
                },
                (error) => {
                    this.setState(() => ({error: error}))
                }
            );
        };

        isLoading = (node: FileTreeNodeDto) => {
            let {loadingFiles} = this.state;
            return loadingFiles.has(node.file.id);
        };

        onNodeClick = (node: FileTreeNodeDto, onSuccess, onError) => {
            let parentId = node.file.id;
            let {fetchChildren} = this.props;
            let startLoading = fetchChildren(
                parentId,
                (children) => {
                    //todo hack. need move this to setState
                    node.children = children;
                    this.setState((prevState) => (prevState), this.onSuccessLoading(onSuccess))
                },
                (error) => {
                    this.setState(() => ({error: error}), onError)
                },
                () => {
                    this.setState((prevState) => {
                        let loadingFiles = new Set(prevState.loadingFiles);
                        loadingFiles.delete(parentId);
                        return {loadingFiles: loadingFiles};
                    });
                }
            );

            this.setState((prevState) => {
                let loadingFiles = new Set(prevState.loadingFiles);
                loadingFiles.add(parentId);
                return {loadingFiles: loadingFiles};
            }, startLoading);

        };

        onSuccessLoading = onSuccessLoading => {
            stateStorage && stateStorage.set(this.state);

            return onSuccessLoading;
        };

        render = () => <div>
            <WrappedComponent root={this.state.root} onNodeClick={this.onNodeClick} isLoading={this.isLoading} error={this.state.error}/>
        </div>;
    }

    return TreeStateWrapper;
};

export default withState;