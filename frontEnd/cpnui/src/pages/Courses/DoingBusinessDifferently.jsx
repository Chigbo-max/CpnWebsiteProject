import { useState } from 'react';
import Cpn3 from '../../assets/dbd.jpeg';

const faqs = [
  {
    question: 'What is the focus of this course?',
    answer: 'This course focuses on building and running businesses that honor God, create value, and impact society for good.'
  },
  {
    question: 'Is this course practical?',
    answer: 'Yes, it provides practical tools and real-world examples for Kingdom-minded entrepreneurs.'
  },
  {
    question: 'Can I take this course if I am not a business owner?',
    answer: 'Absolutely! The course is valuable for anyone interested in business from a biblical perspective.'
  },

  {
    question: 'Can I take the course anytime I want?',
    answer: 'No, you cannot take the course anytime you want. The course is available occasionally but you can register for the next course and get notified when it is available.'
  },
  {
    question: 'Can I take the course anytime I want?',
    answer: 'No, you cannot take the course anytime you want. The course is available occasionally but you can register for the next course and get notified when it is available.'
  }
];

function DoingBusinessDifferently() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;

  const handleOpen = (e) => {
    e.preventDefault();
    setShowModal(true);
    setStatus(null);
  };
  const handleClose = () => {
    setShowModal(false);
    setForm({ name: '', email: '', whatsapp: '' });
    setStatus(null);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${apiBaseUrl}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, course: 'Doing Business Differently (DBD)' })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Enrollment successful! Check your email for confirmation.' });
        setForm({ name: '', email: '', whatsapp: '' });
      } else {
        setStatus({ type: 'error', message: data.error || data.message || 'Enrollment failed.' });
        console.log('Enrollment error:', data);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
      console.log('Network error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 py-16 px-4 sm:px-8 mt-16">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <img src={Cpn3} alt="Doing Business Differently" className="w-full md:w-1/2 h-64 object-cover rounded-xl" />
          <div className="flex-1">
            <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">Free</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">Doing Business Differently (DBD)</h1>
            <p className="text-lg text-gray-700 mb-4">Discover how to build and run businesses that honor God, create value, and impact society for good. Practical tools for Kingdom-minded entrepreneurs and professionals.</p>
            <button onClick={handleOpen} className="inline-block px-8 py-3 bg-amber-600 text-white font-bold rounded-lg shadow hover:bg-amber-700 transition-all duration-300">Secure Your Spot Now!</button>
          </div>
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Kingdom principles for business</li>
            <li>Creating value and serving others</li>
            <li>Ethics and integrity in business</li>
            <li>Impacting society for good</li>
          </ul>
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b pb-4">
                <h3 className="font-semibold text-lg text-amber-700 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="enroll" className="text-center mt-8">
          <button onClick={handleOpen} className="inline-block px-8 py-3 bg-amber-600 text-white font-bold rounded-lg shadow hover:bg-amber-700 transition-all duration-300">Register Now!</button>
        </div>
      </div>
      {/* Enrollment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-center">Enroll in Doing Business Differently</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} className="border rounded px-4 py-3" required />
              <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} className="border rounded px-4 py-3" required />
              <input type="text" name="whatsapp" placeholder="WhatsApp Number" value={form.whatsapp} onChange={handleChange} className="border rounded px-4 py-3" required />
              <button type="submit" className="bg-amber-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-700 transition-all duration-300" disabled={loading}>{loading ? 'Enrolling...' : 'Submit'}</button>
              {status && <div className={`text-center ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoingBusinessDifferently; 