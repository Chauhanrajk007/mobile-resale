"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BOOKING_STATUSES, BRANDS } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";

export default function AdminDashboard() {
  const { user, refresh: refreshUser, loading: authLoading } = useAuth();
  const { toast, confirm } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // State for Overview Tab
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // State for Bookings Tab
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  // State for Technicians Tab
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [techLoading, setTechLoading] = useState(true);
  const [techSearch, setTechSearch] = useState("");
  const [showAddTech, setShowAddTech] = useState(false);
  const [newTech, setNewTech] = useState({ name: "", email: "", phone: "", password: "" });
  const [techError, setTechError] = useState("");

  // State for Phones Tab
  const [phones, setPhones] = useState<any[]>([]);
  const [phoneLoading, setPhoneLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [showAddPhone, setShowAddPhone] = useState(false);
  const [newPhone, setNewPhone] = useState({ brand: "Apple", model: "", variants: "" });
  const [phoneError, setPhoneError] = useState("");

  // State for Settings Tab
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Fetch Overview Stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (res.ok) setBookings(data.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Fetch Technicians
  const fetchTechnicians = async () => {
    setTechLoading(true);
    try {
      const res = await fetch("/api/technicians");
      const data = await res.json();
      if (res.ok) setTechnicians(data.technicians || []);
    } catch (e) {
      console.error(e);
    } finally {
      setTechLoading(false);
    }
  };

  // Fetch Phones
  const fetchPhones = async () => {
    setPhoneLoading(true);
    try {
      const res = await fetch("/api/phones");
      const data = await res.json();
      if (res.ok) setPhones(data.phones || []);
    } catch (e) {
      console.error(e);
    } finally {
      setPhoneLoading(false);
    }
  };

  // Trigger fetches depending on active tab
  useEffect(() => {
    if (activeTab === "overview") fetchStats();
    if (activeTab === "bookings") {
      fetchBookings();
      fetchTechnicians(); // Needed for assignment dropdown
    }
    if (activeTab === "technicians") fetchTechnicians();
    if (activeTab === "phones") fetchPhones();
  }, [activeTab]);

  // Assign Technician to Booking
  const handleAssignTech = async (bookingId: string, technicianId: string) => {
    if (!technicianId) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicianId }),
      });
      if (res.ok) {
        toast("success", "Technician assigned", "The booking has been assigned successfully.");
        fetchBookings();
      } else {
        const d = await res.json();
        toast("error", "Assignment failed", d.error || "Could not assign technician.");
      }
    } catch (e) {
      toast("error", "Error", "Something went wrong assigning the technician.");
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (bookingId: string) => {
    const ok = await confirm({
      title: "Delete booking?",
      message: "This booking will be permanently removed. This action cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setExpandedBooking(null);
        fetchBookings();
        toast("success", "Booking deleted", "The booking has been removed.");
      } else {
        const d = await res.json();
        toast("error", "Failed to delete booking", d.error);
      }
    } catch (e) {
      toast("error", "Error", "Something went wrong deleting the booking.");
    }
  };

  // Toggle Technician active state
  const handleToggleTechActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/technicians/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      });
      if (res.ok) {
        fetchTechnicians();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Technician
  const handleCreateTech = async (e: React.FormEvent) => {
    e.preventDefault();
    setTechError("");
    try {
      const res = await fetch("/api/technicians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTech),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddTech(false);
        setNewTech({ name: "", email: "", phone: "", password: "" });
        fetchTechnicians();
      } else {
        setTechError(data.error || "Failed to create technician");
      }
    } catch (e) {
      setTechError("Server error. Try again.");
    }
  };

  // Create Phone Model
  const handleCreatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    const variantsArray = newPhone.variants
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    try {
      const res = await fetch("/api/phones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: newPhone.brand, model: newPhone.model, variants: variantsArray }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddPhone(false);
        setNewPhone({ brand: "Apple", model: "", variants: "" });
        fetchPhones();
      } else {
        setPhoneError(data.error || "Failed to create phone model");
      }
    } catch (e) {
      setPhoneError("Server error. Try again.");
    }
  };

  // Delete/Deactivate Phone Model
  const handleDeactivatePhone = async (id: string) => {
    const ok = await confirm({
      title: "Deactivate phone model?",
      message: "This model will no longer appear in booking options.",
      confirmLabel: "Deactivate",
      danger: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/phones/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPhones();
        toast("success", "Phone model deactivated");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Email Notifications Setting
  const handleToggleEmailNotifications = async (currentStatus: boolean) => {
    setSettingsLoading(true);
    setSettingsSuccess(false);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailNotifications: !currentStatus }),
      });
      if (res.ok) {
        await refreshUser();
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSettingsLoading(false);
    }
  };

  if (authLoading) return <div style={{ padding: "3rem", display: "flex", justifyContent: "center" }}><div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>;
  if (!user || user.role !== "admin") return <div style={{ padding: "2rem", textAlign: "center", color: "var(--danger)" }}>Access Denied.</div>;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "bookings", label: "Bookings" },
    { id: "technicians", label: "Technicians" },
    { id: "phones", label: "Phone Models" },
    { id: "settings", label: "Settings" },
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter ? b.status === bookingFilter : true;
    const matchesSearch = bookingSearch
      ? b.bookingNo.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        (b.customer?.name || "").toLowerCase().includes(bookingSearch.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });

  const filteredTechs = technicians.filter((t) => {
    return techSearch
      ? t.name.toLowerCase().includes(techSearch.toLowerCase()) ||
        t.email.toLowerCase().includes(techSearch.toLowerCase()) ||
        (t.technicianId || "").toLowerCase().includes(techSearch.toLowerCase())
      : true;
  });

  const filteredPhones = phones.filter((p) => {
    return selectedBrand ? p.brand === selectedBrand : true;
  });

  const cardStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "1.5rem",
    boxShadow: "var(--shadow)",
  };

  const inputStyle = {
    padding: "0.75rem 1rem",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    outline: "none",
    fontSize: "0.9rem",
  };

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    background: "var(--primary)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800 }}>Admin Center</h1>
        <p style={{ color: "var(--text2)", fontSize: "0.95rem", marginTop: "0.25rem" }}>Manage technicians, phone models, inspections, and update system settings.</p>
      </header>

      {/* Tabs list */}
      <div style={{
        display: "flex", gap: "0.25rem", marginBottom: "2rem",
        borderBottom: "1px solid var(--border)", overflowX: "auto", paddingBottom: "0.5rem"
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              position: "relative", padding: "0.75rem 1.5rem", background: "transparent",
              border: "none", color: activeTab === tab.id ? "var(--text)" : "var(--text2)",
              fontWeight: activeTab === tab.id ? "700" : "500", cursor: "pointer", whiteSpace: "nowrap"
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="admin-tab-indicator"
                style={{
                  position: "absolute", bottom: -9, left: 0, right: 0,
                  height: 3, background: "var(--primary)", borderRadius: "3px 3px 0 0"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div>
              {statsLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {/* Stats Summary Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    <div style={cardStyle}>
                      <span style={{ color: "var(--text2)", fontSize: "0.85rem", fontWeight: 600 }}>Total Bookings</span>
                      <p style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.5rem" }}>{stats?.totalBookings || 0}</p>
                    </div>
                    <div style={cardStyle}>
                      <span style={{ color: "var(--text2)", fontSize: "0.85rem", fontWeight: 600 }}>Pending Assignments</span>
                      <p style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--warning)" }}>{stats?.pendingBookings || 0}</p>
                    </div>
                    <div style={cardStyle}>
                      <span style={{ color: "var(--text2)", fontSize: "0.85rem", fontWeight: 600 }}>Completed Bookings</span>
                      <p style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--success)" }}>{stats?.completedBookings || 0}</p>
                    </div>
                    <div style={cardStyle}>
                      <span style={{ color: "var(--text2)", fontSize: "0.85rem", fontWeight: 600 }}>Total Revenue</span>
                      <p style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--primary)" }}>{formatCurrency(stats?.totalRevenue || 0)}</p>
                    </div>
                  </div>

                  {/* Recent Bookings Table */}
                  <div style={cardStyle}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem" }}>Recent Bookings</h3>
                    {stats?.recentBookings?.length > 0 ? (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text2)", fontSize: "0.85rem" }}>
                              <th style={{ padding: "0.75rem 0.5rem" }}>ID</th>
                              <th style={{ padding: "0.75rem 0.5rem" }}>Customer</th>
                              <th style={{ padding: "0.75rem 0.5rem" }}>Device</th>
                              <th style={{ padding: "0.75rem 0.5rem" }}>Status</th>
                              <th style={{ padding: "0.75rem 0.5rem" }}>Technician</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.recentBookings.map((b: any) => {
                              const status = BOOKING_STATUSES[b.status] || { label: b.status, color: "gray" };
                              return (
                                <tr key={b._id} style={{ borderBottom: "1px solid var(--border)", fontSize: "0.9rem" }}>
                                  <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{b.bookingNo}</td>
                                  <td style={{ padding: "0.75rem 0.5rem" }}>{b.customer?.name}</td>
                                  <td style={{ padding: "0.75rem 0.5rem" }}>{b.phone?.brand} {b.phone?.model}</td>
                                  <td style={{ padding: "0.75rem 0.5rem" }}>
                                    <span style={{ padding: "0.2rem 0.6rem", background: status.color, color: "#fff", borderRadius: 99, fontSize: "0.75rem", fontWeight: 600 }}>{status.label}</span>
                                  </td>
                                  <td style={{ padding: "0.75rem 0.5rem", color: b.technician ? "var(--text)" : "var(--text2)" }}>{b.technician?.name || "Not Assigned"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>No bookings available.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Bookings */}
          {activeTab === "bookings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Filters / Search */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <input
                  placeholder="Search by Booking No or Customer Name"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  style={{ ...inputStyle, flex: 1, minWidth: 260 }}
                />
                <select
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                  style={{ ...inputStyle, width: 180 }}
                >
                  <option value="">All Statuses</option>
                  {Object.entries(BOOKING_STATUSES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              {bookingsLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>
              ) : filteredBookings.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {filteredBookings.map((b) => {
                    const status = BOOKING_STATUSES[b.status] || { label: b.status, color: "gray" };
                    const isExpanded = expandedBooking === b._id;
                    return (
                      <div
                        key={b._id}
                        style={{
                          ...cardStyle,
                          border: isExpanded ? "1px solid var(--primary)" : "1px solid var(--border)",
                          cursor: "pointer"
                        }}
                        onClick={() => setExpandedBooking(isExpanded ? null : b._id)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                          <div>
                            <span style={{ color: "var(--text2)", fontSize: "0.8rem", fontWeight: 700 }}>{b.bookingNo}</span>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "0.25rem" }}>{b.phone?.brand} {b.phone?.model}</h3>
                            <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Scheduled: {formatDate(b.meetDate)} at {b.timeSlot}</p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ padding: "0.25rem 0.75rem", background: status.color, color: "#fff", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700 }}>{status.label}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteBooking(b._id); }}
                              title="Delete booking"
                              aria-label="Delete booking"
                              style={{
                                background: "transparent", border: "1px solid var(--border)",
                                color: "var(--danger)", borderRadius: "var(--radius-sm)",
                                width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "background 0.2s, color 0.2s, border-color 0.2s",
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--danger)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--danger)"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--danger)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border)", paddingTop: "1.25rem", cursor: "default" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
                              <div>
                                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--primary)" }}>Customer Info</h4>
                                <p style={{ fontWeight: 600 }}>{b.customer?.name}</p>
                                <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: "0.25rem" }}>{b.customer?.phone} • {b.customer?.email}</p>
                                <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                                  <strong>Address:</strong> {b.address?.line1}, {b.address?.city} {b.address?.pincode}
                                  {b.address?.landmark && ` (Near ${b.address.landmark})`}
                                </p>
                              </div>

                              <div>
                                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--primary)" }}>Technician Assignment</h4>
                                {b.technician ? (
                                  <div>
                                    <p style={{ fontWeight: 600 }}>{b.technician.name}</p>
                                    <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>ID: {b.technician.technicianId} • {b.technician.phone}</p>
                                  </div>
                                ) : (
                                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    <p style={{ color: "var(--danger)", fontSize: "0.85rem", fontWeight: 600 }}>No technician assigned yet.</p>
                                    <select
                                      onChange={(e) => handleAssignTech(b._id, e.target.value)}
                                      defaultValue=""
                                      style={{ ...inputStyle, width: "100%" }}
                                    >
                                      <option value="" disabled>Assign Technician...</option>
                                      {technicians.filter((t) => t.active).map((t) => (
                                        <option key={t._id} value={t._id}>{t.name} ({t.technicianId})</option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            </div>

                            {b.timeline && (
                              <div style={{ marginTop: "1.25rem" }}>
                                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text2)" }}>Timeline</h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                  {b.timeline.map((t: any, idx: number) => (
                                    <span key={idx} style={{ fontSize: "0.8rem", color: "var(--text2)" }}>• {t.label} ({formatDate(t.at)})</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
                              <button
                                onClick={() => handleDeleteBooking(b._id)}
                                style={{
                                  background: "color-mix(in srgb, var(--danger) 10%, transparent)",
                                  border: "1px solid color-mix(in srgb, var(--danger) 40%, transparent)",
                                  color: "var(--danger)", padding: "0.6rem 1.25rem", borderRadius: "var(--radius)",
                                  fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                                  transition: "background 0.2s, color 0.2s",
                                }}
                              >
                                Delete Booking
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: "var(--text2)", textAlign: "center", padding: "2rem" }}>No bookings match search filters.</p>
              )}
            </div>
          )}

          {/* Tab 3: Technicians */}
          {activeTab === "technicians" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <input
                  placeholder="Search by ID, name, or email"
                  value={techSearch}
                  onChange={(e) => setTechSearch(e.target.value)}
                  style={{ ...inputStyle, width: "100%", maxWidth: 320 }}
                />
                <button onClick={() => setShowAddTech(true)} style={buttonStyle}>+ Add Technician</button>
              </div>

              {techLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>
              ) : filteredTechs.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                  {filteredTechs.map((t) => (
                    <div key={t._id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", background: "var(--surface2)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700, color: "var(--text2)" }}>{t.technicianId}</span>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "0.5rem" }}>{t.name}</h3>
                        <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: "0.25rem" }}>{t.email}</p>
                        <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>{t.phone}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                        <span style={{
                          padding: "0.25rem 0.5rem", borderRadius: 4, fontSize: "0.7rem", fontWeight: 700,
                          background: t.active ? "color-mix(in srgb, var(--success) 10%, transparent)" : "color-mix(in srgb, var(--danger) 10%, transparent)",
                          color: t.active ? "var(--success)" : "var(--danger)"
                        }}>{t.active ? "Active" : "Inactive"}</span>
                        <button
                          onClick={() => handleToggleTechActive(t._id, t.active)}
                          style={{
                            background: "transparent", border: "1px solid var(--border)",
                            color: t.active ? "var(--danger)" : "var(--success)",
                            padding: "0.35rem 0.75rem", borderRadius: "var(--radius)",
                            fontSize: "0.8rem", fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          {t.active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text2)", textAlign: "center", padding: "2rem" }}>No technicians available.</p>
              )}

              {/* Add Technician Modal */}
              {showAddTech && (
                <div style={{
                  position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100,
                  display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
                }}>
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      background: "var(--surface)", border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)", padding: "2rem", maxWidth: 400, width: "100%"
                    }}
                  >
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>Add Technician</h3>
                    {techError && <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginBottom: "1rem" }}>{techError}</p>}
                    <form onSubmit={handleCreateTech} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <input placeholder="Name *" required value={newTech.name} onChange={(e) => setNewTech({ ...newTech, name: e.target.value })} style={inputStyle} />
                      <input placeholder="Email *" required type="email" value={newTech.email} onChange={(e) => setNewTech({ ...newTech, email: e.target.value })} style={inputStyle} />
                      <input placeholder="Phone *" required value={newTech.phone} onChange={(e) => setNewTech({ ...newTech, phone: e.target.value })} style={inputStyle} />
                      <input placeholder="Password *" required type="password" value={newTech.password} onChange={(e) => setNewTech({ ...newTech, password: e.target.value })} style={inputStyle} />
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <button type="submit" style={buttonStyle}>Create</button>
                        <button type="button" onClick={() => setShowAddTech(false)} style={{ ...buttonStyle, background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Phone Models */}
          {activeTab === "phones" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  style={{ ...inputStyle, width: 200 }}
                >
                  <option value="">All Brands</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <button onClick={() => setShowAddPhone(true)} style={buttonStyle}>+ Add Phone Model</button>
              </div>

              {phoneLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>
              ) : filteredPhones.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text2)", fontSize: "0.85rem" }}>
                        <th style={{ padding: "0.75rem 1rem" }}>Brand</th>
                        <th style={{ padding: "0.75rem 1rem" }}>Model</th>
                        <th style={{ padding: "0.75rem 1rem" }}>Variants</th>
                        <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPhones.map((p) => (
                        <tr key={p._id} style={{ borderBottom: "1px solid var(--border)", fontSize: "0.9rem" }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{p.brand}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>{p.model}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            {p.variants?.map((v: string) => (
                              <span key={v} style={{ marginRight: 6, padding: "0.15rem 0.4rem", background: "var(--surface2)", borderRadius: 4, fontSize: "0.75rem" }}>{v}</span>
                            ))}
                          </td>
                          <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                            <button
                              onClick={() => handleDeactivatePhone(p._id)}
                              style={{ background: "transparent", border: "none", color: "var(--danger)", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: "var(--text2)", textAlign: "center", padding: "2rem" }}>No phone models available.</p>
              )}

              {/* Add Phone Model Modal */}
              {showAddPhone && (
                <div style={{
                  position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100,
                  display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
                }}>
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      background: "var(--surface)", border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)", padding: "2rem", maxWidth: 400, width: "100%"
                    }}
                  >
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>Add Phone Model</h3>
                    {phoneError && <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginBottom: "1rem" }}>{phoneError}</p>}
                    <form onSubmit={handleCreatePhone} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label style={{ fontSize: "0.8rem", color: "var(--text2)" }}>Brand *</label>
                        <select
                          value={newPhone.brand}
                          onChange={(e) => setNewPhone({ ...newPhone, brand: e.target.value })}
                          style={{ ...inputStyle, width: "100%", marginTop: "0.25rem" }}
                        >
                          {BRANDS.filter(b => b !== "Other").map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <input placeholder="Model Name *" required value={newPhone.model} onChange={(e) => setNewPhone({ ...newPhone, model: e.target.value })} style={inputStyle} />
                      <input placeholder="Variants (comma separated, e.g. 128GB, 256GB)" value={newPhone.variants} onChange={(e) => setNewPhone({ ...newPhone, variants: e.target.value })} style={inputStyle} />
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <button type="submit" style={buttonStyle}>Create</button>
                        <button type="button" onClick={() => setShowAddPhone(false)} style={{ ...buttonStyle, background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Settings */}
          {activeTab === "settings" && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>System Settings</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Email Notifications Toggle */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>Email Notifications on New Bookings</h4>
                    <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Send an email to your address whenever a customer books a doorstep inspection.</p>
                  </div>
                  <button
                    disabled={settingsLoading}
                    onClick={() => handleToggleEmailNotifications(user?.emailNotifications ?? true)}
                    style={{
                      background: (user?.emailNotifications ?? true) ? "var(--primary)" : "var(--border)",
                      color: (user?.emailNotifications ?? true) ? "#fff" : "var(--text)",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius)",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "background 0.2s"
                    }}
                  >
                    {(user?.emailNotifications ?? true) ? "Enabled" : "Disabled"}
                  </button>
                </div>

                {settingsSuccess && (
                  <p style={{ color: "var(--success)", fontSize: "0.85rem", fontWeight: 600 }}>Settings updated successfully!</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
