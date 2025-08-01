import { coursesDropDownItems } from "./CoursesDropDownItems"
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';

function CoursesDropDown({ onItemClick }) {
    return (
        <div className="relative">
            <ul className="list-none bg-amber-50 w-40 p-3 rounded-xl shadow-2xl block absolute top-full left-0 mt-2 z-50 transition-all duration-200">
                {coursesDropDownItems.map((item, index) => (
                    <li key={index} className="p-2 border-b-2 border-white rounded bg-gray-900 mb-1 last:mb-0">
                        <Link 
                            to={item.path} 
                            className="text-white text-sm font-medium no-underline hover:text-amber-100 transition-colors duration-300 block px-2 py-1"
                            onClick={onItemClick}
                        >
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

CoursesDropDown.propTypes = {
  onItemClick: PropTypes.func,
};

export default CoursesDropDown













