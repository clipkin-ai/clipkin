type ResourceId = `res_${string}`;
type BlobRef = {
    readonly kind: "blob";
    readonly resource: ResourceId;
    readonly size: number;
    readonly mediaType: string;
};
type SourceRange = {
    readonly start: number;
    readonly end: number;
};
type SourceUnit = {
    readonly id: string;
    readonly name: string;
    readonly bytes: Uint8Array;
};
type ResolvedSource = {
    readonly unit: SourceUnit;
    readonly frontend: string;
};
type SourceImportRequest = {
    readonly from: string;
    readonly alias: string;
    readonly range?: SourceRange;
};
type SourceAssetRequest = {
    readonly from: string;
    readonly mediaType: string;
    readonly bytes?: Uint8Array;
    readonly range?: SourceRange;
};
type ResolvedSourceAsset = {
    readonly artifact: BlobRef;
};
type Awaitable<T> = T | Promise<T>;
type SourceResolver = (importer: SourceUnit, request: SourceImportRequest) => Awaitable<ResolvedSource>;
type SourceAssetResolver = (importer: SourceUnit, request: SourceAssetRequest) => Awaitable<ResolvedSourceAsset>;
type BlobAttachment = {
    readonly artifact: BlobRef;
    readonly location?: string;
    open(): Awaitable<AsyncIterable<Uint8Array>>;
};
interface WorkspaceSession {
    readonly entry: ResolvedSource;
    readonly resolveSource: SourceResolver;
    readonly resolveAsset: SourceAssetResolver;
    attachments(): Awaitable<readonly BlobAttachment[]>;
}
interface Workspace {
    open(entryLocator: string): Awaitable<WorkspaceSession>;
}
declare class WorkspaceError extends Error {
    readonly code: string;
    readonly subject: string | undefined;
    constructor(code: string, message: string, subject?: string);
}
export { WorkspaceError };
export type { BlobAttachment, Workspace, WorkspaceSession };
