// @flow

import React, {Component} from "react";
import {NodeDto} from "../../model/file";

/**
 * State-aware tree wrapper
 */
const withState = ({stateStorage, updateOnExpand}, WrappedComponent) => {

    class StateWrapper extends Component {

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

            let defaultState = StateWrapper.defaultState();
            this.state = stateStorage ? (stateStorage.get() || defaultState) : defaultState;
        }

        componentDidMount = () => {
            if (this.state.root) return;

            this.loadRoot();
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
                let loadingStatus = (prevNode.loadingStatus === "Loaded") ? prevNode.loadingStatus : "Loading";

                return {
                    nodes: {
                        ...prevState.nodes,
                        [fileId]: {...prevNode, loadingStatus: loadingStatus, isOpened: !wasOpened}
                    }
                };
            }, () => this.loadData(this.node(fileId)));
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
                    this.setState(() => (this.processError(error, null)))
                }
            );
        }



        loadData = (node: NodeDto) => {
            let reloadOpenedNode = (!updateOnExpand && node.loadingStatus === "Loaded");
            if (!node.isOpened || reloadOpenedNode) {
                return null;
            }

            let fileId = node.fileId;
            let {fetchApi} = this.props;
            return fetchApi.fetchChildren(
                fileId,
                (children) => this.setState((prevState) => this.newState(prevState, fileId, children)),
                (error) => this.processError(error, fileId),
                () => this.onLoadingFinished(fileId)
            );
        };

        processError(error, fileId) {
            let {errorProcessingApi} = this.props;
            this.setState(
                (prevState) => errorProcessingApi && errorProcessingApi.applyErrorToState(
                    prevState, error, this.node(fileId), this.file(fileId)
                ), this.resetErrorMessage
            );
        }

        onLoadingFinished(fileId) {
            this.setState((prevState) => {
                let prevNode = this.node(fileId);
                let loadingStatus = prevNode.loadingStatus === "Loading" ? "Loaded" : prevNode.loadingStatus;

                return {
                    nodes: {
                        ...prevState.nodes,
                        [fileId]: {...prevNode, loadingStatus: loadingStatus}
                    }
                };
            }, this.saveState);
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
                    nodes[id] = this.node(id) || new NodeDto(id);
                    childrenIds[parentId].push(id);
                }
            );

            return {files: files, nodes: nodes, childrenIds: childrenIds, error: null};
        };

        //todo preserve structure ?
        resetState = () => {
            stateStorage && stateStorage.reset();

            this.setState(StateWrapper.defaultState());
            this.loadRoot();
        };

        saveState = () => stateStorage && stateStorage.set({...this.state, error: null});

        resetErrorMessage = () => setTimeout(() => this.setState({error: null}), 3000);

        file = (fileId) => this.state.files[fileId];

        node = (fileId) => this.state.nodes[fileId];

        children = (fileId) => this.state.childrenIds[fileId] || [];


        stateApi = {
            root: () => {
                let root = this.state.root;
                return root && this.node(root.id);
            },
            file: this.file,
            node: this.node,
            children: this.children,
            onNodeClick: this.onNodeClick,
            onNodeUnmount: this.onNodeUnmount,
            reset: this.resetState
        };


        render = () => <WrappedComponent { ...this.props } stateApi={this.stateApi} error={this.state.error}/>
    }

    return StateWrapper;
};

export default withState;