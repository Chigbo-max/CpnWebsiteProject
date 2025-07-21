import { Link } from 'react-router-dom';
import Cpn1 from '../../assets/cpnevent1.jpg';
import Cpn2 from '../../assets/cpnevent2.jpg';
import Cpn3 from '../../assets/cpnevent3.jpg';

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
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 py-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">Our <span className="text-amber-600">Courses</span></h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Explore our range of courses designed to help you do work, leadership, and business differently—anchored in Kingdom values and practical excellence.
          </p>
        </div>
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
