# API reference

Every public module, its declaration file inside the engine, and what it exports. The declaration
files hold the exact signatures; read the one you need when writing a component or Provider package.
The engine is installed at `$CLIPKIN_ENGINE_ROOT`; paths below are relative to it.

## `@clipkin/clipkin/cli`

Declarations: `types/cli.d.ts`

`CliApplicationContext`, `CliBuildCatalogDescriptor`, `CliBuildSubmission`, `CliBuildView`, `CliCapabilityPricing`, `CliCapabilityProvider`, `CliCommandModule`, `CliCompilerOptions`, `CliCredentialControl`, `CliCredentialStatus`, `CliDiagnostic`, `CliDistribution`, `CliInvocationObservation`, `CliIo`, `CliMachineView`, `CliOutputOptions`, `CliProviderQuery`, `CliResultControl`, `CliResultRepositoryLocation`, `CliRuntime`, `CliRuntimeControl`, `CliRuntimeDoctorResult`, `CliRuntimeHost`, `CliTerminal`, `CliTransientExecution`, `cliProviderLine`, `cliProviderView`, `clipkinHostStateRoot`, `clipkinProjectStateRoot`, `commandHint`, `createCliScratchResources`, `discoverSourcePackages`, `loadDiscoveredSourcePackages`, `openCliRuntimeHost`, `resolveBuildResultValue`, `selectCliProvider`, `writeCliOutput`

## `@clipkin/clipkin/compiler`

Declarations: `types/compiler.d.ts`

`CheckedRun`, `CompileSourceClosureRequest`, `CompiledAuthorSource`, `CompiledRun`, `Compiler`, `CompilerError`, `CompilerOptions`, `ModulePackageRegistry`, `ModulePackageRegistryLike`, `PlannedBuild`, `RegisteredModulePackage`, `RunCompiler`, `RunCompilerOptions`, `SourceClosureError`, `compileSourceClosure`, `findCandidate`, `findLogicalOutput`, `findOperation`, `findOperationsByProducer`, `walkOperationInputs`

## `@clipkin/clipkin/executor`

Declarations: `types/executor.d.ts`

`BlockedCommand`, `EndpointRegistration`, `EndpointRegistry`, `EndpointResolution`, `Executor`, `ExecutorExecutionOutcome`, `ExecutorOptions`, `ExecutorRunResult`, `MemoryResourceStore`, `ProducerHandler`, `ProducerHandlerContext`, `ProducerHandlerResult`, `ProducerPlanEvaluation`, `ProducerRegistrar`, `ProducerRegistration`, `ProducerRegistry`, `evaluateProducerPlan`

## `@clipkin/clipkin/kernel`

Declarations: `types/kernel.d.ts`

`BuildCandidateSelection`, `BuildMachine`, `PlannedExecution`, `PlannedNeed`, `admitBuildResult`, `compileBuild`, `createResolvedClosure`, `defineBuild`, `link`, `materializeBuild`, `operationResultRecord`, `planBuild`, `plannedNeeds`, `reduce`, `resolveCandidate`, `resolveLogicalOutput`, `resolveNeedCommand`, `resolveOperation`, `resolveProducer`, `resolveType`, `satisfiedCandidate`, `sealBuildRequest`, `sealCompiledGraph`, `sealRecord`, `sliceExecution`, `start`, `verifyBuildRequest`, `verifyClosure`, `verifyCompiledGraph`, `verifyRecordStructure`

## `@clipkin/clipkin/project`

Declarations: `types/project.d.ts`

`findProjectRoot`, `resolveProjectRoot`

## `@clipkin/clipkin/runtime`

Declarations: `types/runtime.d.ts`

