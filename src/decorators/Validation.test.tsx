import InputHandler from "../fields/Input";
import ValidationHandler from "./Validation";
import * as yup from 'yup'
import SmartFormSchemaHandler from "../index";
import InputConfig from "../fields/Input";

describe('Validation decorator', function() {
    const inner = new InputHandler();
    const decorator = new ValidationHandler(inner);
    const handler = new SmartFormSchemaHandler();

    it('Should pass through validation if no conditions are specified', () => {
        const config = {type: 'input', name: 'test'} as InputConfig;
        const context = {yup, handler, parents: []}
        expect(decorator.getYupSchema(config, context).describe()).toEqual(inner.getYupSchema(config, context).describe());
    });

    it('Should add pattern validation if requested', () => {
        const config = {type: 'input', name: 'test', validate: [{pattern: '^a$'}]} as InputConfig;
        const context = {yup, handler, parents: []}
        const schema = decorator.getYupSchema(config, context);
        expect(schema.describe()).toEqual(yup.string().matches(/^a$/).describe());
    });

    it('Should optionally add messaging for pattern validation', () => {
        const config = {type: 'input', name: 'test', validate: [{pattern: '^a$', message: 'foo'}]} as InputConfig;
        const context = {yup, handler, parents: []}
        const schema = decorator.getYupSchema(config, context);
        expect(schema.describe()).toEqual(yup.string().matches(/^a$/, 'foo').describe());
    })

    it('Should add matches validation if requested', () => {
        const config = {type: 'input', name: 'test', validate: [{matches: 'foo'}]} as InputConfig;
        const context = {yup, handler, parents: []}
        const schema = decorator.getYupSchema(config, context);
        expect(schema.describe()).toEqual(yup.string().equals([yup.ref('foo')]).describe());
    });

    it('Should optionally add messaging for matches validation', () => {
        const config = {type: 'input', name: 'test', validate: [{matches: 'foo', message: 'bar'}]} as InputConfig;
        const context = {yup, handler, parents: []}
        const schema = decorator.getYupSchema(config, context);
        expect(schema.describe()).toEqual(yup.string().equals([yup.ref('foo')], 'bar').describe());
    })
});
