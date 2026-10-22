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
type ResolvedTypeDeclaration = {
    readonly name: string;
    readonly ref: TypeRef;
};
type ResolvedProducerDeclaration = ProducerDeclaration & {
    readonly ref: ProducerRef;
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
type BuildRequest = {
    readonly format: "clipkin.build-request@1";
    readonly targets: readonly BuildTarget[];
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
declare function createResolvedClosure(manifests: readonly ModuleManifest[]): ResolvedModuleClosure;
declare function verifyClosure(closure: ResolvedModuleClosure): void;
declare function resolveType(closure: ResolvedModuleClosure, ref: TypeRef): ResolvedTypeDeclaration;
declare function resolveProducer(closure: ResolvedModuleClosure, ref: ProducerRef): ResolvedProducerDeclaration;
declare function sealRecord(record: TypedRecord): TypedRecord;
declare function verifyRecordStructure(closure: ResolvedModuleClosure, record: TypedRecord): ResolvedTypeDeclaration;
declare function link(closure: ResolvedModuleClosure, authoredRecords: readonly TypedRecord[]): LinkedProgram;
declare function sealCompiledGraph(graph: Omit<CompiledGraph, "format">): CompiledGraph;
declare function sealBuildRequest(request: Omit<BuildRequest, "format">): BuildRequest;
declare function resolveLogicalOutput(graph: CompiledGraph, id: string): LogicalOutput;
declare function resolveCandidate(graph: CompiledGraph, id: string): Candidate;
declare function resolveOperation(graph: CompiledGraph, id: string): OperationNode;
declare function satisfiedCandidate(graph: CompiledGraph, outputId: string): Candidate;
declare function operationResultRecord(operation: OperationNode): string;
declare function verifyCompiledGraph(program: LinkedProgram, graph: CompiledGraph): void;
declare function verifyBuildRequest(program: LinkedProgram, graph: CompiledGraph, request: BuildRequest): void;
type PlannedNeed = {
    readonly step: StepId;
    readonly port: string;
    readonly need: NeedId;
    readonly result: RecordId;
    readonly capability: CapabilityRef;
    readonly returns: TypeRef;
};
declare function plannedNeeds(state: BuildState): readonly PlannedNeed[];
type BuildCandidateSelection = {
    readonly output: string;
    readonly candidate: string;
    readonly record: string;
};
type PlannedExecution = {
    readonly plan: BuildPlan;
    readonly selections: readonly BuildCandidateSelection[];
    readonly initialRecords: readonly TypedRecord[];
};
declare function planBuild(program: LinkedProgram, authorGraph: CompiledGraph, runGraph: RunGraph): PlannedExecution;
declare function compileBuild(program: LinkedProgram, graph: CompiledGraph, request: BuildRequest): BuildPlan;
declare function sliceExecution(program: LinkedProgram, authorGraph: CompiledGraph, runGraph: RunGraph): {
    readonly program: LinkedProgram;
    readonly plan: ReturnType<typeof planBuild>["plan"];
    readonly initialRecords: ReturnType<typeof planBuild>["initialRecords"];
    readonly targets: RunGraph["targets"];
    readonly selections: readonly BuildCandidateSelection[];
};
declare function resolveNeedCommand(state: BuildState, id: CommandId): FulfillNeedCommand | undefined;
declare function start(program: LinkedProgram, graph: CompiledGraph, request: BuildRequest): BuildState;
declare function reduce(state: BuildState, event?: CommandResult): BuildState;
declare function defineBuild(input: Omit<BuildDefinition, "format">): BuildDefinition;
declare function admitBuildResult(state: BuildState, event: CommandResult): {
    readonly fact: BuildFact;
    readonly state: BuildState;
};
declare function materializeBuild(definition: BuildDefinition, facts: readonly BuildFact[]): BuildState;
declare class BuildMachine {
    #private;
    readonly definition: BuildDefinition;
    static fromMaterialized(definition: BuildDefinition, state: BuildState): BuildMachine;
    constructor(definition: BuildDefinition, facts?: readonly BuildFact[], materializedState?: BuildState);
    get status(): BuildState["status"];
    commands(): readonly BuildCommand[];
    record(id: string): TypedRecord | undefined;
    view(): BuildState;
    evaluate(result: CommandResult): BuildFact | undefined;
    commit(): void;
}
export { BuildMachine, admitBuildResult, compileBuild, createResolvedClosure, defineBuild, link, materializeBuild, operationResultRecord, planBuild, plannedNeeds, reduce, resolveCandidate, resolveLogicalOutput, resolveNeedCommand, resolveOperation, resolveProducer, resolveType, satisfiedCandidate, sealBuildRequest, sealCompiledGraph, sealRecord, sliceExecution, start, verifyBuildRequest, verifyClosure, verifyCompiledGraph, verifyRecordStructure };
export type { BuildCandidateSelection, PlannedExecution, PlannedNeed };
