// Type definitions for api-benchmark x.x
// Project: https://github.com/matteofigus/api-benchmark 
// Definitions by: Joe Brinkman <https://github.com/jbrinkman>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "api-benchmark" {
    type httpMethodBase = 'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace'

    export type httpMethod = Uppercase<httpMethodBase> | httpMethodBase

    export interface endpointInfo {
        method: httpMethod,
        route: string,
        expectedStatusCode?:number,
        maxMean?:number,
        maxSingleMean?:number,
        headers?: Record<string, string>,  
        data?: number
    }

    export type endpoint = string | endpointInfo

    export type endpoints = Record<string, endpoint>

    export function compare(services: any, endpoints: endpoints, options: any, callback: any): any;

    export function getHtml(input: any, callback: any): any;

    export function measure(services: any, endpoints: endpoints, options: any, callback: any): any;

    export function measure(services: any, endpoints: endpoints, callback: any): any;
}