`BuildSchedulerOptions`, `BuildSnapshot`, `BuildStore`, `CapacityAcquire`, `CapacityAcquireRequest`, `CapacityReservation`, `CapacityResourceClaim`, `CommandExecutionBegin`, `CommandExecutionReceipt`, `CommandExecutionStore`, `CompositeCredentialStore`, `CredentialAcquisition`, `CredentialRef`, `CredentialStore`, `CredentialValue`, `ExecutionDiagnostic`, `ExecutionLogEvent`, `ExecutionLogRecord`, `ExecutionLogView`, `InProcessBuildScheduler`, `OAuth2Credential`, `OperationCompletion`, `OperationFacts`, `OperationFailure`, `OperationIdentity`, `OperationProgress`, `OperationQuery`, `OperationReceipt`, `OperationSnapshot`, `OperationStore`, `OperationUpdate`, `ResourceIOOptions`, `ResourceStore`, `RuntimeActionExecutor`, `RuntimeActionResult`, `RuntimeBlockedCommand`, `RuntimeBuildExecution`, `RuntimeCommandExecutor`, `RuntimeExecutionContext`, `RuntimeExecutionResult`, `RuntimePreparation`, `RuntimeResourceClaim`, `RuntimeRunnableCommand`, `ScheduledBuild`, `ScheduledBuildResult`, `SchedulerExecutionOutcome`, `StreamingResourceStore`, `WritableCredentialStore`, `capacityUnits`, `credentialRef`, `decodeOAuth2Credential`, `encodeOAuth2Credential`, `isStreamingResourceStore`, `isWritableCredentialStore`, `readExecutionLog`, `verifyCredentialRef`, `writableCredentialStore`

## `@clipkin/clipkin/source`

Declarations: `types/source.d.ts`

`Awaitable`, `ResolvedSource`, `ResolvedSourceAsset`, `SourceAssetRequest`, `SourceAssetResolver`, `SourceImportRequest`, `SourceResolver`, `SourceUnit`, `decodeSourceText`, `sourceFrontendPackageAbi`

## `@clipkin/clipkin/source/text`

Declarations: `types/source-text.d.ts`

`SourceHeader`, `SourceHeaderError`, `maskSourceHeader`, `parseSourceHeader`, `resolveSelfDescribedTextSource`

## `@clipkin/clipkin/workspace`

Declarations: `types/workspace.d.ts`

`BlobAttachment`, `Workspace`, `WorkspaceError`, `WorkspaceSession`

## `@clipkin/clipkin/workspace/node`

Declarations: `types/workspace-node.d.ts`

`NodeFilesystemExternalAsset`, `NodeFilesystemExternalAssetResolver`, `NodeFilesystemExternalSource`, `NodeFilesystemExternalSourceResolver`, `NodeFilesystemSourceAdapter`, `NodeFilesystemWorkspace`, `NodeFilesystemWorkspaceOptions`

## `@clipkin/clipkin/blob`

Declarations: `types/blob.d.ts`

`blobDependency`, `blobManifest`, `blobModuleRef`, `blobTypes`

## `@clipkin/clipkin/admission`

Declarations: `types/admission.d.ts`

`AdmissionPackage`, `AdmissionPackageFacet`, `TypeValidationError`, `TypeValidatorContext`, `TypeValidatorFacet`, `TypeValidatorHandler`, `TypeValidatorRegistrar`, `TypeValidatorRegistration`, `TypeValidatorRegistry`, `TypeValidatorRegistryLike`, `admissionPackageFacetAbi`, `admissionPackagesFromFacets`, `admitRecord`, `createAdmissionPackageFacet`, `createRecordAdmitter`, `registerTypeValidatorFacets`, `validateValue`

## `@clipkin/clipkin/producer`

Declarations: `types/producer.d.ts`

`Awaitable`, `PlannedNeedFacet`, `PlannedNeedInput`, `PlannedNeedPresentation`, `PlannedNeedSpecification`, `ProducerFacet`, `ProducerHandler`, `ProducerHandlerContext`, `ProducerHandlerResult`, `ProducerPackage`, `ProducerPackageFacet`, `ProducerRegistrar`, `createProducerPackageFacet`, `plannedNeedInputs`, `producerPackageFacetAbi`, `producerPackagesFromFacets`, `registerProducerFacets`

