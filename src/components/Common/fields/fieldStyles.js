import { css } from "styled-components";

export const inputStyles = css`
  background-color: var(--color-surface-inset);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  padding: 10px 12px;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    background-color: var(--color-surface-inset);
    border-color: var(--color-accent);
    box-shadow: var(--shadow-focus);
    color: var(--color-text-primary);
  }

  &:disabled,
  &[readonly] {
    opacity: 0.6;
  }

  &.is-invalid {
    border-color: var(--color-danger);
  }

  &.is-valid {
    border-color: var(--color-success);
  }
`;
