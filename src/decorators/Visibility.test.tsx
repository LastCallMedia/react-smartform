import {Schema} from "../types";
import {fireEvent, render} from "@testing-library/react";
import SmartForm from "../SmartForm";
import React from "react";
import SmartFormSchemaHandler from "../index";
import VisibilityDecorator from "./Visibility";
import InputHandler from "../fields/Input";
import * as yup from "yup";


describe('VisibilityDecorator', function() {
    const schemaHandler = new SmartFormSchemaHandler([
        new VisibilityDecorator(new InputHandler())
    ])

    const renderSchema = (schema: Schema) => render(<SmartForm handler={schemaHandler} schema={schema} />)

    it('Should display the field when there are no visibility conditions', () => {
        const {container} = renderSchema([{
            name: 'test',
            type: 'text',
        }]);
        expect(container.querySelector('#test')).not.toBeNull()
    })
    it('Should hide the field when the expression evaluates to false', () => {
        const {container} = renderSchema([{
            name: 'test',
            type: 'text',
            when: '1 === 0',
        }]);
        expect(container.querySelector('#test')).toBeNull()
    })
    it('Should show the field when the expression evaluates to true', () => {
        const {container} = renderSchema([{
            name: 'test',
            type: 'text',
            when: '1 === 1',
        }]);
        expect(container.querySelector('#test')).not.toBeNull()
    });

    it('Should be able to query for the remote value of a field', () => {
        const {container, getByLabelText} = renderSchema([
            {name: 'mytext', type: 'text'},
            {name: 'mydep', type: 'text', when: 'ref("mytext") === "foo"'}
        ]);
        expect(container.querySelectorAll('#mydep')).toHaveLength(0)
        fireEvent.input(getByLabelText('label.mytext'), {target: {value: 'foo'}})
        expect(container.querySelectorAll('#mydep')).toHaveLength(1)
    });

    it('Should perform validation on a field when it has a truthy when condition', async () => {
        const schema = schemaHandler.getYupSchema([
            {type: 'text', name: 'foo', required: true, when: '1 === 1'},
        ], {yup})
        await expect(schema.validate({})).rejects.toBeTruthy();
    })
    it('Should perform validation on a field when it has a falsy when condition', async () => {
        const schema = schemaHandler.getYupSchema([
            {type: 'text', name: 'foo', required: true, when: '1 === 2'},
        ], {yup})
        await expect(schema.validate({})).resolves.toBeTruthy();
    })

    it('Should be able to query for the remote value of a field', async () => {
        const schema = schemaHandler.getYupSchema([
            {type: 'text', name: 'foo', required: true, when: 'Number(ref("bar")) === 1'},
            {type: 'text', name: 'bar'}
        ], {yup})
        // Validate no error when bar = 2
        await expect(schema.validate({bar: 2})).resolves.toBeTruthy();
        // Validate that we show a required error when bar = 1
        await expect(schema.validate({bar: 1})).rejects.toBeTruthy();
    });
});
