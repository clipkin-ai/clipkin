type ResourceId = `res_${string}`;
type RecordId = string;
type ModuleRef = {
    readonly name: string;
    readonly version: string;
};
type TypeRef = {
    readonly module: ModuleRef;
    readonly name: string;
};
type ProducerRef = {
    readonly module: ModuleRef;
    readonly name: string;
};
type CapabilityRef = {
    readonly module: ModuleRef;
    readonly name: string;
};
type CanonicalValue = null | boolean | number | string | readonly CanonicalValue[] | {
    readonly [key: string]: CanonicalValue;
};
type BlobRef = {
    readonly kind: "blob";
    readonly resource: ResourceId;
    readonly size: number;
    readonly mediaType: string;
};
type StoredValue = {
    readonly kind: "inline";
    readonly value: CanonicalValue;
} | BlobRef;
type ModuleDependency = {
    readonly module: ModuleRef;
};
type TypeDeclaration = {
    readonly name: string;
};
type PortDeclaration = {
    readonly name: string;
    readonly type: TypeRef;
};
type NeedPortDeclaration = {
    readonly name: string;
    readonly capability: CapabilityRef;
    readonly returns: TypeRef;
};
type CapabilityDeclaration = {
    readonly name: string;
    readonly returns: TypeRef;
};
type ProducerDeclaration = {
    readonly name: string;
    readonly inputs: readonly PortDeclaration[];
    readonly outputs: readonly PortDeclaration[];
    readonly needs: readonly NeedPortDeclaration[];
};
type ModuleManifest = {
    readonly format: "clipkin.module@1";
    readonly name: string;
    readonly version: string;
    readonly dependencies: readonly ModuleDependency[];
    readonly types: readonly TypeDeclaration[];
    readonly capabilities: readonly CapabilityDeclaration[];
    readonly producers: readonly ProducerDeclaration[];
};
type ResolvedModule = {
    readonly manifest: ModuleManifest;
};
type ResolvedModuleClosure = {
    readonly format: "clipkin.closure@1";
    readonly modules: readonly ResolvedModule[];
};
type SourceRange = {
    readonly start: number;
    readonly end: number;
};
type TypedRecord = {
    readonly id: RecordId;
    readonly type: TypeRef;
    readonly value: StoredValue;
};
declare const recipeModuleRef: {
    readonly name: "@clipkin/recipe";
    readonly version: "1";
};
declare const recipeType: {
    module: {
        readonly name: "@clipkin/recipe";
        readonly version: "1";
    };
    name: string;
};
declare const recipeFrontendId = "@clipkin/recipe@1";
declare const recipeManifest: ModuleManifest;
type Recipe = {
    readonly path: string;
    readonly properties: Readonly<Record<string, CanonicalValue>>;
};
type ParsedGradeRecipe = {
    readonly value: Recipe;
    readonly range: SourceRange;
    readonly properties: readonly ParsedGradeProperty[];
};
type ParsedGradeProperty = {
    readonly name: string;
    readonly range: SourceRange;
    readonly valueRange: SourceRange;
};
type ParsedGradeSheet = {
    readonly id?: string;
    readonly recipes: readonly ParsedGradeRecipe[];
};
declare class RecipeSyntaxError extends Error {
    readonly code: string;
    readonly sourceName: string;
    readonly offset: number;
    constructor(code: string, message: string, sourceName: string, offset: number);
}
declare function parseRecipe(sourceName: string, source: string): ParsedGradeSheet;
declare function formatRecipeValue(value: CanonicalValue): string;
type FragmentInputRef = {
    readonly kind: "fragment-input";
    readonly name: string;
};
type FragmentOperationRef = {
    readonly kind: "fragment-operation";
    readonly operation: string;
};
type FragmentValueRef = FragmentInputRef | FragmentOperationRef;
type FragmentOperationResult = {
    readonly kind: "output";
    readonly name: string;
} | {
    readonly kind: "need";
    readonly name: string;
};
type FragmentOperation = {
    readonly id: string;
    readonly producer: ProducerRef;
    readonly inputs: Readonly<Record<string, FragmentValueRef>>;
    readonly result: FragmentOperationResult;
};
type FragmentExport = {
    readonly name: string;
    readonly type: TypeRef;
    readonly root: FragmentOperationRef;
};
type GraphFragment = {
    readonly format: "clipkin.fragment@1";
    readonly id: string;
    readonly inputs: readonly {
        readonly name: string;
        readonly type: TypeRef;
    }[];
    readonly operations: readonly FragmentOperation[];
    readonly exports: readonly FragmentExport[];
};
type AuthorRecordRef = {
    readonly kind: "record";
    readonly id: string;
};
type AuthorComponentOutputRef = {
    readonly kind: "component-output";
    readonly component: string;
    readonly output: string;
};
type AuthorValueRef = AuthorRecordRef | AuthorComponentOutputRef;
type AuthorComponent = {
    readonly id: string;
    readonly fragment: string;
    readonly inputs: Readonly<Record<string, AuthorValueRef>>;
    readonly outputs: Readonly<Record<string, string>>;
};
type SourceUnit = {
    readonly id: string;
    readonly name: string;
    readonly bytes: Uint8Array;
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
type AuthorSourceUnit = SourceUnit;
type AuthorFrontendSourceUnit = AuthorSourceUnit;
type AuthorSourceImport = SourceImportRequest;
type AuthorSourceDiscovery = {
    readonly modules: readonly string[];
    readonly sources: readonly AuthorSourceImport[];
};
type AuthorSourceAssetRequest = SourceAssetRequest;
type ResolvedAuthorSourceAsset = ResolvedSourceAsset;
type AuthorSourceExport = {
    readonly name: string;
    readonly ref: AuthorValueRef;
    readonly type: TypeRef;
};
type AuthorSourceIdentity = {
    readonly namespace: TypeRef;
    readonly id: string;
};
type AuthorInputProvenanceDraft = {
    readonly name: string;
    readonly range: SourceRange;
    readonly kind: "literal" | "reference";
    readonly ref?: AuthorValueRef;
};
type AuthorElementProvenanceDraft = {
    readonly range: SourceRange;
    readonly records: readonly string[];
    readonly components: readonly string[];
    readonly outputs: readonly {
        readonly component: string;
        readonly name: string;
        readonly id: string;
    }[];
    readonly inputs: readonly AuthorInputProvenanceDraft[];
};
type ResolvedAuthorSourceImport = {
    readonly request: AuthorSourceImport;
    readonly source: string;
    readonly exports: readonly AuthorSourceExport[];
    readonly records: readonly TypedRecord[];
};
type Awaitable<T> = T | Promise<T>;
type AuthorSourceDecodeContext = {
    readonly closure: ResolvedModuleClosure;
    readonly imports: readonly ResolvedAuthorSourceImport[];
    readonly resolveAsset: (request: AuthorSourceAssetRequest) => Awaitable<ResolvedAuthorSourceAsset>;
};
type DecodedAuthorSource = {
    readonly records: readonly TypedRecord[];
    readonly components: readonly AuthorComponent[];
    readonly fragments: readonly GraphFragment[];
    readonly exports: readonly AuthorSourceExport[];
    readonly identities?: readonly AuthorSourceIdentity[];
    readonly provenance?: readonly AuthorElementProvenanceDraft[];
};
type AuthorFrontend = {
    readonly id: string;
    discover(source: AuthorFrontendSourceUnit): Awaitable<AuthorSourceDiscovery>;
    decode(source: AuthorFrontendSourceUnit, context: AuthorSourceDecodeContext): Awaitable<DecodedAuthorSource>;
};
declare const recipeFrontend: AuthorFrontend;
export { RecipeSyntaxError, formatRecipeValue, parseRecipe, recipeFrontend, recipeFrontendId, recipeManifest, recipeModuleRef, recipeType };
export type { ParsedGradeProperty, ParsedGradeRecipe, ParsedGradeSheet, Recipe };
