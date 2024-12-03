// components/DialogComponent.js
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function DialogComponent() {
  return (
    <Dialog.Root>
      <DialogTrigger>Open Dialog</DialogTrigger>

      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Dialog Title</DialogTitle>
        </VisuallyHidden>
        <div>
          <p>This is the content inside the dialog.</p>
        </div>
      </DialogContent>
    </Dialog.Root>
  );
}

export default DialogComponent;
