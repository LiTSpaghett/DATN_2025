const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-3xl font-bold">120</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Revenue</h2>
          <p className="text-3xl font-bold">$12,340</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-500">Users</h2>
          <p className="text-3xl font-bold">450</p>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
