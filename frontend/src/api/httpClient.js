// @flow
import AxiosStatic from "axios";
import appConfig from "../appConfig";

const httpClientInstance = AxiosStatic.create({
    baseURL: appConfig.defaultUrl
});


export function fetchData(url: string, success: (data: any) => void) {
    httpClientInstance.get(url)
        .then(function (response) {
            // handle success
            success(response.data);
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}