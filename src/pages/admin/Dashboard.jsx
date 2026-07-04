import AdminLayout from "../../layouts/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-gray-500">
            Products
          </h3>

          <p className="text-4xl font-bold mt-3">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-gray-500">
            Featured Products
          </h3>

          <p className="text-4xl font-bold mt-3">
            0
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-gray-500">
            Categories
          </h3>

          <p className="text-4xl font-bold mt-3">
            0
          </p>
        </div>

      </div>

    </AdminLayout>
  );
}