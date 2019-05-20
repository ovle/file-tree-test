import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import type {FileDto} from "../../../model/file";


const withErrorProcessing = (WrappedComponent) => {

    class ErrorProcessingWrapper extends Component {

        errorInfo = (error) => this.props.t(`${error.type}`);

        //FileNotFound - remove file from tree?
        applyErrorToState = (prevState, error, file: FileDto) => {
            let {t} = this.props;
            //todo not sure how to make this check better
            if (error === "Network Error") {
                error = t("serverUnavailable");
            }
            if ((typeof error == "string") || !file) return error;


            const fileId = file.id;
            return {
                loadingStatuses: {
                    ...prevState.loadingStatuses,
                    [fileId]: "LoadingError"
                },
                openingStatuses: {
                    ...prevState.openingStatuses,
                    [fileId]: false
                },
                error: this.errorInfo(error, file)
            };
        };

        errorProcessingApi = {
            applyErrorToState: this.applyErrorToState
        };

        render = () => <WrappedComponent { ...this.props } errorProcessingApi={this.errorProcessingApi}/>
    }

    return withNamespaces("error")(ErrorProcessingWrapper);
};

export default withErrorProcessing;