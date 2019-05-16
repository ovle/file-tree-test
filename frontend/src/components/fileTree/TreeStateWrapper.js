// @flow

import React, {Component} from "react";
import {processError} from "./processError";
import {NodeDto} from "../../model/file";

/**
 * State-aware tree wrapper
 */
const withState = ({stateStorage, updateOnExpand}, WrappedComponent) => {

    class TreeStateWrapper extends Component {

        static defaultState() {
            return {
                root: null,         //root node
                files: {},          //file by fileId
                nodes: {},          //node by fileId
                childrenIds: {},    //fileIds by parent fileId
                error: null
            };
        }


        constructor(props) {
            super(props);

            let defaultState = TreeStateWrapper.defaultState();
            this.state = stateStorage ? (stateStorage.get() || defaultState) : defaultState;
        }

        componentDidMount = () => {
            if (this.state.root) return;

            this.loadRoot();
        };


        loadRoot() {
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
                    this.setState(() => (processError(error, null)))
                }
            );
        }

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
            if (!isCancelled) {
                return;
            }

            let fileId = node.fileId;
            this.setState((prevState) => {
                let prevNode = this.node(fileId);
                return {
                    nodes: {
                        ...prevState.nodes,
                        [fileId]: {...prevNode, loadingStatus: "NotLoaded", isOpened: false}
                    }
                };
            });
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
            let reloadOpenedNode = (!updateOnExpand && node.loadingStatus === "Loaded");
            if (!node.isOpened || reloadOpenedNode) {
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
                    this.setState((prevState) => processError(prevState, error, this.node(fileId), this.file(fileId)))
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
                    nodes[id] = this.node(id) ||  new NodeDto(id);
                    childrenIds[parentId].push(id);
                }
            );

            return {files: files, nodes: nodes, childrenIds: childrenIds, error: null};
        };

        //todo preserve structure ?
        resetState = () => {
            stateStorage && stateStorage.reset();

            this.setState(TreeStateWrapper.defaultState());
            this.loadRoot();
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
            onNodeUnmount: this.onNodeUnmount,
            reset: this.resetState
        };


        render = () => <WrappedComponent stateApi={this.stateApi} error={this.state.error}/>
    }

    return TreeStateWrapper;
};

export default withState;