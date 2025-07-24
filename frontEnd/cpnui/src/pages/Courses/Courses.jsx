import { Link } from 'react-router-dom';
import Cpn1 from '../../assets/dwd.jpeg';
import Cpn2 from '../../assets/dld.jpeg';
import Cpn3 from '../../assets/dbd.jpeg';
import bgImage from '../../assets/bookshelf.jpeg';

function Courses() {
  const courses = [
    {
      title: 'Doing Work Differently (DWD)',
      image: Cpn1,
      description: 'A course designed to help you integrate biblical principles into your daily work, transforming your approach to vocation and excellence.',
      link: '/courses/doingWorkDifferently',
    },
    {
      title: 'Doing Leadership Differently (DLD)',
      image: Cpn2,
      description: 'Learn how to lead with integrity, humility, and Kingdom values. This course equips you to influence and inspire others in any environment.',
      link: '/courses/doingLeadershipDifferently',
    },
    {
      title: 'Doing Business Differently (DBD)',
      image: Cpn3,
      description: 'Discover how to build and run businesses that honor God, create value, and impact society for good. Practical tools for Kingdom-minded entrepreneurs.',
      link: '/courses/doingBusinessDifferently',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      <section className="relative w-full min-h-[400px] sm:min-h-[500px] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(rgba(17, 24, 38, 0.9), rgba(17, 24, 38, 0.9)), url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative z-20 flex flex-col justify-center items-center w-full px-6 py-20 mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-amber-400 mb-6">Courses</h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white max-w-4xl mx-auto leading-relaxed">
            Explore our range of courses designed to help you do work, leadership, and business differently—anchored in Kingdom values and practical excellence.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-8 text-center">
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover rounded-xl mb-6" />
              <div className="mb-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Free</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-700 mb-6">{course.description}</p>
              <Link
                to={course.link}
                className="inline-block px-8 py-3 bg-amber-600 text-white font-bold rounded-lg shadow hover:bg-amber-700 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Courses;
