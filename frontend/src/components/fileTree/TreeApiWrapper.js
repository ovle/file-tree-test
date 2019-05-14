import React, {Component} from "react";
import {FileTreeNodeDto} from "../../model/file";
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
            this.state = {httpClientInstance: httpClientInstance};
        }

        fetchRoot = (success: (root: any) => void, onError: (error: FileTreeErrorDto) => void, onResponse: () => void) => {
            return this.fetchData(
                `/files/root`, (root) => {
                    success(new FileTreeNodeDto(root))
                }, onError, onResponse
            )
        };

        fetchChildren = (parentId: number, onSuccess: (children: any) => void, onError: (error: FileTreeErrorDto) => void, onResponse: () => void) => {
            return this.fetchData(
                `/files/${parentId}`, (children) => {
                    onSuccess(children.map(file => new FileTreeNodeDto(file)))
                }, onError, onResponse
            )
        };

        fetchData = (url: string, onSuccess: (data: any) => void, onError: (error: any) => void, onResponse: () => void) => {
            let CancelToken = AxiosStatic.CancelToken;
            let cancel;
            let cancelTokenInstance = new CancelToken((c) => { cancel = c; });

            this.state.httpClientInstance.get(url, { cancelToken:cancelTokenInstance })
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

        render = () => <div>
            <WrappedComponent fetchRoot={this.fetchRoot} fetchChildren={this.fetchChildren}/>
        </div>;
    }

    return TreeApiWrapper;
};

export default withApi;