## `@clipkin/clipkin/facet`

Declarations: `types/facet.d.ts`

`Facet`, `FrontendFacet`, `FrontendImplementation`, `createFrontendFacet`, `frontendsFromFacets`

## `@clipkin/clipkin/protocol`

Declarations: `types/protocol.d.ts`

`BlobRef`, `BuildCommand`, `BuildDefinition`, `BuildDiagnostic`, `BuildFact`, `BuildGoal`, `BuildOutputBinding`, `BuildPlan`, `BuildRequest`, `BuildState`, `BuildTarget`, `Candidate`, `CandidateId`, `CandidateRoot`, `CanonicalValue`, `CapabilityDeclaration`, `CapabilityRef`, `CommandFailedEvent`, `CommandFailedFact`, `CommandId`, `CommandResult`, `CompiledGraph`, `FulfillNeedCommand`, `GraphValueRef`, `InvokeProducerCommand`, `LinkedProgram`, `LogicalOutput`, `LogicalOutputId`, `LogicalOutputRef`, `ModuleDependency`, `ModuleManifest`, `ModuleRef`, `Need`, `NeedAppliedFact`, `NeedBinding`, `NeedFulfilledEvent`, `NeedId`, `NeedPortDeclaration`, `ObjectFieldSchema`, `OperationId`, `OperationNode`, `OperationResult`, `OperationResultRef`, `PortDeclaration`, `ProducerAppliedFact`, `ProducerCompletedEvent`, `ProducerDeclaration`, `ProducerRef`, `ProducerStep`, `ProvidedValue`, `RecordId`, `RecordRef`, `ReelError`, `ResolvedCapabilityDeclaration`, `ResolvedModule`, `ResolvedModuleClosure`, `ResolvedProducerDeclaration`, `ResolvedTypeDeclaration`, `ResourceId`, `RunGraph`, `Satisfaction`, `SourceRange`, `StepId`, `StepState`, `StoredValue`, `TypeDeclaration`, `TypeRef`, `TypedRecord`, `ValueSchema`, `assertBuildId`, `assertOrderedBuildId`, `blobRefObjectSchema`, `buildIdCreatedAt`, `canonicalStringify`, `canonicalize`, `capabilityKey`, `isResourceId`, `moduleKey`, `modulePackageAbi`, `orderedBuildId`, `producerKey`, `sameModule`, `sameType`, `typeKey`

## `@clipkin/clipkin/author`

Declarations: `types/author.d.ts`

`AuthorComponent`, `AuthorComponentOutputRef`, `AuthorElementProvenance`, `AuthorElementProvenanceDraft`, `AuthorFrontend`, `AuthorFrontendError`, `AuthorFrontendFacet`, `AuthorFrontendRegistry`, `AuthorFrontendRegistryLike`, `AuthorFrontendSourceUnit`, `AuthorGraphError`, `AuthorInputProvenance`, `AuthorInputProvenanceDraft`, `AuthorOutputBinding`, `AuthorProvenance`, `AuthorRecordAdmitter`, `AuthorRecordRef`, `AuthorSourceAssetRequest`, `AuthorSourceAssetResolver`, `AuthorSourceDecodeContext`, `AuthorSourceDiscovery`, `AuthorSourceExport`, `AuthorSourceIdentity`, `AuthorSourceImport`, `AuthorSourceResolver`, `AuthorSourceUnit`, `AuthorValueRef`, `Awaitable`, `CompiledSourceClosure`, `CompiledSourceExport`, `DecodedAuthorSource`, `ElaboratedFragment`, `ElaboratedFragmentExport`, `FragmentContribution`, `FragmentError`, `FragmentExport`, `FragmentInputRef`, `FragmentInstanceRequest`, `FragmentOperation`, `FragmentOperationRef`, `FragmentOperationResult`, `FragmentValueRef`, `GraphFragment`, `GraphFragmentResolver`, `ResolvedAuthorSourceAsset`, `ResolvedAuthorSourceImport`, `RunFragmentContribution`, `RunFragmentExport`, `SourceClosure`, `SourceClosureUnit`, `authorFrontendsFromFacets`, `bindAuthorFragment`, `createAuthorFrontendFacet`, `elaborateAuthorGraph`, `elaborateGraphFragment`, `exportRunFragment`, `installAuthorFrontendFacets`, `mergeFragmentContributions`, `resolveCompiledSourceExport`, `sealGraphFragment`, `verifyGraphFragment`

