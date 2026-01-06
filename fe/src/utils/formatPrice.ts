export const formatMoneyVND = (amount: string) => {
  const n = Number(amount);
  if (Number.isNaN(n)) return amount;
  return n.toLocaleString("vi-VN") + "đ";
};

export const formatMoney = (value: number | string) => {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
};
