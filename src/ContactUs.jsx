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
            C-23/24, Sai Tower<br />
            Ambadi Road<br />
            Vasai Road (West) - 401202<br />
            Palghar (Dist)<br />
            Maharashtra<br />
            India
          </h2>
        </div>

        <div className="gap-2">
          <h1 className="text-lg sm:text-xl font-semibold mt-4">Quick Contact:</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-2">
            <div className="flex items-center gap-2">
              <IoIosCall className="text-lg sm:text-xl text-black dark:text-white" />
              <h1 className="text-sm sm:text-base">+91 7303717177</h1>
            </div>
            <div className="flex items-center gap-2">
              <TiMail className="text-lg sm:text-xl text-black dark:text-white" />
              <h1 className="text-sm sm:text-base">vasai@chinmayamission.com</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex items-center bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-4 sm:p-6 md:p-8 w-full max-w-4xl h-auto flex flex-col gap-4 mt-6">
        <h1 className="text-lg sm:text-xl font-semibold">Locate Us</h1>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1204.4314691847571!2d72.82567982118061!3d19.385288842834683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7afdf8bd27579%3A0x4611efb7ad50e330!2sSai%20tower!5e1!3m2!1sen!2sin!4v1742901245734!5m2!1sen!2sin" width="600" height="450" allowFullScreen="" loading="lazy"></iframe>
      </div>
    </div>
  );
};

export default ContactUs;