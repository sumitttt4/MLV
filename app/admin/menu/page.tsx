"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  getCategories,
  getMenuItems,
  seedMenuItems,
  updateAvailability,
  updateMenuPrice,
  type MenuItemRecord
} from "@/lib/api";
import { menuItems as dummyMenuItems } from "@/lib/dummyData";
import { AddMenuItem } from "@/components/admin/MenuForms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import Image from "next/image";

interface MenuItemRow {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string | null;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([]);
  const [categories, setCategories] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const [categoryData, itemData] = await Promise.all([
        getCategories(),
        getMenuItems()
      ]);
      const nextCategories = new Map<string, string>();
      categoryData.forEach((category) => {
        nextCategories.set(category.id, category.name);
      });
      setCategories(nextCategories);
      setMenuItems(itemData);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load menu items."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const data = useMemo<MenuItemRow[]>(
    () =>
      menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: categories.get(item.category_id) ?? "Unassigned",
        price: item.price,
        isAvailable: item.is_available,
        imageUrl: item.image_url
      })),
    [menuItems, categories]
  );

  const handleAvailabilityToggle = useCallback(
    async (id: string, nextValue: boolean) => {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_available: nextValue } : item
        )
      );

      try {
        await updateAvailability(id, nextValue);
      } catch (updateError) {
        setMenuItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, is_available: !nextValue } : item
          )
        );
        setError(
          updateError instanceof Error
            ? updateError.message
            : "Unable to update availability."
        );
      }
    },
    []
  );

  const handlePriceUpdate = useCallback(
    async (id: string, nextPrice: number) => {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, price: nextPrice } : item
        )
      );

      try {
        await updateMenuPrice(id, nextPrice);
      } catch (updateError) {
        await fetchData();
        setError(
          updateError instanceof Error
            ? updateError.message
            : "Unable to update the price."
        );
      }
    },
    [fetchData]
  );

  const columns = useMemo<ColumnDef<MenuItemRow>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => (
          <div className="relative h-12 w-16 overflow-hidden rounded-xl border border-brand-gold/30 bg-white">
            {row.original.imageUrl ? (
              <Image
                src={row.original.imageUrl}
                alt={row.original.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-brand-maroon/50">
                N/A
              </div>
            )}
          </div>
        )
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-brand-maroon">
              {row.original.name}
            </p>
            <p className="text-xs text-brand-maroon/60">
              {row.original.id}
            </p>
          </div>
        )
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-maroon">
            {row.original.category}
          </span>
        )
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <PriceEditor
            value={row.original.price}
            onCommit={(value) => handlePriceUpdate(row.original.id, value)}
          />
        )
      },
      {
        accessorKey: "isAvailable",
        header: "Status",
        cell: ({ row }) => (
          <AvailabilityToggle
            isAvailable={row.original.isAvailable}
            onToggle={(nextValue) =>
              handleAvailabilityToggle(row.original.id, nextValue)
            }
          />
        )
      }
    ],
    [handlePriceUpdate, handleAvailabilityToggle]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const handleSeed = async () => {
    setIsSeeding(true);
    setError(null);
    try {
      await seedMenuItems(
        dummyMenuItems.map((item) => ({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          image: item.image,
          isVeg: item.isVeg
        }))
      );
      await fetchData();
    } catch (seedError) {
      setError(
        seedError instanceof Error
          ? seedError.message
          : "Unable to seed menu items."
      );
    } finally {
      setIsSeeding(false);
    }
  };

  const categoryOptions = useMemo(
    () =>
      Array.from(categories.entries()).map(([id, name]) => ({ id, name })),
    [categories]
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-brand-maroon">
            Menu Command Center
          </h2>
          <p className="mt-2 max-w-xl text-sm text-brand-maroon/70">
            Keep every dish available, priced, and photo ready for the dining
            room.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSeed}
            disabled={isSeeding}
            className="rounded-full border border-brand-maroon/30 px-5 py-2 text-sm font-semibold text-brand-maroon transition hover:bg-brand-maroon/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSeeding ? "Seeding menu..." : "Reset/Seed Menu"}
          </button>
          <AddMenuItem categories={categoryOptions} onCreated={fetchData} />
        </div>
      </header>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="rounded-3xl border border-brand-gold/30 bg-white shadow-sm">
        <div className="border-b border-brand-gold/20 px-6 py-4">
          <p className="text-sm font-semibold text-brand-maroon">
            {isLoading ? "Loading menu..." : `${data.length} items`} 
          </p>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {isLoading
                    ? "Loading menu items..."
                    : "No menu items found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function PriceEditor({
  value,
  onCommit
}: {
  value: number;
  onCommit: (value: number) => void;
}) {
  const [draft, setDraft] = useState(value.toString());

  useEffect(() => {
    setDraft(value.toString());
  }, [value]);

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="0.01"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          const parsed = Number(draft);
          if (!Number.isNaN(parsed)) {
            onCommit(parsed);
          }
        }}
        className="w-24 rounded-full border border-brand-maroon/20 px-3 py-1 text-sm"
      />
      <span className="text-xs text-brand-maroon/60">
        {formatPrice(Number(draft) || 0)}
      </span>
    </div>
  );
}

function AvailabilityToggle({
  isAvailable,
  onToggle
}: {
  isAvailable: boolean;
  onToggle: (nextValue: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!isAvailable)}
      className={`relative h-6 w-12 rounded-full border transition ${
        isAvailable
          ? "border-brand-gold bg-brand-cream"
          : "border-brand-maroon bg-brand-maroon/80"
      }`}
      aria-pressed={!isAvailable}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition ${
          isAvailable ? "left-1 bg-brand-gold" : "left-7 bg-brand-cream"
        }`}
      />
      <span className="sr-only">
        {isAvailable ? "Mark out of stock" : "Mark available"}
      </span>
    </button>
  );
}
