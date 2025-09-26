// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { fmtMoney } from "../utils/formatter";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [stats, setStats] = useState({
    totals: { orders: 0, revenue: 0, customers: 0 },
    charts: { revenueByDay: [] },
    topProducts: [],
  });

  useEffect(() => {
    (async () => {
      try {
        // thêm tz nếu backend của bạn hỗ trợ, giúp đồng bộ múi giờ
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/stats?range=30d&tz=Asia/Ho_Chi_Minh"
        );
        setStats(data);
      } catch (e) {
        setErr(e.response?.data?.message || "Không tải được số liệu");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const chartData = useMemo(
    () =>
      (stats.charts?.revenueByDay || []).map((d) => ({
        date: `${d._id.slice(8, 10)}-${d._id.slice(5, 7)}`, 
        revenue: d.revenue,
        orders: d.orders,
      })),
    [stats.charts?.revenueByDay]
  );

  if (loading) return <div>Loading…</div>;
  if (err) return <div className="text-red-600">{err}</div>;

  const totals = stats.totals || { orders: 0, revenue: 0, customers: 0 };
  const topProducts = stats.topProducts ?? [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border px-6 py-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span role="img" aria-label="chart">📊</span> Dashboard
        </h2>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-gray-500 text-sm">Tổng đơn</div>
          <div className="text-3xl font-extrabold mt-1">{totals.orders}</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-gray-500 text-sm">Doanh thu</div>
          <div className="text-3xl font-extrabold mt-1">{fmtMoney(totals.revenue)}₫</div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-gray-500 text-sm">Người dùng</div>
          <div className="text-3xl font-extrabold mt-1">{totals.customers}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Revenue 30 days chart */}
        <div className="bg-white rounded-xl shadow p-5 lg:col-span-3">
          <div className="flex items-center justify-between pb-4 border-b">
            <h3 className="text-lg font-semibold">Doanh thu</h3>
            <span className="text-sm text-gray-500">{chartData.length} ngày</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" minTickGap={20} />
                <YAxis tickFormatter={(v) => fmtMoney(v)} />
                <Tooltip
                  formatter={(val, key) => key === "revenue" ? `${fmtMoney(val)}₫` : val}
                  labelFormatter={(label) => `Ngày ${label}`}
                />
                <Line type="monotone" dataKey="revenue" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow lg:col-span-2">
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold">Top Products (Doanh thu)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3 font-medium">Sản phẩm</th>
                <th className="p-3 font-medium">Danh mục</th>
                <th className="p-3 font-medium text-right">SL</th>
                <th className="p-3 font-medium text-right">Đơn</th>
                <th className="p-3 font-medium text-right">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length === 0 && (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={5}>Chưa có dữ liệu</td>
                </tr>
              )}
              {topProducts.map((p, idx) => (
                <tr key={p.productId || idx} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{String(p.productId).slice(-6)}</div>
                  </td>
                  <td className="p-3">{p.category || "-"}</td>
                  <td className="p-3 text-right">{p.quantity}</td>
                  <td className="p-3 text-right">{p.orders}</td>
                  <td className="p-3 text-right">{fmtMoney(p.revenue)}₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
