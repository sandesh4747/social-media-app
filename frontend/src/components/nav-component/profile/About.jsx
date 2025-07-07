import React from "react";
import {
  FaPencilAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaHome,
} from "react-icons/fa";

export default function About({ user }) {
  // Sample data - replace with actual user data
  const aboutData = {
    bio: user?.bio || "No bio added yet",
    work: [
      {
        company: "Tech Corp",
        position: "Software Engineer",
        duration: "2020-Present",
      },
    ],
    education: [
      {
        school: "State University",
        degree: "B.Sc Computer Science",
        duration: "2016-2020",
      },
    ],
    places: [
      { type: "Lives in", value: "San Francisco, CA" },
      { type: "From", value: "New York, NY" },
    ],
    contact: {
      email: user?.email || "example@example.com",
      phone: "+1 (555) 123-4567",
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* About Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">About</h2>
      </div>

      {/* Bio Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Bio</h3>
        <p className="text-gray-700">{aboutData.bio}</p>
      </div>

      {/* Work and Education */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Work */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FaBriefcase className="text-gray-500" />
            <span>Work</span>
          </h3>
          {aboutData.work.map((job, index) => (
            <div key={index} className="mb-4">
              <p className="font-medium">{job.position}</p>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500 text-sm">{job.duration}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FaGraduationCap className="text-gray-500" />
            <span>Education</span>
          </h3>
          {aboutData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <p className="font-medium">{edu.school}</p>
              <p className="text-gray-600">{edu.degree}</p>
              <p className="text-gray-500 text-sm">{edu.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Places */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-500" />
          <span>Places</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {aboutData.places.map((place, index) => (
            <div key={index} className="flex items-start gap-3">
              <FaHome className="mt-1 text-gray-500" />
              <div>
                <p className="text-gray-500 text-sm">{place.type}</p>
                <p className="font-medium">{place.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="font-semibold mb-3">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 w-24">Email:</span>
            <span className="font-medium">{aboutData.contact.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 w-24">Phone:</span>
            <span className="font-medium">{aboutData.contact.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
