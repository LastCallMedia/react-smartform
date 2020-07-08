import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";
import {
  ArrayConfig,
  ArrayRenderer,
  makeArrayHandler,
  withVisibility,
} from "@lastcall/react-smartform";
import Tree from "../components/Tree";

// Material UI arrays may optionally be labelled.
export interface MaterialArrayConfig extends ArrayConfig {
  label?: string;
  itemLabel?: string;
}

/**
 * This component simply determines whether the array is simple or complex,
 * and delegates accordingly.
 */
const MaterialArray: ArrayRenderer<MaterialArrayConfig> = (props) => {
  if (Array.isArray(props.config.of)) {
    return <ComplexMaterialArray {...props} />;
  }
  return <SimpleMaterialArray {...props} />;
};

/**
 * This component renders simple arrays (where it's an array of a single field).
 */
const SimpleMaterialArray: ArrayRenderer<MaterialArrayConfig> = (props) => {
  const { items, config, context } = props;
  const { t } = context;
  return (
    <>
      {config.label && <Typography variant="h4">{t(config.label)}</Typography>}
      {items.map((item, i) => (
        <Tree key={i} fields={item} />
      ))}
    </>
  );
};

/**
 * This component renders complex arrays (where it's an array of multiple fields).
 */
const ComplexMaterialArray: ArrayRenderer<MaterialArrayConfig> = (props) => {
  const { config, context, items } = props;
  const { t } = context;
  return (
    <>
      {config.label && <Typography variant="h4">{t(config.label)}</Typography>}
      {items.map((item, i) => (
        <Accordion key={i} defaultExpanded={true}>
          {/* @todo: Label should include index. */}
          <AccordionSummary>
            {config.itemLabel && t(config.itemLabel)}
          </AccordionSummary>
          <AccordionDetails>
            <Tree fields={item} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

const MaterialArrayHandler = makeArrayHandler<MaterialArrayConfig>(
  ["array"],
  MaterialArray
);

export default withVisibility(MaterialArrayHandler);
