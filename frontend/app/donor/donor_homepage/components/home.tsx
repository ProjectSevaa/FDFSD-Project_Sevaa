export function HomeSection() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Welcome Home</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">Quick Stats</h3>
          {/* Add content */}
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">Recent Activity</h3>
          {/* Add content */}
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium mb-2">Notifications</h3>
          {/* Add content */}
        </div>
      </div>
    </div>
  );
}
