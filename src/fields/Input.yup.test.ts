
import YupInputVisitor from './Input.yup'
import * as yup from 'yup'

describe('YupInputVisitor', () => {
    const inputVisitor = new YupInputVisitor();

    it('Should form a base schema', () => {
        const actual = inputVisitor.visit({type: 'input', name: 'foo'}, {yup})
        const expected = yup.string();
        expect(actual.describe()).toEqual(expected.describe());
    })

    it('Should be require-able', () => {
        const actual = inputVisitor.visit({type: 'input', name: 'foo', required: true}, {yup})
        const expected = yup.string().required();
        expect(actual.describe()).toEqual(expected.describe());
    });

    it('Should be capable of pattern validation', () => {
        const actual = inputVisitor.visit({
            type: 'input',
            name: 'foo',
            validations: [{pattern: '^\\d+$', message: 'error.invalidPattern'}]
        }, {yup})
        const expected = yup.string().matches(/^\d+$/, 'error.invalidPattern');
        expect(actual.describe()).toEqual(expected.describe());
    })
})
