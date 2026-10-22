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
declare function credentialRef(store: string, key: string): CredentialRef;
type CapacityResourceClaim = {
    readonly id: string;
    readonly limit: number;
    readonly units?: number;
    readonly periodMs?: number;
};
type ResourceId = `res_${string}`;
type RecordId = string;
type NeedId = string;
type CommandId = string;
type ModuleRef = {
    readonly name: string;
    readonly version: string;
};
type TypeRef = {
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
declare function canonicalize(value: unknown): CanonicalValue;
type Need = {
    readonly id: NeedId;
    readonly capability: CapabilityRef;
    readonly returns: TypeRef;
    readonly constraints: CanonicalValue;
    readonly result: RecordId;
};
type FulfillNeedCommand = {
    readonly kind: "fulfill-need";
    readonly id: CommandId;
    readonly need: Need;
};
type OperationReceipt = {
    readonly id: string;
    readonly url?: string;
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
type ExecutionDiagnostic = {
    readonly level: "info" | "warning" | "error";
    readonly message: string;
    readonly stream?: "stdout" | "stderr";
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
type Awaitable<T> = T | Promise<T>;
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
type EndpointPricingDocument = {
    readonly source: string;
    readonly data: CanonicalValue;
    readonly summary?: string;
};
type EndpointPricingReaderContext = {
    readonly request: EndpointRequest;
    readonly credentials: () => Promise<Readonly<Record<string, EndpointCredential>>>;
};
type EndpointPricingReader = (context: EndpointPricingReaderContext) => Awaitable<readonly EndpointPricingDocument[]>;
declare function verifyEndpointPricingDocument(value: EndpointPricingDocument): void;
type EndpointInvocationContext = {
    readonly command: FulfillNeedCommand;
    readonly need: Need;
    readonly resources: ResourceStore;
    readonly credentials: Readonly<Record<string, EndpointCredential>>;
    readonly reportDiagnostic?: (diagnostic: ExecutionDiagnostic) => Promise<void>;
    readonly reportProgress?: (progress: OperationProgress) => Promise<void>;
};
type ImmediateEndpointHandler = (context: EndpointInvocationContext) => Awaitable<EndpointFulfillment>;
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
type EndpointActionLimits = Partial<Readonly<Record<EndpointAction, {
    readonly concurrency?: number;
    readonly rate?: {
        readonly limit: number;
        readonly periodMs: number;
    };
}>>>;
declare function actionResourceClaims(pool: string, limits: EndpointActionLimits): NonNullable<EndpointScheduling["actions"]>;
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
    start(context: EndpointStartContext): Awaitable<EndpointOutcome>;
    poll(context: EndpointPollContext): Awaitable<EndpointOutcome>;
    cancel?(context: EndpointPollContext): Awaitable<EndpointCancelOutcome>;
    collect?(context: EndpointPollContext): Awaitable<EndpointOutcome>;
};
type EndpointScheduling = {
    readonly resources: readonly CapacityResourceClaim[];
    readonly actions?: Partial<Readonly<Record<EndpointAction, readonly CapacityResourceClaim[]>>>;
    readonly unitsForRequest?: (request: EndpointRequest) => Readonly<Record<string, number>>;
};
declare function endpointResourceClaims(scheduling: EndpointScheduling, request: EndpointRequest): readonly CapacityResourceClaim[];
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
type EndpointPricing = {
    readonly kind: "page";
    readonly url: string;
} | {
    readonly kind: "local";
};
type EndpointInstance = {
    readonly instance: {
        readonly id: string;
        readonly pool: string;
    };
    readonly offers: readonly EndpointOffer[];
    readonly credentials: readonly EndpointCredentialDescription[];
    readonly pricing?: EndpointPricing;
    readonly readPricing?: EndpointPricingReader;
    install(registry: EndpointRegistrar): Awaitable<void>;
};
type EndpointOffer = {
    readonly capability: CapabilityRef;
    readonly returns: TypeRef;
    readonly endpoint: string;
    readonly supports?: (request: EndpointRequest) => EndpointSupport;
    readonly transient?: true;
};
type EndpointCredentialDescription = {
    readonly endpoint: string;
    readonly slot: string;
    readonly label: string;
    readonly kind: "secret" | "json";
    readonly ref: CredentialRef;
    readonly acquisition?: CredentialAcquisition;
};
type EndpointCapabilityBase = {
    readonly resources?: readonly CapacityResourceClaim[];
    readonly unitsForRequest?: EndpointScheduling["unitsForRequest"];
    readonly capability: CapabilityRef;
    readonly returns: TypeRef;
    readonly supports?: (request: EndpointRequest) => EndpointSupport;
    readonly transient?: true;
    readonly capacity?: string;
    readonly maxConcurrency?: number;
};
type ImmediateEndpointCapability = EndpointCapabilityBase & {
    readonly lifecycle: "immediate";
    readonly handler: ImmediateEndpointHandler;
};
type AsyncEndpointCapability = EndpointCapabilityBase & {
    readonly lifecycle: "asynchronous";
    readonly endpoint: AsyncEndpoint;
};
type EndpointCapability = ImmediateEndpointCapability | AsyncEndpointCapability;
type DefineEndpointOptions = {
    readonly instance: string;
    readonly pool: string;
    readonly credentials?: Readonly<Record<string, CredentialRef>>;
    readonly credentialInputs?: Readonly<Record<string, {
        readonly label: string;
        readonly kind?: "secret" | "json";
        readonly acquisition?: CredentialAcquisition;
    }>>;
    readonly defaultConcurrency?: number;
    readonly actions?: EndpointScheduling["actions"];
    readonly actionLimits?: EndpointActionLimits;
    readonly pricing?: EndpointPricing;
    readonly readPricing?: EndpointPricingReader;
    readonly capabilities: readonly EndpointCapability[];
};
declare function defineEndpoint(options: DefineEndpointOptions): EndpointInstance;
declare function wakeAfter(handle: CanonicalValue, delayMs: number, now?: number, progress?: OperationProgress): {
    readonly status: "pending";
    readonly handle: CanonicalValue;
    readonly wakeAt: number;
    readonly progress?: OperationProgress;
};
declare class EndpointServiceError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
}
export { EndpointServiceError, actionResourceClaims, canonicalize, credentialRef, decodeOAuth2Credential, defineEndpoint, encodeOAuth2Credential, endpointActions, endpointResourceClaims, isStreamingResourceStore, verifyEndpointPricingDocument, wakeAfter };
export type { AsyncEndpoint, AsyncEndpointCapability, Awaitable, BlobRef, CanonicalValue, CapabilityRef, CapacityResourceClaim, CredentialAcquisition, CredentialRef, CredentialValue, DefineEndpointOptions, EndpointAction, EndpointActionLimits, EndpointCancelOutcome, EndpointCapability, EndpointCheckpoint, EndpointCredential, EndpointCredentialDescription, EndpointFulfillment, EndpointInputSlot, EndpointInstance, EndpointInvocationContext, EndpointOffer, EndpointOutcome, EndpointPollContext, EndpointPricing, EndpointPricingDocument, EndpointPricingReader, EndpointPricingReaderContext, EndpointRegistrar, EndpointRegistrationOptions, EndpointRequest, EndpointScheduling, EndpointStartContext, EndpointSupport, ExecutionDiagnostic, ImmediateEndpointCapability, ImmediateEndpointHandler, ModuleRef, OperationFailure, OperationProgress, OperationReceipt, ResourceIOOptions, ResourceId, ResourceStore, StoredValue, TypeRef };
