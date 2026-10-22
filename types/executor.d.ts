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
type CredentialRef = {
    readonly store: string;
    readonly key: string;
};
type CredentialValue = {
    readonly secret: string;
    readonly expiresAt?: number;
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
type ResourceIOOptions = {
    readonly signal?: AbortSignal;
};
type ResourceStore = {
    put(bytes: Uint8Array, mediaType: string, options?: ResourceIOOptions): Promise<BlobRef>;
    write(resource: BlobRef, bytes: Uint8Array, options?: ResourceIOOptions): Promise<void>;
    get(resource: ResourceId, options?: ResourceIOOptions): Promise<Uint8Array | undefined>;
    has(resource: ResourceId, options?: ResourceIOOptions): Promise<boolean>;
};
declare class MemoryResourceStore implements ResourceStore {
    #private;
    put(bytes: Uint8Array, mediaType: string, options?: ResourceIOOptions): Promise<BlobRef>;
    write(resource: BlobRef, bytes: Uint8Array, options?: ResourceIOOptions): Promise<void>;
    get(resource: ResourceId, options?: ResourceIOOptions): Promise<Uint8Array | undefined>;
    has(resource: ResourceId, options?: ResourceIOOptions): Promise<boolean>;
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
declare class Executor {
    #private;
    readonly producers: ProducerRegistry;
    readonly endpoints: EndpointRegistry;
    readonly resources: ResourceStore;
    readonly operations: OperationStore | undefined;
    readonly credentials: CredentialStore | undefined;
    readonly validators: TypeValidatorRegistryLike;
    constructor(options?: ExecutorOptions);
    acceptOperation(state: BuildState, snapshot: OperationSnapshot): Promise<CommandResult | undefined>;
    advanceOperation(operation: OperationSnapshot, context?: RuntimeExecutionContext): Promise<OperationSnapshot>;
    prepare(state: BuildState): RuntimePreparation;
    prepareExecution(execution: RuntimeBuildExecution): RuntimePreparation;
    executeCommand(state: BuildState, descriptor: RuntimeRunnableCommand, context: RuntimeExecutionContext): Promise<RuntimeExecutionResult>;
    executeExecutionCommand(execution: RuntimeBuildExecution, descriptor: RuntimeRunnableCommand, context: RuntimeExecutionContext): Promise<RuntimeExecutionResult>;
    cancelOperation(initial: BuildState, operation: OperationSnapshot): Promise<OperationSnapshot>;
    run(initial: BuildState, context?: RuntimeExecutionContext): Promise<ExecutorRunResult>;
}
type ProducerPlanEvaluation = {
    readonly state: BuildState;
    readonly failures: ReadonlyMap<string, string>;
};
declare function evaluateProducerPlan(definition: BuildDefinition, producers: ProducerRegistry, validators?: TypeValidatorRegistryLike): Promise<ProducerPlanEvaluation>;
export { EndpointRegistry, Executor, MemoryResourceStore, ProducerRegistry, evaluateProducerPlan };
export type { BlockedCommand, EndpointRegistration, EndpointResolution, ExecutorExecutionOutcome, ExecutorOptions, ExecutorRunResult, ProducerHandler, ProducerHandlerContext, ProducerHandlerResult, ProducerPlanEvaluation, ProducerRegistrar, ProducerRegistration };
