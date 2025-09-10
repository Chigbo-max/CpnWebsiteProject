import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Cpn2 from '../../assets/dld.jpeg';
import JoinCommunityBanner from '../../components/JoinCommunityBanner';


const faqs = [
  {
    question: 'Who should take this course?',
    answer: 'Anyone aspiring to lead with integrity, humility, and Kingdom values in any environment.'
  },
  {
    question: 'Is this course only for managers?',
    answer: 'No, it is for anyone who wants to develop leadership skills, regardless of their current position.'
  },
  {
    question: 'What will I learn?',
    answer: 'You will learn practical leadership strategies rooted in biblical principles.'
  },
  {
    question: 'Can I take the course anytime I want?',
    answer: 'No, you cannot take the course anytime you want. The course is available occasionally but you can register for the next course and get notified when it is available.'
  }
];

function DoingLeadershipDifferently() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;

  const toggleFAQ = (idx) => {
    setOpenFAQ(openFAQ === idx ? null : idx);
  };

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
        body: JSON.stringify({ ...form, course: 'Doing Leadership Differently (DLD)' })
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
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-accent-50 py-16 px-4 sm:px-8 mt-16">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <img src={Cpn2} alt="Doing Leadership Differently" className="w-full md:w-1/2 h-64 object-cover rounded-xl" />
          <div className="flex-1">
            <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">Free</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary-900 mb-4">Doing Leadership Differently (DLD)</h1>
            <p className="text-lg text-gray-700 mb-4">Learn how to lead with integrity, humility, and Kingdom values. This course equips you to influence and inspire others in any environment, with practical tools for real-world leadership.</p>
            <button onClick={handleOpen} className="inline-block px-8 py-3 bg-accent-600 text-white font-bold rounded-lg shadow hover:bg-accent-700 transition-all duration-300">Secure Your Spot Now!</button>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">Course Overview</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Foundations of biblical leadership</li>
            <li>Developing character and influence</li>
            <li>Leading teams with vision and purpose</li>
            <li>Practical tools for everyday leadership</li>
          </ul>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b pb-4">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <h3 className="font-semibold text-lg text-accent-700">{faq.question}</h3>
                  {openFAQ === idx ? (
                    <ChevronUp className="w-5 h-5 text-accent-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-accent-600" />
                  )}
                </button>
                {openFAQ === idx && <p className="mt-2 text-gray-700">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>

        <div id="enroll" className="text-center mt-8">
          <button onClick={handleOpen} className="inline-block px-8 py-3 bg-accent-600 text-white font-bold rounded-lg shadow hover:bg-accent-700 transition-all duration-300">Register Now!</button>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-primary-900 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-center">Enroll in Doing Leadership Differently</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                value={form.name}
                onChange={handleChange}
                className="border rounded px-4 py-3"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                value={form.email}
                onChange={handleChange}
                className="border rounded px-4 py-3"
                required
              />
              <input
                type="text"
                name="whatsapp"
                placeholder="WhatsApp Number"
                value={form.whatsapp}
                onChange={handleChange}
                className="border rounded px-4 py-3"
                required
              />
              <button
                type="submit"
                className="bg-accent-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-800 transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Enrolling...' : 'Submit'}
              </button>
              {status && (
                <div
                  className={`text-center ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      <JoinCommunityBanner />
    </div>
  );
}

export default DoingLeadershipDifferently;
