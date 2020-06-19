import type {
  FieldHandler,
  ReactFieldHandlerContext,
  YupFieldHandlerContext,
  ExtractConfigFromHandler,
} from "../types";
import { Schema as YupSchema, StringSchema } from "yup";

interface PatternValidation {
  pattern: string;
  message?: string;
}
interface MatchesValidation {
  matches: string | string[];
  message?: string;
}
type Validation = PatternValidation | MatchesValidation;
interface ValidationConfig {
  validate?: Validation[];
}

export default class ValidationDecorator<
  I extends FieldHandler,
  C extends ExtractConfigFromHandler<I>
> implements FieldHandler<C & ValidationConfig> {
  private readonly inner: FieldHandler;
  constructor(inner: I) {
    this.inner = inner;
  }
  handles(): string[] {
    return this.inner.handles();
  }
  getReactElement(
    config: C & ValidationConfig,
    context: ReactFieldHandlerContext
  ): React.ReactElement {
    return this.inner.getReactElement(config, context);
  }
  getYupSchema(
    config: C & ValidationConfig,
    context: YupFieldHandlerContext
  ): YupSchema<unknown> {
    let schema = this.inner.getYupSchema(config, context);
    if (config.validate) {
      config.validate.forEach((validation) => {
        if ("pattern" in validation) {
          if (!schema.isType("string")) {
            throw new Error(
              `Unable to perform pattern validation on a schema of type ${schema.type}`
            );
          }
          schema = (schema as StringSchema).matches(
            new RegExp(validation.pattern),
            validation.message
          );
        }
        if ("matches" in validation) {
          // @todo: Validate type here?
          const refs = Array.isArray(validation.matches)
            ? validation.matches.map((m) => context.yup.ref(m))
            : [context.yup.ref(validation.matches)];
          schema = (schema as StringSchema).equals(refs, validation.message);
        }
      });
    }
    return schema;
  }
}