## `@clipkin/clipkin/markup`

Declarations: `types/markup.d.ts`

`MarkupAttributeValue`, `MarkupAuthorFrontend`, `MarkupAuthorFrontendOptions`, `MarkupDecodeContext`, `MarkupDecodeResult`, `MarkupDiscovery`, `MarkupFrontendError`, `MarkupImportRequest`, `MarkupReference`, `MarkupSource`, `MarkupSurfaceDeclaration`, `MarkupSurfaceFacetOptions`, `MarkupSurfaceRegistry`, `MarkupSurfaceRegistryLike`, `RawSurfaceDeclaration`, `RawSurfaceHandler`, `RawSurfaceInput`, `RawSurfaceOutput`, `RegisteredRawSurface`, `RegisteredStructuredSurface`, `RegisteredSurface`, `StructuredElement`, `StructuredNode`, `StructuredSurfaceDeclaration`, `StructuredSurfaceHandler`, `StructuredSurfaceInput`, `StructuredText`, `SurfaceAttributeKind`, `SurfaceAttributeVocabulary`, `SurfaceChildVocabulary`, `SurfaceComponentDraft`, `SurfaceDecodeOutput`, `SurfacePortVocabulary`, `SurfacePreview`, `SurfaceRecipePropertyVocabulary`, `SurfaceRecordDraft`, `SurfaceResolvedReference`, `SurfaceVocabulary`, `assertAttributes`, `assertEmptyElement`, `assertExactAttributes`, `closeDocument`, `createMarkupAuthorFrontend`, `createMarkupSurfaceFacet`, `decodeMarkup`, `discoverMarkup`, `installMarkupSurfaceFacets`, `localName`, `markupAuthorFrontendId`, `markupSurfaceFacetAbi`, `optionalTextAttribute`, `parseOpeningTag`, `parseStructuredElement`, `skipTextTrivia`, `textAttribute`

## `@clipkin/clipkin/markup/run`

Declarations: `types/markup-run.d.ts`

`RunSyntaxError`, `parseRunDocument`, `runMarkupFrontend`, `runMarkupFrontendId`

## `@clipkin/clipkin/run`

Declarations: `types/run.d.ts`

`DecodedRunSource`, `ProvidedCandidateInput`, `ResolveRunDocumentContext`, `RunAuthorSourceRequest`, `RunBuildRecord`, `RunCandidateDeclaration`, `RunCandidateSource`, `RunCompilation`, `RunDocument`, `RunFragmentFacet`, `RunFragmentInput`, `RunFragmentInstance`, `RunFragmentPackage`, `RunFragmentRegistry`, `RunFragmentRegistryLike`, `RunFrontend`, `RunFrontendFacet`, `RunFrontendRegistry`, `RunFrontendRegistryLike`, `RunFrontendSourceUnit`, `RunGraph`, `RunGraphError`, `RunImport`, `RunProvidedFile`, `RunProvidedValue`, `RunSatisfaction`, `RunSourceDiscovery`, `RunSourceError`, `RunSourceUnit`, `RunTarget`, `collectRunModuleRequests`, `compileRunSource`, `createProvidedCandidate`, `createRunFragmentFacet`, `createRunFrontendFacet`, `installRunFragmentFacets`, `resolveRunDocument`, `runFragmentFacetAbi`, `runFrontendsFromFacets`, `sealRunGraph`, `verifyRunGraph`

## `@clipkin/clipkin/result`

