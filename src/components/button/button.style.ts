import styled from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'link'

interface ButtonVariantProps {
  $variant: ButtonVariant
}

const bgColors = {
  primary: '--color-primary-600',
  secondary: '--color-neutral-100',
  link: '',
}

const hover = {
  primary: '--color-primary-700',
  secondary: '--color-primary-100',
  link: '',
}

const colors = {
  primary: '--color-neutral-100',
  secondary: '--color-primary-600',
  link: '--color-primary-600',
}

const borderColors = {
  primary: '',
  secondary: '1px solid var(--color-primary-600)',
  link: '',
}

const borderColorsHover = {
  primary: '',
  secondary: '',
  link: '',
}

export const ButtonStyled = styled.button<ButtonVariantProps>`
  ${({ $variant }) => {
    return `
      background-color: var(${bgColors[$variant]});
      color: var(${colors[$variant]});
      border: ${borderColors[$variant]};
    `
  }}

  &:hover {
    ${({ $variant }) => {
      return `
        background-color: var(${hover[$variant]});
        border: ${borderColorsHover[$variant]};
      `
    }}
  }
`
