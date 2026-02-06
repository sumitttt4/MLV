"use client";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface PrintReceiptProps {
  orderId: string;
  items: ReceiptItem[];
  total: number;
  createdAt: string;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function PrintReceipt({ orderId, items, total, createdAt }: PrintReceiptProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handlePrint}
        className="rounded-full border border-brand-maroon/30 px-4 py-2 text-sm font-semibold text-brand-maroon transition hover:bg-brand-maroon/10 print:hidden"
      >
        Print Receipt
      </button>
      <div className="sr-only print:block">
        <div className="w-[280px] p-4 text-xs text-black">
          <h2 className="text-center text-sm font-semibold">Hotel MLV Grand</h2>
          <p className="mt-1 text-center">Order #{orderId}</p>
          <p className="mt-1 text-center">
            {new Date(createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short"
            })}
          </p>
          <table className="mt-4 w-full border-t border-b border-dashed border-black">
            <thead>
              <tr className="text-left">
                <th className="py-2">Qty</th>
                <th className="py-2">Item</th>
                <th className="py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name}>
                  <td className="py-1">{item.quantity}</td>
                  <td className="py-1">{item.name}</td>
                  <td className="py-1 text-right">
                    {currencyFormatter.format(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>{currencyFormatter.format(total)}</span>
          </div>
          <p className="mt-4 text-center">Thank You</p>
        </div>
      </div>
    </div>
  );
}
