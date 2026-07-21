import { Button } from "react-bootstrap";
import styled from "styled-components";

const TONE_COLORS = {
  accent: { bg: "var(--color-accent)", hover: "var(--color-accent-hover)", text: "#0f172a" },
  success: { bg: "var(--color-success)", hover: "var(--color-success-hover)", text: "#ffffff" },
  danger: { bg: "var(--color-danger)", hover: "var(--color-danger-hover)", text: "#ffffff" },
};

const StyledButton = styled(Button)`
  background-color: ${({ $tone }) => TONE_COLORS[$tone].bg};
  color: ${({ $tone }) => TONE_COLORS[$tone].text};
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  min-width: 120px;
  height: 42px;
  padding: 0 var(--space-md);

  &:hover,
  &:focus {
    background-color: ${({ $tone }) => TONE_COLORS[$tone].hover};
    color: ${({ $tone }) => TONE_COLORS[$tone].text};
  }

  &:disabled {
    opacity: 0.5;
    background-color: ${({ $tone }) => TONE_COLORS[$tone].bg};
  }
`;

const SubmitButton = ({ tone = "accent", variant, ...props }) => (
  <StyledButton $tone={tone} variant="light" {...props} />
);

export default SubmitButton;
