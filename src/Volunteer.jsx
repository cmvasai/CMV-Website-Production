import axios from "axios";
import e from "cors";
import { useState } from "react";

const Volunteer = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [comments, setComments] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  

  const onSubmit = async (event) => {
    event.preventDefault();

    // Check if the form is already submitted
    if (formSubmitted) {
      alert("Form already submitted");
      return;
    }
    setFormSubmitted(true); // Set formSubmitted to true
    
    try {
      await axios.post("http://localhost:5000/api/volunteer", {
        firstName,
        lastName,
        email,
        phone,
        dob,
        comments,
      });
      alert("Form submitted successfully");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDob("");
      setComments("");
      setFormSubmitted(false); 
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
      setFormSubmitted(false); // Reset formSubmitted on error
      return;
      
    }





    const formData = new FormData(event.target);

    formData.append("access_key", "2e176cdf-a2d7-4ffe-a2a5-40a08c3f04f6");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      alert("Form Submitted Successfully");
    } else {
      console.log("Error", data);
      alert("error");
    }
  };

  return (
    <>
      {/* Background Image Section (Unchanged) */}
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-8 px-4">
        <div
          className="relative w-full h-[calc(100vh-4rem)] bg-black bg-contain bg-center flex items-end sm:items-center justify-start bg-no-repeat"
          style={{ backgroundImage: "url('/Hanuman.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 sm:bg-opacity-40" />
          <div className="relative z-10 text-white pl-6 sm:pl-10 md:pl-16 max-w-lg pb-6 sm:pb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              Volunteering Opportunities
            </h1>
            <p className="text-sm sm:text-base md:text-lg italic">
              “I serve others not because they are others, but because they are my own self”
            </p>
            <p className="text-xs sm:text-sm md:text-base mt-2">
              - Pujya Gurudev Swami Chinmayananda
            </p>
          </div>
        </div>
      </div>

      {/* Why Serve Section */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-8 px-4">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-6 rounded-lg w-full max-w-4xl flex flex-col gap-6 transition-all duration-300">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Why Serve?</h1>
          <div className="space-y-4 text-sm sm:text-base md:text-lg leading-relaxed">
            <p>
              Chinmaya Mission Sevaks (volunteers) strive to serve in a spirit of selfless action. Serving all as worship of the Lord.
            </p>
            <p>
              Whatever the task, be it great or small, service conducted without the expectation of personal gain shortens the ego and brings us peace and contentment within.
            </p>
            <p>Register your interest using the form below.</p>
          </div>
        </div>
      </div>

      {/* YouTube Video Section */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-8 px-4">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-6 rounded-lg w-full max-w-4xl flex flex-col gap-6 transition-all duration-300">
          <div className="w-full h-[200px] sm:h-[315px] overflow-hidden rounded-md">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/B66u9DNMkvQ?si=0IVEqs2pHQ1ej_fx"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-8 px-4">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-6 rounded-lg w-full max-w-4xl flex flex-col gap-6 transition-all duration-300">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
            Volunteering - Expression of Interest
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                name="First Name"
                required
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                name="Last Name"
                required
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              name="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <input
              type="number"
              placeholder="Phone No"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              name="Phone No"
              required
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />

            <div className="space-y-2">
            <label className="font-semibold text-sm sm:text-base">DOB</label>
              <input
                type="date"
                placeholder="DOB"
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                name="DOB"
                required
                onChange={(e) => setDob(e.target.value)}
                value={dob}
              />
            </div>


            <div className="space-y-2">
              <label className="font-semibold text-sm sm:text-base">Additional Comments:</label>
              <input
                type="text"
                className="border border-gray-300 dark:border-gray-600 p-3 rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                name="other skills and comments"
                onChange={(e) => setComments(e.target.value)}
                value={comments}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-md w-full sm:w-auto hover:bg-blue-600 transition-all duration-300 font-semibold"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Volunteer;