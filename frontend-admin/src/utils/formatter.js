export const fmtMoney = (n = 0) => 
  new Intl.NumberFormat("vi-VN").format(n);
