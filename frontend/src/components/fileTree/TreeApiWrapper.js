import React, {Component} from "react";
import {FileTreeNodeDto} from "../../model/file";
import messages from "../../utils/messages";
import AxiosStatic from "axios";


export type ApiError = {
    message: string
}

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

        fetchRoot = (success: (root: any) => void, error: (error: ApiError) => void) => {
            return this.fetchData(
                `/files/root`, (root) => {
                    success(new FileTreeNodeDto(root))
                }, error
            )
        };

        fetchChildren = (parentId: number, onSuccess: (children: any) => void, onError: (error: ApiError) => void) => {
            return this.fetchData(
                `/files/${parentId}`, (children) => {
                    onSuccess(children.map(file => new FileTreeNodeDto(file)))
                }, onError
            )
        };

        fetchData = (url: string, onSuccess: (data: any) => void, onError: (error: ApiError) => void) => {
            this.state.httpClientInstance.get(url)
                .then(function (response) {
                    onSuccess(response.data);
                })
                .catch(function (error) {
                    if (error.message === "Network Error") {
                        error = { text : messages.error.serverUnavailable}
                    }
                    onError(error);
                })
                .then(function () {
                    //todo
                });
        };

        render = () => <div>
            <WrappedComponent fetchRoot={this.fetchRoot} fetchChildren={this.fetchChildren}/>
        </div>;
    }

    return TreeApiWrapper;
};

export default withApi;