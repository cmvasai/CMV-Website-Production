import { useState } from 'react';
import ActivitiesModal from '../../modals/ActivitiesModal';

const activities = [
  {
    id: 1,
    name: "Shishu Vihar",
    image: "/shishu-vihar.png",
    description: "Shishu Vihar, Chinmaya Mission's early childhood programme, nurtures children aged 1-5 years. It lays a lasting foundation of spiritual and moral values that will guide them throughout life.",
    // schedule: "Every Sunday, 9:30 AM - 10:30 AM",
    benefits: [
      "Early spiritual and moral foundation for toddlers",
      "Parent-child bonding through spiritual activities",
      "Age-appropriate introduction to scriptural stories",
      "Development of motor skills through games and crafts",
      "Social connection in a warm and joyful setting"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com",
    additionalInfo: "Shishu Vihar was first introduced in Hong Kong through the vision of Swamini Supriyananda, a Psychologist by profession. It has since expanded to Centres worldwide. She notes, \"Little ones have a strong retentive power and learn quickly. The added benefit is that parents also absorb the teachings, reinforcing values at home. Even 3-year-olds can chant the Hanuman Chalisa!\" Shishu Vihar is designed to introduce infants and toddlers to spiritual education in a fun, engaging and age-appropriate manner. Classes follow a modern structure of playgroups where babies and toddlers are accompanied by one or both parents. Children are immersed in simple scriptural stories, sing bhajans and nursery rhymes, play games to develop motor skills and engage in arts and crafts that foster social connection in a warm and joyful setting."
  },
  {
    id: 2,
    name: "Bala Vihar",
    image: "/bala_vihar.png",
    description: "Bala Vihar is a weekly cultural and spiritual education program for children. Through stories, shlokas, bhajans, games, and other creative activities, children learn values and principles from our rich cultural heritage.",
    schedule: "Every Sunday, 10:30 AM - 12:00 PM",
    benefits: [
      "Character development through value education",
      "Learning Indian culture and traditions",
      "Development of leadership qualities",
      "Building confidence and public speaking skills"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com"
  },
  {
    id: 3,
    name: "Yuva Kendra",
    image: "/yuva-kendra.png",
    darkImage: "/chyk.png",
    description: "Yuva Kendra is a dynamic forum for youth to explore and understand life through the wisdom of Vedanta. It provides a platform for young adults to discuss practical life challenges and find solutions through ancient wisdom.",
    schedule: "Every Sunday, 8:30 AM - 10:00 AM",
    benefits: [
      "Understanding life through Vedantic perspective",
      "Developing clarity in decision making",
      "Building a strong value system",
      "Networking with like-minded youth"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com"
  },
  {
    id: 4,
    name: "Spiritual Camps",
    image: "/spiritual-camps.png",
    description: "Chinmaya Mission devotees often choose to take a solitary retreat and stay at our Ashrams. The Centres worldwide host spiritual camps and intensive Residential Courses not only for individuals, but also for families and children.",
    benefits: [
      "Break from daily routines in a sacred space",
      "Immersion in Vedantic learning and devotion",
      "Guided learning and introspection",
      "Transformative journey for entire families",
      "Strengthening spiritual connection and values"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com",
    additionalInfo: "These spiritual camps offer an opportunity to participants, whether individuals or entire families, to take a break from their routines. Staying in a sacred space, they are immersed in Vedantic learning, devotion and culture. Through guided learning and introspection, they experience a transformative journey together, strengthening their spiritual connection and values."
  },
  {
    id: 5,
    name: "Vedic and Gita Chanting",
    image: "vedic_gita_chanting.png",
    description: "Chinmaya Mission regards chanting as a powerful and transformative path to inner stillness, clarity of thought and spiritual growth. Through the sacred vibrations of Vedic and Gita chanting, aspirants connect with ancient wisdom in a deeply experiential way.",
    benefits: [
      "Cultivates discipline and concentration",
      "Develops devotion and self-awareness",
      "Refines the mind and opens the heart",
      "Connects with ancient wisdom experientially",
      "Spiritual discipline (sadhana) practice"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com",
    additionalInfo: "These practices cultivate discipline, concentration and devotion, guiding individuals towards greater self-awareness. Chanting is not merely a ritual – it is a sadhana, a spiritual discipline that refines the mind and opens the heart."
  },
  {
    id: 6,
    name: "Satsang",
    image: "/satsang.png",
    description: "At Chinmaya Mission, regular Satsangs, mostly held every Sunday, welcome entire families to come together in devotion and learning. Each session typically features prayers and invocations, soulful bhajans and an inspiring discourse by our Swamiji or Acharya.",
    // schedule: "Every Sunday",
    benefits: [
      "Collective reflection and spiritual growth",
      "Family empowerment with value-based living",
      "Deep spiritual understanding development",
      "Community gathering in warm atmosphere",
      "Living eternal wisdom of Vedanta"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com",
    additionalInfo: "Participants spend about an hour each week reading and listening about various Scriptures. These gatherings offer a space for collective reflection, spiritual growth and living the eternal wisdom of Vedanta in a warm and uplifting atmosphere. Satsang is an opportunity to empower the entire family with knowledge on living a value-based life, deepening spiritual understanding and growing together in truth and harmony."
  },
  {
    id: 7,
    name: "Garbha Samskara",
    image: "/garbha_sanskar.png",
    description: "Chinmaya Garbha Samskara (CGS) is a four-module Vedic prenatal course for couples on their journey to conception and parenthood. This programme blends ancient Hindu wisdom with modern life, offering parents deep insights on spiritually nurturing their babies during pregnancy and early parenting.",
    benefits: [
      "Spiritual preparation for parenthood",
      "Blends ancient wisdom with modern life",
      "Guidance for pregnancy and early parenting",
      "Comprehensive four-module teaching",
      "Interactive workshops and learning"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com",
    additionalInfo: "CGS Motto: Happy parents make happy babies, Happy babies make a happy world. The programme began in 2019 by Kanchan Daswani in Dubai as a prenatal course rooted in Vedic teachings, specially crafted for expectant Bala Vihar sevikas and their friends. After receiving an enthusiastic response and increasing demand, with the blessings of Swami Tejomayananda and Swami Swaroopananda, the course was formally structured. Featuring a comprehensive four-module teaching manual and interactive workshops, the programme has since expanded globally, inspiring young couples to embrace the richness of Hindu culture and the spiritual depth of conscious parenting."
  },
  {
    id: 8,
    name: "Jnana Yajna",
    image: "/jnana_yajnas.png",
    description: "Swami Chinmayananda coined the term 'Jnana Yajna' for Chinmaya Mission's free public discourses on the scriptures. Traditionally, a yajna is a fire ritual where offerings are burned to invoke divine blessings. In a Jnana Yajna, ignorance of our true nature is symbolically burned in the fire of Vedantic wisdom, revealing the Self.",
    benefits: [
      "Free public discourses on scriptures",
      "Accessible Vedantic wisdom for all",
      "Symbolic burning of ignorance",
      "Revelation of true Self",
      "Open to all backgrounds"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com",
    additionalInfo: "Swami Chinmayananda introduced this concept in his first talks in Pune in 1951, addressing just five seekers. The thirst for accessible and inspiring teachings on the Upanishads and Bhagavad Gita quickly grew. By the 1960s, his discourses were drawing tens of thousands, making Vedantic knowledge available to all, regardless of background."
  },
  {
    id: 9,
    name: "Swaranjali",
    image: "/swaranjali.png",
    description: "Swaranjali, the music wing of Chinmaya Mission, was established in 2003, following Gurudev's deep love for music, and to honor the birthday of Swami Tejomayananda, a devoted singer and composer of devotional music.",
    benefits: [
      "Classical music as meditation practice",
      "Spiritual upliftment through sound",
      "Connection with divine vibrations",
      "Science of sound and vibration",
      "Spreading positivity through music"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com",
    additionalInfo: "Swami Chinmayananda's deep love for classical music and dance was well known. When renowned musicians performed to support Chinmaya Mission projects, he swayed and tapped in rhythm, fully immersed in the divine vibrations. He regarded listening to Indian classical music as a form of meditation. He observed, \"Music is an ornamentation of Silence and should be used by seekers to experience the silence within, in our quest towards Oneness with our Divine Self.\" Rooted in the Samaveda and Natyashastra, Indian classical music is more than an art—it is a science of sound and vibration. Through carefully composed shlokas and stutis, it uplifts the spirit and spreads positivity."
  },
  {
    id: 10,
    name: "Study Groups",
    image: "/Study_Groups.png",
    description: "Study Groups and Devi Groups - Chinmaya Mission Study Groups are small, dedicated gatherings of spiritual seekers who meet regularly to study, reflect and live the timeless wisdom of Vedanta. These groups that typically consist of 5 to 15 members, foster collective enquiry and inner transformation through the study of scriptural texts.",
    benefits: [
      "Small dedicated gatherings of spiritual seekers",
      "Collective enquiry and inner transformation",
      "Study of scriptural texts and Vedanta",
      "Systematic reflection (Mananam) practice",
      "Global network of seekers"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com",
    additionalInfo: "Study Groups began in 1952 when inspired listeners from Swami Chinmayananda's early Jnana Yajnas in Pune and Chennai started meeting regularly to reflect on the Scriptures. Emphasising the importance of systematic reflection (Mananam), Gurudev encouraged this practice to internalise spiritual knowledge. A year later, the first formal Study Group was formed in Chennai, marking the beginning of Chinmaya Mission as an organised movement. Today, these groups have grown into a global network of seekers, united in the pursuit of self-knowledge. Devi Groups, introduced in 1958, are Study Groups exclusively for women. Created with Gurudev's blessings, they offer a nurturing space for scriptural study, devotional practices and cultural upliftment. Together, Study Groups and Devi Groups serve as the grassroots foundation of Chinmaya Mission's enduring vision: a spiritually awakened society, grounded in timeless values."
  },
  {
    id: 11,
    name: "Chinmaya Vanaprastha",
    image: "/vanprasta.png",
    description: "In a world where ageing is often seen as a phase of decline or retreat, Chinmaya Mission offers a compelling alternative - a time for inner renewal, higher purpose and joyful contribution. Through Chinmaya Vanaprastha, the later years are seen as one of inner resilience.",
    benefits: [
      "Inner renewal and higher purpose for seniors",
      "Smooth transition from householder stage",
      "Guidance on health and emotional well-being",
      "Financial planning and personal safety",
      "Daily sadhana and spiritual mentoring"
    ],
    contact: "For registration: +91 7303717177 or email: info@chinmayamissionvasai.com",
    additionalInfo: "Established as the Senior Citizens' wing of Chinmaya Mission, the Central Chinmaya Vanaprastha Sansthan (CCVS) unites individuals over sixty across the globe. While stepping back from worldly roles, Vanaprasthis are guided towards deeper self-enquiry and lasting fulfilment. CCVS programmes support a smooth transition from the householder (Grihastha) stage to Vanaprastha through practical and spiritual resources, including guidance on health, emotional well-being, financial planning, personal safety and daily sadhana. These offerings are thoughtfully adapted to diverse cultural and regional contexts, yet firmly rooted in the unchanging vision of Vedanta. Chinmaya Mission sees later years of life not as a decline, but as an opportunity to shift awareness towards inner growth. As put by Swami Tejomayananda, \"Ageing is not decaying; it is maturing for the inward journey. It is the birth into empowerment - leaving the world of dependency on objects and relationships.\" CCVS programmes offer practical tools and answers to the real-life questions of the elderly through workshops, study groups, Vedanta classes, retreats, spiritual mentoring and community engagement. They empower Seniors to: Balance action and rest with inner wisdom, Cultivate meaningful relationships within a like-minded community, Embrace spiritual growth as the central goal of life's final chapters."
  }
];

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-3xl font-bold text-center mb-8">Activities</h1>
          
          <div className="prose max-w-none text-gray-800 dark:text-gray-300">
            <p className="text-lg leading-relaxed mb-6 text-justify">
              Chinmaya Mission Vasai conducts various spiritual and cultural activities aimed at inner transformation and character development for all age groups. Our activities are designed to promote the understanding of Vedantic knowledge and its practical application in daily life.
            </p>
            
            <p className="text-lg leading-relaxed mb-6 text-justify">
              Through regular study groups, workshops, cultural programs, and community service initiatives, we provide platforms for individuals to grow spiritually while serving society. Our activities include Vedanta classes, meditation sessions, youth programs, children's cultural education, and various community outreach programs.
            </p>

            <p className="text-lg leading-relaxed mb-6 text-justify">
              Each activity at Chinmaya Mission is carefully structured to help participants understand the deeper meaning of life while fostering values like compassion, discipline, and selfless service. We welcome everyone to join our activities and experience the transformative wisdom of Vedanta.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-center mb-12">Our Regular Activities</h2>
          
          {/* Children Section */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-center mb-8 text-[#BC3612] dark:text-[#F47930]">
              Children's Programs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {activities.filter(activity => activity.id === 1 || activity.id === 2).map((activity) => (
                <div 
                  key={activity.id}
                  className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="mt-4 text-xl font-semibold text-center dark:text-white">{activity.name}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Youth Section */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-center mb-8 text-[#BC3612] dark:text-[#F47930]">
              Youth Programs
            </h3>
            <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
              {activities.filter(activity => activity.id === 3).map((activity) => (
                <div 
                  key={activity.id}
                  className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                    {activity.darkImage ? (
                      <>
                        <img
                          src={activity.image}
                          alt={activity.name}
                          className="w-full h-full object-cover dark:hidden"
                        />
                        <img
                          src={activity.darkImage}
                          alt={activity.name}
                          className="w-full h-full object-cover hidden dark:block"
                        />
                      </>
                    ) : (
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h4 className="mt-4 text-xl font-semibold text-center dark:text-white">{activity.name}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Families Section */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-center mb-8 text-[#BC3612] dark:text-[#F47930]">
              Family Programs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {activities.filter(activity => activity.id >= 4 && activity.id <= 9).map((activity) => (
                <div 
                  key={activity.id}
                  className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="mt-4 text-xl font-semibold text-center dark:text-white">{activity.name}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Adults Section */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-center mb-8 text-[#BC3612] dark:text-[#F47930]">
              Adult Programs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {activities.filter(activity => activity.id === 10 || activity.id === 11).map((activity) => (
                <div 
                  key={activity.id}
                  className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="mt-4 text-xl font-semibold text-center dark:text-white">{activity.name}</h4>
                </div>
              ))}
            </div>
          </div>

          <ActivitiesModal
            isOpen={!!selectedActivity}
            onClose={() => setSelectedActivity(null)}
            activity={selectedActivity}
          />
        </div>
      </div>
    </div>
  );
};

export default Activities;