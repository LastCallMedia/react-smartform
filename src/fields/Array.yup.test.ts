import YupSchemaVisitor from "../yup";
import YupArrayVisitor from "./Array.yup";
import YupInputVisitor from "./Input.yup";
import * as yup from "yup";

describe('YupArrayVisitor', function() {
    const visitor = new YupSchemaVisitor([
        new YupArrayVisitor(),
        new YupInputVisitor()
    ]);

    it('Should validate simple arrays', () => {
        const actual = visitor.visitSchema([
            {
                name: 'myarr',
                type: 'array',
                of: {type: 'input'}
            }
        ], {yup})
        const expected = yup.object({
            myarr: yup.array().of(yup.string())
        })
        expect(actual.describe()).toEqual(expected.describe())
    });

    it('Should validate complex arrays', () => {
        const actual = visitor.visitSchema([
            {
                name: 'myarr',
                type: 'array',
                of: [{type: 'input', name: 'mytext'}]
            }
        ], {yup})
        const expected = yup.object({
            myarr: yup.array().of(yup.object({mytext: yup.string()}))
        })
        expect(actual.describe()).toEqual(expected.describe())
    });

})
