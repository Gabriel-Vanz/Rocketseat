import { Slot } from '@radix-ui/react-slot'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

const button = tv({
  base: ['rounded-lg text-sm  outline-none '],
  variants: {
    variant: {
      primary:
        'mt-2 text-white bg-violet-500 hover:bg-violet-700 focus:shadow-violet-800 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px]  leading-none outline-none focus:shadow-[0_0_0_2px] font-semibold',
    },
  },
})

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean
}

// secondary:
// 'mt-2 text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px]  leading-none outline-none focus:shadow-[0_0_0_2px]',
// tertiary:
// 'mt-2 text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px]  leading-none outline-none focus:shadow-[0_0_0_2px] font-semibold',

export function ButtonBase({
  asChild,
  variant,
  className,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button'

  return <Component {...props} className={button({ variant, className })} />
}

export const Button = forwardRef(ButtonBase)
