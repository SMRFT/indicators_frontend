import { Alert } from "react-bootstrap";
import styled from "styled-components";

const TONE_COLORS = {
  danger: "var(--color-danger)",
  success: "var(--color-success)",
};

const StyledAlert = styled(Alert)`
  background-color: var(--color-surface-inset);
  border: 1px solid ${({ $tone }) => TONE_COLORS[$tone]};
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
`;

const FormAlert = ({ variant = "danger", children, ...props }) => (
  <StyledAlert $tone={variant === "success" ? "success" : "danger"} {...props}>
    {children}
  </StyledAlert>
);

export default FormAlert;
