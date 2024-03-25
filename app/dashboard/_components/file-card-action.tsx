import { useState } from "react";
import { useMutation } from "convex/react";
import { MoreVertical, Star, Trash2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";

interface FileCardActionProps {
  file: Doc<"files">;
  isFavorite?: boolean;
}

export function FileCardAction({ file, isFavorite }: FileCardActionProps) {
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);

  const { toast } = useToast();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteFile = async () => {
    await deleteFile({ fileId: file._id });

    toast({
      variant: "default",
      title: "File deleted",
      description: "Your file has been deleted successfully.",
      duration: 3000,
    });
  };

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFile}
              className="bg-red-600 hover:bg-red-700"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="w-6 h-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-center">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({ fileId: file._id });
            }}
            className="gap-2 flex justify-between items-center cursor-pointer"
          >
            {isFavorite ? (
              <>
                Unfavorite
                <Star className="w-4 h-4 text-yellow-500" />
              </>
            ) : (
              <>
                Favorite
                <Star className="w-4 h-4" />
              </>
            )}
          </DropdownMenuItem>
          <Protect
            role="org:admin"
            fallback={
              <p className="text-xs px-2 py-1.5">
                You do not have the permission delete this file.
              </p>
            }
          >
            <DropdownMenuItem
              onClick={() => setIsConfirmOpen(true)}
              className="gap-2 flex justify-between items-center cursor-pointer"
            >
              Delete
              <Trash2 className="w-4 h-4 text-red-600" />
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
