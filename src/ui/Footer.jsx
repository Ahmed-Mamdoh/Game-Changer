import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";

function Footer() {
  return (
    <div className="border-obsidian-border bg-obsidian-deep/60 w-full border-t-3 py-6 backdrop-blur-2xl">
      <div className="mx-auto flex w-8/10 items-center justify-between">
        <div className="flex items-center gap-x-2">
          <h2 className="text-[1.75rem]">Ahmed Mamdoh</h2>
          <p className="text-text-secondary">ahmedmamdoh.cs@gmail.com</p>
        </div>

        <div className="flex items-center gap-x-2">
          <a
            href="https://github.com/Ahmed-Mamdoh"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoGithub className="text-[2.5rem] " />
          </a>
          <a
            href="https://www.linkedin.com/in/ahmed-mamdoh-salem"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoLinkedin className="text-[2.5rem] " />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
