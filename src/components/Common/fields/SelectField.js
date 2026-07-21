import { Form } from "react-bootstrap";
import styled from "styled-components";
import { inputStyles } from "./fieldStyles";

const SelectField = styled(Form.Select)`
  ${inputStyles}

  option {
    background-color: var(--color-bg-canvas);
    color: var(--color-text-primary);
  }
`;

export default SelectField;
