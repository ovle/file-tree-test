import React, {Component} from "react";

/**
 * State-aware tree wrapper
 */
const withState = ({stateStorage}, WrappedComponent) => {

    class TreeStateWrapper extends Component {

        constructor(props) {
            super(props);

            let defaultState = { root: null, error: null };
            this.state = stateStorage ? (stateStorage.get() || defaultState) : defaultState;
        }

        componentDidMount = () => {
            if (this.state.root) return;

            let {fetchRoot} = this.props;
            fetchRoot(
                (root) => {
                    this.setState(() => {
                        return {root: root}
                    })
                },
                (error) => {
                    this.setState(() => {
                        return {error: error}
                    })
                }
            );
        };

        onNodeClick = (node, onSuccess, onError) => {
            let parentId = node.file.id;
            let {fetchChildren} = this.props;

            fetchChildren(
                parentId,
                (children) => {
                    node.children = children;

                    this.setState((prevState) => {
                        return {root: prevState.root}
                    }, this.onSuccessLoading(onSuccess))
                },
                (error) => {
                    this.setState(() => {
                        return {error: error}
                    }, onError)
                }
            );
        };

        onSuccessLoading = onSuccessLoading => {
            stateStorage && stateStorage.set(this.state);

            return onSuccessLoading;
        };

        render = () => <div>
            <WrappedComponent root={this.state.root} onNodeClick={this.onNodeClick} error={this.state.error}/>
        </div>;
    }

    return TreeStateWrapper;
};

export default withState;