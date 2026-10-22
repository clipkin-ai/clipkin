type SourceUnit = {
    readonly id: string;
    readonly name: string;
    readonly bytes: Uint8Array;
};
type ResolvedSource = {
    readonly unit: SourceUnit;
    readonly frontend: string;
};
type SourceHeader = {
    readonly using: string;
    readonly start: number;
    readonly end: number;
};
declare class SourceHeaderError extends Error {
    readonly code: string;
    readonly sourceName: string;
    readonly offset: number;
    readonly line: number;
    readonly column: number;
    constructor(code: string, message: string, sourceName: string, source: string, offset: number);
}
declare function parseSourceHeader(sourceName: string, text: string): SourceHeader;
declare function maskSourceHeader(text: string, header: SourceHeader): string;
declare function resolveSelfDescribedTextSource(input: {
    readonly id: string;
    readonly name: string;
    readonly text: string;
}): ResolvedSource;
export { SourceHeaderError, maskSourceHeader, parseSourceHeader, resolveSelfDescribedTextSource };
export type { SourceHeader };
