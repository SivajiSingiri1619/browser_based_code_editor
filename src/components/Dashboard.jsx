function Dashboard() {
  return (
    <div
      data-test-id="event-dashboard"
      style={{
        width: "30%",
        padding: "10px"
      }}
    >
      <h3>Event Logs</h3>

      <div
        data-test-id="event-log-list"
        style={{
          height: "90%",
          border: "1px solid gray",
          overflowY: "scroll"
        }}
      ></div>
    </div>
  );
}

export default Dashboard;
