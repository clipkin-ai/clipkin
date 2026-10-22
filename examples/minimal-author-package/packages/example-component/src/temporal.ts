import { resolveTemporalInstantReference, resolveTemporalWindowReference, temporalInstantAttributeNames, temporalWindowAttributeNames } from "@clipkin/temporal/markup";

/** The fixture intentionally exposes both projection helpers and their vocabularies. */
export { temporalInstantAttributeNames, temporalWindowAttributeNames };
export const projectExampleWindow = resolveTemporalWindowReference;
export const projectExampleMoment = resolveTemporalInstantReference;
