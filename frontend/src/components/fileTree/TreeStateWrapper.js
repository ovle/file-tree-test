// @flow

import React, {Component} from "react";
import {FileTreeNodeDto} from "../../model/file";
import messages from "../../utils/messages";

/**
 * State-aware tree wrapper
 */
const withState = ({stateStorage, updateOnExpand}, WrappedComponent) => {

    class TreeStateWrapper extends Component {

        constructor(props) {
            super(props);

            let defaultState = {root: null};
            this.state = stateStorage ? (stateStorage.get() || defaultState) : defaultState;

            //this part of state shouldn't be subject to store
            this.state.error = null;
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
                    this.processError(error, null);
                }
            );
        };

        isLoading = (node: FileTreeNodeDto) => {
            let {loadingFiles} = this.state;
            return loadingFiles.has(node.file.id);
        };

        onNodeClick = (node: FileTreeNodeDto, onSuccess) => {
            let parentId = node.file.id;
            this.setState((prevState) => {
                let loadingFiles = new Set(prevState.loadingFiles);
                loadingFiles.add(parentId);
                return {loadingFiles: loadingFiles};
            });

            return this.props.fetchChildren(
                parentId,
                (children) => {
                    //todo hack. need move this to setState
                    node.children = children;
                    if (!updateOnExpand) node.isLoaded = true;

                    this.setState((prevState) => ({
                        root: prevState.root,
                        error: null
                    }), this.onSuccessLoading(onSuccess))
                },
                (error) => {
                    this.processError(error, node);
                },
                () => {
                    this.setState((prevState) => {
                        let loadingFiles = new Set(prevState.loadingFiles);
                        loadingFiles.delete(parentId);
                        return {loadingFiles: loadingFiles};
                    });
                }
            );
        };

        //todo extract to separate component?
        processError(error, node: FileTreeNodeDto) {
            const errorMessage = error => {
                //todo not sure how to make this check better
                if (error === "Network Error") {
                    error = messages.error.serverUnavailable;
                }
                if ((typeof error == "string") || !node) return error;

                let errorText = messages.error[error.type] || error;
                let fileInfo = `${messages.file} ${node.file.name}`;
                return `${errorText}; ${fileInfo}`;
            };

            this.setState(() => ({error: errorMessage(error)}))
        }

        onSuccessLoading = onSuccessLoading => {
            stateStorage && stateStorage.set(this.state);

            return onSuccessLoading;
        };

        render = () => <div>
            <WrappedComponent root={this.state.root} onNodeClick={this.onNodeClick} isLoading={this.isLoading}
                              error={this.state.error}/>
        </div>;
    }

    return TreeStateWrapper;
};

export default withState;