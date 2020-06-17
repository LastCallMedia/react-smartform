import React from "react";
import {render, fireEvent} from "@testing-library/react";
import ReactVisibilityDecorator from "./Visibility.react";
import {Schema} from "../types";
import ReactSchemaVisitor from "../react";
import ReactInputVisitor from "../fields/Input.react";
import SmartForm from "../SmartForm";


describe('ReactVisibilityDecorator', () => {
    const innerVisitor = new ReactInputVisitor();
    const fieldVisitor = new ReactVisibilityDecorator(
        new ReactInputVisitor()
    )
    const schemaVisitor = new ReactSchemaVisitor([
        new ReactVisibilityDecorator(new ReactInputVisitor())
    ]);
    const renderSchema = (schema: Schema) => render(<SmartForm visitor={schemaVisitor} schema={schema} />)
    it('Should delegate visits() to the inner', () => {
        expect(fieldVisitor.visits()).toEqual(innerVisitor.visits());
    })
    it('Should display the field when there are no visibility conditions', () => {
        const {container} = renderSchema([{
            name: 'test',
            type: 'input',
        }]);
        expect(container.querySelector('#test')).not.toBeNull()
    })
    it('Should hide the field when the expression evaluates to false', () => {
        const {container} = renderSchema([{
            name: 'test',
            type: 'input',
            when: '1 === 0',
        }]);
        expect(container.querySelector('#test')).toBeNull()
    })
    it('Should show the field when the expression evaluates to true', () => {
        const {container} = renderSchema([{
            name: 'test',
            type: 'input',
            when: '1 === 1',
        }]);
        expect(container.querySelector('#test')).not.toBeNull()
    });

    it('Should be able to query for the remote value of a field', () => {
        const {container} = renderSchema([
            {name: 'mytext', type: 'input'},
            {name: 'mydep', type: 'input', when: 'ref("mytext") === "foo"'}
        ]);
        expect(container.querySelectorAll('#mydep')).toHaveLength(0)
        fireEvent.input(container.querySelector('#mytext'), {target: {value: 'foo'}})
        expect(container.querySelectorAll('#mydep')).toHaveLength(1)
    });
});
