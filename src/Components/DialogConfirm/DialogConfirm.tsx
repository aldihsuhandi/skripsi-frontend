import React, { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export interface DialogConfirmProps {
  /**
   * Function dari prent uat close `isOpen`
   */
  onClose?: () => void;
  /**
   * Content isi dialog
   */
  title: string;
  /**
   * Function to run if confirm
   */
  onConfirm?: () => void;
  /**
   * Triggering component
   */
  trigger: ReactNode;
}

export const DialogConfrim = ({
  onClose,
  onConfirm,
  trigger,
  title,
}: DialogConfirmProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    onClose?.();
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Trigger asChild onClick={() => setIsOpen(true)}>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 rounded bg-white p-6 shadow-2xl"
          style={{ transform: "translate(-50%, -50%)" }}
          onInteractOutside={handleClose}
          onClick={(e) => e.preventDefault()}
        >
          <Dialog.Title className="">{title}</Dialog.Title>
          <div className="flex flex-row justify-between pt-3">
            <Dialog.Close onClick={handleClose}>
              <button className="rounded border border-normal-red bg-transparent py-1 px-2 font-semibold text-normal-red hover:border-transparent hover:bg-normal-red hover:text-white">
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close onClick={handleConfirm}>
              <button className="rounded border border-blue-500 bg-transparent py-1 px-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white">
                Confirm
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
