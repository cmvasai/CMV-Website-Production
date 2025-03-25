import { TfiLocationPin } from "react-icons/tfi";
import { IoIosCall } from "react-icons/io";
import { TiMail } from "react-icons/ti";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center py-8 px-4">
      {/* Contact Info Section */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-6 rounded-lg w-full max-w-4xl flex flex-col gap-6 transition-all duration-300">
        <div className="flex items-center gap-3">
          <TfiLocationPin className="text-2xl md:text-3xl text-black dark:text-white flex-shrink-0" />
          <h1 className="text-2xl md:text-3xl font-bold">Contact Us</h1>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-semibold">Chinmaya Mission Vasai</h1>
          <address className="text-sm md:text-base not-italic leading-relaxed">
            C-23/24, Sai Tower<br />
            Ambadi Road<br />
            Vasai Road (West) - 401202<br />
            Palghar (Dist)<br />
            Maharashtra<br />
            India
          </address>
        </div>

        <div className="space-y-3">
          <h1 className="text-xl md:text-2xl font-semibold">Quick Contact</h1>
          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
            <div className="flex items-center gap-2">
              <IoIosCall className="text-xl md:text-2xl text-black dark:text-white flex-shrink-0" />
              <a href="tel:+917303717177" className="text-sm md:text-base hover:underline">+91 7303717177</a>
            </div>
            <div className="flex items-center gap-2">
              <TiMail className="text-xl md:text-2xl text-black dark:text-white flex-shrink-0" />
              <a href="mailto:vasai@chinmayamission.com" className="text-sm md:text-base hover:underline">vasai@chinmayamission.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] p-6 rounded-lg w-full max-w-4xl flex flex-col gap-4 mt-6 transition-all duration-300">
        <h1 className="text-xl md:text-2xl font-semibold">Locate Us</h1>
        <div className="w-full h-[300px] md:h-[450px] overflow-hidden rounded-md">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1204.4314691847571!2d72.82567982118061!3d19.385288842834683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7afdf8bd27579%3A0x4611efb7ad50e330!2sSai%20tower!5e1!3m2!1sen!2sin!4v1742901245734!5m2!1sen!2sin" 
            className="w-full h-full border-0"
            allowFullScreen 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;