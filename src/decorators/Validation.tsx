import {
  FieldConfig,
  FieldHandler,
  ReactFieldHandlerContext,
  YupFieldHandlerContext,
} from "../types";
import * as yup from "yup";

interface PatternValidation {
  pattern: string;
  message?: string;
}
interface MatchesValidation {
  matches: string | string[];
  message?: string;
}
type Validation = PatternValidation | MatchesValidation;
interface ValidationConfig extends FieldConfig {
  validate?: Validation[];
}

export default class ValidationHandler
  implements FieldHandler<ValidationConfig> {
  private readonly inner: FieldHandler;
  constructor(inner: FieldHandler) {
    this.inner = inner;
  }
  handles(): string[] {
    return this.inner.handles();
  }
  getReactElement(
    config: ValidationConfig,
    context: ReactFieldHandlerContext
  ): React.ReactElement {
    return this.inner.getReactElement(config, context);
  }
  getYupSchema(
    config: ValidationConfig,
    context: YupFieldHandlerContext
  ): yup.Schema<unknown> {
    let schema = this.inner.getYupSchema(config, context);
    if (config.validate) {
      config.validate.forEach((validation) => {
        if ("pattern" in validation) {
          if (!schema.isType("string")) {
            throw new Error(
              `Unable to perform pattern validation on a schema of type ${schema.type}`
            );
          }
          schema = (schema as yup.StringSchema).matches(
            new RegExp(validation.pattern),
            validation.message
          );
        }
        if ("matches" in validation) {
          // @todo: Validate type here?
          const refs = Array.isArray(validation.matches)
            ? validation.matches.map((m) => context.yup.ref(m))
            : [yup.ref(validation.matches)];
          schema = (schema as yup.StringSchema).equals(
            refs,
            validation.message
          );
        }
      });
    }
    return schema;
  }
}
