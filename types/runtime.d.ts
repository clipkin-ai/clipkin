type CredentialRef = {
    readonly store: string;
    readonly key: string;
};
type CredentialValue = {
    readonly secret: string;
    readonly expiresAt?: number;
};
type OAuth2Credential = {
    readonly format: "clipkin.oauth2-credential@1";
    readonly accessToken: string;
    readonly refreshToken?: string;
    readonly expiresAt?: number;
};
declare function encodeOAuth2Credential(value: Omit<OAuth2Credential, "format">): string;
declare function decodeOAuth2Credential(secret: string): OAuth2Credential | undefined;
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
type WritableCredentialStore = CredentialStore & {
    owns(ref: CredentialRef): boolean;
    put(ref: CredentialRef, value: CredentialValue): Promise<void>;
    delete(ref: CredentialRef): Promise<boolean>;
};
declare function credentialRef(store: string, key: string): CredentialRef;
declare function verifyCredentialRef(ref: CredentialRef): void;
declare function isWritableCredentialStore(value: CredentialStore): value is WritableCredentialStore;
declare function writableCredentialStore(store: CredentialStore, ref: CredentialRef): Promise<WritableCredentialStore | undefined>;
declare class CompositeCredentialStore implements CredentialStore {
    #private;
    constructor(stores: readonly CredentialStore[]);
    resolve(ref: CredentialRef): Promise<CredentialValue | undefined>;
    writable(ref: CredentialRef): Promise<WritableCredentialStore | undefined>;
}
type CapacityResourceClaim = {
    readonly id: string;
    readonly limit: number;
    readonly units?: number;
    readonly periodMs?: number;
};
declare function capacityUnits(resource: CapacityResourceClaim): number;
type CapacityReservation = {
    readonly build: string;
    readonly command: string;
    readonly resources: readonly CapacityResourceClaim[];
    readonly createdAt: number;
    readonly lifetime?: "action" | "operation";
};
type CapacityAcquireRequest = {
    readonly lifetime?: "action" | "operation";
    readonly build: string;
    readonly command: string;
    readonly resources: readonly CapacityResourceClaim[];
    readonly now: number;
};
type CapacityAcquire = {
    readonly status: "acquired";
    readonly reservation: CapacityReservation;
} | {
    readonly status: "blocked";
    readonly availableAt?: number;
    readonly reason: "resource-in-flight" | "rate-limit";
    readonly resource: string;
};
type ResourceId = `res_${string}`;
type RecordId = string;
type LogicalOutputId = string;
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
type BuildFactBase = {
    readonly format: "clipkin.build-fact@1";
    readonly command: CommandId;
};
type ProducerAppliedFact = BuildFactBase & {
    readonly kind: "producer-applied";
    readonly step: StepId;
    readonly records: readonly TypedRecord[];
    readonly needs: readonly Need[];
};
type NeedAppliedFact = BuildFactBase & {
    readonly kind: "need-applied";
    readonly need: NeedId;
    readonly record: TypedRecord;
};
type CommandFailedFact = BuildFactBase & {
    readonly kind: "command-failed";
    readonly diagnostic: BuildDiagnostic;
};
type BuildFact = ProducerAppliedFact | NeedAppliedFact | CommandFailedFact;
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
type CommandExecutionReceipt = {
    readonly build: string;
    readonly command: string;
    readonly status: "started" | "completed";
    readonly event?: CommandResult;
    readonly activity?: {
        readonly endpoint: string;
        readonly progress: OperationProgress;
    };
};
type CommandExecutionBegin = {
    readonly created: boolean;
    readonly receipt: CommandExecutionReceipt;
};
type CommandExecutionStore = {
    begin(build: string, command: string): Promise<CommandExecutionBegin>;
    reportProgress(build: string, command: string, activity: NonNullable<CommandExecutionReceipt["activity"]>): Promise<void>;
    complete(build: string, command: string, event: CommandResult): Promise<CommandExecutionReceipt>;
    list(build: string): Promise<readonly CommandExecutionReceipt[]>;
    removeBuild(build: string): Promise<void>;
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
declare function readExecutionLog(chunks: AsyncIterable<Uint8Array>, limit: number): Promise<ExecutionLogView>;
type RuntimeBlockedCommand = {
    readonly command: string;
    readonly reason: string;
    readonly subject: string;
};
type RuntimeRunnableCommand = {
    readonly command: BuildCommand;
    readonly resources: readonly RuntimeResourceClaim[];
    readonly capacityMode?: "active" | "asynchronous";
};
type RuntimeResourceClaim = CapacityResourceClaim;
type RuntimePreparation = {
    readonly state: BuildState;
    readonly runnable: readonly RuntimeRunnableCommand[];
    readonly blocked: readonly RuntimeBlockedCommand[];
};
type RuntimeExecutionContext = {
    readonly build: string;
    readonly reportProgress?: (activity: NonNullable<CommandExecutionReceipt["activity"]>) => Promise<void>;
    readonly recordExecution?: (event: ExecutionLogEvent) => Promise<void>;
    readonly releaseOperationCapacity?: () => Promise<void>;
};
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
type RuntimeBuildExecution = {
    view(): BuildState;
    commands(): readonly BuildCommand[];
    record(id: string): TypedRecord | undefined;
};
type RuntimeCommandExecutor = {
    prepare(state: BuildState): RuntimePreparation;
    prepareExecution?(execution: RuntimeBuildExecution): RuntimePreparation;
    executeCommand(state: BuildState, command: RuntimeRunnableCommand, context: RuntimeExecutionContext): Promise<RuntimeExecutionResult>;
    executeExecutionCommand?(execution: RuntimeBuildExecution, command: RuntimeRunnableCommand, context: RuntimeExecutionContext): Promise<RuntimeExecutionResult>;
    cancelOperation?(state: BuildState, operation: OperationSnapshot): Promise<OperationSnapshot>;
    advanceOperation?(operation: OperationSnapshot, context?: RuntimeExecutionContext): Promise<OperationSnapshot>;
    acceptOperation?(state: BuildState, operation: OperationSnapshot): Promise<CommandResult | undefined>;
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
type StreamingResourceStore = ResourceStore & {
    putStream(chunks: AsyncIterable<Uint8Array>, mediaType: string, options?: ResourceIOOptions): Promise<BlobRef>;
    writeStream(resource: BlobRef, chunks: AsyncIterable<Uint8Array>, options?: ResourceIOOptions): Promise<void>;
    open(resource: ResourceId, options?: ResourceIOOptions): Promise<AsyncIterable<Uint8Array> | undefined>;
};
declare function isStreamingResourceStore(value: ResourceStore): value is StreamingResourceStore;
type BuildSnapshot = {
    readonly build: string;
    readonly definition: BuildDefinition;
    readonly facts: readonly BuildFact[];
    readonly state: BuildState;
};
type BuildStore = {
    create(build: string, definition: BuildDefinition): Promise<BuildSnapshot>;
    read(build: string): Promise<BuildSnapshot | undefined>;
    append(build: string, fact: BuildFact): Promise<void>;
    remove?(build: string): Promise<void>;
};
type ScheduledBuild = {
    readonly id: string;
    readonly state: BuildState;
    readonly snapshot?: never;
} | {
    readonly id: string;
    readonly snapshot: BuildSnapshot;
    readonly state?: never;
};
type SchedulerExecutionOutcome = {
    readonly command: string;
    readonly kind: BuildCommand["kind"];
    readonly resources: readonly string[];
    readonly status: "completed" | "pending" | "deferred" | "error";
    readonly operation?: string;
    readonly wakeAt?: number;
    readonly message?: string;
};
type ScheduledBuildResult = {
    readonly id: string;
    readonly status: "complete" | "paused" | "failed";
    readonly state: BuildState;
    readonly outcomes: readonly SchedulerExecutionOutcome[];
    readonly blocked: readonly RuntimeBlockedCommand[];
};
type BuildSchedulerOptions = {
    readonly buildStore?: BuildStore;
    readonly onStateChange?: (build: string, state: BuildState) => Promise<void>;
};
declare class InProcessBuildScheduler {
    #private;
    constructor(executor: RuntimeCommandExecutor, options?: BuildSchedulerOptions);
    run(requests: readonly ScheduledBuild[]): Promise<readonly ScheduledBuildResult[]>;
}
export { CompositeCredentialStore, InProcessBuildScheduler, capacityUnits, credentialRef, decodeOAuth2Credential, encodeOAuth2Credential, isStreamingResourceStore, isWritableCredentialStore, readExecutionLog, verifyCredentialRef, writableCredentialStore };
export type { BuildSchedulerOptions, BuildSnapshot, BuildStore, CapacityAcquire, CapacityAcquireRequest, CapacityReservation, CapacityResourceClaim, CommandExecutionBegin, CommandExecutionReceipt, CommandExecutionStore, CredentialAcquisition, CredentialRef, CredentialStore, CredentialValue, ExecutionDiagnostic, ExecutionLogEvent, ExecutionLogRecord, ExecutionLogView, OAuth2Credential, OperationCompletion, OperationFacts, OperationFailure, OperationIdentity, OperationProgress, OperationQuery, OperationReceipt, OperationSnapshot, OperationStore, OperationUpdate, ResourceIOOptions, ResourceStore, RuntimeActionExecutor, RuntimeActionResult, RuntimeBlockedCommand, RuntimeBuildExecution, RuntimeCommandExecutor, RuntimeExecutionContext, RuntimeExecutionResult, RuntimePreparation, RuntimeResourceClaim, RuntimeRunnableCommand, ScheduledBuild, ScheduledBuildResult, SchedulerExecutionOutcome, StreamingResourceStore, WritableCredentialStore };
