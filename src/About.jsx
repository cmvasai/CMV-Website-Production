import { useState } from 'react';
import AcharyaModal from './AcharyaModal';

const acharyas = [
  {
    id: 1,
    name: "Swami Tejomayananda",
    image: "/images/swami-tejomayananda.jpg",
    description: "Swami Tejomayananda is the former Head of Chinmaya Mission Worldwide, a position he held since 1993 after Swami Chinmayananda attained Mahasamadhi. If Swami Chinmayananda served the cause of Vedanta with his service, knowledge and pioneering qualities, Swami Tejomayananda – fondly addressed as Guruji – completed that with his natural attitude of devotion. This is richly and abundantly evident in his talks, his singing, and his demeanour. But the gentleness of devotion arrived riding on the back of a degree in physics. Born, Sudhakar Kaitwade to a Maharashtrian family in Madhya Pradesh, this physicist had a close encounter that changed the velocity, direction and path of his life."
  },
  {
    id: 2,
    name: "Swami Swaroopananda",
    image: "/images/swami-swaroopananda.png",
    description: "Swami Swaroopananda is the Global Head of Chinmaya Mission. The mantle of this important responsibility draped his shoulders from 19 January 2017, when Swami Tejomayananda passed on the baton to him. He chairs Central Chinmaya Mission Trust (CCMT), the apex governing body of Chinmaya Mission Centres and Trusts the world over. He is the Chancellor of Chinmaya University (Chinmaya Vishwavidyapeeth) and Chairman of Chinmaya International Residential School in Coimbatore, one of the most well-respected and well-performing residential schools of India. An able administrator and a dynamic leader, his watchful eye and acumen keeps him abreast with developments of any consequence in the over 300 Centres under his guard. Devotion to his Guru, Swami Chinmayananda, and obeisance to his philosophy, guides his decision making and governance."
  },
  {
    id: 3,
    name: "Swami Brahmananda",
    image: "/images/swami-brahmananda.jpg",
    description: "Pujya Swami Brahmananda is one of the senior disciples of Pujya Gurudev, Swami Chinmayananda. Swamiji’s clarity on profound Vedantic truths has made his spiritual discourses popular throughout India. Swamiji has also endeared himself to millions with his mastery in Sanskrit chanting and resonant devotional hymns. Born to a devout family in Pavanje Village in South Karnataka, the making of this spiritual luminary was visible from childhood. Inspired by Pujya Gurudev, the young seeker of knowledge underwent rigourous training at Chinmaya Mission’s Sandeepany Sadhanalaya ashram in Mumbai. After the completion of the intensive three-year Vedanta course, Pujya Gurudev, recognising the brahmachari’s mastery of the scriptures and missionary zeal, asked him to begin conducting spiritual discourses immediately."
  },
  {
    id: 4,
    name: "Swami Nirbhayananda",
    image: "/images/swami-nirbhayananda.jpeg",
    description: "Swami Nirbhayananda hailing from South India received his formal education overseas. A Software professional in his purvashram was involved with Chinmaya Mission and it’s activities from his childhood. Served the Chinmaya Mission Mumbai as it”s General Secretary for the Youth Wing in late 90’s took up to learning of Vedanta as a full time student in 2002-2004 under the tutelage of Sw. Ishwaranandaji and received the name Br. Pavan Chaitanya in 2004 by Pujya Guruji Sw. Tejomayanandaji. Ever since his posting in Chinmaya Mission Mumbai at Chinmaya Bhakti, Borivali, the Area has seen a steady grow in it’s activities. He is proficient in English, Hindi and Malayalam alike and has been conducting workshops in B’ Schools, Educational Institutions, Corporate Offices. He is known for his sessions on parenting, Stress buster modules and talks on Human Values based on Bhagavat Geeta and Upanishads. He has addressed seminars on Indian approach to Management and also uses movie workshops and Outdoor-Experiential-Learning (OEL) through adventurous treks, etc. effectively. He has been an inspiration to the Chinmaya Yuva Kendra (CHYK), the youth wing of Chinmaya Mission.Br. Pavan Chaitanya wins hearts with his simplicity and affection to one and all around him. He is a Tech Savvy and passionate about painting and loves playing Badminton. He is known for his focus and clarity in the spiritual Path."
  }
];

const About = () => {
  const [selectedAcharya, setSelectedAcharya] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        {/* About Us Section */}
        <h1 className="text-3xl font-bold text-center mb-8">About Us</h1>

        <div className="max-w-4xl mx-auto text-gray-800 dark:text-gray-300">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Text Content */}
            <div className="w-full md:w-3/4 space-y-6 text-justify order-2 md:order-1">
              <p className="text-lg leading-relaxed">
                Chinmaya Mission was established in 1953 by devotees of the world-renowned Vedanta teacher, His Holiness Swami Chinmayananda. The Mission carries forward the spiritual and educational legacy of this great visionary through its numerous activities and centers worldwide.
              </p>

              <p className="text-lg leading-relaxed">
                Swami Chinmayananda was one of the 20th century's most world-renowned and revered exponents of Vedanta, the ancient philosophical wisdom of India. Through his tireless service spanning more than four decades, he worked to bring about spiritual revival in India and abroad. His teachings are kept alive today through Chinmaya Mission centers worldwide.
              </p>

              <p className="text-lg leading-relaxed">
                The Mission's purpose is to spread the knowledge of Vedanta and provide a means for spiritual growth and development. Through various spiritual, educational, and charitable activities, Chinmaya Mission aims to help individuals understand the deeper purpose of life and achieve inner growth and development.
              </p>

              <p className="text-lg leading-relaxed">
                Here at Chinmaya Mission Vasai, we conduct various activities including Vedanta classes, Bala Vihar for children, Yuva Kendra for youth, and spiritual discourses. Our center is dedicated to promoting the teachings of Vedanta and fostering spiritual growth in our community through regular study groups, workshops, and cultural activities.
              </p>

              <div className="text-center mt-8 py-4 bg-[#ffe4d6] dark:bg-gray-700 rounded-lg">
                <p className="text-xl font-semibold">Our Vision</p>
                <p className="italic mt-2 px-4">
                  "To provide to individuals from any background, the wisdom of Vedanta and the practical means for spiritual growth and happiness, enabling them to become positive contributors to society."
                </p>
              </div>
            </div>

            {/* Swami Chinmayananda's Image */}
            <div className="w-full md:w-1/4 flex justify-center mb-4 md:mb-0 order-1 md:order-2">
              <img 
                src="/images/swamiji.jpg" 
                alt="Swami Chinmayananda" 
                className="rounded-lg shadow-lg w-[200px] h-auto object-cover" 
              />
            </div>
          </div>
        </div>

        {/* Acharyas Section */}
        <div className="mt-20 mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">Our Acharyas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {acharyas.map((acharya) => (
              <div 
                key={acharya.id}
                className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => setSelectedAcharya(acharya)}
              >
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg">
                  <img
                    src={acharya.image}
                    alt={acharya.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-center dark:text-white">{acharya.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        <AcharyaModal
          isOpen={!!selectedAcharya}
          onClose={() => setSelectedAcharya(null)}
          acharya={selectedAcharya}
        />
      </div>
    </div>
  );
};

export default About;