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
declare function moduleKey(ref: ModuleRef): string;
declare function typeKey(ref: TypeRef): string;
declare function producerKey(ref: ProducerRef): string;
declare function capabilityKey(ref: CapabilityRef): string;
declare function sameModule(left: ModuleRef, right: ModuleRef): boolean;
declare function sameType(left: TypeRef, right: TypeRef): boolean;
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
declare function blobRefObjectSchema(mediaTypes?: readonly string[]): ValueSchema;
declare function canonicalize(value: unknown): CanonicalValue;
declare function canonicalStringify(value: unknown): string;
declare function isResourceId(value: string): value is ResourceId;
declare function orderedBuildId(createdAt: number, nonce: string): string;
declare function buildIdCreatedAt(value: string): number | undefined;
declare function assertOrderedBuildId(value: string): void;
declare function assertBuildId(value: string): void;
declare class ReelError extends Error {
    readonly code: string;
    readonly subject: string | undefined;
    constructor(code: string, message: string, subject?: string);
}
declare const modulePackageAbi = "clipkin.module@1";
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
type ResolvedCapabilityDeclaration = CapabilityDeclaration & {
    readonly ref: CapabilityRef;
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
export { ReelError, assertBuildId, assertOrderedBuildId, blobRefObjectSchema, buildIdCreatedAt, canonicalStringify, canonicalize, capabilityKey, isResourceId, moduleKey, modulePackageAbi, orderedBuildId, producerKey, sameModule, sameType, typeKey };
export type { BlobRef, BuildCommand, BuildDefinition, BuildDiagnostic, BuildFact, BuildGoal, BuildOutputBinding, BuildPlan, BuildRequest, BuildState, BuildTarget, Candidate, CandidateId, CandidateRoot, CanonicalValue, CapabilityDeclaration, CapabilityRef, CommandFailedEvent, CommandFailedFact, CommandId, CommandResult, CompiledGraph, FulfillNeedCommand, GraphValueRef, InvokeProducerCommand, LinkedProgram, LogicalOutput, LogicalOutputId, LogicalOutputRef, ModuleDependency, ModuleManifest, ModuleRef, Need, NeedAppliedFact, NeedBinding, NeedFulfilledEvent, NeedId, NeedPortDeclaration, ObjectFieldSchema, OperationId, OperationNode, OperationResult, OperationResultRef, PortDeclaration, ProducerAppliedFact, ProducerCompletedEvent, ProducerDeclaration, ProducerRef, ProducerStep, ProvidedValue, RecordId, RecordRef, ResolvedCapabilityDeclaration, ResolvedModule, ResolvedModuleClosure, ResolvedProducerDeclaration, ResolvedTypeDeclaration, ResourceId, RunGraph, Satisfaction, SourceRange, StepId, StepState, StoredValue, TypeDeclaration, TypeRef, TypedRecord, ValueSchema };
