type Facet = {
    readonly abi: string;
    readonly offers?: readonly string[];
    readonly implementation: unknown;
};
type FrontendImplementation = {
    readonly id: string;
};
type FrontendFacet<Kind extends string, Frontend extends FrontendImplementation> = Facet & {
    readonly offers: readonly [
        string
    ];
    readonly implementation: {
        readonly kind: Kind;
        readonly frontend: Frontend;
    };
};
declare function createFrontendFacet<Kind extends string, Frontend extends FrontendImplementation>(abi: string, kind: Kind, frontend: Frontend): FrontendFacet<Kind, Frontend>;
declare function frontendsFromFacets<Kind extends string, Frontend extends FrontendImplementation>(abi: string, kind: Kind, facets: readonly Facet[]): readonly Frontend[];
export { createFrontendFacet, frontendsFromFacets };
export type { Facet, FrontendFacet, FrontendImplementation };
