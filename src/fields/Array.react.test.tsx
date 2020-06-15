import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ReactSchemaVisitor from "../react";
import ReactArrayVisitor from "./Array.react";
import ReactInputVisitor from "./Input.react";
import SmartForm from "../SmartForm";
import {Schema} from "../types";

describe('Array', function() {
    const visitor = new ReactSchemaVisitor([
        new ReactArrayVisitor(),
        new ReactInputVisitor()
    ]);
    function renderSchema(schema: Schema) {
        return render(<SmartForm visitor={visitor} schema={schema} />)
    }

    it('Should render complex array items', () => {
        const {container, debug} = renderSchema([
            {
                type: 'array',
                name: 'myarr',
                count: 2,
                of: [{name: 'text', type: 'input', inputType: 'text'}]
            }
        ]);
        expect(container.querySelectorAll('input[name="myarr[0].text"]')).toHaveLength(1);
        expect(container.querySelectorAll('input[name="myarr[1].text"]')).toHaveLength(1);
    })

    it('Should render simple array items', () => {
        const {container} = renderSchema([
            {
                type: 'array',
                name: 'myarr',
                count: 2,
                of: {type: 'input', inputType: 'text'}
            }
        ]);
        expect(container.querySelectorAll('input[name="myarr[0]"]')).toHaveLength(1);
        expect(container.querySelectorAll('input[name="myarr[1]"]')).toHaveLength(1);
    });

    it('Should allow count to be controlled by another field', async () => {
        const {container} = renderSchema([
            {
                name: 'mynumber',
                type: 'input',
                inputType: 'number'
            },
            {
                type: 'array',
                name: 'myarr',
                count: 'value(mynumber)',
                of: {type: 'input', inputType: 'text'}
            }
        ]);
        expect(container.querySelectorAll('input[name="myarr[0]"]')).toHaveLength(0);
        fireEvent.input(container.querySelector('[name="mynumber"]'), {target: {value: '2'}})
        expect(container.querySelectorAll('input[id^="myarr-"]')).toHaveLength(2);
    });

    it('Should allow count to be controlled by a relative field', async () => {
        const {container} = renderSchema([
            {
                type: 'array',
                name: 'myarr',
                count: 1,
                of: [
                    {name: 'cnt', type: 'input', inputType: 'number'},
                    {
                        type: 'array',
                        name: 'mynestedarr',
                        count: 'value(./cnt)',
                        of: {type: 'input', inputType: 'text'}
                    }
                ]
            }
        ]);
        expect(container.querySelectorAll('input[name="myarr[0].mynestedarr[0]"]')).toHaveLength(0);
        fireEvent.input(container.querySelector('#myarr-0-cnt'), {target: {value: '2'}})
        expect(container.querySelectorAll('input[id^="myarr-0-mynestedarr-"]')).toHaveLength(2)
    })
})
