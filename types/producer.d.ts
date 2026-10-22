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
type BuildDiagnostic = {
    readonly code: string;
    readonly message: string;
    readonly subject?: string;
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
type Facet = {
    readonly abi: string;
    readonly offers?: readonly string[];
    readonly implementation: unknown;
};
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
type ProducerFacet = {
    readonly producer: ProducerRef;
    readonly handler: ProducerHandler;
};
type PlannedNeedInput = {
    readonly input: string;
    readonly record: string;
    readonly sourceStep?: string;
    readonly role?: string;
};
type PlannedNeedSpecification = {
    readonly constraints: CanonicalValue;
    readonly pendingInputs: readonly PlannedNeedInput[];
};
type PlannedNeedPresentation = {
    readonly fields: Readonly<Record<string, readonly CanonicalValue[]>>;
    readonly references: Readonly<Record<string, number>>;
};
type PlannedNeedFacet = {
    readonly producer: ProducerRef;
    readonly port: string;
    readonly capability: CapabilityRef;
    plan(input: {
        readonly state: BuildState;
        readonly step: string;
        readonly port: string;
    }): PlannedNeedSpecification | undefined;
    present?(specification: PlannedNeedSpecification): PlannedNeedPresentation;
};
declare function plannedNeedInputs(state: BuildState, stepId: string, roles?: Readonly<Record<string, string>>): readonly PlannedNeedInput[];
declare function registerProducerFacets(registry: ProducerRegistrar, facets: readonly ProducerFacet[]): void;
type ProducerPackage = {
    readonly producers?: readonly ProducerFacet[];
    readonly plannedNeeds?: readonly PlannedNeedFacet[];
};
declare const producerPackageFacetAbi = "clipkin.producer-package@1";
type ProducerPackageFacet = Facet & {
    readonly abi: typeof producerPackageFacetAbi;
    readonly implementation: ProducerPackage;
};
declare function createProducerPackageFacet(value: unknown): ProducerPackageFacet;
declare function producerPackagesFromFacets(facets: readonly Facet[]): readonly ProducerPackage[];
export { createProducerPackageFacet, plannedNeedInputs, producerPackageFacetAbi, producerPackagesFromFacets, registerProducerFacets };
export type { Awaitable, PlannedNeedFacet, PlannedNeedInput, PlannedNeedPresentation, PlannedNeedSpecification, ProducerFacet, ProducerHandler, ProducerHandlerContext, ProducerHandlerResult, ProducerPackage, ProducerPackageFacet, ProducerRegistrar };
