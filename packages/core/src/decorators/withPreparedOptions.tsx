import {
  Constructor,
  ExtractConfigFromHandler,
  FieldHandler,
  OptionList,
  FieldRenderContext,
  FieldValidationContext,
  Option,
  TranslationFunction,
  FieldConfig,
} from "../types";

export type WithNamedOptionsConfig<Config extends FieldConfig> = Omit<
  Config,
  "options"
> & { options: string | string[] | OptionList };

type OptionFactory = (name: string) => OptionList;
const defaultOptionFactory: OptionFactory = (name: string) => {
  throw new Error(`Unknown option set: ${name}`);
};

/**
 * This decorator allows the options property to be a string referencing a predefined
 * list of options.
 */
export default function withPreparedOptions<
  HandlerConstructor extends Constructor<FieldHandler>,
  HandlerInstance extends InstanceType<HandlerConstructor>,
  HandlerInstanceConfig extends ExtractConfigFromHandler<HandlerInstance>,
  Config extends WithNamedOptionsConfig<HandlerInstanceConfig>
>(
  constructor: HandlerConstructor,
  factory: OptionFactory = defaultOptionFactory
): Constructor<FieldHandler<Config>> {
  // Ex: ref(foo) > 0 ? 'bar' : 'baz'
  return class extends constructor {
    render(config: Config, context: FieldRenderContext): React.ReactElement {
      return super.render(
        {
          ...config,
          options: prepareOptions(config.options, context.t, factory),
        },
        context
      );
    }
    buildYupSchema(config: Config, context: FieldValidationContext) {
      return super.buildYupSchema(
        {
          ...config,
          options: prepareOptions(config.options, context.t, factory),
        },
        context
      );
    }
  };
}

function prepareOptions(
  options: string | string[] | OptionList,
  t: TranslationFunction,
  factory: OptionFactory
): OptionList {
  if (typeof options === "string") {
    options = factory(options);
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
