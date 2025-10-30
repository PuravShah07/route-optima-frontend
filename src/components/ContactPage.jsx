import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Mail, Github, Linkedin, MapPin, Code2 } from "lucide-react";
import { Button } from "./ui/button";

export function ContactPage() {
  const developers = [
    {
      name: "Purav Shah",
      role: "Product Manager",
      email: "24bce005@nirmauni.ac.in",
      github: "github.com/PuravShah07",
      linkedin: "https://www.linkedin.com/in/purav-shah-40a776331",
      bio: "Specialized in algorithmic optimization and scalable system design. Built the core routing engine using advanced graph algorithms and machine learning.",
      skills: ["Algorithm Design", "React", "Node.js", "Machine Learning"],
      avatar: "PS"
    },
    {
      name: "Divya Langaliya",
      role: "Full Stack Developer & UI/UX Designer",
      email: "24bce054@nirmauni.ac.in",
      github: "https://github.com/Divya-tech06",
      linkedin: "https://www.linkedin.com/in/divya-langalia-b46a16305/",
      bio: "Passionate about creating intuitive user experiences and building responsive web applications. Designed and developed the entire frontend architecture.",
      skills: ["React", "TypeScript", "UI/UX Design", "Motion Design"],
      avatar: "DL"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-[#F2F2F2] py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
          >
            <Code2 className="w-8 h-8 text-[#1E90FF]" />
          </motion.div>
          <h1 className="text-[#0B3D91] mb-4" style={{ fontSize: '48px', fontWeight: '700' }}>
            Meet Our Team
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '18px' }}>
            The talented developers behind RouteOptima's intelligent courier routing platform
          </p>
        </motion.div>

        {/* Developer Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {developers.map((dev, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.2, duration: 0.6 }}
            >
              <Card className="p-8 bg-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#1E90FF] to-[#0B3D91] flex items-center justify-center text-white shadow-lg">
                      <span style={{ fontSize: '48px', fontWeight: '700' }}>
                        {dev.avatar}
                      </span>
                    </div>
                    <motion.div
                      className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Info */}
                  <h2 className="text-[#0B3D91] mb-2" style={{ fontSize: '28px', fontWeight: '700' }}>
                    {dev.name}
                  </h2>
                  <p className="text-[#1E90FF] mb-4" style={{ fontSize: '16px', fontWeight: '600' }}>
                    {dev.role}
                  </p>
                  <p className="text-gray-600 mb-6">
                    {dev.bio}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {dev.skills.map((skill, i) => (
                      <motion.span
                        key={i}
                        className="px-3 py-1 bg-[#1E90FF]/10 text-[#0B3D91] rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.2 + i * 0.1 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(30, 144, 255, 0.2)" }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>

                  {/* Contact Links */}
                  <div className="space-y-3 w-full">
                    <motion.a
                      href={`mailto:${dev.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F2F2F2] transition-colors group"
                      whileHover={{ x: 5 }}
                    >
                      <Mail className="w-5 h-5 text-[#1E90FF]" />
                      <span className="text-gray-700 group-hover:text-[#1E90FF] transition-colors">
                        {dev.email}
                      </span>
                    </motion.a>

                    <motion.a
                      href={`https://${dev.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F2F2F2] transition-colors group"
                      whileHover={{ x: 5 }}
                    >
                      <Github className="w-5 h-5 text-[#1E90FF]" />
                      <span className="text-gray-700 group-hover:text-[#1E90FF] transition-colors">
                        {dev.github}
                      </span>
                    </motion.a>

                    <motion.a
                      href={`https://${dev.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F2F2F2] transition-colors group"
                      whileHover={{ x: 5 }}
                    >
                      <Linkedin className="w-5 h-5 text-[#1E90FF]" />
                      <span className="text-gray-700 group-hover:text-[#1E90FF] transition-colors">
                        {dev.linkedin}
                      </span>
                    </motion.a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card className="p-8 bg-linear-to-r from-[#1E90FF] to-[#0B3D91] border-none text-white">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-4" style={{ fontSize: '24px', fontWeight: '700' }}>
                  RouteOptima HQ
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 shrink-0" />
                    <div>
                      <p className="opacity-90">
                        Tech Hub, Innovation District<br />
                        Bangalore, Karnataka 560001<br />
                        India
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 shrink-0" />
                    <p className="opacity-90">contact@routeoptima.com</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4" style={{ fontSize: '24px', fontWeight: '700' }}>
                  About RouteOptima
                </h3>
                <p className="opacity-90 leading-relaxed">
                  RouteOptima is built with cutting-edge technology to revolutionize 
                  courier route optimization. Our mission is to help logistics companies 
                  save time, reduce costs, and improve delivery efficiency through 
                  intelligent algorithms and beautiful, intuitive interfaces.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-gray-600 mb-4">Interested in collaborating or have questions?</p>
          <Button
            className="bg-[#1E90FF] hover:bg-[#0B3D91] text-white"
            size="lg"
            onClick={() => window.location.href = 'mailto:contact@routeoptima.com'}
          >
            Get In Touch
          </Button>
        </motion.div>
      </div>
    </div>
  );
}