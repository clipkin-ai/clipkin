declare function findProjectRoot(options?: {
    readonly cwd?: string;
}): Promise<string | undefined>;
declare function resolveProjectRoot(options?: {
    readonly projectRoot?: string;
    readonly cwd?: string;
}): Promise<string>;
export { findProjectRoot, resolveProjectRoot };
