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
declare function verifyPackageContributions(packages: readonly PackageContribution[]): void;
export { verifyPackageContributions };
export type { LoadedPackage, LogicalPackageAddress, ModuleContribution, PackageContribution };
