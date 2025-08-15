import { useTransition } from "react";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { AUTH_ROUTES } from "@/routes/common/routePath";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogoutDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const LogoutDialog = ({ isOpen, setIsOpen }: LogoutDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isPending) return;
    startTransition(() => {
      // Optimistically close, clear session, then navigate.
      setIsOpen(false);
      dispatch(logout());
      navigate(AUTH_ROUTES.SIGN_IN);
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isPending) setIsOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log out?</DialogTitle>
          <DialogDescription>
            This will end your current session. You’ll need to sign in again to access your account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="!text-white"
            disabled={isPending}
            onClick={handleLogout}
          >
            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
