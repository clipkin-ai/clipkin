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
declare const blobModuleRef: {
    readonly name: "@clipkin/blob";
    readonly version: "1";
};
declare const blobTypes: {
    blob: {
        module: {
            readonly name: "@clipkin/blob";
            readonly version: "1";
        };
        name: string;
    };
};
declare const blobManifest: ModuleManifest;
declare const blobDependency: {
    readonly module: {
        readonly name: "@clipkin/blob";
        readonly version: "1";
    };
};
export { blobDependency, blobManifest, blobModuleRef, blobTypes };
