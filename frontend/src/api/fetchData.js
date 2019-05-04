// @flow

import AxiosStatic from "axios";
import appConfig from "../appConfig";

const axiosInstance = AxiosStatic.create({
    baseURL: appConfig.defaultUrl
});

export function fetchData(url: string, success: (data: any) => void) {
    axiosInstance.get(url,  { crossdomain: true })
        .then(function (response) {
            // handle success
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