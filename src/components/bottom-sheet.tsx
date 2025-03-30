import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from '@/components/ui/sheet'

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
      <SheetContent side='bottom'>
        <SheetHeader>
          <SheetDescription>{children}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
