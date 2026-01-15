"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaIdCard,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    admissionNo: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessBox, setShowSuccessBox] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // 1️⃣ Upload image to Supabase bucket (student)
      let imageUrl = null;
  
      if (formData.image) {
        const fileExt = formData.image.name.split(".").pop();
        const fileName = `${Date.now()}-${formData.admissionNo}.${fileExt}`;
  
        const { error: uploadError } = await supabase.storage
          .from("albayan")
          .upload(fileName, formData.image);
  
        if (uploadError) {
          console.error(uploadError);
          alert("Image upload failed");
          return;
        }
  
        // 2️⃣ Get public URL
        const { data } = supabase.storage
          .from("albayan")
          .getPublicUrl(fileName);
  
        imageUrl = data.publicUrl;
      }
  
      // 3️⃣ Insert data into students table
      const { error: insertError } = await supabase
        .from("all_student")
        .insert({
          name: formData.name,
          class: formData.class,
          admission_no: formData.admissionNo,
          image_url: imageUrl,
        });
  
      if (insertError) {
        console.error(insertError);
        alert("Database insert failed");
        return;
      }
  
      // 4️⃣ Show success modal
      setIsSubmitted(true);
      setShowSuccessBox(true);
  
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };
  
  const handleCloseSuccessBox = () => {
    setShowSuccessBox(false);
    setIsSubmitted(false);
    setFormData({ name: "", class: "", admissionNo: "", image: null });
    setPreview(null);
  };

  // SVG noise texture as a separate variable to avoid quote issues
  const noiseSVG = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 animate-gradient-xy bg-gradient-to-r from-blue-200/30 via-transparent to-purple-200/30"></div>
        
        {/* Animated Blobs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, 150, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl"
        />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff0_1px,transparent_1px),linear-gradient(180deg,#fff0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"></div>
        
        {/* Subtle Noise Texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("${noiseSVG}")`,
            backgroundSize: '200px 200px'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Success Box - Centered Modal */}
          <AnimatePresence>
            {showSuccessBox && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={handleCloseSuccessBox}
              >
                <motion.div
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  exit={{ y: 50 }}
                  className="relative w-full max-w-md bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-2xl border border-white/50 overflow-hidden max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={handleCloseSuccessBox}
                    className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 bg-white/90 rounded-full p-2 backdrop-blur-sm hover:bg-white transition-all shadow-lg"
                  >
                    <FaTimes className="text-lg" />
                  </button>

                  <div className="flex flex-col items-center p-6">
                    {/* Top - Rounded Image */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                        {preview ? (
                          <img
                            src={preview}
                            alt="Student"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <FaUserGraduate className="text-3xl sm:text-4xl text-gray-400" />
                          </div>
                        )}
                      </div>
                      {/* Check Badge */}
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                        <FaCheckCircle className="text-xl sm:text-2xl text-white" />
                      </div>
                    </div>

                    {/* Congratulation Message */}
                    <div className="text-center mb-6">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        Congratulations! 🎉
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Successfully registered as a Memmber
                      </p>
                    </div>

                    {/* User Details */}
                    <div className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                        Registration Details
                      </h3>
                      <div className="space-y-4">
                        <DetailItemMobile 
                          label="Name" 
                          value={formData.name} 
                          icon={<FaUserGraduate className="text-blue-500" />}
                        />
                        <DetailItemMobile 
                          label="Class" 
                          value={formData.class} 
                          icon={<FaChalkboardTeacher className="text-purple-500" />}
                        />
                        <DetailItemMobile 
                          label="Admission Number" 
                          value={formData.admissionNo} 
                          icon={<FaIdCard className="text-pink-500" />}
                        />
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Status</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <FaCheckCircle className="mr-1.5" /> Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={handleCloseSuccessBox}
                      className="mt-6 w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                    >
                      Close & Register Another
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            {/* LEFT SECTION - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2"
            >
              <div className="bg-gradient-to-br from-blue-800/95 via-purple-900/95 to-pink-900/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-5 sm:p-8 text-white border border-white/20">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                  Join Us as a <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">
                  Member
                  </span>
                </h1>

                <div className="bg-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 backdrop-blur-sm">
                  <img
                    src="/logo.png"
                    alt="Samastha Centenary"
                    className="w-full h-32 sm:h-40 lg:h-48 object-contain"
                  />
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                    ⭐ About Vaakku Kathi 
                  </h3>
                  <p className="text-blue-100 leading-relaxed text-xs sm:text-sm md:text-base">
                    Celebrating Vaakku Kathi of service, education, and community
                    impact. Join us in honoring our legacy and shaping the
                    future.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SECTION - Registration Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:w-1/2"
            >
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/30">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-5 sm:mb-7">
                  Registration Form
                </h2>

                {preview && !showSuccessBox && (
                  <div className="flex justify-center mb-5 sm:mb-7">
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-2xl object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        <FaUserGraduate className="text-xs sm:text-sm text-white" />
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <InputMobile
                    icon={<FaUserGraduate />}
                    label="Student Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    disabled={showSuccessBox}
                  />

                  <InputMobile
                    icon={<FaChalkboardTeacher />}
                    label="Class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    placeholder="12th"
                    disabled={showSuccessBox}
                  />

                  <InputMobile
                    icon={<FaIdCard />}
                    label="Admission Number"
                    name="admissionNo"
                    value={formData.admissionNo}
                    onChange={handleChange}
                    placeholder="Admission No"
                    disabled={showSuccessBox}
                  />

                  <div>
                    <label className="font-bold text-xs sm:text-sm block mb-1.5 sm:mb-2">
                      Student Photo
                    </label>
                    <div className={`file-input-wrapper ${showSuccessBox ? 'opacity-50' : ''}`}>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        required={!showSuccessBox}
                        disabled={showSuccessBox}
                        className="w-full text-xs sm:text-sm file:py-2.5 sm:file:py-3 file:px-4 sm:file:px-5 file:rounded-lg sm:file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={!showSuccessBox ? { scale: 1.02 } : {}}
                    whileTap={!showSuccessBox ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={showSuccessBox}
                    className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-white transition-all duration-300 text-sm sm:text-base ${
                      showSuccessBox 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95'
                    }`}
                  >
                    {showSuccessBox ? 'Already Registered' : 'Register Now'}
                  </motion.button>

                  {showSuccessBox && (
                    <p className="text-center text-xs sm:text-sm text-gray-500 pt-2">
                      Close the success popup to register another student
                    </p>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add styles for animation */}
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
          animation: gradient-xy 15s ease infinite;
        }

        /* Custom scrollbar for success modal */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* File input styling */
        .file-input-wrapper input[type="file"]::-webkit-file-upload-button {
          font-size: 0.75rem;
          padding: 0.5rem 1rem;
        }

        @media (min-width: 640px) {
          .file-input-wrapper input[type="file"]::-webkit-file-upload-button {
            font-size: 0.875rem;
            padding: 0.625rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

/* Mobile Optimized Input Component */
function InputMobile({ icon, label, disabled, ...props }) {
  return (
    <div>
      <label className="font-bold text-xs sm:text-sm block mb-1.5 sm:mb-2">{label}</label>
      <div className="relative">
        <span className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-sm sm:text-base ${disabled ? 'text-gray-300' : 'text-gray-400'}`}>
          {icon}
        </span>
        <input
          {...props}
          required={!disabled}
          disabled={disabled}
          className={`w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border transition-all duration-300 text-sm sm:text-base ${
            disabled 
              ? 'border-gray-100 bg-gray-50 cursor-not-allowed text-gray-500' 
              : 'border-gray-200 focus:border-blue-400 focus:ring-2 sm:focus:ring-4 focus:ring-blue-100'
          }`}
        />
      </div>
    </div>
  );
}

/* Mobile Optimized Detail Item */
function DetailItemMobile({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${
        label === 'Name' ? 'bg-blue-50' : 
        label === 'Class & Section' ? 'bg-purple-50' : 
        'bg-pink-50'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className="text-sm sm:text-base font-semibold text-gray-800 break-words mt-0.5">{value || 'Not provided'}</p>
      </div>
    </div>
  );
}