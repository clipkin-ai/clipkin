declare class CompilerError extends Error {
    readonly code: string;
    readonly subject: string | undefined;
    constructor(code: string, message: string, subject?: string);
}
type ResourceId = `res_${string}`;
type RecordId = string;
type LogicalOutputId = string;
type CandidateId = string;
type OperationId = string;
type NeedId = string;
type StepId = string;
type CommandId = string;
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
type Need = {
    readonly id: NeedId;
    readonly capability: CapabilityRef;
    readonly returns: TypeRef;
    readonly constraints: CanonicalValue;
    readonly result: RecordId;
};
type NeedBinding = {
    readonly id: NeedId;
    readonly result: RecordId;
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
type BuildTarget = {
    readonly output: LogicalOutputId;
};
type Satisfaction = {
    readonly output: LogicalOutputId;
    readonly candidate: CandidateId;
};
type BuildOutputBinding = {
    readonly output: LogicalOutputId;
    readonly record: RecordId;
    readonly type: TypeRef;
};
type ProducerStep = {
    readonly id: StepId;
    readonly producer: ProducerRef;
    readonly inputs: Readonly<Record<string, RecordId>>;
    readonly outputs: Readonly<Record<string, RecordId>>;
    readonly needs: Readonly<Record<string, NeedBinding>>;
};
type BuildGoal = {
    readonly record: RecordId;
    readonly type: TypeRef;
};
type BuildPlan = {
    readonly format: "clipkin.plan@1";
    readonly steps: readonly ProducerStep[];
    readonly goals: readonly BuildGoal[];
    readonly outputBindings: readonly BuildOutputBinding[];
};
type RunGraph = {
    readonly format: "clipkin.run-graph@1";
    readonly records: readonly TypedRecord[];
    readonly candidates: readonly Candidate[];
    readonly operations: readonly OperationNode[];
    readonly satisfactions: readonly Satisfaction[];
    readonly targets: readonly BuildTarget[];
};
type LinkedProgram = {
    readonly closure: ResolvedModuleClosure;
    readonly records: readonly TypedRecord[];
};
type StepState = {
    readonly id: StepId;
    readonly status: "pending" | "complete";
};
type InvokeProducerCommand = {
    readonly kind: "invoke-producer";
    readonly id: CommandId;
    readonly step: StepId;
    readonly producer: ProducerRef;
    readonly inputs: Readonly<Record<string, RecordId>>;
};
type FulfillNeedCommand = {
    readonly kind: "fulfill-need";
    readonly id: CommandId;
    readonly need: Need;
};
type BuildCommand = InvokeProducerCommand | FulfillNeedCommand;
type BuildDiagnostic = {
    readonly code: string;
    readonly message: string;
    readonly subject?: string;
};
type BuildDefinition = {
    readonly format: "clipkin.build-definition@1";
    readonly program: LinkedProgram;
    readonly initialRecords: readonly TypedRecord[];
    readonly plan: BuildPlan;
    readonly targets: readonly BuildTarget[];
};
type BuildState = {
    readonly format: "clipkin.build@1";
    readonly program: LinkedProgram;
    readonly plan: BuildPlan;
    readonly targets: readonly BuildTarget[];
    readonly status: "active" | "complete" | "failed";
    readonly records: readonly TypedRecord[];
    readonly steps: readonly StepState[];
    readonly needs: readonly Need[];
    readonly outstanding: readonly BuildCommand[];
    readonly diagnostics: readonly BuildDiagnostic[];
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
type Awaitable$2<T> = T | Promise<T>;
type SourceResolver = (importer: SourceUnit, request: SourceImportRequest) => Awaitable$2<ResolvedSource>;
type SourceAssetResolver = (importer: SourceUnit, request: SourceAssetRequest) => Awaitable$2<ResolvedSourceAsset>;
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
type Awaitable$1<T> = T | Promise<T>;
type AuthorSourceDecodeContext = {
    readonly closure: ResolvedModuleClosure;
    readonly imports: readonly ResolvedAuthorSourceImport[];
    readonly resolveAsset: (request: AuthorSourceAssetRequest) => Awaitable$1<ResolvedAuthorSourceAsset>;
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
    discover(source: AuthorFrontendSourceUnit): Awaitable$1<AuthorSourceDiscovery>;
    decode(source: AuthorFrontendSourceUnit, context: AuthorSourceDecodeContext): Awaitable$1<DecodedAuthorSource>;
};
interface AuthorFrontendRegistryLike {
    resolve(id: string): AuthorFrontend | undefined;
}
type AuthorRecordAdmitter = (closure: ResolvedModuleClosure, record: TypedRecord) => Awaitable$1<void>;
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
type Awaitable<T> = T | Promise<T>;
type CompileSourceClosureRequest = {
    readonly entry: ResolvedSource;
    readonly closure: ResolvedModuleClosure;
    readonly frontends: AuthorFrontendRegistryLike;
    readonly discover?: (source: AuthorFrontendSourceUnit, frontend: AuthorFrontend) => Awaitable<AuthorSourceDiscovery>;
    readonly resolveSource: SourceResolver;
    readonly resolveAsset?: SourceAssetResolver;
    readonly admitRecord?: AuthorRecordAdmitter;
};
declare class SourceClosureError extends Error {
    readonly code: string;
    readonly subject: string | undefined;
    constructor(code: string, message: string, subject?: string);
}
declare function compileSourceClosure(request: CompileSourceClosureRequest): Promise<CompiledSourceClosure>;
type RegisteredModulePackage = {
    readonly manifest: ModuleManifest;
    readonly specifiers?: readonly string[];
};
interface ModulePackageRegistryLike {
    resolve(request: string): ModuleRef | undefined;
    createClosure(requests: readonly string[]): ResolvedModuleClosure;
}
declare class ModulePackageRegistry implements ModulePackageRegistryLike {
    #private;
    register(value: RegisteredModulePackage): void;
    resolve(request: string): ModuleRef | undefined;
    createClosure(requests: readonly string[]): ResolvedModuleClosure;
}
type BlobAttachment = {
    readonly artifact: BlobRef;
    readonly location?: string;
    open(): Awaitable$2<AsyncIterable<Uint8Array>>;
};
interface WorkspaceSession {
    readonly entry: ResolvedSource;
    readonly resolveSource: SourceResolver;
    readonly resolveAsset: SourceAssetResolver;
    attachments(): Awaitable$2<readonly BlobAttachment[]>;
}
interface Workspace {
    open(entryLocator: string): Awaitable$2<WorkspaceSession>;
}
type TypeValidatorContext = {
    readonly type: TypeRef;
    readonly value: StoredValue;
};
type TypeValidatorHandler = (context: TypeValidatorContext) => void | Promise<void>;
type TypeValidatorRegistration = {
    readonly handler: TypeValidatorHandler;
};
interface TypeValidatorRegistryLike {
    resolve(type: TypeRef): TypeValidatorRegistration | undefined;
}
type CompilerOptions = {
    readonly modules: ModulePackageRegistryLike;
    readonly frontends: AuthorFrontendRegistryLike;
    readonly workspace: Workspace;
    readonly validators?: TypeValidatorRegistryLike;
};
type CompiledAuthorSource = CompiledSourceClosure & {
    readonly attachments: readonly BlobAttachment[];
};
declare class Compiler {
    #private;
    constructor(options: CompilerOptions);
    supportsFrontend(id: string): boolean;
    openEntry(locator: string): Promise<WorkspaceSession>;
    compileEntry(locator: string): Promise<CompiledAuthorSource>;
    compileResolvedSource(entry: ResolvedSource, workspace: WorkspaceSession): Promise<CompiledAuthorSource>;
    extendExecutionProgram(program: LinkedProgram, requests: readonly string[]): LinkedProgram;
    admitRecord(program: LinkedProgram, record: TypedRecord): Promise<void>;
}
type BuildCandidateSelection = {
    readonly output: string;
    readonly candidate: string;
    readonly record: string;
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
interface RunFrontendRegistryLike {
    resolve(id: string): RunFrontend | undefined;
}
interface RunFragmentRegistryLike {
    resolve(packageName: string, fragmentName: string): GraphFragment | undefined;
}
type RunCandidateSource = {
    readonly kind: "stored-value";
    readonly from: string;
} | {
    readonly kind: "file";
    readonly from: string;
    readonly mediaType: string;
} | {
    readonly kind: "build-output";
    readonly build: string;
    readonly output: string;
};
type RunCompilation = {
    readonly document: RunDocument;
    readonly graph: RunGraph;
    readonly candidates: Readonly<Record<string, string>>;
    readonly candidateSources: Readonly<Record<string, RunCandidateSource>>;
    readonly satisfactionNames: Readonly<Record<string, string>>;
};
type RunCompilerOptions = {
    readonly authorCompiler: Compiler;
    readonly frontends: RunFrontendRegistryLike;
    readonly fragments: RunFragmentRegistryLike;
    readonly locateHistoricalOutput?: (build: string, output: string) => Promise<{
        readonly build: string;
        readonly output: string;
        readonly type: TypeRef;
    } | undefined> | {
        readonly build: string;
        readonly output: string;
        readonly type: TypeRef;
    } | undefined;
    readonly resolveHistoricalOutput?: (build: string, output: string) => Promise<{
        readonly type: TypeRef;
        readonly value: StoredValue;
        readonly attachments?: readonly BlobAttachment[];
    } | undefined> | {
        readonly type: TypeRef;
        readonly value: StoredValue;
        readonly attachments?: readonly BlobAttachment[];
    } | undefined;
};
type CompiledRun = {
    readonly source: string;
    readonly authorSource: string;
    readonly author: CompiledAuthorSource;
    readonly program: LinkedProgram;
    readonly run: RunCompilation;
    readonly historicalOutputs: Readonly<Record<string, {
        readonly build: string;
        readonly output: string;
        readonly type: TypeRef;
    }>>;
    readonly attachments: readonly BlobAttachment[];
};
type CheckedRun = {
    readonly source: string;
    readonly authorSource: string;
    readonly author: CompiledAuthorSource;
    readonly program: LinkedProgram;
    readonly document: RunCompilation["document"];
    readonly unresolvedHistoricalOutputs: readonly {
        readonly id: string;
        readonly build: string;
        readonly output: string;
    }[];
    readonly attachments: readonly BlobAttachment[];
};
type PlannedBuild = {
    readonly compilation: CompiledRun;
    readonly selections: readonly BuildCandidateSelection[];
    readonly resultForwards: readonly {
        readonly output: string;
        readonly build: string;
        readonly sourceOutput: string;
        readonly type: TypeRef;
    }[];
    readonly definition: BuildDefinition;
    readonly state: BuildState;
};
declare class RunCompiler {
    #private;
    constructor(options: RunCompilerOptions);
    supportsFrontend(id: string): boolean;
    compileEntry(locator: string): Promise<CompiledRun>;
    checkResolvedSource(source: ResolvedSource, workspace: WorkspaceSession): Promise<CheckedRun>;
    compileResolvedSource(source: ResolvedSource, workspace: WorkspaceSession): Promise<CompiledRun>;
    planCompilation(compilation: CompiledRun): PlannedBuild;
    planEntry(locator: string): Promise<PlannedBuild>;
}
declare function findLogicalOutput(graph: CompiledGraph, outputId: string): LogicalOutput | undefined;
declare function findCandidate(graph: CompiledGraph, candidateId: string): Candidate | undefined;
declare function findOperation(graph: CompiledGraph, operationId: string): OperationNode | undefined;
declare function findOperationsByProducer(graph: CompiledGraph, producer: ProducerRef): readonly OperationNode[];
declare function walkOperationInputs(graph: CompiledGraph, operationId: string): readonly OperationNode[];
export { Compiler, CompilerError, ModulePackageRegistry, RunCompiler, SourceClosureError, compileSourceClosure, findCandidate, findLogicalOutput, findOperation, findOperationsByProducer, walkOperationInputs };
export type { CheckedRun, CompileSourceClosureRequest, CompiledAuthorSource, CompiledRun, CompilerOptions, ModulePackageRegistryLike, PlannedBuild, RegisteredModulePackage, RunCompilerOptions };
