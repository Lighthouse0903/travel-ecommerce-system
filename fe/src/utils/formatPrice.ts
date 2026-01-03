export const formatPrice = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export const formatMoneyVND = (amount: string) => {
  const n = Number(amount);
  if (Number.isNaN(n)) return amount;
  return n.toLocaleString("vi-VN") + "đ";
};
