"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Status } from "@/types/status";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Status title is required"),
});

interface NewStatusDialogProps {
  key: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string }) => Promise<void>;
  initialValue: string;
}

const EditStatusDialog = ({
  key,
  open,
  onOpenChange,
  onSubmit,
  initialValue,
}: NewStatusDialogProps) => {
  const form = useForm<{ title: string }>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: initialValue },
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { title: string }) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog key={key} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Status</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Status Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatusDialog;
