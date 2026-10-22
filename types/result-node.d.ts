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
declare function assertBuildResultPath(value: unknown, subject: string): asserts value is string;
declare function assertBuildResultFileRef(value: unknown, subject: string): asserts value is BuildResultFileRef;
declare function assertBuildResultValueDocument(value: unknown, subject?: string): asserts value is BuildResultValueDocument;
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
type RepositoryBuildResultOutputLocation = {
    readonly build: string;
    readonly output: string;
    readonly type: TypeRef;
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
declare function assertBuildResultSeed(seed: BuildResultSeed): void;
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
type BuildResultWriterState = {
    readonly resources: Readonly<Record<string, string>>;
    readonly resourceReferences?: Readonly<Record<string, BuildResultFileRef>>;
    readonly values: Readonly<Record<string, string>>;
    readonly publishedOutputs: readonly {
        readonly name: string;
        readonly output: string;
        readonly displayName?: string;
    }[];
    readonly forwards: readonly {
        readonly output: string;
        readonly build: string;
        readonly sourceOutput: string;
        readonly type: TypeRef;
    }[];
};
type BuildResultWriteTarget = {
    writeResource(path: string, artifact: BlobRef, source: BuildResultResourceSource): Promise<void>;
    writeValue(path: string, document: BuildResultValueDocument): Promise<void>;
};
type BuildResultSyncResult = {
    readonly changed: boolean;
    readonly manifest: BuildResultManifest;
    readonly writer: BuildResultWriterState;
};
declare function syncBuildResultOutputs(input: {
    readonly manifest: BuildResultManifest;
    readonly writer: BuildResultWriterState;
    readonly sync: BuildResultSync;
    readonly target: BuildResultWriteTarget;
}): Promise<BuildResultSyncResult>;
declare function decodeBuildResultJson(value: Uint8Array, subject: string): unknown;
declare function decodeBuildResultManifest(value: unknown, build: string, subject?: string): BuildResultManifest;
declare function encodeBuildResultManifest(manifest: BuildResultManifest): Omit<BuildResultManifest, "id">;
declare function decodeBuildResultWriterState(value: unknown, subject?: string): BuildResultWriterState;
declare function decodeBuildResultValueDocument(value: unknown, subject?: string): BuildResultValueDocument;
declare function preserveExecutionLog(chunks: AsyncIterable<Uint8Array> | undefined, write: (path: string, chunks: AsyncIterable<Uint8Array>, mediaType: string) => Promise<void>): Promise<BuildResultFileRef | undefined>;
type ExternalFileAccess = {
    size(uri: string): Promise<number>;
    open(uri: string, range?: BuildResultFileRange): Promise<AsyncIterable<Uint8Array>>;
};
declare const localExternalFiles: ExternalFileAccess;
declare function fileReferenceIdentity(owner: string, file: BuildResultFileRef): string;
declare function ownedFileReference(owner: string, file: BuildResultFileRef): BuildResultFileRef;
declare function currentFileReference(file: BuildResultFileRef, access?: ExternalFileAccess): Promise<BuildResultFileRef>;
declare function applyBuildResultPresentation(manifest: BuildResultManifest, update: BuildResultPresentationUpdate): BuildResultManifest;
declare function locateRepositoryBuildResultOutput(repository: Pick<BuildResultRepository, "read">, build: string, output: string): Promise<RepositoryBuildResultOutputLocation | undefined>;
declare function locateBuildResultOutput(root: string, build: string, output: string): Promise<RepositoryBuildResultOutputLocation | undefined>;
declare function buildResultDirectory(root: string, build: string): string;
declare function readBuildResult(directory: string): Promise<BuildResultManifest | undefined>;
declare function browseBuildResults(root: string, request: {
    readonly before?: string;
    readonly limit: number;
}): Promise<{
    readonly results: readonly FinishedBuildResultManifest[];
    readonly next?: string;
}>;
declare function resolveBuildResultOutput(root: string, build: string, output: string, externalFiles?: ExternalFileAccess): Promise<ResolvedBuildResultOutput | undefined>;
declare function describeBuildResultOutput(root: string, build: string, output: string, externalFiles?: ExternalFileAccess): Promise<RepositoryBuildResultOutputDescription | undefined>;
declare function normalizeBuildResultForwards(repository: {
    read(build: string): Promise<BuildResultManifest | undefined>;
}, forwards: readonly BuildResultForward[]): Promise<readonly (BuildResultForward & {
    readonly type: TypeRef;
})[]>;
declare class FileBuildResult {
    readonly directory: string;
    private constructor();
    static create(root: string, seed: BuildResultSeed, externalFiles?: ExternalFileAccess): Promise<FileBuildResult>;
    static open(directory: string): Promise<FileBuildResult>;
    read(): Promise<BuildResultManifest>;
    sync(input: BuildResultSync): Promise<BuildResultManifest>;
    finish(input: BuildResultFinish): Promise<BuildResultManifest>;
}
declare class FileBuildResultRepository implements BuildResultRepository {
    readonly externalFiles: ExternalFileAccess;
    readonly root: string;
    constructor(root: string, externalFiles?: ExternalFileAccess);
    create(seed: BuildResultSeed): Promise<FileBuildResult>;
    openWriter(build: string): Promise<FileBuildResult | undefined>;
    removeIncomplete(build: string): Promise<void>;
    read(build: string): Promise<BuildResultManifest | undefined>;
    updatePresentation(build: string, update: BuildResultPresentationUpdate): Promise<BuildResultManifest>;
    browse(request: {
        readonly before?: string;
        readonly limit: number;
    }): Promise<{
        readonly results: readonly FinishedBuildResultManifest[];
        readonly next?: string;
    }>;
    describeOutput(build: string, output: string): Promise<RepositoryBuildResultOutputDescription | undefined>;
    resolve(build: string, output: string): Promise<RepositoryBuildResultOutput | undefined>;
    describeFile(_build: string, file: BuildResultFileRef): Promise<BuildResultFileRef>;
    openFile(build: string, file: BuildResultFileRef, range?: BuildResultFileRange): Promise<AsyncIterable<Uint8Array> | undefined>;
}
export { FileBuildResult, FileBuildResultRepository, applyBuildResultPresentation, assertBuildResultFileRef, assertBuildResultPath, assertBuildResultSeed, assertBuildResultValueDocument, browseBuildResults, buildResultDirectory, currentFileReference, decodeBuildResultJson, decodeBuildResultManifest, decodeBuildResultValueDocument, decodeBuildResultWriterState, describeBuildResultOutput, encodeBuildResultManifest, fileReferenceIdentity, localExternalFiles, locateBuildResultOutput, locateRepositoryBuildResultOutput, normalizeBuildResultForwards, ownedFileReference, preserveExecutionLog, readBuildResult, resolveBuildResultOutput, syncBuildResultOutputs };
export type { BuildResultBrowseRequest, BuildResultFileRange, BuildResultFileRef, BuildResultFinish, BuildResultForward, BuildResultManifest, BuildResultOperation, BuildResultOutcome, BuildResultOutput, BuildResultOutputValue, BuildResultPage, BuildResultPresentationUpdate, BuildResultPublishedOutput, BuildResultRepository, BuildResultResourceBinding, BuildResultResourceSource, BuildResultSeed, BuildResultSync, BuildResultSyncResult, BuildResultValueDocument, BuildResultValuePath, BuildResultWriteTarget, BuildResultWriter, BuildResultWriterState, ExternalFileAccess, FinishedBuildResultManifest, HistoricalBuildOutputRef, RepositoryBuildResultOutput, RepositoryBuildResultOutputDescription, RepositoryBuildResultOutputLocation, ResolvedBuildResultOutput };
