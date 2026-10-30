type Facet = {
    readonly abi: string;
    readonly offers?: readonly string[];
    readonly implementation: unknown;
};
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
type ProducerCompletedEvent = {
    readonly kind: "producer-completed";
    readonly command: CommandId;
    readonly outputs: Readonly<Record<string, StoredValue>>;
    readonly needs: Readonly<Record<string, CanonicalValue>>;
};
type NeedFulfilledEvent = {
    readonly kind: "need-fulfilled";
    readonly command: CommandId;
    readonly value: StoredValue;
};
type CommandFailedEvent = {
    readonly kind: "command-failed";
    readonly command: CommandId;
    readonly code: string;
    readonly message: string;
};
type CommandResult = ProducerCompletedEvent | NeedFulfilledEvent | CommandFailedEvent;
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
type ModuleContribution = {
    readonly manifest: ModuleManifest;
    readonly specifiers?: readonly string[];
};
type LogicalPackageAddress = {
    readonly abi: string;
    readonly name: string;
};
type PackageContribution = {
    readonly format: "clipkin.package@1";
    readonly modules?: readonly ModuleContribution[];
    readonly facets?: readonly Facet[];
};
type LoadedPackage = {
    readonly specifier: string;
    readonly contribution: PackageContribution;
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
type Awaitable$3<T> = T | Promise<T>;
type SourceResolver = (importer: SourceUnit, request: SourceImportRequest) => Awaitable$3<ResolvedSource>;
type SourceAssetResolver = (importer: SourceUnit, request: SourceAssetRequest) => Awaitable$3<ResolvedSourceAsset>;
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
type Awaitable$2<T> = T | Promise<T>;
type AuthorSourceDecodeContext = {
    readonly closure: ResolvedModuleClosure;
    readonly imports: readonly ResolvedAuthorSourceImport[];
    readonly resolveAsset: (request: AuthorSourceAssetRequest) => Awaitable$2<ResolvedAuthorSourceAsset>;
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
    discover(source: AuthorFrontendSourceUnit): Awaitable$2<AuthorSourceDiscovery>;
    decode(source: AuthorFrontendSourceUnit, context: AuthorSourceDecodeContext): Awaitable$2<DecodedAuthorSource>;
};
interface AuthorFrontendRegistryLike {
    resolve(id: string): AuthorFrontend | undefined;
}
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
interface ModulePackageRegistryLike {
    resolve(request: string): ModuleRef | undefined;
    createClosure(requests: readonly string[]): ResolvedModuleClosure;
}
type BlobAttachment = {
    readonly artifact: BlobRef;
    readonly location?: string;
    open(): Awaitable$3<AsyncIterable<Uint8Array>>;
};
interface WorkspaceSession {
    readonly entry: ResolvedSource;
    readonly resolveSource: SourceResolver;
    readonly resolveAsset: SourceAssetResolver;
    attachments(): Awaitable$3<readonly BlobAttachment[]>;
}
interface Workspace {
    open(entryLocator: string): Awaitable$3<WorkspaceSession>;
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
type BuildResultOutcome = "complete" | "failed" | "cancelled";
type BuildResultFileRef = {
    readonly size: number;
    readonly mediaType: string;
} & ({
    readonly kind: "build-file";
    readonly build?: string;
    readonly path: string;
} | {
    readonly kind: "external-file";
    readonly uri: string;
});
type BuildResultFileRange = {
    readonly start: number;
    readonly endExclusive: number;
};
type HistoricalBuildOutputRef = {
    readonly kind: "build-output";
    readonly build: string;
    readonly output: string;
};
type BuildResultValuePath = readonly (string | number)[];
type BuildResultResourceBinding = {
    readonly at: BuildResultValuePath;
    readonly file: BuildResultFileRef;
};
type BuildResultValueDocument = {
    readonly format: "clipkin.result-value@1";
    readonly value: CanonicalValue;
    readonly resources: readonly BuildResultResourceBinding[];
};
type BuildResultOutputValue = BuildResultFileRef | HistoricalBuildOutputRef | {
    readonly kind: "inline";
    readonly value: null | boolean | number | string;
} | {
    readonly kind: "value";
    readonly path: string;
};
type BuildResultOutput = {
    readonly displayName?: string;
    readonly type: TypeRef;
    readonly value: BuildResultOutputValue;
};
type BuildResultOperation = {
    readonly operation: string;
    readonly need?: {
        readonly id: string;
        readonly capability: TypeRef;
    };
    readonly createdAt?: number;
    readonly acknowledgedAt?: number;
    readonly endedAt?: number;
    readonly progress?: {
        readonly phase: string;
        readonly completed?: number;
        readonly total?: number;
        readonly unit?: string;
    };
    readonly cancellation?: {
        readonly outcome: "confirmed" | "accepted" | "unsupported" | "too-late" | "failed";
        readonly message?: string;
    };
    readonly command: string;
    readonly endpoint: string;
    readonly pool?: string;
    readonly credentials?: Readonly<Record<string, {
        readonly store: string;
        readonly key: string;
    }>>;
    readonly receipt?: {
        readonly id: string;
        readonly url?: string;
    };
    readonly status: "pending" | "completed" | "failed" | "cancelled";
    readonly failure?: {
        readonly code: string;
        readonly message: string;
    };
};
type BuildResultManifest = {
    readonly format: "clipkin.build-result@1";
    readonly id: string;
    readonly title?: string;
    readonly note?: string;
    readonly highlightedOutputs?: readonly string[];
    readonly source: {
        readonly id: string;
    };
    readonly run?: {
        readonly id: string;
    };
    readonly targets: readonly string[];
    readonly finishedAt?: number;
    readonly outcome?: BuildResultOutcome;
    readonly failure?: string;
    readonly outputs: Readonly<Record<string, BuildResultOutput>>;
    readonly operations?: readonly BuildResultOperation[];
    readonly executionLog?: BuildResultFileRef;
};
type FinishedBuildResultManifest = BuildResultManifest & {
    readonly outcome: BuildResultOutcome;
    readonly finishedAt: number;
};
type BuildResultPublishedOutput = {
    readonly displayName?: string;
    readonly name: string;
    readonly output: string;
};
type BuildResultForward = {
    readonly output: string;
    readonly build: string;
    readonly sourceOutput: string;
    readonly type?: TypeRef;
};
type BuildResultSeed = {
    readonly id: string;
    readonly title?: string;
    readonly source: {
        readonly id: string;
    };
    readonly run?: {
        readonly id: string;
    };
    readonly targets: readonly string[];
    readonly publishedOutputs: readonly BuildResultPublishedOutput[];
    readonly forwards?: readonly BuildResultForward[];
    readonly resourceReferences?: Readonly<Record<string, BuildResultFileRef>>;
};
type BuildResultResourceSource = {
    open(artifact: BlobRef): Promise<AsyncIterable<Uint8Array> | undefined>;
};
type BuildResultSync = {
    readonly state: BuildState;
    readonly resources: BuildResultResourceSource;
};
type BuildResultFinish = {
    readonly executionLog?: AsyncIterable<Uint8Array>;
    readonly operations?: readonly BuildResultOperation[];
    readonly outcome: BuildResultOutcome;
    readonly failure?: string;
};
type BuildResultPresentationUpdate = {
    readonly outputDisplayNames?: Readonly<Record<string, string | null>>;
    readonly title?: string | null;
    readonly note?: string | null;
    readonly highlightedOutputs?: readonly string[];
};
type BuildResultBrowseRequest = {
    readonly before?: string;
    readonly limit: number;
};
type BuildResultPage = {
    readonly results: readonly FinishedBuildResultManifest[];
    readonly next?: string;
};
type ResolvedBuildResultOutput = {
    readonly build: string;
    readonly output: string;
    readonly directory: string;
    readonly type: TypeRef;
    readonly value: BuildResultFileRef | {
        readonly kind: "inline";
        readonly value: null | boolean | number | string;
    } | {
        readonly kind: "value";
        readonly path: string;
        readonly document: BuildResultValueDocument;
    };
};
type RepositoryBuildResultOutput = Omit<ResolvedBuildResultOutput, "directory">;
type RepositoryBuildResultOutputDescription = {
    readonly type: TypeRef;
} & ({
    readonly kind: "scalar";
} | {
    readonly kind: "composite";
} | {
    readonly kind: "resource";
    readonly size: number;
    readonly mediaType: string;
});
type BuildResultWriter = {
    read(): Promise<BuildResultManifest>;
    sync(input: BuildResultSync): Promise<BuildResultManifest>;
    finish(input: BuildResultFinish): Promise<BuildResultManifest>;
};
type BuildResultRepository = {
    create(seed: BuildResultSeed): Promise<BuildResultWriter>;
    openWriter(build: string): Promise<BuildResultWriter | undefined>;
    removeIncomplete(build: string): Promise<void>;
    read(build: string): Promise<BuildResultManifest | undefined>;
    updatePresentation(build: string, update: BuildResultPresentationUpdate): Promise<BuildResultManifest>;
    browse(request: BuildResultBrowseRequest): Promise<BuildResultPage>;
    describeOutput(build: string, output: string): Promise<RepositoryBuildResultOutputDescription | undefined>;
    resolve(build: string, output: string): Promise<RepositoryBuildResultOutput | undefined>;
    describeFile(build: string, file: BuildResultFileRef): Promise<BuildResultFileRef>;
    openFile(build: string, file: BuildResultFileRef, range?: BuildResultFileRange): Promise<AsyncIterable<Uint8Array> | undefined>;
};
type CredentialRef = {
    readonly store: string;
    readonly key: string;
};
type CredentialValue = {
    readonly secret: string;
    readonly expiresAt?: number;
};
type CredentialAcquisition = {
    readonly kind: "oauth2-pkce";
    readonly authorizationEndpoint: string;
    readonly redirectUri: string;
    readonly tokenEndpoint: string;
    readonly clientId: string;
    readonly scopes: readonly string[];
    readonly requestTimeoutMs: number;
};
type CredentialStore = {
    resolve(ref: CredentialRef): Promise<CredentialValue | undefined>;
};
type CapacityResourceClaim = {
    readonly id: string;
    readonly limit: number;
    readonly units?: number;
    readonly periodMs?: number;
};
type CapacityReservation = {
    readonly build: string;
    readonly command: string;
    readonly resources: readonly CapacityResourceClaim[];
    readonly createdAt: number;
    readonly lifetime?: "action" | "operation";
};
type OperationReceipt = {
    readonly id: string;
    readonly url?: string;
};
type OperationFacts = {
    readonly createdAt?: number;
    readonly acknowledgedAt?: number;
    readonly endedAt?: number;
    readonly request?: FulfillNeedCommand;
    readonly credentials?: Readonly<Record<string, CredentialRef>>;
    readonly pool?: string;
    readonly receipt?: OperationReceipt;
    readonly remoteEnded?: true;
    readonly submission?: "queued" | "started" | "accepted";
};
type OperationIdentity = {
    readonly id: string;
    readonly build: string;
    readonly command: string;
    readonly endpoint: string;
};
type OperationCompletion = {
    readonly value: StoredValue;
};
type OperationFailure = {
    readonly code: string;
    readonly message: string;
};
type OperationProgress = {
    readonly phase: string;
    readonly completed?: number;
    readonly total?: number;
    readonly unit?: string;
};
type OperationSnapshot = OperationIdentity & OperationFacts & {
    readonly status: OperationUpdate["status"];
    readonly handle?: CanonicalValue;
    readonly wakeAt?: number;
    readonly progress?: OperationProgress;
    readonly completion?: OperationCompletion;
    readonly failure?: OperationFailure;
    readonly cancellation?: {
        readonly outcome: "confirmed" | "accepted" | "unsupported" | "too-late" | "failed";
        readonly message?: string;
    };
};
type OperationUpdate = OperationFacts & ({
    readonly status: "pending";
    readonly completion?: OperationCompletion;
    readonly handle?: CanonicalValue;
    readonly wakeAt?: number;
    readonly progress?: OperationProgress;
} | {
    readonly status: "completed";
    readonly completion: OperationCompletion;
} | {
    readonly status: "failed";
    readonly failure: OperationFailure;
} | {
    readonly status: "cancelled";
    readonly cancellation?: OperationSnapshot["cancellation"];
});
type OperationQuery = {
    readonly build?: string;
    readonly command?: string;
    readonly endpoint?: string;
};
type OperationStore = {
    create(operation: OperationSnapshot): Promise<OperationSnapshot>;
    read(id: string): Promise<OperationSnapshot | undefined>;
    list(query: OperationQuery): Promise<readonly OperationSnapshot[]>;
    update(id: string, update: OperationUpdate): Promise<OperationSnapshot>;
    removeBuild?(build: string): Promise<void>;
};
type ExecutionDiagnostic = {
    readonly level: "info" | "warning" | "error";
    readonly message: string;
    readonly stream?: "stdout" | "stderr";
};
type ExecutionLogEvent = {
    readonly endpoint: string;
} & ({
    readonly kind: "started" | "completed";
} | {
    readonly kind: "failed";
    readonly message: string;
} | {
    readonly kind: "phase";
    readonly phase: string;
} | ({
    readonly kind: "diagnostic";
} & ExecutionDiagnostic));
type ExecutionLogRecord = ExecutionLogEvent & {
    readonly format: "clipkin.execution-log@1";
    readonly time: number;
    readonly command: string;
};
type ExecutionLogView = {
    readonly records: readonly ExecutionLogRecord[];
    readonly total: number;
};
type RuntimeResourceClaim = CapacityResourceClaim;
type RuntimeActionResult<T> = {
    readonly status: "completed";
    readonly value: T;
} | Extract<RuntimeExecutionResult, {
    readonly status: "deferred";
}>;
type RuntimeActionExecutor = {
    run<T>(request: {
        readonly build: string;
        readonly command: string;
        readonly action: string;
        readonly resources: readonly RuntimeResourceClaim[];
    }, execute: () => Promise<T>): Promise<RuntimeActionResult<T>>;
};
type RuntimeExecutionResult = {
    readonly status: "completed";
    readonly event: CommandResult;
} | {
    readonly status: "pending";
    readonly operation: string;
    readonly wakeAt?: number;
} | {
    readonly status: "deferred";
    readonly wakeAt?: number;
    readonly reason: string;
};
type ResourceIOOptions = {
    readonly signal?: AbortSignal;
};
type ResourceStore = {
    put(bytes: Uint8Array, mediaType: string, options?: ResourceIOOptions): Promise<BlobRef>;
    write(resource: BlobRef, bytes: Uint8Array, options?: ResourceIOOptions): Promise<void>;
    get(resource: ResourceId, options?: ResourceIOOptions): Promise<Uint8Array | undefined>;
    has(resource: ResourceId, options?: ResourceIOOptions): Promise<boolean>;
};
type Awaitable$1<T> = T | Promise<T>;
type EndpointFulfillment = {
    readonly value: StoredValue;
};
type EndpointInputSlot = {
    readonly input: string;
    readonly role?: string;
};
type EndpointRequest = {
    readonly capability: Need["capability"];
    readonly returns: Need["returns"];
    readonly constraints: Need["constraints"];
    readonly pendingInputs?: readonly EndpointInputSlot[];
};
type EndpointCredential = CredentialValue & {
    readonly replace?: (value: CredentialValue) => Promise<void>;
};
type EndpointInvocationContext = {
    readonly command: FulfillNeedCommand;
    readonly need: Need;
    readonly resources: ResourceStore;
    readonly credentials: Readonly<Record<string, EndpointCredential>>;
    readonly reportDiagnostic?: (diagnostic: ExecutionDiagnostic) => Promise<void>;
    readonly reportProgress?: (progress: OperationProgress) => Promise<void>;
};
type ImmediateEndpointHandler = (context: EndpointInvocationContext) => Awaitable$1<EndpointFulfillment>;
type EndpointCheckpoint = {
    readonly handle: CanonicalValue;
    readonly receipt?: OperationReceipt;
    readonly remoteEnded?: true;
};
declare const endpointActions: readonly [
    "submit",
    "poll",
    "collect"
];
type EndpointAction = typeof endpointActions[number];
type EndpointOutcome = ({
    readonly status: "pending";
    readonly handle: CanonicalValue;
    readonly wakeAt?: number;
    readonly progress?: OperationProgress;
} | {
    readonly status: "completed";
    readonly result: EndpointFulfillment;
} | {
    readonly status: "failed";
    readonly failure: OperationFailure;
} | {
    readonly status: "ready";
    readonly handle: CanonicalValue;
}) & {
    readonly receipt?: OperationReceipt;
};
type EndpointStartContext = EndpointInvocationContext & {
    readonly operation: string;
    readonly checkpoint?: (checkpoint: EndpointCheckpoint) => Promise<void>;
};
type EndpointPollContext = EndpointStartContext & {
    readonly handle: CanonicalValue;
};
type EndpointCancelOutcome = {
    readonly status: "confirmed";
} | {
    readonly status: "accepted";
} | {
    readonly status: "unsupported";
} | {
    readonly status: "too-late";
};
type AsyncEndpoint = {
    start(context: EndpointStartContext): Awaitable$1<EndpointOutcome>;
    poll(context: EndpointPollContext): Awaitable$1<EndpointOutcome>;
    cancel?(context: EndpointPollContext): Awaitable$1<EndpointCancelOutcome>;
    collect?(context: EndpointPollContext): Awaitable$1<EndpointOutcome>;
};
type EndpointScheduling = {
    readonly resources: readonly CapacityResourceClaim[];
    readonly actions?: Partial<Readonly<Record<EndpointAction, readonly CapacityResourceClaim[]>>>;
    readonly unitsForRequest?: (request: EndpointRequest) => Readonly<Record<string, number>>;
};
type EndpointSupport = {
    readonly status: "supported";
} | {
    readonly status: "unsupported";
    readonly reason: string;
};
type EndpointRegistrationOptions = {
    readonly pool?: string;
    readonly supports?: (request: EndpointRequest) => EndpointSupport;
    readonly scheduling?: EndpointScheduling;
    readonly credentials?: Readonly<Record<string, CredentialRef>>;
    readonly transient?: true;
};
interface EndpointRegistrar {
    registerImmediateEndpoint(id: string, capability: CapabilityRef, returns: TypeRef, handler: ImmediateEndpointHandler, options?: EndpointRegistrationOptions): void;
    registerAsyncEndpoint(id: string, capability: CapabilityRef, returns: TypeRef, endpoint: AsyncEndpoint, options?: EndpointRegistrationOptions): void;
}
type Awaitable<T> = T | Promise<T>;
type ProducerHandlerResult = {
    readonly outputs: Readonly<Record<string, StoredValue>>;
    readonly needs: Readonly<Record<string, CanonicalValue>>;
};
type ProducerHandlerContext = {
    readonly command: InvokeProducerCommand;
    readonly producer: ProducerRef;
    readonly inputs: Readonly<Record<string, TypedRecord>>;
};
type ProducerHandler = (context: ProducerHandlerContext) => Awaitable<ProducerHandlerResult>;
interface ProducerRegistrar {
    registerProducer(producer: ProducerRef, handler: ProducerHandler): void;
}
type ExecutorExecutionOutcome = {
    readonly command: string;
    readonly kind: BuildCommand["kind"];
    readonly status: "completed" | "pending" | "error";
    readonly operation?: string;
    readonly wakeAt?: number;
    readonly message?: string;
};
type BlockedCommand = {
    readonly command: string;
    readonly reason: "missing-producer" | "missing-endpoint" | "unsupported-endpoint-request" | "ambiguous-endpoint" | "missing-operation-store";
    readonly subject: string;
};
type ExecutorRunResult = {
    readonly status: "complete" | "paused" | "failed";
    readonly state: BuildState;
    readonly outcomes: readonly ExecutorExecutionOutcome[];
    readonly blocked: readonly BlockedCommand[];
};
type ProducerRegistration = {
    readonly handler: ProducerHandler;
    readonly scheduling?: EndpointScheduling;
};
type EndpointRegistrationBase = {
    readonly id: string;
    readonly capability: CapabilityRef;
    readonly returns: TypeRef;
} & EndpointRegistrationOptions;
type EndpointRegistration = EndpointRegistrationBase & ({
    readonly kind: "immediate";
    readonly handler: ImmediateEndpointHandler;
} | {
    readonly kind: "asynchronous";
    readonly endpoint: AsyncEndpoint;
});
type EndpointResolution = {
    readonly status: "resolved";
    readonly registration: EndpointRegistration;
} | {
    readonly status: "missing";
    readonly endpointId?: string;
} | {
    readonly status: "unsupported";
    readonly rejections: readonly {
        readonly endpointId: string;
        readonly reason: string;
    }[];
} | {
    readonly status: "ambiguous";
    readonly endpointIds: readonly string[];
};
declare class ProducerRegistry implements ProducerRegistrar {
    #private;
    registerProducer(producer: ProducerRef, handler: ProducerHandler, options?: {
        readonly scheduling?: EndpointScheduling;
    }): void;
    producer(ref: ProducerRef): ProducerRegistration | undefined;
}
type EndpointOptions = EndpointRegistrationOptions;
declare class EndpointRegistry implements EndpointRegistrar {
    #private;
    bind(capability: CapabilityRef, endpointId: string): void;
    endpointIds(): readonly string[];
    capacityConflicts(): readonly {
        readonly resource: string;
        readonly limits: readonly number[];
        readonly settings: readonly string[];
        readonly endpointIds: readonly string[];
    }[];
    contested(): readonly {
        readonly capability: CapabilityRef;
        readonly endpointIds: readonly string[];
        readonly bound?: string;
    }[];
    registerImmediateEndpoint(id: string, capability: CapabilityRef, returns: TypeRef, handler: ImmediateEndpointHandler, options?: EndpointOptions): void;
    registerAsyncEndpoint(id: string, capability: CapabilityRef, returns: TypeRef, endpoint: AsyncEndpoint, options?: EndpointOptions): void;
    resolve(need: EndpointRequest): EndpointResolution;
}
type ExecutorOptions = {
    readonly producers?: ProducerRegistry;
    readonly endpoints?: EndpointRegistry;
    readonly resources?: ResourceStore;
    readonly resourcesForBuild?: (build: string) => ResourceStore;
    readonly operations?: OperationStore;
    readonly credentials?: CredentialStore;
    readonly validators?: TypeValidatorRegistryLike;
    readonly actions?: RuntimeActionExecutor;
};
type CliResultRepositoryLocation = {
    readonly root: string;
    readonly path: string;
};
type CliDiagnostic$1 = {
    readonly severity: "error" | "warning" | "info";
    readonly code: string;
    readonly message: string;
    readonly subject?: string;
};
type CliBuildCatalogDescriptor = {
    readonly source: {
        readonly path: string;
    };
    readonly run?: {
        readonly path: string;
    };
    readonly targets?: readonly LogicalOutputRef[];
    readonly publishedOutputs: readonly {
        readonly displayName?: string;
        readonly name: string;
        readonly ref: LogicalOutputRef;
    }[];
};
type CliBuildView = {
    readonly id: string;
    readonly createdAt: number;
    readonly activity: "submitting" | "ready" | "running" | "waiting" | "saving-result";
    readonly outcome?: "complete" | "failed" | "cancelled";
    readonly issue?: {
        readonly scope: "result" | "cleanup";
        readonly message: string;
    };
    readonly cancellationRequested: boolean;
    readonly stop?: {
        readonly cause: "user-cancelled" | "execution-failed";
        readonly reason?: string;
    };
    readonly source?: {
        readonly path: string;
    };
    readonly run?: {
        readonly path: string;
    };
    readonly targets: readonly string[];
    readonly requests?: {
        readonly total: number;
        readonly completed: number;
    };
    readonly acceptedRecords: number;
    readonly outstandingCommands: number;
    readonly operations: readonly {
        readonly id?: string;
        readonly receipt?: OperationReceipt;
        readonly wakeAt?: number;
        readonly endpoint: string;
        readonly status: OperationSnapshot["status"];
        readonly progress?: OperationSnapshot["progress"];
        readonly failure?: OperationSnapshot["failure"];
    }[];
    readonly commands?: readonly {
        readonly id: string;
        readonly endpoint: string;
        readonly progress: NonNullable<OperationSnapshot["progress"]>;
    }[];
};
type CliBuildSubmission = {
    readonly id: string;
    readonly state: BuildState;
} & ({
    readonly view: CliBuildView;
} | {
    readonly completion: {
        readonly build: string;
        readonly outcome: "complete" | "failed" | "cancelled";
        readonly reason?: string;
    };
});
type CliCredentialStatus = {
    readonly endpoint: string;
    readonly slot: string;
    readonly label: string;
    readonly kind: "secret" | "json";
    readonly ref: CredentialRef;
    readonly acquisition?: CredentialAcquisition;
    readonly writable: boolean;
    readonly configured: boolean;
};
type CliRuntimeControl = {
    logs?(build: string, lines: number): Promise<ExecutionLogView | undefined>;
    inspect(build: string): Promise<CliBuildView | undefined>;
    activity(): Promise<{
        readonly builds: readonly CliBuildView[];
        readonly capacity: readonly CapacityReservation[];
    }>;
    cancel(build: string, reason?: string): Promise<CliBuildView | undefined>;
    close(): void | Promise<void>;
};
type CliResultControl = {
    finishResult(build: string): Promise<{
        readonly id: string;
        readonly outcome: "complete" | "failed" | "cancelled";
        readonly issue?: {
            readonly scope: "result" | "cleanup";
            readonly message: string;
        };
    } | undefined>;
    discardSubmission(build: string): Promise<boolean>;
    close(): void | Promise<void>;
};
type CliCredentialControl = {
    describeCredentials(endpoint?: string): Promise<readonly Omit<CliCredentialStatus, "configured">[]>;
    credentials(endpoint?: string): Promise<readonly CliCredentialStatus[]>;
    putCredential(endpoint: string, slot: string, secret: string): Promise<CliCredentialStatus>;
    deleteCredential(endpoint: string, slot: string): Promise<{
        readonly deleted: boolean;
        readonly credential: CliCredentialStatus;
    }>;
    close(): void | Promise<void>;
};
type CliRuntime = CliRuntimeControl & CliCredentialControl & CliResultControl & {
    build(request: {
        readonly id: string;
        readonly definition: BuildDefinition;
        readonly executionPackages?: readonly string[];
        readonly catalog: CliBuildCatalogDescriptor;
        readonly attachments?: readonly BlobAttachment[];
        readonly result: {
            readonly repository: CliResultRepositoryLocation;
            readonly title?: string;
            readonly forwards?: readonly BuildResultForward[];
            readonly resourceReferences?: Readonly<Record<string, BuildResultFileRef>>;
        };
    }, options?: {
        readonly follow?: boolean;
        readonly pollIntervalMs?: number;
        readonly maxWaitMs?: number;
        readonly signal?: AbortSignal;
    }): Promise<CliBuildSubmission>;
};
type CliRuntimeDoctorResult = {
    readonly dataRoot: string;
    readonly diagnostics: readonly CliDiagnostic$1[];
};
type CliTransientExecution = {
    evaluate(input: {
        readonly state: BuildState;
        readonly producers: ProducerRegistry;
        readonly validators: NonNullable<ExecutorOptions["validators"]>;
        readonly resources: ResourceStore;
    }): Promise<ExecutorRunResult>;
    close(): void | Promise<void>;
};
type CliCapabilityProvider = {
    readonly request: string;
    readonly capability: CapabilityRef;
    readonly status: "resolved" | "unresolved" | "unsupported" | "ambiguous";
    readonly endpoint?: string;
    readonly use?: string;
    readonly pricing?: {
        readonly kind: "page";
        readonly url: string;
    } | {
        readonly kind: "local";
    };
    readonly endpoints?: readonly string[];
    readonly rejections?: readonly {
        readonly endpoint: string;
        readonly message: string;
    }[];
    readonly binding?: string;
};
type CliCapabilityPricing = CliCapabilityProvider & {
    readonly pricingDocuments?: readonly {
        readonly source: string;
        readonly data: CanonicalValue;
        readonly summary?: string;
    }[];
    readonly pricingError?: string;
};
type CliProviderQuery = {
    readonly request: string;
    readonly capability: CapabilityRef;
    readonly returns: TypeRef;
    readonly constraints: CanonicalValue;
    readonly pendingInputs?: readonly {
        readonly input: string;
        readonly role?: string;
    }[];
};
type CliInvocationObservation = {
    readonly reportProgress?: (progress: OperationProgress) => Promise<void>;
    readonly reportDiagnostic?: (diagnostic: ExecutionDiagnostic) => Promise<void>;
    readonly waitForAsynchronous?: {
        readonly timeoutMs: number;
    };
};
type CliRuntimeHost = {
    readonly profile: string;
    executionStatus(): Promise<{
        readonly state: "running" | "stopped";
    }>;
    ensureExecution(options?: {
        readonly maxWaitMs?: number;
    }): Promise<{
        readonly state: "running" | "stopped";
    }>;
    createRuntime(options?: {
        readonly endpoints?: readonly string[];
    }): Promise<CliRuntime>;
    openControl(options?: {
        readonly readOnly?: boolean;
    }): Promise<CliRuntimeControl>;
    openResultControl(): Promise<CliResultControl>;
    openCredentials(endpoint: string): Promise<CliCredentialControl>;
    preflight(options?: {
        readonly capabilities?: readonly CapabilityRef[];
        readonly endpoints?: readonly string[];
    }): Promise<CliRuntimeDoctorResult>;
    doctor(options?: {
        readonly capabilities?: readonly CapabilityRef[];
        readonly endpoints?: readonly string[];
    }): Promise<CliRuntimeDoctorResult>;
    providers(requests: readonly CliProviderQuery[]): Promise<readonly CliCapabilityProvider[]>;
    pricing(requests: readonly CliProviderQuery[]): Promise<readonly CliCapabilityPricing[]>;
    invoke(need: Need, resources: ResourceStore, observation?: CliInvocationObservation): Promise<{
        readonly value: StoredValue;
    }>;
    openTransientExecution(): Promise<CliTransientExecution>;
};
type CliCompilerOptions = {
    readonly workspaceRoot?: string;
    readonly assetRoots?: readonly string[];
    readonly packageRoot?: string;
    readonly distributionPackageRoot?: string;
    readonly packageContributions: readonly PackageContribution[];
};
type CliDistribution = {
    readonly packageRoot?: string;
    readonly bootstrapPackages: readonly LoadedPackage[];
    resolveProjectRuntime?(projectRoot: string): Promise<{
        readonly profile: string;
    } | undefined>;
    createWorkspace(options: Pick<CliCompilerOptions, "workspaceRoot" | "assetRoots" | "packageRoot" | "distributionPackageRoot">): Workspace;
    createCompiler(options: CliCompilerOptions): Compiler;
    discoverSourcePackages?(path: string, options?: {
        readonly workspaceRoot?: string;
        readonly packageRoot?: string;
        readonly distributionPackageRoot?: string;
        readonly packages?: readonly LoadedPackage[];
    }): Promise<{
        readonly selected: readonly string[];
        readonly logical?: readonly LogicalPackageAddress[];
    }>;
    openRuntimeHost(path: string, options: {
        readonly packageRoot: string;
        readonly distributionPackageRoot?: string;
    }): Promise<CliRuntimeHost>;
    openProjectResults(projectRoot: string, options: {
        readonly packageRoot: string;
        readonly distributionPackageRoot?: string;
    }): Promise<{
        readonly location: CliResultRepositoryLocation;
        readonly repository: BuildResultRepository;
        close(): void | Promise<void>;
    }>;
    diagnoseProjectResults(projectRoot: string, options: {
        readonly packageRoot: string;
        readonly distributionPackageRoot?: string;
    }): Promise<{
        readonly location?: CliResultRepositoryLocation;
        readonly diagnostics: readonly CliDiagnostic$1[];
    }>;
};
type Micros = number;
type QuoteBasis = "exact" | "estimate" | "unknown";
type RunEstimate = {
    readonly format: "clipkin.run-estimate@1";
    readonly currency: "USD";
    readonly requests: number;
    readonly priced: number;
    readonly local: number;
    readonly unpriced: readonly {
        readonly request: string;
        readonly capability: string;
        readonly reason: string;
    }[];
    readonly basis: QuoteBasis;
    readonly vendorLowMicros: Micros;
    readonly vendorHighMicros: Micros;
    readonly customerLowMicros: Micros;
    readonly customerHighMicros: Micros;
    readonly creditsLow: number;
    readonly creditsHigh: number;
    readonly holdCredits: number;
};
type CliTerminal = {
    readonly isTTY: boolean;
    readonly color: boolean;
    readonly unicode: boolean;
    readonly columns: number;
};
type CliIo = {
    readonly write: (text: string) => void;
    readonly writeProgress?: (text: string) => void;
    readonly setExitCode?: (code: number) => void;
    readonly readSecret?: (prompt: string) => Promise<string>;
    readonly terminal?: CliTerminal;
};
type CliColorMode = "auto" | "always" | "never";
type CliOutputOptions = {
    readonly json: boolean;
    readonly jsonl?: boolean;
    readonly color: CliColorMode;
    readonly verbose: boolean;
};
type CliDiagnostic = {
    readonly severity: "error" | "warning" | "info";
    readonly code: string;
    readonly message: string;
    readonly subject?: string;
};
type DoctorOutput = {
    readonly format: "clipkin.cli-doctor@1";
    readonly ok: boolean;
    readonly project: string;
    readonly profile?: string;
    readonly profileSource?: "argument" | "project" | "none";
    readonly selectionFile?: string;
    readonly diagnosticCount: number;
    readonly diagnostics: readonly CliDiagnostic[];
    readonly omittedDiagnostics?: number;
};
type AuthorCheckOutput = {
    readonly format: "clipkin.cli-check@1";
    readonly sourceKind: "author";
    readonly ok: true;
    readonly source: string;
    readonly frontend: string;
    readonly units: number;
    readonly assets: number;
    readonly modules: number;
    readonly outputCount: number;
    readonly outputs?: readonly {
        readonly name: string;
        readonly type: string;
    }[];
    readonly omittedOutputs?: number;
    readonly details?: {
        readonly modules: readonly string[];
        readonly values: readonly {
            readonly name: string;
            readonly type: string;
        }[];
    };
};
type RunCheckOutput = {
    readonly format: "clipkin.cli-check@1";
    readonly sourceKind: "run";
    readonly ok: true;
    readonly run: string;
    readonly author: string;
    readonly frontend: string;
    readonly targetCount: number;
    readonly targets: readonly string[];
    readonly candidates: number;
    readonly satisfactions: number;
    readonly historicalOutputCount?: number;
    readonly steps?: number;
    readonly unresolvedHistoricalOutputs?: readonly {
        readonly candidate: string;
        readonly build: string;
        readonly output: string;
    }[];
    readonly omittedHistoricalOutputs?: number;
};
type PlanPreflight = {
    readonly ok: boolean;
    readonly capabilityCount: number;
    readonly capabilities?: readonly string[];
    readonly omittedCapabilities?: number;
    readonly diagnosticCount: number;
    readonly diagnostics: readonly CliDiagnostic[];
    readonly omittedDiagnostics?: number;
};
type PlanProvider = {
    readonly request: string;
    readonly capability: string;
    readonly status: "resolved" | "unresolved" | "unsupported" | "ambiguous";
    readonly endpoint?: string;
    readonly use?: string;
    readonly pricing?: {
        readonly kind: "page";
        readonly url: string;
    } | {
        readonly kind: "local";
    };
    readonly endpoints?: readonly string[];
    readonly rejections?: readonly {
        readonly endpoint: string;
        readonly message: string;
    }[];
    readonly binding?: string;
};
type PlanOutput = {
    readonly format: "clipkin.cli-plan@1";
    readonly ok: boolean;
    readonly run: string;
    readonly targetCount: number;
    readonly targets: readonly string[];
    readonly steps?: number;
    readonly requestCount: number;
    readonly requestIssueCount: number;
    readonly producerFailureCount: number;
    readonly producerFailures: readonly {
        readonly step: string;
        readonly message: string;
    }[];
    readonly providerRequestCount?: number;
    readonly localRequestCount?: number;
    readonly unresolvedRequestCount?: number;
    readonly unsupportedRequestCount?: number;
    readonly choiceCount: number;
    readonly choices?: readonly {
        readonly output: string;
        readonly candidate: string;
    }[];
    readonly omittedChoices?: number;
    readonly unreached?: readonly {
        readonly output: string;
        readonly operation: string;
    }[];
    readonly omittedUnreached?: number;
    readonly providers?: readonly PlanProvider[];
    readonly needs?: readonly PlanNeed[];
    readonly preflight?: PlanPreflight;
};
type PricingEntry = PlanProvider & {
    readonly pricingDocuments?: readonly PricingDocument[];
    readonly pricingError?: string;
};
type PricingDocument = {
    readonly source: string;
    readonly data: CanonicalValue;
    readonly summary?: string;
};
type PricingOutput = {
    readonly format: "clipkin.cli-pricing@1";
    readonly run: string;
    readonly requestCount: number;
    readonly noChargeRequestCount: number;
    readonly producerFailureCount: number;
    readonly producerFailures: PlanOutput["producerFailures"];
    readonly groups: readonly (Omit<PricingEntry, "request"> & {
        readonly requests: readonly PlanNeed[];
    })[];
    readonly estimate: RunEstimate;
};
type PlanNeed = {
    readonly request: string;
    readonly step: string;
    readonly port: string;
    readonly capability: string;
    readonly endpoint?: string;
    readonly summary?: {
        readonly fields: Readonly<Record<string, string | number | boolean>>;
        readonly references: Readonly<Record<string, number>>;
    };
    readonly pending: readonly {
        readonly input: string;
        readonly record: string;
        readonly sourceStep?: string;
        readonly kind?: "image" | "video" | "audio" | "other";
    }[];
    readonly issue?: string;
};
type CliMachineView = {
    readonly format: string;
    readonly [field: string]: unknown;
};
type CliPresentation = {
    readonly kind: "doctor";
    readonly machine: DoctorOutput;
} | {
    readonly kind: "check-author";
    readonly machine: AuthorCheckOutput;
} | {
    readonly kind: "check-run";
    readonly machine: RunCheckOutput;
} | {
    readonly kind: "plan";
    readonly machine: PlanOutput;
} | {
    readonly kind: "pricing";
    readonly machine: PricingOutput;
    readonly limit?: number;
} | {
    readonly kind: "operational";
    readonly machine: CliMachineView;
    readonly title: string;
    readonly status?: "success" | "warning" | "error" | "info";
    readonly facts?: readonly (readonly [
        string,
        string
    ])[];
    readonly lines?: readonly string[];
};
declare function writeCliOutput(io: CliIo, options: CliOutputOptions, presentation: CliPresentation): void;
type CliCommandModule = {
    readonly format: "clipkin.cli-command@1";
    readonly id: string;
    readonly commands: readonly string[];
    writeRootHelp?(io: CliIo): void;
    writeHelp(argv: readonly string[], io: CliIo): void | Promise<void>;
    run(argv: readonly string[], io: CliIo, context: CliApplicationContext): void | Promise<void>;
};
type CliApplicationContext = {
    readonly cwd: string;
    readonly distribution: CliDistribution;
    resolveProjectRoot(projectRoot?: string): Promise<string>;
};
type CommandScope = {
    readonly projectRoot?: string;
    readonly runtimeProfile?: string;
};
declare function commandHint(args: readonly string[], scope?: CommandScope, shell?: "posix" | "powershell"): string;
declare function createCliScratchResources(): ResourceStore;
declare function openCliRuntimeHost(application: CliApplicationContext, runtime: string | undefined, project: string | undefined): Promise<{
    readonly profile: string;
    readonly host: CliRuntimeHost;
    readonly projectRoot: string;
}>;
declare function selectCliProvider(host: Pick<CliRuntimeHost, "providers">, need: Need, profile: string): Promise<CliCapabilityProvider>;
declare function cliProviderView(provider: CliCapabilityProvider): {
    endpoint: string | null;
    use: string | null;
    pricing: {
        readonly kind: "page";
        readonly url: string;
    } | {
        readonly kind: "local";
    } | null;
};
declare function cliProviderLine(provider: CliCapabilityProvider): string;
declare function clipkinProjectStateRoot(projectRoot: string): string;
declare function clipkinHostStateRoot(options?: {
    readonly env?: NodeJS.ProcessEnv;
    readonly platform?: NodeJS.Platform;
    readonly home?: string;
}): string;
type DiscoveryOptions = {
    readonly source: string;
    readonly workspaceRoot?: string;
    readonly packageRoot: string;
    readonly distributionPackageRoot?: string;
};
declare function loadDiscoveredSourcePackages(distribution: CliDistribution, options: DiscoveryOptions): Promise<readonly LoadedPackage[]>;
declare function discoverSourcePackages(sourcePath: string, options?: {
    readonly workspaceRoot?: string;
    readonly packageRoot?: string;
    readonly distributionPackageRoot?: string;
    readonly packages?: readonly LoadedPackage[];
    readonly bootstrapAuthorFrontends?: readonly AuthorFrontend[];
    readonly bootstrapRunFrontends?: readonly RunFrontend[];
}): Promise<{
    readonly selected: readonly string[];
    readonly logical: readonly LogicalPackageAddress[];
}>;
type BuildResultResolutionSession = {
    readonly files: Map<string, BlobAttachment>;
    readonly references: Map<string, BuildResultFileRef>;
    readonly outputs: Map<string, Promise<RepositoryBuildResultOutput | undefined>>;
};
declare function resolveBuildResultValue(repository: BuildResultRepository, build: string, output: string, session?: BuildResultResolutionSession): Promise<{
    readonly type: RepositoryBuildResultOutput["type"];
    readonly value: StoredValue;
    readonly attachments?: readonly BlobAttachment[];
} | undefined>;
export { cliProviderLine, cliProviderView, clipkinHostStateRoot, clipkinProjectStateRoot, commandHint, createCliScratchResources, discoverSourcePackages, loadDiscoveredSourcePackages, openCliRuntimeHost, resolveBuildResultValue, selectCliProvider, writeCliOutput };
export type { CliApplicationContext, CliBuildCatalogDescriptor, CliBuildSubmission, CliBuildView, CliCapabilityPricing, CliCapabilityProvider, CliCommandModule, CliCompilerOptions, CliCredentialControl, CliCredentialStatus, CliDiagnostic$1 as CliDiagnostic, CliDistribution, CliInvocationObservation, CliIo, CliMachineView, CliOutputOptions, CliProviderQuery, CliResultControl, CliResultRepositoryLocation, CliRuntime, CliRuntimeControl, CliRuntimeDoctorResult, CliRuntimeHost, CliTerminal, CliTransientExecution };
