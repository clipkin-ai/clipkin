type Facet = {
    readonly abi: string;
    readonly offers?: readonly string[];
    readonly implementation: unknown;
};
type ResourceId = `res_${string}`;
type RecordId = string;
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
type TypeValidatorContext = {
    readonly type: TypeRef;
    readonly value: StoredValue;
};
type TypeValidatorHandler = (context: TypeValidatorContext) => void | Promise<void>;
interface TypeValidatorRegistrar {
    register(type: TypeRef, handler: TypeValidatorHandler): void;
}
type TypeValidatorFacet = {
    readonly type: TypeRef;
    readonly handler: TypeValidatorHandler;
};
type AdmissionPackage = {
    readonly validators?: readonly TypeValidatorFacet[];
};
declare const admissionPackageFacetAbi = "clipkin.admission-package@1";
type AdmissionPackageFacet = Facet & {
    readonly abi: typeof admissionPackageFacetAbi;
    readonly implementation: AdmissionPackage;
};
declare function createAdmissionPackageFacet(value: unknown): AdmissionPackageFacet;
declare function admissionPackagesFromFacets(facets: readonly Facet[]): readonly AdmissionPackage[];
declare function registerTypeValidatorFacets(registry: TypeValidatorRegistrar, facets: readonly TypeValidatorFacet[]): void;
type TypeValidatorRegistration = {
    readonly handler: TypeValidatorHandler;
};
interface TypeValidatorRegistryLike {
    resolve(type: TypeRef): TypeValidatorRegistration | undefined;
}
declare class TypeValidationError extends Error {
    readonly code: string;
    readonly subject: string | undefined;
    constructor(code: string, message: string, subject?: string);
}
declare class TypeValidatorRegistry implements TypeValidatorRegistryLike, TypeValidatorRegistrar {
    #private;
    register(type: TypeRef, handler: TypeValidatorHandler): void;
    resolve(type: TypeRef): TypeValidatorRegistration | undefined;
}
declare function validateValue(closure: ResolvedModuleClosure, type: TypeRef, value: StoredValue, registry: TypeValidatorRegistryLike): Promise<void>;
declare function admitRecord(closure: ResolvedModuleClosure, record: TypedRecord, registry: TypeValidatorRegistryLike): Promise<TypedRecord>;
declare function createRecordAdmitter(registry: TypeValidatorRegistryLike): (closure: ResolvedModuleClosure, record: TypedRecord) => Promise<void>;
export { TypeValidationError, TypeValidatorRegistry, admissionPackageFacetAbi, admissionPackagesFromFacets, admitRecord, createAdmissionPackageFacet, createRecordAdmitter, registerTypeValidatorFacets, validateValue };
export type { AdmissionPackage, AdmissionPackageFacet, TypeValidatorContext, TypeValidatorFacet, TypeValidatorHandler, TypeValidatorRegistrar, TypeValidatorRegistration, TypeValidatorRegistryLike };
