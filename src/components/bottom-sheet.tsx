import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type BottomSheetProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const BottomSheet = ({children, open, onOpenChange}: BottomSheetProps) => {
  return <Sheet open={open} onOpenChange={onOpenChange}>
  <SheetTrigger>{children}</SheetTrigger>
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>

}