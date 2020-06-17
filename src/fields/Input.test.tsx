import SmartFormSchemaHandler from "../index";
import InputHandler from "./Input";
import {Schema} from "../types";
import {render} from "@testing-library/react";
import SmartForm from "../SmartForm";
import React from "react";
import * as yup from "yup";

describe('InputHandler', function() {
    const fieldHandler = new InputHandler();
    const schemaHandler = new SmartFormSchemaHandler([
        fieldHandler
    ]);

    const renderSchema = (schema: Schema) => render(<SmartForm handler={schemaHandler} schema={schema} />)

    it('Should render', () => {
        const {container} = renderSchema([
            {type: 'input', name: 'mynumber', inputType: 'number'},
            {type: 'input', name: 'mytext', inputType: 'text'},
        ])
        expect(container.querySelectorAll('input[type="number"][name="mynumber"]')).toHaveLength(1);
        expect(container.querySelectorAll('input[type="text"][name="mytext"]')).toHaveLength(1);
    });

    it('Should optionally render with a placeholder', () => {
        const {getByPlaceholderText} = renderSchema([
            {type: 'input', name: 'mytext', placeholder: true},
        ])
        expect(getByPlaceholderText('placeholder.mytext')).not.toBeNull();
    });

    it('Should form a base schema', () => {
        const actual = fieldHandler.getYupSchema({type: 'input', name: 'foo'}, {yup})
        const expected = yup.string();
        expect(actual.describe()).toEqual(expected.describe());
    })

    it('Should be require-able', () => {
        const actual = fieldHandler.getYupSchema({type: 'input', name: 'foo', required: true}, {yup})
        const expected = yup.string().required();
        expect(actual.describe()).toEqual(expected.describe());
    });

    it('Should be capable of pattern validation', () => {
        const actual = fieldHandler.getYupSchema({
            type: 'input',
            name: 'foo',
            validations: [{pattern: '^\\d+$', message: 'error.invalidPattern'}]
        }, {yup, handler: schemaHandler, parents: []})
        const expected = yup.string().matches(/^\d+$/, 'error.invalidPattern');
        expect(actual.describe()).toEqual(expected.describe());
    })
});
