import YupVisibilityDecorator from "./Visibility.yup";
import YupInputVisitor from "./Input.yup";
import * as yup from 'yup'
import YupSchemaVisitor from "../yup";

describe('YupVisibilityDecorator', () => {
    const inner = new YupInputVisitor();
    const decorator = new YupVisibilityDecorator(inner);
    const visitor = new YupSchemaVisitor([
        decorator
    ]);

    it('Should delegate validation when no when condition is given', () => {
        const field = {type: 'input', name: 'foo'};
        const context = {yup, visitor, parents: []}
        expect(decorator.visit(field, context).describe()).toEqual(inner.visit(field, context).describe());
    });

    it('Should perform validation on a field when it has a truthy when condition', async () => {
        const schema = visitor.visitSchema([
            {type: 'input', name: 'foo', required: true, when: '1 === 1'},
        ], {yup})
        await expect(schema.validate({})).rejects.toBeTruthy();
    })
    it('Should perform validation on a field when it has a falsy when condition', async () => {
        const schema = visitor.visitSchema([
            {type: 'input', name: 'foo', required: true, when: '1 === 2'},
        ], {yup})
        await expect(schema.validate({})).resolves.toBeTruthy();
    })

    it('Should be able to query for the remote value of a field', async () => {
        const schema = visitor.visitSchema([
            {type: 'input', name: 'foo', required: true, when: 'Number(ref("bar")) === 1'},
            {type: 'input', name: 'bar'}
        ], {yup})
        // Validate no error when bar = 2
        await expect(schema.validate({bar: 2})).resolves.toBeTruthy();
        // Validate that we show a required error when bar = 1
        await expect(schema.validate({bar: 1})).rejects.toBeTruthy();
    });

});
