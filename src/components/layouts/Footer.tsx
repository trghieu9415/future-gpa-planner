export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mt-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left text-sm">
          ©2025 - <span className="font-semibold">3122560017</span>. All rights reserved.
        </div>
        <div className="flex gap-4 text-sm">
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Terms
          </a>
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};
