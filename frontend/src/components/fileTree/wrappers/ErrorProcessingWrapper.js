import {NodeDto} from "../../../model/file";
import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import type {FileDto} from "../../../model/file";


const withErrorProcessing = (WrappedComponent) => {

    class ErrorProcessingWrapper extends Component {

        errorInfo = (error) => this.props.t(`${error.type}`);

        //FileNotFound - remove file from tree?
        applyErrorToState = (prevState, error, node: NodeDto, file: FileDto) => {
            let {t} = this.props;
            //todo not sure how to make this check better
            if (error === "Network Error") {
                error = t("serverUnavailable");
            }
            if ((typeof error == "string") || !node) {
                return {error: error};
            }

            let nodes = {...prevState.nodes};
            if (node) {
                nodes[node.fileId] = {...node, loadingStatus: "LoadingError", isOpened: false}
            }

            return {
                nodes: nodes,
                error: this.errorInfo(error, file)
            };
        };

        errorProcessingApi = {
            applyErrorToState: this.applyErrorToState
        };

        render = () => <WrappedComponent {...this.props} errorProcessingApi={this.errorProcessingApi}/>
    }

    return withNamespaces("error")(ErrorProcessingWrapper);
};

export default withErrorProcessing;