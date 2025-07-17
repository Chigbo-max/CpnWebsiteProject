import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

const SimpleSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <ClipLoader color="#fbbf24" size={60} />
    <p className="text-lg text-gray-500 mt-4">{message}</p>
  </div>
);

SimpleSpinner.propTypes = {
  message: PropTypes.string
};

export default SimpleSpinner; 