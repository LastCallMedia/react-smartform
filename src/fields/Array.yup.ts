
import {YupFieldVisitorContext, YupFieldVisitor} from "../yup";
import ArrayConfig from "./Array.config";

export default class YupArrayVisitor implements YupFieldVisitor<ArrayConfig> {
    visits(): string[] {
        return ['array']
    }
    visit(config: ArrayConfig, context: YupFieldVisitorContext) {
        const children = Array.isArray(config.of) ?
            context.visitor.visitSchema(config.of, context) :
            context.visitor.visitField({name: 0, ...config.of}, context);
        return context.yup.array().of(children);
    }

}
