import React, {Component} from "react";

/**
 * State-aware tree wrapper
 */
const withState = ({stateStorage, updateOnExpand}, WrappedComponent) => {

    class StateWrapper extends Component {

        static defaultState() {
            return {
                root: null,         //root node
                files: {},          //file by fileId
                loadingStatuses: {},          //loadingStatus by fileId
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
                        [fileId]: "NotLoaded"
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

            this.setState((prevState) => {
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
            }, () => this.loadChildren(fileId));
        };


        loadRoot() {
            let {fetchApi} = this.props;
            fetchApi.fetchRoot(
                (root) => {
                    let id = root.id;
                    this.setState((prevState) => ({
                        root: root,
                        files: {[id]: root},
                        loadingStatuses: {[id]: "NotLoaded"},
                        openingStatuses: { ...prevState.openingStatuses, [id]: this.openingStatus(id) || false}
                    }), this.checkOpenNodes())
                },
                (error) => {
                    this.setState(() => (this.processError(error, null)))
                }
            );
        }

        loadChildren = (fileId) => {
            let reloadOpenedNode = (!updateOnExpand && this.loadingStatus(fileId) === "Loaded");
            if (!this.openingStatus(fileId) || reloadOpenedNode) {
                return null;
            }
            // if (!this.file(fileId)) {
            //     return null;
            // }

            let {fetchApi} = this.props;
            return fetchApi.fetchChildren(
                fileId,
                (children) => this.setState((prevState) => this.newState(prevState, fileId, children)),
                (error) => this.processError(error, fileId),
                () => this.onLoadingFinished(fileId)
            );
        };

        //todo fix ddos on deleted file
        //clear openingStatuses somehow
        checkOpenNodes = () => {
            const openingStatuses = this.state.openingStatuses;
            const openedIds = Object.keys(openingStatuses);
            for (let id of openedIds) {
                if (openingStatuses[id] && !this.file(id)) {
                    this.loadChildren(id);
                }
            }
        };

        processError(error, fileId) {
            let {errorProcessingApi} = this.props;
            this.setState(
                (prevState) => errorProcessingApi && errorProcessingApi.applyErrorToState(
                    prevState, error, this.file(fileId)
                ), this.resetErrorMessage
            );
        }

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
            }, () => { this.saveState(); this.checkOpenNodes(); }); //todo
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

                    files[id] = file;
                    childrenIds[parentId].push(id);
                    loadingStatuses[id] = "NotLoaded";
                    openingStatuses[id] = this.openingStatus(id) || false;
                }
            );

            return {files: files, childrenIds: childrenIds, loadingStatuses: loadingStatuses, openingStatuses: openingStatuses, error: null};
        };

        //todo preserve structure ?
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

        children = (fileId) => this.state.childrenIds[fileId] || [];

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