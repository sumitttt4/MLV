"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/api";
import { createMenuItem } from "@/lib/api";

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive."),
  categoryId: z.string().min(1, "Category is required."),
  isVeg: z.boolean().default(true)
});

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;

interface CategoryOption {
  id: string;
  name: string;
}

interface AddMenuItemProps {
  categories: CategoryOption[];
  onCreated: () => void;
}

export function AddMenuItem({ categories, onCreated }: AddMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: categories[0]?.id ?? "",
      isVeg: true
    }
  });

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      )),
    [categories]
  );

  const handleSubmit = async (values: MenuItemFormValues) => {
    setFormError(null);

    const fileInput = document.getElementById(
      "menu-image"
    ) as HTMLInputElement | null;

    const file = fileInput?.files?.[0] ?? null;

    if (!file) {
      setFormError("Please upload a menu image.");
      return;
    }

    setIsUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrl } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);

      await createMenuItem({
        name: values.name,
        description: values.description ?? "",
        price: values.price,
        categoryId: values.categoryId,
        imageUrl: publicUrl.publicUrl,
        isVeg: values.isVeg,
        isAvailable: true
      });

      form.reset();
      if (fileInput) {
        fileInput.value = "";
      }
      onCreated();
      setIsOpen(false);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to add this menu item."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="rounded-full bg-brand-maroon px-5 py-2 text-sm font-semibold text-brand-cream shadow-sm transition hover:bg-brand-maroon/90">
          Add Item
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-brand-gold/30 bg-brand-cream p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-brand-maroon">
              Add menu item
            </Dialog.Title>
            <Dialog.Close className="text-sm text-brand-maroon/70">
              Close
            </Dialog.Close>
          </div>
          <p className="mt-2 text-sm text-brand-maroon/70">
            Keep the royal menu polished with fresh offerings.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <label className="block text-sm font-semibold text-brand-maroon">
              Name
              <input
                className="mt-2 w-full rounded-2xl border border-brand-maroon/20 bg-white px-4 py-2 text-sm"
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <span className="mt-1 block text-xs text-red-600">
                  {form.formState.errors.name.message}
                </span>
              ) : null}
            </label>
            <label className="block text-sm font-semibold text-brand-maroon">
              Description
              <textarea
                className="mt-2 w-full rounded-2xl border border-brand-maroon/20 bg-white px-4 py-2 text-sm"
                rows={3}
                {...form.register("description")}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-brand-maroon">
                Category
                <select
                  className="mt-2 w-full rounded-2xl border border-brand-maroon/20 bg-white px-4 py-2 text-sm"
                  {...form.register("categoryId")}
                >
                  {categoryOptions}
                </select>
                {form.formState.errors.categoryId ? (
                  <span className="mt-1 block text-xs text-red-600">
                    {form.formState.errors.categoryId.message}
                  </span>
                ) : null}
              </label>
              <label className="block text-sm font-semibold text-brand-maroon">
                Price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-2 w-full rounded-2xl border border-brand-maroon/20 bg-white px-4 py-2 text-sm"
                  {...form.register("price")}
                />
                {form.formState.errors.price ? (
                  <span className="mt-1 block text-xs text-red-600">
                    {form.formState.errors.price.message}
                  </span>
                ) : null}
              </label>
            </div>
            <label className="block text-sm font-semibold text-brand-maroon">
              Image upload
              <input
                id="menu-image"
                type="file"
                accept="image/*"
                className="mt-2 w-full rounded-2xl border border-brand-maroon/20 bg-white px-4 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-brand-maroon">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-brand-maroon/30"
                defaultChecked
                {...form.register("isVeg")}
              />
              Vegetarian
            </label>
            {formError ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {formError}
              </p>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-full border border-brand-maroon/30 px-5 py-2 text-sm font-semibold text-brand-maroon"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="rounded-full bg-brand-maroon px-5 py-2 text-sm font-semibold text-brand-cream shadow-sm transition hover:bg-brand-maroon/90 disabled:cursor-not-allowed disabled:bg-brand-maroon/40"
                disabled={isUploading}
              >
                {isUploading ? "Uploading image..." : "Save item"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
