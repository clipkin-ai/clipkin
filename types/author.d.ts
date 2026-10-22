type ResourceId = `res_${string}`;
type RecordId = string;
type LogicalOutputId = string;
type CandidateId = string;
type OperationId = string;
type NeedId = string;
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
type RecordRef = {
    readonly kind: "record";
    readonly id: RecordId;
};
type LogicalOutputRef = {
    readonly kind: "logical-output";
    readonly id: LogicalOutputId;
};
type OperationResultRef = {
    readonly kind: "operation-result";
    readonly operation: OperationId;
};
type GraphValueRef = RecordRef | LogicalOutputRef | OperationResultRef;
type LogicalOutput = {
    readonly id: LogicalOutputId;
    readonly type: TypeRef;
    readonly primary: CandidateId;
};
type OperationResult = {
    readonly kind: "output";
    readonly name: string;
    readonly record: RecordId;
} | {
    readonly kind: "need";
    readonly name: string;
    readonly id: NeedId;
    readonly record: RecordId;
};
type OperationNode = {
    readonly id: OperationId;
    readonly producer: ProducerRef;
    readonly inputs: Readonly<Record<string, GraphValueRef>>;
    readonly result: OperationResult;
};
type ProvidedValue = {
    readonly id: RecordId;
    readonly value: StoredValue;
};
type CandidateRoot = {
    readonly kind: "value";
    readonly value: ProvidedValue;
} | {
    readonly kind: "operation";
    readonly result: OperationResultRef;
};
type Candidate = {
    readonly id: CandidateId;
    readonly type: TypeRef;
    readonly root: CandidateRoot;
};
type CompiledGraph = {
    readonly format: "clipkin.graph@1";
    readonly outputs: readonly LogicalOutput[];
    readonly candidates: readonly Candidate[];
    readonly operations: readonly OperationNode[];
};
type Satisfaction = {
    readonly output: LogicalOutputId;
    readonly candidate: CandidateId;
};
type LinkedProgram = {
    readonly closure: ResolvedModuleClosure;
    readonly records: readonly TypedRecord[];
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
type FragmentInstanceRequest = {
    readonly id: string;
    readonly fragment: string;
    readonly inputs: Readonly<Record<string, GraphValueRef>>;
};
type ElaboratedFragmentExport = {
    readonly name: string;
    readonly type: TypeRef;
    readonly root: CandidateRoot;
};
type ElaboratedFragment = {
    readonly format: "clipkin.fragment-instance@1";
    readonly id: string;
    readonly fragment: string;
    readonly instance: string;
    readonly inputs: Readonly<Record<string, GraphValueRef>>;
    readonly operations: readonly OperationNode[];
    readonly exports: readonly ElaboratedFragmentExport[];
};
type FragmentContribution = {
    readonly outputs: readonly LogicalOutput[];
    readonly candidates: readonly Candidate[];
    readonly operations: readonly OperationNode[];
    readonly satisfactions?: readonly Satisfaction[];
};
type RunFragmentExport = {
    readonly name: string;
    readonly candidate: string;
    readonly type: TypeRef;
};
type RunFragmentContribution = FragmentContribution & {
    readonly exports: readonly RunFragmentExport[];
};
declare class FragmentError extends Error {
    readonly code: string;
    readonly subject: string | undefined;
    constructor(code: string, message: string, subject?: string);
}
declare function sealGraphFragment(fragment: Omit<GraphFragment, "format" | "id">): GraphFragment;
declare function verifyGraphFragment(program: LinkedProgram, fragment: GraphFragment): void;
declare function elaborateGraphFragment(program: LinkedProgram, fragment: GraphFragment, request: FragmentInstanceRequest): ElaboratedFragment;
declare function exportRunFragment(instance: ElaboratedFragment, names?: readonly string[]): RunFragmentContribution;
declare function bindAuthorFragment(instance: ElaboratedFragment, outputs: Readonly<Record<string, string>>): FragmentContribution;
declare function mergeFragmentContributions(graph: Pick<CompiledGraph, "outputs" | "candidates" | "operations">, ...contributions: readonly FragmentContribution[]): Pick<CompiledGraph, "outputs" | "candidates" | "operations">;
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
type AuthorOutputBinding = {
    readonly component: string;
    readonly output: string;
    readonly id: string;
    readonly type: TypeRef;
};
type GraphFragmentResolver = (id: string) => GraphFragment | undefined;
declare class AuthorGraphError extends Error {
    readonly code: string;
    readonly subject: string | undefined;
    constructor(code: string, message: string, subject?: string);
}
declare function elaborateAuthorGraph(program: LinkedProgram, components: readonly AuthorComponent[], resolveFragment: GraphFragmentResolver): CompiledGraph;
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
type Awaitable$1<T> = T | Promise<T>;
type SourceResolver = (importer: SourceUnit, request: SourceImportRequest) => Awaitable$1<ResolvedSource>;
type SourceAssetResolver = (importer: SourceUnit, request: SourceAssetRequest) => Awaitable$1<ResolvedSourceAsset>;
declare const sourceFrontendPackageAbi = "clipkin.source-frontend@1";
type AuthorSourceUnit = SourceUnit;
type AuthorFrontendSourceUnit = AuthorSourceUnit;
type AuthorSourceImport = SourceImportRequest;
type AuthorSourceDiscovery = {
    readonly modules: readonly string[];
    readonly sources: readonly AuthorSourceImport[];
};
type AuthorSourceAssetRequest = SourceAssetRequest;
type ResolvedAuthorSourceAsset = ResolvedSourceAsset;
type AuthorSourceResolver = SourceResolver;
type AuthorSourceAssetResolver = SourceAssetResolver;
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
interface AuthorFrontendRegistryLike {
    resolve(id: string): AuthorFrontend | undefined;
}
declare class AuthorFrontendError extends Error {
    readonly code: string;
    readonly subject: string | undefined;
    constructor(code: string, message: string, subject?: string);
}
declare class AuthorFrontendRegistry implements AuthorFrontendRegistryLike {
    #private;
    register(frontend: AuthorFrontend): void;
    resolve(id: string): AuthorFrontend | undefined;
}
type AuthorRecordAdmitter = (closure: ResolvedModuleClosure, record: TypedRecord) => Awaitable<void>;
type SourceClosureUnit = {
    readonly id: string;
    readonly name: string;
    readonly frontend: string;
    readonly imports: readonly {
        readonly alias: string;
        readonly source: string;
    }[];
};
type AuthorInputProvenance = {
    readonly id: string;
    readonly name: string;
    readonly range: SourceRange;
    readonly kind: "literal" | "reference";
    readonly ref?: AuthorValueRef;
};
type AuthorElementProvenance = {
    readonly id: string;
    readonly source: string;
    readonly sourceName: string;
    readonly frontend: string;
    readonly range: SourceRange;
    readonly records: readonly {
        readonly local: string;
        readonly id: string;
    }[];
    readonly components: readonly {
        readonly local: string;
        readonly id: string;
    }[];
    readonly outputs: readonly {
        readonly component: string;
        readonly name: string;
        readonly local: string;
        readonly id: string;
    }[];
    readonly inputs: readonly AuthorInputProvenance[];
};
type AuthorProvenance = {
    readonly format: "clipkin.author-provenance@1";
    readonly elements: readonly AuthorElementProvenance[];
};
type SourceClosure = {
    readonly entry: string;
    readonly units: readonly SourceClosureUnit[];
};
type CompiledSourceExport = {
    readonly name: string;
    readonly type: TypeRef;
    readonly ref: GraphValueRef;
};
type CompiledSourceClosure = {
    readonly closure: SourceClosure;
    readonly program: LinkedProgram;
    readonly graph: CompiledGraph;
    readonly exports: readonly CompiledSourceExport[];
    readonly provenance: AuthorProvenance;
};
declare function resolveCompiledSourceExport(compiled: CompiledSourceClosure, name: string, expected?: TypeRef): CompiledSourceExport;
type Facet = {
    readonly abi: string;
    readonly offers?: readonly string[];
    readonly implementation: unknown;
};
type FrontendImplementation = {
    readonly id: string;
};
type FrontendFacet<Kind extends string, Frontend extends FrontendImplementation> = Facet & {
    readonly offers: readonly [
        string
    ];
    readonly implementation: {
        readonly kind: Kind;
        readonly frontend: Frontend;
    };
};
type AuthorFrontendFacet = FrontendFacet<"author", AuthorFrontend> & {
    readonly abi: typeof sourceFrontendPackageAbi;
};
declare function createAuthorFrontendFacet(frontend: AuthorFrontend): AuthorFrontendFacet;
declare function authorFrontendsFromFacets(facets: readonly Facet[]): readonly AuthorFrontend[];
declare function installAuthorFrontendFacets(facets: readonly Facet[], registry: {
    register(frontend: AuthorFrontend): void;
}): void;
export { AuthorFrontendError, AuthorFrontendRegistry, AuthorGraphError, FragmentError, authorFrontendsFromFacets, bindAuthorFragment, createAuthorFrontendFacet, elaborateAuthorGraph, elaborateGraphFragment, exportRunFragment, installAuthorFrontendFacets, mergeFragmentContributions, resolveCompiledSourceExport, sealGraphFragment, verifyGraphFragment };
export type { AuthorComponent, AuthorComponentOutputRef, AuthorElementProvenance, AuthorElementProvenanceDraft, AuthorFrontend, AuthorFrontendFacet, AuthorFrontendRegistryLike, AuthorFrontendSourceUnit, AuthorInputProvenance, AuthorInputProvenanceDraft, AuthorOutputBinding, AuthorProvenance, AuthorRecordAdmitter, AuthorRecordRef, AuthorSourceAssetRequest, AuthorSourceAssetResolver, AuthorSourceDecodeContext, AuthorSourceDiscovery, AuthorSourceExport, AuthorSourceIdentity, AuthorSourceImport, AuthorSourceResolver, AuthorSourceUnit, AuthorValueRef, Awaitable, CompiledSourceClosure, CompiledSourceExport, DecodedAuthorSource, ElaboratedFragment, ElaboratedFragmentExport, FragmentContribution, FragmentExport, FragmentInputRef, FragmentInstanceRequest, FragmentOperation, FragmentOperationRef, FragmentOperationResult, FragmentValueRef, GraphFragment, GraphFragmentResolver, ResolvedAuthorSourceAsset, ResolvedAuthorSourceImport, RunFragmentContribution, RunFragmentExport, SourceClosure, SourceClosureUnit };
