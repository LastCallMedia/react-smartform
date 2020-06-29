import type {
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
  ExtractConfigFromHandler,
} from "../types";
import { StringSchema } from "yup";
import { Constructor } from "../types";

interface PatternValidation {
  pattern: string;
  message?: string;
}
interface MatchesValidation {
  matches: string | string[];
  message?: string;
}
type WithValidation = PatternValidation | MatchesValidation;
export interface ValidationConfig {
  validate?: WithValidation[];
}

/**
 * This decorator adds advanced validation options.
 */
export default function withValidation<
  HandlerConstructor extends Constructor<FieldHandler>,
  HandlerInstance extends InstanceType<HandlerConstructor>,
  Config extends ExtractConfigFromHandler<HandlerInstance>
>(
  constructor: HandlerConstructor
): Constructor<FieldHandler<Config & ValidationConfig>> {
  return class extends constructor {
    render(config: Config & ValidationConfig, context: FieldRenderContext) {
      return super.render(config, context);
    }
    buildYupSchema(
      config: Config & ValidationConfig,
      context: FieldValidationContext
    ) {
      const schema = super.buildYupSchema(config, context);
      if (schema === false) {
        return false;
      }
      const validations = config.validate || [];
      return validations.reduce((derivedSchema, validation) => {
        if ("pattern" in validation) {
          if (derivedSchema.type !== "string") {
            throw new Error(
              `Unable to perform pattern validation on a schema of type ${derivedSchema.type}`
            );
          }
          return (derivedSchema as StringSchema).matches(
            new RegExp(validation.pattern),
            validation.message
          );
        }
        if ("matches" in validation) {
          const refs = Array.isArray(validation.matches)
            ? validation.matches.map((m) => context.yup.ref(m))
            : [context.yup.ref(validation.matches)];
          return (derivedSchema as StringSchema).equals(
            refs,
            validation.message
          );
        }
        return derivedSchema;
      }, schema);
    }
  };
}
