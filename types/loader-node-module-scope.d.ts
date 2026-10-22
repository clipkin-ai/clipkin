declare function scopedCommonJs(id: string, filename: string): unknown;
declare class NodeModuleScope {
    #private;
    constructor();
    import(url: string): Promise<unknown>;
    commonJs(filename: string, parent?: NodeJS.Module): unknown;
    close(): void;
}
export { NodeModuleScope, scopedCommonJs };
