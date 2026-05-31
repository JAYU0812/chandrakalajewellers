import AdminLayout from "../../layouts/AdminLayout";

export default function Categories() {
  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8">
        Categories
      </h1>

      <div className="bg-white p-8 rounded-3xl shadow">

        <div className="flex gap-4 mb-6">

          <input
            type="text"
            placeholder="Category Name"
            className="
              flex-1
              border
              p-3
              rounded-xl
            "
          />

          <button
            className="
              bg-yellow-500
              text-white
              px-6
              rounded-xl
            "
          >
            Add Category
          </button>

        </div>

        <div className="text-gray-500">
          No categories found.
        </div>

      </div>
    </AdminLayout>
  );
}