import React from 'react'
import ReactSchemaVisitor from "./react";
import {useForm} from "react-hook-form";
import {Schema} from "./types";

type SmartFormProps = {
    visitor: ReactSchemaVisitor
    schema: Schema
}
export default function SmartForm({visitor, schema}: SmartFormProps) {
    const formContext = useForm();

    return (
        <form>{visitor.visitSchema(schema, {form: formContext})}</form>
    )
}
