import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { Loader } from "lucide-react";
import { useUpdateUserMutation } from "@/features/user/userAPI";
import { updateCredentials } from "@/features/auth/authSlice";
import { Label } from "@/components/ui/label";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .optional(),
  // we don't validate the file here; this string tracks the current image URL
  profilePicture: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);

  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [updateUserMutation, { isLoading }] = useUpdateUserMutation();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user?.name || "",
      profilePicture: user?.profilePicture || "",
    },
  });

  const onSubmit = (values: AccountFormValues) => {
    if (isLoading) return;

    const formData = new FormData();
    formData.append("name", values.name || "");
    if (file) formData.append("profilePicture", file);

    updateUserMutation(formData)
      .unwrap()
      .then((response) => {
        dispatch(
          updateCredentials({
            user: {
              profilePicture: response.data.profilePicture,
              name: response.data.name,
            },
          })
        );
        toast.success("Account updated successfully");
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Failed to update account");
      });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    if (!next) {
      toast.error("Please select a file");
      return;
    }
    if (!next.type.startsWith("image/")) {
      toast.error("Please select an image (JPG/PNG).");
      return;
    }
    if (next.size > MAX_IMAGE_BYTES) {
      toast.error("Image is too large. Max size is 5MB.");
      return;
    }

    setFile(next);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarUrl(result);
      // keep form state in sync so other parts can read it
      form.setValue("profilePicture", result, { shouldDirty: true });
    };
    reader.readAsDataURL(next);
  };

  const initialLetter =
    (form.watch("name") || user?.name || "U").charAt(0).toUpperCase();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Avatar block */}
        <div className="card-princess spenderella-sparkle p-4">
          <div className="flex flex-col items-start gap-4">
          <Label htmlFor="avatar-input">Profile Picture</Label>

            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 glow-ring">
                <AvatarImage
                  src={avatarUrl || user?.profilePicture || ""}
                  className="!object-cover !object-center"
                />
                <AvatarFallback className="text-2xl">{initialLetter}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2">
                {/* visually-hidden file input + pretty label-button */}
                <Input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label htmlFor="avatar-input" className="btn-outline-rose cursor-pointer w-fit">
                  Choose image
                </label>

                {file && (
                  <span className="text-xs text-muted-foreground">
                    Selected: {file.name}
                  </span>
                )}
                <p className="text-xs text-muted-foreground">
                  Recommended: Square JPG/PNG, at least 300×300px (max 5MB).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} className="input-fairy" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex items-center gap-3">
          <Button
            disabled={isLoading}
            type="submit"
            aria-busy={isLoading}
            className="btn-princess gilded-focus"
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Update account
          </Button>

          {/* optional cancel/reset */}
          <Button
            type="button"
            variant="ghost"
            className="btn-outline-rose"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
