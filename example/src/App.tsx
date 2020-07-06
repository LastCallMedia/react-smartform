import React, {ChangeEvent, useState} from 'react';
import './App.css';
import schemas from "./schemas";
import {MenuItem, TextField} from "@material-ui/core";
import UsingHook from "./usage/UsingHook";
import UsingHOC from "./usage/UsingHOC";
import {Schema} from "@lastcall/react-smartform";


function App() {
  const [schema, setSchema] = useState(schemas.compound as Schema);

  const handleSchemaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    if(name in schemas) {
      setSchema(schemas[name])
    }
  }
  return (
    <>
      <TextField select label={"Select a Schema"} fullWidth={true} onChange={handleSchemaChange} placeholder={"Select a Schema"}>
        {Object.keys(schemas).map(name => (
          <MenuItem key={name} value={name}>{name}</MenuItem>
        ))}
      </TextField>
      <UsingHook schema={schema} />
      <UsingHOC schema={schema} />
    </>
  );
}

export default App;
