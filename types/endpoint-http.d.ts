declare class EndpointHttpError extends Error {
    readonly code: string;
    readonly status: number;
    readonly retryAfterMs?: number | undefined;
    constructor(code: string, message: string, status: number, retryAfterMs?: number | undefined);
}
declare class EndpointTransportError extends Error {
    readonly code: string | undefined;
    readonly timeout: true | undefined;
    constructor(message: string, options?: ErrorOptions & {
        readonly code?: string;
        readonly timeout?: true;
    });
}
declare class EndpointResponseError extends Error {
}
declare function endpointTransportError(error: unknown): EndpointTransportError;
declare function transport<T>(request: Promise<T>): Promise<T>;
type RequestDeadline = {
    readonly signal: AbortSignal;
    readonly wait: <T>(work: Promise<T>) => Promise<T>;
};
declare function withRequestDeadline<T>(timeoutMs: number, work: (deadline: RequestDeadline) => Promise<T>, timeoutError?: () => EndpointTransportError): Promise<T>;
declare function retryAfterMs(headers: Headers, now?: number): number | undefined;
export { EndpointHttpError, EndpointResponseError, EndpointTransportError, endpointTransportError, retryAfterMs, transport, withRequestDeadline };
export type { RequestDeadline };
