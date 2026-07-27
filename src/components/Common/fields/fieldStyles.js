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
    background-color: var(--color-surface-raised, rgba(255, 255, 255, 0.06)) !important;
    color: var(--color-text-primary, #0f172a) !important;
    border-color: var(--color-border, #cbd5e0) !important;
    opacity: 0.9 !important;
    cursor: not-allowed;
    -webkit-text-fill-color: var(--color-text-primary, #0f172a) !important;
  }

  &.is-invalid {
    border-color: var(--color-danger);
  }

  &.is-valid {
    border-color: var(--color-success);
  }
`;
