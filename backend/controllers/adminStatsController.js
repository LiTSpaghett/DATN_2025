// controllers/adminStatsController.js
import Order from "../models/Order.js";
// import Product from "../models/Product.js";
// import User from "../models/User.js";

function parseRangeDays(range = "30d") {
  const m = String(range).match(/^(\d+)\s*d$/i);
  return m ? Math.max(1, parseInt(m[1], 10)) : 30;
}

// --- helpers tính from/to theo timezone ---
function _partsInTZ(date, tz) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(date);
  const get = (t) => +parts.find(p => p.type === t).value;
  return { y: get("year"), m: get("month"), d: get("day") };
}
function startOfDayInTZ(date, tz) {
  const { y, m, d } = _partsInTZ(date, tz);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}
function endOfDayInTZ(date, tz) {
  const { y, m, d } = _partsInTZ(date, tz);
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
}

function getRangeBounds(days, tz = "Asia/Ho_Chi_Minh") {
  const today = new Date();
  const to = endOfDayInTZ(today, tz);                       // cuối NGÀY HÔM NAY theo VN
  const startBase = new Date(today.getTime() - (days - 1) * 86400000);
  const from = startOfDayInTZ(startBase, tz);               // đầu ngày (today - days + 1)
  return { from, to };
}

// key YYYY-MM-DD theo đúng timezone, KHÔNG dùng toISOString()
function _dateKeyInTZ(date, tz) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date); // "YYYY-MM-DD"
}

function padDaysSeries(series, from, to, tz = "Asia/Ho_Chi_Minh") {
  const map = new Map(series.map((x) => [x._id, x])); // _id đã là YYYY-MM-DD theo tz
  const out = [];
  const cur = new Date(from);
  while (cur <= to) {
    const key = _dateKeyInTZ(cur, tz);
    out.push({
      _id: key,
      revenue: map.get(key)?.revenue || 0,
      orders: map.get(key)?.orders || 0,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

function buildAllOrdersMatch(from, to) {
  return { createdAt: { $gte: from, $lte: to } };
}


export const getAdminStatsAll = async (req, res) => {
  try {
    const days = parseRangeDays(req.query.range);
    const tz = req.query.tz || "Asia/Ho_Chi_Minh";
    const limitProducts = Math.min(Number(req.query.limitProducts) || 10, 50);
    const limitCustomers = Math.min(Number(req.query.limitCustomers) || 10, 50);
    const { from, to } = getRangeBounds(days,tz);
    const paidMatch = buildAllOrdersMatch(from, to);

    // Pipelines
    const pipelineByDay = [
      { $match: paidMatch },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: tz } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
    ];
    const pipelineTopDays = [
      { $match: paidMatch },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: tz } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
      }},
      { $sort: { revenue: -1 } },
      { $limit: 7 },
    ];
    const pipelineTotals = [
      { $match: paidMatch },
      { $group: { _id: null, revenue: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
    ];
    const pipelineCustomers = [
      { $match: paidMatch },
      { $group: { _id: "$user" } },
      { $count: "customers" },
    ];
    const pipelineTopProducts = [
        { $match: paidMatch }, 
        { $unwind: "$orderItems" }, 
        {
            $group: {
            _id: "$orderItems.product",
            quantity: { $sum: "$orderItems.quantity" },
            revenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } },
            orders: { $sum: 1 },
            },
        },
        { $sort: { revenue: -1 } },
        
        { $limit: limitProducts },
        {
            $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $project: {
            _id: 0,
            productId: "$product._id",
            name: "$product.name",
            category: "$product.category",
            revenue: 1,
            quantity: 1,
            orders: 1,
            },
        },
    ];

    const pipelineTopCustomers = [
      { $match: paidMatch },
      { $group: { _id: "$user", revenue: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: limitCustomers },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { _id: 0, userId: "$user._id", name: "$user.name", email: "$user.email", revenue: 1, orders: 1 } },
    ];
    const pipelineStatusFunnel = [
      { $match: { createdAt: { $gte: from, $lte: to } } },
      { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } },
      { $sort: { count: -1 } },
    ];
    const pipelineCategoryBreakdown = [
      { $match: paidMatch },
      { $unwind: "$items" },
      { $lookup: { from: "products", localField: "items.product", foreignField: "_id", as: "prod" } },
      { $unwind: "$prod" },
      { $group: {
          _id: "$prod.category",
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          quantity: { $sum: "$items.quantity" },
          orders: { $sum: 1 },
      }},
      { $sort: { revenue: -1 } },
    ];

    // Chạy song song
    const [
      byDay,
      topDays,
      totalsAgg,
      customersAgg,
      topProducts,
      topCustomers,
      statusFunnel,
      categoryBreakdown
    ] = await Promise.all([
      Order.aggregate(pipelineByDay),
      Order.aggregate(pipelineTopDays),
      Order.aggregate(pipelineTotals),
      Order.aggregate(pipelineCustomers),
      Order.aggregate(pipelineTopProducts),
      Order.aggregate(pipelineTopCustomers),
      Order.aggregate(pipelineStatusFunnel),
      Order.aggregate(pipelineCategoryBreakdown),
    ]);

    const totalsRow = totalsAgg[0] || { revenue: 0, orders: 0 };
    const customers = customersAgg[0]?.customers || 0;
    const aov = totalsRow.orders ? totalsRow.revenue / totalsRow.orders : 0;

    res.json({
      totals: { orders: totalsRow.orders, revenue: totalsRow.revenue, customers, aov },
      charts: {
        revenueByDay: padDaysSeries(byDay, from, to,tz),
        topDays,
      },
      topProducts,       // [{ productId, name, category, revenue, quantity, orders }]
      topCustomers,      // [{ userId, name, email, revenue, orders }]
      statusFunnel,      // [{ _id: status, count, revenue }]
      categoryBreakdown, // [{ _id: category, revenue, quantity, orders }]
      meta: { rangeDays: days, tz, from, to },
    });
  } catch (err) {
    console.error("getAdminStatsAll error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
