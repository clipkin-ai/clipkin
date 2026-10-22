import { createMarkupSurfaceFacet } from "@clipkin/clipkin/markup";
import { createAdmissionPackageFacet } from "@clipkin/clipkin/admission";
import { createProducerPackageFacet } from "@clipkin/clipkin/producer";
import { decodeExampleSurface, exampleComponent, exampleManifest, exampleMarkupSurfaces, exampleModuleRef } from "./index.js";

export const clipkinPackage = {
  format: "clipkin.package@1" as const,
  modules: [{ manifest: exampleManifest }],
  facets: [
    createProducerPackageFacet(exampleComponent),
    createAdmissionPackageFacet(exampleComponent),
    ...exampleMarkupSurfaces.map((declaration) => createMarkupSurfaceFacet({ module: exampleModuleRef, declaration, handler: decodeExampleSurface })),
  ],
};
export default clipkinPackage;