Declarations: `types/result.d.ts`

`BuildResultBrowseRequest`, `BuildResultFileRange`, `BuildResultFileRef`, `BuildResultFinish`, `BuildResultForward`, `BuildResultManifest`, `BuildResultOperation`, `BuildResultOutcome`, `BuildResultOutput`, `BuildResultOutputValue`, `BuildResultPage`, `BuildResultPresentationUpdate`, `BuildResultPublishedOutput`, `BuildResultRepository`, `BuildResultResourceBinding`, `BuildResultResourceSource`, `BuildResultSeed`, `BuildResultSync`, `BuildResultSyncResult`, `BuildResultValueDocument`, `BuildResultValuePath`, `BuildResultWriteTarget`, `BuildResultWriter`, `BuildResultWriterState`, `FinishedBuildResultManifest`, `HistoricalBuildOutputRef`, `RepositoryBuildResultOutput`, `RepositoryBuildResultOutputDescription`, `RepositoryBuildResultOutputLocation`, `ResolvedBuildResultOutput`, `assertBuildResultFileRef`, `assertBuildResultPath`, `assertBuildResultSeed`, `assertBuildResultValueDocument`, `decodeBuildResultJson`, `decodeBuildResultManifest`, `decodeBuildResultValueDocument`, `decodeBuildResultWriterState`, `encodeBuildResultManifest`, `preserveExecutionLog`, `syncBuildResultOutputs`

## `@clipkin/clipkin/result/node`

Declarations: `types/result-node.d.ts`

`BuildResultBrowseRequest`, `BuildResultFileRange`, `BuildResultFileRef`, `BuildResultFinish`, `BuildResultForward`, `BuildResultManifest`, `BuildResultOperation`, `BuildResultOutcome`, `BuildResultOutput`, `BuildResultOutputValue`, `BuildResultPage`, `BuildResultPresentationUpdate`, `BuildResultPublishedOutput`, `BuildResultRepository`, `BuildResultResourceBinding`, `BuildResultResourceSource`, `BuildResultSeed`, `BuildResultSync`, `BuildResultSyncResult`, `BuildResultValueDocument`, `BuildResultValuePath`, `BuildResultWriteTarget`, `BuildResultWriter`, `BuildResultWriterState`, `ExternalFileAccess`, `FileBuildResult`, `FileBuildResultRepository`, `FinishedBuildResultManifest`, `HistoricalBuildOutputRef`, `RepositoryBuildResultOutput`, `RepositoryBuildResultOutputDescription`, `RepositoryBuildResultOutputLocation`, `ResolvedBuildResultOutput`, `applyBuildResultPresentation`, `assertBuildResultFileRef`, `assertBuildResultPath`, `assertBuildResultSeed`, `assertBuildResultValueDocument`, `browseBuildResults`, `buildResultDirectory`, `currentFileReference`, `decodeBuildResultJson`, `decodeBuildResultManifest`, `decodeBuildResultValueDocument`, `decodeBuildResultWriterState`, `describeBuildResultOutput`, `encodeBuildResultManifest`, `fileReferenceIdentity`, `localExternalFiles`, `locateBuildResultOutput`, `locateRepositoryBuildResultOutput`, `normalizeBuildResultForwards`, `ownedFileReference`, `preserveExecutionLog`, `readBuildResult`, `resolveBuildResultOutput`, `syncBuildResultOutputs`

## `@clipkin/clipkin/endpoint`

Declarations: `types/endpoint.d.ts`

