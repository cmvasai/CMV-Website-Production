import { TfiLocationPin } from "react-icons/tfi";
import { IoIosCall } from "react-icons/io";
import { TiMail } from "react-icons/ti";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center">
      {/* Contact Info Section */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-4 sm:p-6 md:p-8 w-full max-w-4xl h-auto flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <TfiLocationPin className="text-xl sm:text-2xl text-black dark:text-white" />
          <h1 className="text-2xl sm:text-3xl font-bold">Contact Us</h1>
        </div>

        <div className="gap-2">
          <h1 className="text-lg sm:text-xl font-semibold">Chinmaya Mission Vasai</h1>
          <h2 className="text-sm sm:text-base mt-2">
            D-101 Apeksha Apartments <br />
            Sai Nagar <br />
            Vasai Road West Palghar District <br />
            Vasai 401-202 <br />
            Maharashtra <br />
            India
          </h2>
        </div>

        <div className="gap-2">
          <h1 className="text-lg sm:text-xl font-semibold mt-4">Quick Contact:</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-2">
            <div className="flex items-center gap-2">
              <IoIosCall className="text-lg sm:text-xl text-black dark:text-white" />
              <h1 className="text-sm sm:text-base">0250-2345513</h1>
            </div>
            <div className="flex items-center gap-2">
              <IoIosCall className="text-lg sm:text-xl text-black dark:text-white" />
              <h1 className="text-sm sm:text-base">+91 XXXXXXXXXX</h1>
            </div>
            <div className="flex items-center gap-2">
              <TiMail className="text-lg sm:text-xl text-black dark:text-white" />
              <h1 className="text-sm sm:text-base">vasai@chinmayamission.com</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-4 sm:p-6 md:p-8 w-full max-w-4xl h-auto flex flex-col gap-4 mt-6">
        <h1 className="text-lg sm:text-xl font-semibold">Locate Us</h1>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1581.695267185037!2d72.82446992679535!3d19.38105670559166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7aebfb2ba2abf%3A0xc6f031efd0d60b32!2sApeksha%20Apartment!5e1!3m2!1sen!2sin!4v1742840919995!5m2!1sen!2sin"
          className="w-full h-64 sm:h-80 md:h-96"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;