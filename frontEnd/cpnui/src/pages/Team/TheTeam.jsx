import ceo from "../../assets/ceo.jpeg";
import commanager from "../../assets/commanager.jpeg";
import contentlead from "../../assets/contentlead.jpeg";

const team = [
  { name: 'Chigbo Ezeokeke', role: 'Founder', img: ceo },
  { name: 'Jane Anachuna', role: 'Community Manager', img: commanager },
  { name: 'Michael Aniakor', role: 'Content Lead', img: contentlead },
];

function TheTeam() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-10 text-center text-gray-900">The Team</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {team.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8">
              <img src={member.img} alt={member.name} className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-amber-600" />
              <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
              <p className="text-gray-600 font-semibold mb-2">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TheTeam;