`AsyncEndpoint`, `AsyncEndpointCapability`, `Awaitable`, `BlobRef`, `CanonicalValue`, `CapabilityRef`, `CapacityResourceClaim`, `CredentialAcquisition`, `CredentialRef`, `CredentialValue`, `DefineEndpointOptions`, `EndpointAction`, `EndpointActionLimits`, `EndpointCancelOutcome`, `EndpointCapability`, `EndpointCheckpoint`, `EndpointCredential`, `EndpointCredentialDescription`, `EndpointFulfillment`, `EndpointInputSlot`, `EndpointInstance`, `EndpointInvocationContext`, `EndpointOffer`, `EndpointOutcome`, `EndpointPollContext`, `EndpointPricing`, `EndpointPricingDocument`, `EndpointPricingReader`, `EndpointPricingReaderContext`, `EndpointRegistrar`, `EndpointRegistrationOptions`, `EndpointRequest`, `EndpointScheduling`, `EndpointServiceError`, `EndpointStartContext`, `EndpointSupport`, `ExecutionDiagnostic`, `ImmediateEndpointCapability`, `ImmediateEndpointHandler`, `ModuleRef`, `OperationFailure`, `OperationProgress`, `OperationReceipt`, `ResourceIOOptions`, `ResourceId`, `ResourceStore`, `StoredValue`, `TypeRef`, `actionResourceClaims`, `canonicalize`, `credentialRef`, `decodeOAuth2Credential`, `defineEndpoint`, `encodeOAuth2Credential`, `endpointActions`, `endpointResourceClaims`, `isStreamingResourceStore`, `verifyEndpointPricingDocument`, `wakeAfter`

## `@clipkin/clipkin/endpoint/http`

Declarations: `types/endpoint-http.d.ts`

`EndpointHttpError`, `EndpointResponseError`, `EndpointTransportError`, `RequestDeadline`, `endpointTransportError`, `retryAfterMs`, `transport`, `withRequestDeadline`

## `@clipkin/clipkin/loader`

Declarations: `types/loader.d.ts`

`LoadedPackage`, `LogicalPackageAddress`, `ModuleContribution`, `PackageContribution`, `verifyPackageContributions`

## `@clipkin/clipkin/loader/node`

Declarations: `types/loader-node.d.ts`

`LocateNodePackageOptions`, `LocatedNodePackage`, `LocatedNodePackageResource`, `NodePackageLoadOptions`, `NodePackageNotFoundError`, `NodePackageSelectionMissingError`, `NodePackageSelectionRequest`, `distributionPackageRoots`, `installDistributionPackageResolution`, `loadNodePackageSelection`, `locateNodePackage`, `physicalPackageName`, `resolveDistributionPackageImport`, `resolveNodePackageResource`, `resolveNodePackageResourceSpecifier`, `resolveNodePackageSource`

## `@clipkin/clipkin/loader/node/module-scope`

Declarations: `types/loader-node-module-scope.d.ts`

`NodeModuleScope`, `scopedCommonJs`

## `@clipkin/clipkin/atomic-file`

Declarations: `types/atomic-file.d.ts`

`replaceFile`

## `@clipkin/clipkin/recipe`

Declarations: `types/recipe.d.ts`

`ParsedGradeProperty`, `ParsedGradeRecipe`, `ParsedGradeSheet`, `Recipe`, `RecipeSyntaxError`, `formatRecipeValue`, `parseRecipe`, `recipeFrontend`, `recipeFrontendId`, `recipeManifest`, `recipeModuleRef`, `recipeType`

## `@clipkin/clipkin/text`

Declarations: `types/text.d.ts`

`Text`, `TextBinding`, `TextBindingValue`, `TextBindings`, `TextCondition`, `TextExpression`, `TextFragmentBinding`, `TextScalar`, `TextTemplate`, `TextTransform`, `bindText`, `createTextRenderFragment`, `decodeTextRenderSurface`, `decodeTextValueSurface`, `renderText`, `sealText`, `sealTextBinding`, `sealTextBindings`, `sealTextTemplate`, `textComponent`, `textDependency`, `textManifest`, `textMarkupSurfaces`, `textModuleRef`, `textProducers`, `textRecipeFrontend`, `textRecipeFrontendId`, `textTemplateBindingNames`, `textTemplateFromRecipes`, `textTypes`, `verifyText`, `verifyTextBinding`, `verifyTextBindings`, `verifyTextTemplate`

