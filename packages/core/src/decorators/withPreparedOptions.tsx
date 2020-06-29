import {
  Constructor,
  ExtractConfigFromHandler,
  FieldHandler,
  OptionList,
  FieldRenderContext,
  FieldValidationContext,
  Option,
  TranslationFunction,
} from "../types";

export interface NamedOptionsConfig {
  options: string | string[] | OptionList;
}

/**
 * This decorator allows the options property to be a string referencing a predefined
 * list of options.
 */
export default function withPreparedOptions<
  HandlerConstructor extends Constructor<FieldHandler>,
  HandlerInstance extends InstanceType<HandlerConstructor>,
  HandlerInstanceConfig extends ExtractConfigFromHandler<HandlerInstance>,
  Config extends HandlerInstanceConfig & NamedOptionsConfig
>(constructor: HandlerConstructor): Constructor<FieldHandler<Config>> {
  // Ex: ref(foo) > 0 ? 'bar' : 'baz'
  return class extends constructor {
    render(config: Config, context: FieldRenderContext): React.ReactElement {
      return super.render(
        {
          ...config,
          options: prepareOptions(config.options, context.t, (name: string) =>
            context.builder.getOptionList(name)
          ),
        },
        context
      );
    }
    buildYupSchema(config: Config, context: FieldValidationContext) {
      return super.buildYupSchema(
        {
          ...config,
          options: prepareOptions(config.options, context.t, (name: string) =>
            context.builder.getOptionList(name)
          ),
        },
        context
      );
    }
  };
}

function prepareOptions(
  options: string | string[] | OptionList,
  t: TranslationFunction,
  cb: (name: string) => OptionList
): OptionList {
  if (typeof options === "string") {
    options = cb(options);
  }
  if (!Array.isArray(options)) {
    throw new Error(
      `Expected options to be an array, but got a ${typeof options} instead.`
    );
  }
  return (options as unknown[]).map(
    (option: unknown): Option => {
      if (typeof option === "string") {
        // @todo: Allow the formulation of this key to be specified.
        return { value: option, label: t(`label.${option}`) };
      }
      if (!isValidOption(option)) {
        throw new Error(
          `Malformed option detected. Options must have both a label and a value property.`
        );
      }
      return { value: option.value, label: t(option.label) };
    }
  );
}
function isValidOption(option: unknown): option is Option {
  // Non-null assertion operator is required to work around "Object is possibly null" BS.
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  if (
    !option ||
    typeof option !== "object" ||
    !("value" in option!) ||
    !("label" in option!)
  ) {
    return false;
  }
  /* eslint-enable */
  return true;
}
