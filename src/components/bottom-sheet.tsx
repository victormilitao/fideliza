import {
  Sheet,
  SheetContent, SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

type BottomSheetProps = {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const BottomSheet = ({
  children,
  open,
  onOpenChange,
}: BottomSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom' className='p-5'>
        <SheetHeader className='text-center'>
          <VisuallyHidden>
            <SheetTitle />
          </VisuallyHidden>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
