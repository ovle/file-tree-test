import React, {Component} from "react";
import {FileTreeNodeDto} from "../../model/file";
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

        fetchChildren = (parentId: number, success: (children: any) => void, error: (error: ApiError) => void) => {
            return this.fetchData(
                `/files/${parentId}`, (children) => {
                    success(children.map(file => new FileTreeNodeDto(file)))
                }, error
            )
        };

        fetchData = (url: string, success: (data: any) => void, error: (error: ApiError) => void) => {
            this.state.httpClientInstance.get(url)
                .then(function (response) {
                    success(response.data);
                })
                .catch(function (error) {
                    error(error);
                })
                .then(function () {
                });
        };

        render = () => <div>
            <WrappedComponent fetchRoot={this.fetchRoot} fetchChildren={this.fetchChildren}/>
        </div>;
    }

    return TreeApiWrapper;
};

export default withApi;