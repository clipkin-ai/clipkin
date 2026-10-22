declare class MarkupFrontendError extends Error {
    readonly code: string;
    readonly sourceName: string;
    readonly offset: number | undefined;
    readonly line: number | undefined;
    readonly column: number | undefined;
    constructor(code: string, message: string, sourceName: string, offset?: number, source?: string);
}
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
type ValueSchema = {
    readonly kind: "null";
} | {
    readonly kind: "boolean";
} | {
    readonly kind: "number";
    readonly integer?: boolean;
    readonly minimum?: number;
    readonly maximum?: number;
} | {
    readonly kind: "string";
    readonly enum?: readonly string[];
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly format?: "color";
} | {
    readonly kind: "literal";
    readonly value: CanonicalValue;
} | {
    readonly kind: "array";
    readonly items: ValueSchema;
    readonly minItems?: number;
    readonly maxItems?: number;
} | {
    readonly kind: "object";
    readonly fields: Readonly<Record<string, ObjectFieldSchema>>;
    readonly allowUnknown?: boolean;
} | {
    readonly kind: "oneOf";
    readonly variants: readonly ValueSchema[];
} | {
    readonly kind: "blob";
    readonly mediaTypes?: readonly string[];
    readonly maxBytes?: number;
};
type ObjectFieldSchema = {
    readonly schema: ValueSchema;
    readonly optional?: boolean;
};
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
type Facet = {
    readonly abi: string;
    readonly offers?: readonly string[];
    readonly implementation: unknown;
};
type MarkupSource = {
    readonly id?: string;
    readonly name: string;
    readonly text: string;
};
type MarkupImportRequest = {
    readonly kind: "module" | "source";
    readonly from: string;
    readonly alias?: string;
    readonly range: SourceRange;
};
type MarkupDiscovery = {
    readonly imports: readonly MarkupImportRequest[];
    readonly bodyStart: number;
};
type MarkupReference = {
    readonly kind: "reference";
    readonly path: string;
};
type MarkupAttributeValue = string | MarkupReference;
type StructuredText = {
    readonly kind: "text";
    readonly value: string;
    readonly range: SourceRange;
};
type StructuredElement = {
    readonly kind: "element";
    readonly name: string;
    readonly attributes: Readonly<Record<string, MarkupAttributeValue>>;
    readonly attributeValueRanges?: Readonly<Record<string, SourceRange>>;
    readonly children: readonly StructuredNode[];
    readonly range: SourceRange;
};
type StructuredNode = StructuredText | StructuredElement;
type SurfaceRecordDraft = {
    readonly id: string;
    readonly type: TypeRef;
    readonly value: StoredValue;
    readonly range: SourceRange;
};
type SurfaceComponentDraft = AuthorComponent & {
    readonly range: SourceRange;
};
type SurfaceDecodeOutput = {
    readonly records: readonly SurfaceRecordDraft[];
    readonly components: readonly SurfaceComponentDraft[];
    readonly fragments: readonly GraphFragment[];
    readonly identities?: readonly AuthorSourceIdentity[];
    readonly exports?: readonly string[];
};
type RawSurfaceInput = {
    readonly sourceName: string;
    readonly sourceId?: string;
    readonly source: string;
    readonly tag: string;
    readonly openingStart: number;
    readonly contentStart: number;
    readonly attributes: Readonly<Record<string, MarkupAttributeValue>>;
    readonly resolveAsset: (request: AuthorSourceAssetRequest) => Awaitable<ResolvedAuthorSourceAsset>;
};
type RawSurfaceOutput = SurfaceDecodeOutput & {
    readonly nextOffset: number;
};
type StructuredSurfaceInput = {
    readonly sourceName: string;
    readonly sourceId?: string;
    readonly element: StructuredElement;
    readonly resolveReference: (path: string) => SurfaceResolvedReference | undefined;
    readonly resolveAsset: (request: AuthorSourceAssetRequest) => Awaitable<ResolvedAuthorSourceAsset>;
};
type SurfaceResolvedReference = {
    readonly path: string;
    readonly ref: AuthorValueRef;
    readonly type: TypeRef;
    readonly record?: TypedRecord;
};
type RawSurfaceHandler = (input: RawSurfaceInput) => Awaitable<RawSurfaceOutput>;
type StructuredSurfaceHandler = (input: StructuredSurfaceInput) => Awaitable<SurfaceDecodeOutput>;
type SurfaceAttributeKind = "identifier" | "literal" | "reference" | "expression";
type SurfaceRecipePropertyVocabulary = {
    readonly name: string;
    readonly required: boolean;
    readonly summary: string;
    readonly schema?: ValueSchema;
    readonly values?: readonly string[];
    readonly fallback?: CanonicalValue;
};
type SurfaceAttributeVocabulary = {
    readonly name: string;
    readonly kind: SurfaceAttributeKind;
    readonly required: boolean;
    readonly summary: string;
    readonly values?: readonly string[];
    readonly accepts?: readonly TypeRef[];
    readonly recipe?: readonly SurfaceRecipePropertyVocabulary[];
};
type SurfaceChildVocabulary = {
    readonly tag: string;
    readonly cardinality: "one" | "optional" | "many";
    readonly summary: string;
    readonly attributes?: readonly SurfaceAttributeVocabulary[];
    readonly children?: readonly SurfaceChildVocabulary[];
    readonly text?: string;
};
type SurfacePortVocabulary = {
    readonly name: string;
    readonly type: TypeRef;
    readonly summary: string;
};
type SurfacePreview = {
    readonly mediaType: string;
    readonly path: string;
    readonly open: () => Promise<Uint8Array>;
};
type SurfaceVocabulary = {
    readonly summary: string;
    readonly appearance?: string;
    readonly preview?: SurfacePreview;
    readonly attributes: readonly SurfaceAttributeVocabulary[];
    readonly children?: readonly SurfaceChildVocabulary[];
    readonly ports?: readonly SurfacePortVocabulary[];
    readonly text?: string;
    readonly example: string;
    readonly notes?: readonly string[];
};
type MarkupSurfaceDeclarationBase = {
    readonly name: string;
    readonly tag: string;
    readonly outputs: readonly TypeRef[];
    readonly vocabulary?: SurfaceVocabulary;
};
type RawSurfaceDeclaration = MarkupSurfaceDeclarationBase & {
    readonly mode: "raw";
};
type StructuredSurfaceDeclaration = MarkupSurfaceDeclarationBase & {
    readonly mode: "structured";
};
type MarkupSurfaceDeclaration = RawSurfaceDeclaration | StructuredSurfaceDeclaration;
type RegisteredSurfaceBase = {
    readonly module: ModuleRef;
    readonly surface: string;
    readonly tag: string;
    readonly outputs: readonly TypeRef[];
    readonly vocabulary?: SurfaceVocabulary;
};
type RegisteredRawSurface = RegisteredSurfaceBase & {
    readonly mode: "raw";
    readonly handler: RawSurfaceHandler;
};
type RegisteredStructuredSurface = RegisteredSurfaceBase & {
    readonly mode: "structured";
    readonly handler: StructuredSurfaceHandler;
};
type RegisteredSurface = RegisteredRawSurface | RegisteredStructuredSurface;
type MarkupDecodeContext = {
    readonly closure: ResolvedModuleClosure;
    readonly registry: MarkupSurfaceRegistryLike;
    readonly resolveModule: (request: MarkupImportRequest) => ModuleRef;
    readonly sourceImports?: readonly ResolvedAuthorSourceImport[];
    readonly resolveAsset?: (request: AuthorSourceAssetRequest) => Awaitable<ResolvedAuthorSourceAsset>;
};
type MarkupDecodeResult = {
    readonly records: readonly TypedRecord[];
    readonly components: readonly AuthorComponent[];
    readonly fragments: readonly GraphFragment[];
    readonly exports: readonly AuthorSourceExport[];
    readonly identities: readonly AuthorSourceIdentity[];
    readonly provenance: readonly AuthorElementProvenanceDraft[];
};
type MarkupAuthorFrontendOptions = {
    readonly registry: MarkupSurfaceRegistryLike;
    readonly resolveModule: (request: MarkupImportRequest) => ModuleRef;
};
type MarkupAuthorFrontend = AuthorFrontend;
interface MarkupSurfaceRegistryLike {
    resolve(module: ModuleRef, surface: string): RegisteredSurface | undefined;
    surfaces(module: ModuleRef): readonly RegisteredSurface[];
}
declare function assertAttributes(element: StructuredElement, allowed: readonly string[], required?: readonly string[]): void;
declare function assertExactAttributes(element: StructuredElement, names: readonly string[]): void;
declare function assertEmptyElement(element: StructuredElement): void;
declare function localName(name: string): string;
declare function textAttribute(element: StructuredElement, name: string, fallback?: string): string;
declare function optionalTextAttribute(element: StructuredElement, name: string): string | undefined;
declare const markupAuthorFrontendId = "@clipkin/markup@1";
declare function decodeMarkup(source: MarkupSource, context: MarkupDecodeContext): Promise<MarkupDecodeResult>;
declare function createMarkupAuthorFrontend(options: MarkupAuthorFrontendOptions): MarkupAuthorFrontend;
declare class MarkupSurfaceRegistry implements MarkupSurfaceRegistryLike {
    #private;
    register(value: RegisteredSurface): void;
    registerRaw(options: {
        readonly module: ModuleRef;
        readonly declaration: RawSurfaceDeclaration;
        readonly handler: RawSurfaceHandler;
    }): void;
    registerStructured(options: {
        readonly module: ModuleRef;
        readonly declaration: StructuredSurfaceDeclaration;
        readonly handler: StructuredSurfaceHandler;
    }): void;
    resolve(module: ModuleRef, surface: string): RegisteredSurface | undefined;
    surfaces(module: ModuleRef): readonly RegisteredSurface[];
}
declare const markupSurfaceFacetAbi = "clipkin.markup-surface@1";
type RawMarkupSurfaceFacetOptions = {
    readonly module: ModuleRef;
    readonly surface: string;
    readonly tag: string;
    readonly outputs: readonly TypeRef[];
    readonly vocabulary?: SurfaceVocabulary;
    readonly mode: "raw";
    readonly handler: RawSurfaceHandler;
} | {
    readonly module: ModuleRef;
    readonly declaration: RawSurfaceDeclaration;
    readonly handler: RawSurfaceHandler;
};
type StructuredMarkupSurfaceFacetOptions = {
    readonly module: ModuleRef;
    readonly surface: string;
    readonly tag: string;
    readonly outputs: readonly TypeRef[];
    readonly vocabulary?: SurfaceVocabulary;
    readonly mode: "structured";
    readonly handler: StructuredSurfaceHandler;
} | {
    readonly module: ModuleRef;
    readonly declaration: StructuredSurfaceDeclaration;
    readonly handler: StructuredSurfaceHandler;
};
type MarkupSurfaceFacetOptions = RawMarkupSurfaceFacetOptions | StructuredMarkupSurfaceFacetOptions;
type MutableMarkupSurfaceRegistry = MarkupSurfaceRegistryLike & {
    register(value: RegisteredSurface): void;
};
declare function createMarkupSurfaceFacet(options: RawMarkupSurfaceFacetOptions): Facet;
declare function createMarkupSurfaceFacet(options: StructuredMarkupSurfaceFacetOptions): Facet;
declare function installMarkupSurfaceFacets(facets: readonly Facet[], registry: MutableMarkupSurfaceRegistry): void;
type OpeningTag = {
    readonly name: string;
    readonly attributes: Readonly<Record<string, MarkupAttributeValue>>;
    readonly attributeValueRanges: Readonly<Record<string, SourceRange>>;
    readonly start: number;
    readonly end: number;
    readonly selfClosing: boolean;
};
declare function parseOpeningTag(source: MarkupSource, start: number): OpeningTag;
declare function parseStructuredElement(source: MarkupSource, start: number): {
    readonly element: StructuredElement;
    readonly nextOffset: number;
};
declare function discoverMarkup(source: MarkupSource): MarkupDiscovery;
declare function closeDocument(source: MarkupSource, start: number): number;
declare function skipTextTrivia(source: MarkupSource, start: number): number;
export { MarkupFrontendError, MarkupSurfaceRegistry, assertAttributes, assertEmptyElement, assertExactAttributes, closeDocument, createMarkupAuthorFrontend, createMarkupSurfaceFacet, decodeMarkup, discoverMarkup, installMarkupSurfaceFacets, localName, markupAuthorFrontendId, markupSurfaceFacetAbi, optionalTextAttribute, parseOpeningTag, parseStructuredElement, skipTextTrivia, textAttribute };
export type { MarkupAttributeValue, MarkupAuthorFrontend, MarkupAuthorFrontendOptions, MarkupDecodeContext, MarkupDecodeResult, MarkupDiscovery, MarkupImportRequest, MarkupReference, MarkupSource, MarkupSurfaceDeclaration, MarkupSurfaceFacetOptions, MarkupSurfaceRegistryLike, RawSurfaceDeclaration, RawSurfaceHandler, RawSurfaceInput, RawSurfaceOutput, RegisteredRawSurface, RegisteredStructuredSurface, RegisteredSurface, StructuredElement, StructuredNode, StructuredSurfaceDeclaration, StructuredSurfaceHandler, StructuredSurfaceInput, StructuredText, SurfaceAttributeKind, SurfaceAttributeVocabulary, SurfaceChildVocabulary, SurfaceComponentDraft, SurfaceDecodeOutput, SurfacePortVocabulary, SurfacePreview, SurfaceRecipePropertyVocabulary, SurfaceRecordDraft, SurfaceResolvedReference, SurfaceVocabulary };
