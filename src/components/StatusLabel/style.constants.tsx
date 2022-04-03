import type { StatusStyle } from "./index"

export const styles: Record<
  'blue' | 'green' | 'gray' | 'pink',
  StatusStyle & {color: string}
> = {
  blue: {
    color: '#247BEA',
    style: {
      backgroundColor: '#F3F7FE'
    },
  },
  green: {
    color: '#28A03A',
    style: {
      backgroundColor: '#E1F7EE'
    },
  },
  gray: {
    color: '#8C929A',
    style: {
      backgroundColor: '#EFEFEF'
    }
  },
  pink: {
    color: '#F7303E',
    style: {
      backgroundColor: '#FEEBEB'
    },
  },
}
