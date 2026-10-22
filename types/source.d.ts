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
declare function decodeSourceText(source: SourceUnit): string;
declare const sourceFrontendPackageAbi = "clipkin.source-frontend@1";
export { decodeSourceText, sourceFrontendPackageAbi };
export type { Awaitable, ResolvedSource, ResolvedSourceAsset, SourceAssetRequest, SourceAssetResolver, SourceImportRequest, SourceResolver, SourceUnit };
