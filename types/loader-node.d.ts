type Facet = {
    readonly abi: string;
    readonly offers?: readonly string[];
    readonly implementation: unknown;
};
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
type NodePackageSelectionRequest = {
    readonly selected: readonly string[];
    readonly logical?: readonly LogicalPackageAddress[];
};
type NodePackageLoadOptions = {
    readonly importModule?: (url: string) => Promise<unknown>;
    readonly fallbackRoots?: readonly string[];
};
declare function physicalPackageName(logical: string): string;
declare class NodePackageSelectionMissingError extends Error {
    readonly address: LogicalPackageAddress;
    readonly code = "PACKAGE_SELECTION_MISSING";
    constructor(address: LogicalPackageAddress);
}
declare function loadNodePackageSelection(request: readonly string[] | NodePackageSelectionRequest, root: string, options?: NodePackageLoadOptions): Promise<readonly LoadedPackage[]>;
declare function resolveDistributionPackageImport(root: string, specifier: string): string | undefined;
declare function installDistributionPackageResolution(roots: readonly string[]): void;
declare class NodePackageNotFoundError extends Error {
    constructor(name: string);
}
type LocatedNodePackage = {
    readonly root: string;
    readonly manifest: {
        readonly name: string;
        readonly version?: string;
        readonly bin?: string | Readonly<Record<string, string>>;
    };
};
type LocatedNodePackageSource = {
    readonly specifier: string;
    readonly package: string;
    readonly root: string;
    readonly source: string;
};
type LocatedNodePackageResource = {
    readonly specifier: string;
    readonly package: string;
    readonly root: string;
    readonly resource: string;
};
type LocateNodePackageOptions = {
    readonly from: string | URL;
    readonly workspaceRoots?: readonly string[];
    readonly distributionRoots?: readonly string[];
};
declare function distributionPackageRoots(root: string): readonly string[];
declare function locateNodePackage(nameValue: string, options: LocateNodePackageOptions): LocatedNodePackage;
declare function resolveNodePackageResource(name: string, relativePath: string, options: LocateNodePackageOptions): string;
declare function resolveNodePackageResourceSpecifier(specifier: string, options: LocateNodePackageOptions): LocatedNodePackageResource;
declare function resolveNodePackageSource(specifier: string, options: LocateNodePackageOptions): LocatedNodePackageSource;
export { NodePackageNotFoundError, NodePackageSelectionMissingError, distributionPackageRoots, installDistributionPackageResolution, loadNodePackageSelection, locateNodePackage, physicalPackageName, resolveDistributionPackageImport, resolveNodePackageResource, resolveNodePackageResourceSpecifier, resolveNodePackageSource };
export type { LocateNodePackageOptions, LocatedNodePackage, LocatedNodePackageResource, NodePackageLoadOptions, NodePackageSelectionRequest };
