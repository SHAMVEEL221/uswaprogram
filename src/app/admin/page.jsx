"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  FaUserGraduate,
  FaSearch,
  FaEye,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
  FaIdCard,
  FaTimes,
} from "react-icons/fa";

export default function AdminPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.admission_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("all_student")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setStudents(data);
      setFilteredStudents(data);
    }

    setLoading(false);
  };

  const handleImageClick = (imageUrl, student) => {
    setSelectedImage(imageUrl);
    setSelectedStudent(student);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedStudent(null);
  };

  const handleExport = () => {
    const csvContent = [
      ["Name", "Class", "Admission No", "Registration Date"],
      ...filteredStudents.map((s) => [
        s.name,
        s.class,
        s.admission_no,
        new Date(s.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 animate-gradient-xy bg-gradient-to-r from-blue-200/30 via-transparent to-purple-200/30"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff0_1px,transparent_1px),linear-gradient(180deg,#fff0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg backdrop-blur-sm">
                  <FaUserGraduate className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Manage and view registered students
                  </p>
                </div>
              </div>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
              >
                <FaDownload />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/95 backdrop-blur-lg rounded-xl p-5 shadow-lg border-l-4 border-blue-500 border-t border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold text-gray-800">{students.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100/80 backdrop-blur-sm rounded-lg">
                    <FaUserGraduate className="text-blue-600 text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-lg rounded-xl p-5 shadow-lg border-l-4 border-purple-500 border-t border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Today's Registrations</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {students.filter(
                        (s) =>
                          new Date(s.created_at).toDateString() ===
                          new Date().toDateString()
                      ).length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100/80 backdrop-blur-sm rounded-lg">
                    <FaCalendarAlt className="text-purple-600 text-xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-lg rounded-xl p-5 shadow-lg border-l-4 border-green-500 border-t border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Showing</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {filteredStudents.length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100/80 backdrop-blur-sm rounded-lg">
                    <FaFilter className="text-green-600 text-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur-lg rounded-xl p-4 shadow-lg mb-6 border-t border-white/30">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, class, or admission number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 bg-white/50"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading students...</p>
            </div>
          )}

          {/* Table (Desktop) */}
          {!loading && filteredStudents.length > 0 && (
            <div className="hidden md:block bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-200/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/80">
                    <tr>
                      <th className="p-4 text-left text-gray-700 font-semibold">Photo</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Name</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Class</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Admission No</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Registration Date</th>
                      <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, index) => (
                      <tr
                        key={s.id}
                        className={`hover:bg-blue-50/50 transition-colors ${
                          index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="p-4">
                          <div className="relative group">
                            {s.image_url ? (
                              <img
                                src={s.image_url}
                                alt={s.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow cursor-pointer hover:scale-110 transition-transform duration-300"
                                onClick={() => handleImageClick(s.image_url, s)}
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                                <FaUserGraduate className="text-gray-500 text-xl" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <FaEye className="text-white" />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-gray-800">{s.name}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            {s.class}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FaIdCard className="text-gray-400" />
                            <span className="font-mono text-gray-700">{s.admission_no}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600">
                            {new Date(s.created_at).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(s.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleImageClick(s.image_url, s)}
                            className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors"
                          >
                            <FaEye />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cards (Mobile) */}
          {!loading && filteredStudents.length > 0 && (
            <div className="grid md:hidden gap-4">
              {filteredStudents.map((s) => (
                <div
                  key={s.id}
                  className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-gray-200/50"
                >
                  <div className="flex gap-4 items-start">
                    <div className="relative">
                      {s.image_url ? (
                        <img
                          src={s.image_url}
                          alt={s.name}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow cursor-pointer"
                          onClick={() => handleImageClick(s.image_url, s)}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                          <FaUserGraduate className="text-gray-500 text-xl" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{s.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {s.class}
                        </span>
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaIdCard className="text-xs" />
                          <span className="text-sm font-mono">{s.admission_no}</span>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-500">
                        Registered: {new Date(s.created_at).toLocaleDateString()}
                      </div>

                      <button
                        onClick={() => handleImageClick(s.image_url, s)}
                        className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <FaEye />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredStudents.length === 0 && (
            <div className="text-center py-12 bg-white/95 backdrop-blur-lg rounded-2xl shadow border-t border-white/30">
              <div className="text-gray-400 text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No students found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? `No results for "${searchTerm}". Try a different search term.`
                  : "No students registered yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeImageModal}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/30">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50/80 to-blue-50/80">
                <div>
                  <h3 className="font-bold text-gray-800">Student Photo</h3>
                  {selectedStudent && (
                    <p className="text-sm text-gray-600">
                      {selectedStudent.name} • {selectedStudent.class}
                    </p>
                  )}
                </div>
                <button
                  onClick={closeImageModal}
                  className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-auto">
                <div className="flex flex-col items-center">
                  <img
                    src={selectedImage}
                    alt="Student"
                    className="w-64 h-64 rounded-2xl object-cover border-4 border-white shadow-xl mb-6"
                  />

                  {selectedStudent && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUserGraduate className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Student Name</p>
                            <p className="font-bold text-gray-800">{selectedStudent.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50/80 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <FaIdCard className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Admission No</p>
                            <p className="font-bold text-gray-800 font-mono">
                              {selectedStudent.admission_no}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 text-center text-sm text-gray-500">
                    Click outside to close
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t bg-gray-50/80">
                <div className="flex justify-end gap-3">
                  <a
                    href={selectedImage}
                    download={`${selectedStudent?.name || "student"}_photo.jpg`}
                    className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <FaDownload />
                    Download Photo
                  </a>
                  <button
                    onClick={closeImageModal}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
        }
        
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 20s ease infinite;
        }
      `}</style>
    </div>
  );
}