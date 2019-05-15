import React, {Component} from "react";
import AxiosStatic, {Cancel} from "axios";
import type {FileTreeErrorDto} from "../../model/error";

/**
 * API-aware tree wrapper
 */
const withApi = (baseURL, WrappedComponent) => {

    class TreeApiWrapper extends Component {

        constructor(props) {
            super(props);

            let httpClientInstance = AxiosStatic.create({baseURL: baseURL});
            this.state = {httpClientInstance: httpClientInstance, cancelTokens: {}};
        }

        fetchRoot = (onSuccess: (root: any) => void, onError: (error: FileTreeErrorDto) => void, onResponse: () => void) => {
            this.fetchData(
                `/files/root`, onSuccess, onError, onResponse
            )
        };

        fetchChildren = (parentId: number, onSuccess: (children: any) => void, onError: (error: FileTreeErrorDto) => void, onResponse: () => void) => {
            let cancelToken = this.fetchData(
                `/files/${parentId}`, onSuccess, onError, onResponse
            );

            this.state.cancelTokens[parentId] = cancelToken;
        };

        fetchData = (url: string, onSuccess: (data: any) => void, onError: (error: any) => void, onResponse: () => void) => {
            let CancelToken = AxiosStatic.CancelToken;
            let cancel;
            let cancelTokenInstance = new CancelToken((c) => {
                cancel = c;
            });

            this.state.httpClientInstance.get(url, {cancelToken: cancelTokenInstance})
                .then(response => onSuccess(response.data))
                .catch(error => {
                    if (error instanceof Cancel) return;

                    let response = error.response;
                    return onError((response && response.data && response.data.error) || error.message);
                })
                .then(onResponse);

            // noinspection JSUnusedAssignment
            return cancel;
        };

        cancelFetch = (fileId: number) => {
            let cancelTokens = this.state.cancelTokens;
            let cancelToken = cancelTokens[fileId];
            if (!cancelToken) return false;

            cancelTokens[fileId] = null;
            cancelToken && cancelToken();
            return true;
        };

        fetchApi = {
            fetchRoot: this.fetchRoot,
            fetchChildren: this.fetchChildren,
            cancelFetch: this.cancelFetch
        };


        render = () => <WrappedComponent fetchApi={this.fetchApi}/>
    }

    return TreeApiWrapper;
};

export default withApi;