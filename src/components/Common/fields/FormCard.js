import styled from "styled-components";

const FormCard = styled.div`
  /* contains legacy float:"right" ID/Name header blocks without clipping dropdowns/calendars */
  display: flow-root;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--space-xl);
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  max-width: 1000px;
  width: 100%;
  margin: var(--space-lg) auto;

  h2,
  h5 {
    color: var(--color-text-primary);
  }

  label,
  .form-label {
    color: var(--color-text-secondary);
  }

  b {
    color: var(--color-text-primary);
  }

  @media screen and (max-width: 768px) {
    padding: var(--space-md);
  }
`;

export default FormCard;
