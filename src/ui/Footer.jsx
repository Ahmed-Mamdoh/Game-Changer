import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";

function Footer() {
  return (
    <footer className="border-stroke-subtle mt-16 w-full border-t">
      <div className="text-text-dim mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-6 text-sm md:flex-row md:px-8">
        <p className="text-sm">
          Built by{" "}
          <span className="text-text-main font-semibold">Ahmed Mamdoh</span>
          {" · "}
          <a
            href="mailto:ahmedmamdoh.cs@gmail.com"
            className="hover:text-text-main"
          >
            ahmedmamdoh.cs@gmail.com
          </a>
          {" · "}Game data from IGDB
        </p>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/Ahmed-Mamdoh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-text-main flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/[0.06]"
          >
            <IoLogoGithub className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/ahmed-mamdoh-salem"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-text-main flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/[0.06]"
          >
            <IoLogoLinkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
