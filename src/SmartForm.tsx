import React from 'react'
import ReactVisitor from "./react";
import {useForm} from "react-hook-form";
import {Schema} from "./types";

type SmartFormProps = {
    visitor: ReactVisitor
    schema: Schema
}
export default function SmartForm({visitor, schema}: SmartFormProps) {
    const formContext = useForm();

    return (
        <form>{visitor.visitSchema(schema, {form: formContext})}</form>
    )
}
