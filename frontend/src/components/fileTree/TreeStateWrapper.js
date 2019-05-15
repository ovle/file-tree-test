// @flow

import React, {Component} from "react";
import {errorMessage} from "./errorMessage";
import {NodeDto} from "../../model/file";

/**
 * State-aware tree wrapper
 */
const withState = ({stateStorage, updateOnExpand}, WrappedComponent) => {

    class TreeStateWrapper extends Component {

        constructor(props) {
            super(props);

            let defaultState = {
                root: null,         //root node
                files: {},          //file by fileId
                nodes: {},          //node by fileId
                childrenIds: {},    //fileIds by parent fileId
                error: null
            };
            this.state = stateStorage ? (stateStorage.get() || defaultState) : defaultState;

        }

        componentDidMount = () => {
            if (this.state.root) return;

            let {fetchApi} = this.props;
            fetchApi.fetchRoot(
                (root) => {
                    let id = root.id;
                    this.setState(() => ({
                        root: root,
                        files: {[id]: root},
                        nodes: {[id]: new NodeDto(id)}
                    }))
                },
                (error) => {
                    this.setState(() => ({error: errorMessage(error, null)}))
                }
            );
        };

        file = (fileId) => {
            let {files} = this.state;
            return files[fileId];
        };

        node = (fileId) => {
            let {nodes} = this.state;
            return nodes[fileId];
        };

        children = (fileId) => {
            let {childrenIds} = this.state;
            return childrenIds[fileId] || [];
        };

        onSuccessLoading = onSuccessLoading => {
            stateStorage && stateStorage.set(this.state);
            return onSuccessLoading;
        };

        onNodeUnmount = (node: NodeDto) => {
            let {fetchApi} = this.props;
            let isCancelled = fetchApi.cancelFetch(node.fileId);
            //todo fix
            if (isCancelled) {
                node.isOpened = false;
                node.loadingStatus = "NotLoaded";
            }
        };

        onNodeClick = (node: NodeDto) => {
            let fileId = node.fileId;
            let file = this.file(node.fileId);
            if (!file.mayHaveChildren) {
                return;
            }

            this.setState((prevState) => {
                let prevNode = this.node(fileId);
                let wasOpened = prevNode.isOpened;
                let loadingStatus = prevNode.loadingStatus === "NotLoaded" ? "Loading" : prevNode.loadingStatus;

                return {
                    nodes: {
                        ...prevState.nodes,
                        [fileId]: {...prevNode, loadingStatus: loadingStatus, isOpened: !wasOpened}
                    }
                };
            }, () => this.loadData(this.node(fileId)));
        };

        loadData = (node: NodeDto) => {
            if (!node.isOpened || node.loadingStatus === "Loaded") {
                return null;
            }

            let fileId = node.fileId;
            let {fetchApi} = this.props;
            return fetchApi.fetchChildren(
                fileId,
                (children) => {
                    this.setState((prevState) => this.newState(prevState, fileId, children), this.onSuccessLoading)
                },
                (error) => {
                    this.setState(() => ({error: errorMessage(error, node ? this.file(fileId) : null)}))
                },
                () => {
                    this.setState((prevState) => {
                        let prevNode = this.node(fileId);
                        return {
                            nodes: {
                                ...prevState.nodes,
                                [fileId]: {...prevNode, loadingStatus: "Loaded"}
                            }
                        };
                    });
                }
            );
        };

        newState = (prevState, parentId, children) => {
            let files = {...prevState.files};
            let nodes = {...prevState.nodes};
            let childrenIds = {...prevState.childrenIds};

            childrenIds[parentId] = [];
            children.forEach(
                (file) => {
                    let id = file.id;

                    files[id] = file;
                    nodes[id] = new NodeDto(id);
                    childrenIds[parentId].push(id);
                }
            );

            return {files: files, nodes: nodes, childrenIds: childrenIds, error: null};
        };

        stateApi = {
            root: () => {
                let root = this.state.root;
                return root && this.node(root.id);
            },
            file: this.file,
            node: this.node,
            children: this.children,
            onSuccessLoading: this.onSuccessLoading,
            onNodeClick: this.onNodeClick,
            onNodeUnmount: this.onNodeUnmount
        };


        render = () => <WrappedComponent stateApi={this.stateApi} error={this.state.error}/>
    }

    return TreeStateWrapper;
};

export default withState;