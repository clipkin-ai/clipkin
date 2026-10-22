type ModuleRef = {
    readonly name: string;
    readonly version: string;
};
type TypeRef = {
    readonly module: ModuleRef;
    readonly name: string;
};
type CanonicalValue = null | boolean | number | string | readonly CanonicalValue[] | {
    readonly [key: string]: CanonicalValue;
};
type SourceUnit = {
    readonly id: string;
    readonly name: string;
    readonly bytes: Uint8Array;
};
type RunSourceUnit = SourceUnit;
type RunFrontendSourceUnit = RunSourceUnit;
type RunAuthorSourceRequest = {
    readonly source: string;
};
type RunImport = {
    readonly from: string;
    readonly as: string;
};
type RunTarget = {
    readonly output: string;
};
type RunProvidedValue = {
    readonly kind: "provided";
    readonly id: string;
    readonly type: TypeRef;
    readonly from: string;
};
type RunProvidedFile = {
    readonly kind: "file";
    readonly id: string;
    readonly type: TypeRef;
    readonly from: string;
    readonly mediaType: string;
};
type RunBuildRecord = {
    readonly kind: "build-record";
    readonly id: string;
    readonly build: string;
    readonly output: string;
};
type RunFragmentInput = {
    readonly name: string;
    readonly from: string;
} | {
    readonly name: string;
    readonly value: CanonicalValue;
};
type RunFragmentInstance = {
    readonly kind: "fragment";
    readonly id: string;
    readonly using: {
        readonly alias: string;
        readonly name: string;
    };
    readonly inputs: readonly RunFragmentInput[];
    readonly exports?: readonly string[];
};
type RunCandidateDeclaration = RunProvidedValue | RunProvidedFile | RunBuildRecord | RunFragmentInstance;
type RunSatisfaction = {
    readonly output: string;
    readonly candidate: string;
};
type RunDocument = {
    readonly format: "clipkin.run-document@1";
    readonly author: RunAuthorSourceRequest;
    readonly imports: readonly RunImport[];
    readonly targets: readonly RunTarget[];
    readonly candidates: readonly RunCandidateDeclaration[];
    readonly satisfactions: readonly RunSatisfaction[];
};
type RunSourceDiscovery = {
    readonly author: RunAuthorSourceRequest;
    readonly imports: readonly RunImport[];
};
type DecodedRunSource = {
    readonly document: RunDocument;
};
type RunFrontend = {
    readonly id: string;
    discover(source: RunFrontendSourceUnit): RunSourceDiscovery | Promise<RunSourceDiscovery>;
    decode(source: RunFrontendSourceUnit): DecodedRunSource | Promise<DecodedRunSource>;
};
declare const runMarkupFrontendId = "@clipkin/markup/run@1";
declare const runMarkupFrontend: RunFrontend;
declare class RunSyntaxError extends Error {
    readonly code: string;
    readonly offset: number;
    readonly sourceName: string | undefined;
    readonly line: number | undefined;
    readonly column: number | undefined;
    constructor(code: string, message: string, offset: number, sourceName?: string, source?: string);
}
declare function parseRunDocument(name: string, text: string): RunDocument;
export { RunSyntaxError, parseRunDocument, runMarkupFrontend, runMarkupFrontendId };
