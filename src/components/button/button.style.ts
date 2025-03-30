import styled from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'link'

interface ButtonVariantProps {
  variant: ButtonVariant
}

const bgColors = {
  primary: '--color-primary-600',
  secondary: '--color-neutral-200',
  link: '',
}

const hover = {
  primary: '--color-primary-700',
  secondary: '--color-primary-100',
  link: '',
}

const colors = {
  primary: '--color-neutral-200',
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
  ${(props) => {
    return `
      background-color: var(${bgColors[props.variant]});
      color: var(${colors[props.variant]});
      border: ${borderColors[props.variant]};
    `
  }}

  &:hover {
    ${(props) => {
      return `
        background-color: var(${hover[props.variant]});
        border: ${borderColorsHover[props.variant]};
      `
    }}
  }
`
