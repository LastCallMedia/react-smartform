import {YupFieldVisitor, YupFieldVisitorContext} from "../yup";
import InputConfig from "./Input.config";

export default class YupInputVisitor implements YupFieldVisitor<InputConfig> {
    visits(): string[] {
        return ['input']
    }
    visit(config: InputConfig, context: YupFieldVisitorContext) {
        let schema = context.yup.string()
        if(config.required) {
            schema = schema.required()
        }
        for(const validation of config.validations ?? []) {
            if(validation.pattern) {
                schema = schema.matches(new RegExp(validation.pattern), validation.message);
            }
        }
        return schema
    }
}
