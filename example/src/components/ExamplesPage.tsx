import {Link, useParams} from "react-router-dom";
import React, {useState} from "react";
import schemas from "../schemas";
import {Grid, Menu, MenuItem, List, ListItem, ListItemText} from "@material-ui/core";
import UsingHook from "../usage/UsingHook";
import UsingHOC from "../usage/UsingHOC";

export default function ExamplePage() {
  const {schemaName} = useParams();

  if(!(schemaName in schemas)) {
    throw new Error(`Invalid schema selected: ${schemaName}`)
  }
  const schema = schemas[schemaName];
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ExampleChooser current={schemaName} />
      </Grid>
      <Grid item xs={6}>
        <UsingHook schema={schema} />
      </Grid>
      <Grid item xs={6}>
        <UsingHOC schema={schema} />
      </Grid>
    </Grid>
  );
}

function ExampleChooser(props: {current: keyof typeof schemas}) {
  const [anchorEl, setAnchorEl] = useState<Element|null>();

  const handleButtonClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  }
  return (
    <>
    <List component="nav" aria-label="Choose an Example">
      <ListItem button aria-haspopup="true" aria-controls="lock-menu" aria-label="Example being shown" onClick={handleButtonClick}>
        <ListItemText primary={"Example:"} secondary={props.current} />
      </ListItem>
    </List>
    <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} keepMounted onClose={handleClose}>
      {Object.keys(schemas).map((name) => (
        <MenuItem key={name}><Link onClick={handleClose} to={`/example/${name}`}>{name}</Link></MenuItem>
      ))}
    </Menu>
    </>
  )
}
