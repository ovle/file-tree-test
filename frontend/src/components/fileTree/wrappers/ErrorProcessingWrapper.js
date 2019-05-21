import React, {Component} from "react";
import {withNamespaces} from "react-i18next";


const withErrorProcessing = (WrappedComponent) => {

    class ErrorProcessingWrapper extends Component {

        applyErrorToState = (prevState, error, fileId) => {
            let {t} = this.props;
            //todo not sure how to make this check better
            if (error === "Network Error") {
                error = t("serverUnavailable");
            }
            if (typeof error == "string") return { error: error };

            if (error.type === "FileNotFound") {
                return this.fileNotFoundErrorState(prevState, fileId)
            } else {
                return this.generalErrorState(prevState, fileId, error)
            }
        };

        generalErrorState(prevState, fileId, error) {
            return {
                loadingStatuses: {
                    ...prevState.loadingStatuses,
                    [fileId]: "LoadingError"
                },
                openingStatuses: {
                    ...prevState.openingStatuses,
                    [fileId]: false
                },
                error: this.props.t(`${error.type}`)
            };
        }

        fileNotFoundErrorState(prevState, fileId) {
            return {
                files: {
                    ...prevState.files,
                    [fileId]: null
                },
                loadingStatuses: {
                    ...prevState.loadingStatuses,
                    [fileId]: null
                },
                openingStatuses: {
                    ...prevState.openingStatuses,
                    [fileId]: null
                },
                childrenIds: {
                    ...prevState.childrenIds,
                    [fileId]: null
                }
            };
        }

        errorProcessingApi = {
            applyErrorToState: this.applyErrorToState
        };

        render = () => <WrappedComponent { ...this.props } errorProcessingApi={this.errorProcessingApi}/>
    }

    return withNamespaces("error")(ErrorProcessingWrapper);
};

export default withErrorProcessing;