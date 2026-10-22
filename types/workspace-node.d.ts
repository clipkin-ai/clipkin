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
type NodeFilesystemExternalSource = {
    readonly root: string;
    readonly source: string;
    readonly frontend?: string;
};
type NodeFilesystemExternalSourceResolver = (importer: SourceUnit, request: SourceImportRequest) => Awaitable<NodeFilesystemExternalSource>;
type NodeFilesystemExternalAsset = {
    readonly root: string;
    readonly asset: string;
};
type NodeFilesystemExternalAssetResolver = (importer: SourceUnit, request: SourceAssetRequest) => Awaitable<NodeFilesystemExternalAsset>;
type NodeFilesystemSourceAdapter = (source: SourceUnit) => Awaitable<ResolvedSource>;
type NodeFilesystemWorkspaceOptions = {
    readonly root?: string;
    readonly assetRoots?: readonly string[];
    readonly externalSourceResolver?: NodeFilesystemExternalSourceResolver;
    readonly externalAssetResolver?: NodeFilesystemExternalAssetResolver;
    readonly sourceAdapter?: NodeFilesystemSourceAdapter;
};
declare class NodeFilesystemWorkspace implements Workspace {
    #private;
    constructor(options?: NodeFilesystemWorkspaceOptions);
    open(entryLocator: string): Promise<WorkspaceSession>;
}
export { NodeFilesystemWorkspace };
export type { NodeFilesystemExternalAsset, NodeFilesystemExternalAssetResolver, NodeFilesystemExternalSource, NodeFilesystemExternalSourceResolver, NodeFilesystemSourceAdapter, NodeFilesystemWorkspaceOptions };
