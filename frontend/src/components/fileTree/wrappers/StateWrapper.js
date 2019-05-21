import React, {Component} from "react";

/**
 * State-aware tree wrapper
 * todo tests
 * todo too many state mutation boilerplate
 */
const withState = ({stateStorage, updateOnExpand}, WrappedComponent) => {

    class StateWrapper extends Component {

        static defaultState() {
            return {
                root: null,         //root node
                files: {},          //file by fileId
                loadingStatuses: {},          //loadingStatus by fileId todo remove it, too complex
                openingStatuses: {},          //openedStatus by fileId
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

        onNodeUnmount = ({fileId}) => {
            let {fetchApi} = this.props;
            let isCancelled = fetchApi.cancelFetch(fileId);
            if (!isCancelled) {
                return;
            }

            this.setState((prevState) => {
                return {
                    loadingStatuses: {
                        ...prevState.loadingStatuses,
                        [fileId]: this.children(fileId) != null ? "Loaded" : "NotLoaded"
                    },
                    openingStatuses: {
                        ...prevState.openingStatuses,
                        [fileId]: false
                    }
                };
            });
        };

        onNodeClick = ({fileId}) => {
            let file = this.file(fileId);
            if (!file.mayHaveChildren) {
                return;
            }
            this.updateNodeStatus(fileId);
        };


        updateNodeStatus(fileId) {
            this.setState(
                (prevState) => {
                    let wasOpened = this.openingStatus(fileId);
                    let prevLoadingStatus = this.loadingStatus(fileId);
                    let loadingStatus = (prevLoadingStatus === "Loaded") ? prevLoadingStatus : "Loading";

                    return {
                        loadingStatuses: {
                            ...prevState.loadingStatuses,
                            [fileId]: loadingStatus
                        },
                        openingStatuses: {
                            ...prevState.openingStatuses,
                            [fileId]: !wasOpened
                        },
                    };
                },
                () => this.loadChildren(fileId)
            );
        }

        loadRoot() {
            let {fetchApi} = this.props;
            fetchApi.fetchRoot(
                (root) => {
                    let id = root.id;
                    let loadingStatus = this.children(id) != null ? "Loaded" : "NotLoaded";

                    this.setState((prevState) => ({
                        root: root,
                        files: {[id]: root},
                        loadingStatuses: {[id]: loadingStatus},
                        openingStatuses: { ...prevState.openingStatuses, [id]: this.openingStatus(id) || false}
                    }), this.checkOpenNodes())
                },
                (error) => {
                    this.setState(() => (this.processError(error, null)))
                },
                () => this.onLoadingFinished(this.state.root ? this.state.root : null)
            );
        }

        loadChildren = (fileId) => {
            let reloadOpenedNode = (!updateOnExpand && this.loadingStatus(fileId) === "Loaded");
            if ((this.children(fileId)) || reloadOpenedNode) {
                return null;
            }

            let {fetchApi} = this.props;
            return fetchApi.fetchChildren(
                fileId,
                (children) => this.setState((prevState) => this.newState(prevState, fileId, children)),
                (error) => this.processError(error, fileId),
                () => this.onLoadingFinished(fileId)
            );
        };

        checkOpenNodes = () => {
            setTimeout(() => {
                const openingStatuses = this.state.openingStatuses;
                const openedIds = Object.keys(openingStatuses);
                //todo batch request? looks like ddos in case of many opened nodes
                for (let id of openedIds) {
                    if (openingStatuses[id] && this.children(id) == null) {
                        this.loadChildren(id);
                    }
                }
            }, 1000);
        };

        processError(error, fileId) {
            let {errorProcessingApi} = this.props;
            this.setState(
                (prevState) => errorProcessingApi && errorProcessingApi.applyErrorToState(
                    prevState, error, fileId
                ), this.resetErrorMessage
            );
        }

        //called both on success and on error
        onLoadingFinished(fileId) {
            this.setState((prevState) => {
                    let prevLoadingStatus = this.loadingStatus(fileId);
                    let loadingStatus = prevLoadingStatus === "Loading" ? "Loaded" : prevLoadingStatus;

                    return {
                        loadingStatuses: {
                            ...prevState.loadingStatuses,
                            [fileId]: loadingStatus
                        }
                    };
                }, () => {
                    //todo
                    this.saveState();
                    this.checkOpenNodes();
                }
            );
        };


        newState = (prevState, parentId, children) => {
            let files = {...prevState.files};
            let childrenIds = {...prevState.childrenIds};
            let loadingStatuses = {...prevState.loadingStatuses};
            let openingStatuses = {...prevState.openingStatuses};

            childrenIds[parentId] = [];
            children.forEach(
                (file) => {
                    let id = file.id;
                    const openingStatus = this.openingStatus(id) || false;

                    files[id] = file;
                    childrenIds[parentId].push(id);
                    loadingStatuses[id] = openingStatus ? "Loaded" : "NotLoaded";
                    openingStatuses[id] = openingStatus;
                }
            );

            return {files: files, childrenIds: childrenIds, loadingStatuses: loadingStatuses, openingStatuses: openingStatuses, error: null};
        };

        resetState = () => {
            stateStorage && stateStorage.reset();

            const newState = {
                ...StateWrapper.defaultState(),
                openingStatuses: this.state.openingStatuses
            };

            this.setState(newState);
            this.loadRoot();
        };

        saveState = () => stateStorage && stateStorage.set({...this.state, error: null});

        resetErrorMessage = () => setTimeout(() => this.setState({error: null}), 3000);

        file = (fileId) => this.state.files[fileId];

        openingStatus = (fileId) => this.state.openingStatuses[fileId];

        loadingStatus = (fileId) => this.state.loadingStatuses[fileId];

        children = (fileId) => this.state.childrenIds[fileId];

        node = (fileId) => ({
            fileId: fileId,
            loadingStatus: this.loadingStatus(fileId),
            openingStatus: this.openingStatus(fileId)
        });

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

        render = () => <WrappedComponent {...this.props} stateApi={this.stateApi} error={this.state.error}/>
    }

    return StateWrapper;
};

export default withState;