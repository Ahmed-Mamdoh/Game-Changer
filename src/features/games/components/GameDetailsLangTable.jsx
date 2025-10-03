import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

const LANGUAGES = [
  {
    id: 7,
    native_name: "English (US)",
  },
  {
    id: 8,
    native_name: "English (UK)",
  },
  {
    id: 1,
    native_name: "العربية",
  },
  {
    id: 2,
    native_name: "简体中文",
  },
  {
    id: 3,
    native_name: "繁體中文",
  },
  {
    id: 4,
    native_name: "čeština",
  },
  {
    id: 5,
    native_name: "Dansk",
  },
  {
    id: 6,
    native_name: "Nederlands",
  },
  {
    id: 9,
    native_name: "Español (España)",
  },
  {
    id: 10,
    native_name: "Español (Mexico)",
  },
];
const LANGUAGES_TYPES = [
  { id: 1, name: "Audio" },
  { id: 2, name: "Subtitles" },
  { id: 3, name: "Interface" },
];

function GameDetailsLangTable({ data }) {
  const { language_supports } = data[0];

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  //check if the screen size changed and set isSmall screen if the size < 1024
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (language_supports?.length > 0 && !isSmallScreen) {
    return (
      <>
        <span id="Supported languages"></span>
        <div className="font-heading flex items-center justify-center pt-9 pb-4 text-4xl md:text-6xl">
          <h2 className="text-center">Language Support</h2>
        </div>
        <Table className="bg-bg-secondary rounded-sm px-4 py-8">
          <TableHeader>
            <TableRow className="border-text-muted">
              <TableHead></TableHead>

              {LANGUAGES.map((language, i) => (
                <TableHead
                  key={language.id}
                  className={`text-text-general border-text-muted border-x py-4 text-center ${i === LANGUAGES.length - 1 ? "border-r-0" : ""}`}
                >
                  {language.native_name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-text-muted">
              <TableCell className="font-medium">Audio</TableCell>
              {LANGUAGES.map((language, i) => {
                return checkGameLanguages(
                  language_supports,
                  language,
                  "Audio",
                  i,
                );
              })}
            </TableRow>
            <TableRow className="border-text-muted">
              <TableCell className="font-medium">Subtitles</TableCell>
              {LANGUAGES.map((language, i) => {
                return checkGameLanguages(
                  language_supports,
                  language,
                  "Subtitles",
                  i,
                );
              })}
            </TableRow>
            <TableRow className="border-text-muted">
              <TableCell className="font-medium">Interface</TableCell>
              {LANGUAGES.map((language, i) => {
                return checkGameLanguages(
                  language_supports,
                  language,
                  "Interface",
                  i,
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  }

  if (language_supports?.length > 0 && isSmallScreen) {
    return (
      <>
        <span id="Supported languages"></span>

        <div className="font-heading flex items-center justify-center pt-9 pb-4 text-4xl md:text-6xl">
          <h2 className="text-center">Language Support</h2>
        </div>
        <Table className="bg-bg-secondary rounded-sm px-4 py-8">
          <TableHeader>
            <TableRow className="border-text-muted">
              <TableHead></TableHead>
              {LANGUAGES_TYPES.map((type, i) => (
                <TableHead
                  className={`text-text-general border-text-muted border-x py-4 text-center ${i === LANGUAGES_TYPES.length - 1 ? "border-r-0" : ""}`}
                >
                  {type.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {LANGUAGES.map((language) => {
              return (
                <TableRow key={language.id} className="border-text-muted">
                  <TableCell>{language.native_name}</TableCell>
                  {LANGUAGES_TYPES.map((type, i) =>
                    checkGameLanguages(
                      language_supports,
                      language,
                      type.name,
                      i,
                      "vertical",
                    ),
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </>
    );
  }

  return <></>;
}

function checkGameLanguages(
  language_supports,
  language,
  type,
  i,
  variant = "horizontal",
) {
  const currentLanguage = language_supports.filter((supportedLanguage) => {
    return supportedLanguage?.language?.id === language?.id;
  });

  const isAvailable = currentLanguage?.find(
    (lang) => lang?.language_support_type?.name === type,
  );
  if (isAvailable) {
    return (
      <TableCell
        className={`border-text-muted border-x py-4 font-medium ${
          variant === "horizontal"
            ? i === LANGUAGES.length - 1
              ? "border-r-0"
              : ""
            : i === LANGUAGES_TYPES.length - 1
              ? "border-r-0"
              : ""
        }`}
      >
        <FaCheck className="mx-auto" />
      </TableCell>
    );
  }
  return (
    <TableCell
      className={`border-text-muted border-x py-6 font-medium ${
        variant === "horizontal"
          ? i === LANGUAGES.length - 1
            ? "border-r-0"
            : ""
          : i === LANGUAGES_TYPES.length - 1
            ? "border-r-0"
            : ""
      }`}
    ></TableCell>
  );
}

export default GameDetailsLangTable;
