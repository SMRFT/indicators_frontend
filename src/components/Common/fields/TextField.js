import { Form } from "react-bootstrap";
import styled from "styled-components";
import { inputStyles } from "./fieldStyles";

const TextField = styled(Form.Control)`
  ${inputStyles}
`;

export default TextField;
