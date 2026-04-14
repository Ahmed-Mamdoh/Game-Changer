import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useScreenWidth from "@/hooks/useScreenWidth";
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

  const screenWidth = useScreenWidth();
  const isSmallScreen = screenWidth < 1024;

  if (language_supports?.length > 0 && !isSmallScreen) {
    return (
      <>
        <span id="Supported languages"></span>
        <div className="font-heading mx-auto flex w-9/10 items-start justify-start pt-9 pb-4">
          <h2 className="text-center text-3xl md:text-5xl">Language Support</h2>
        </div>
        <Table className="bg-obsidian-deep/50 outline-obsidian-border mx-auto my-5 w-9/10 rounded-2xl px-4 py-8 outline-2 backdrop-blur-sm">
          <TableHeader>
            <TableRow className="border-text-muted">
              <TableHead></TableHead>

              {LANGUAGES.map((language, i) => (
                <TableHead
                  key={language.id}
                  className={`base-content border-text-muted border-x py-4 text-center ${i === LANGUAGES.length - 1 ? "border-r-0" : ""}`}
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

        <div className="font-heading flex items-start justify-center pt-9 pb-4">
          <h2 className="text-center text-3xl md:text-5xl">Language Support</h2>
        </div>
        <Table className="bg-obsidian-deep/50 outline-obsidian-border mx-auto my-3 w-9/10 rounded-2xl px-4 py-8 outline-2 backdrop-blur-sm">
          <TableHeader>
            <TableRow className="border-text-muted">
              <TableHead></TableHead>
              {LANGUAGES_TYPES.map((type, i) => (
                <TableHead
                  className={`base-content border-text-muted border-x py-4 text-center ${i === LANGUAGES_TYPES.length - 1 ? "border-r-0" : ""}`}
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

  return (
    <TableCell
      className={`border-text-muted border-x ${isAvailable ? "py-4" : "py-6"} text-center font-medium ${
        variant === "horizontal"
          ? i === LANGUAGES.length - 1
            ? "border-r-0"
            : ""
          : i === LANGUAGES_TYPES.length - 1
            ? "border-r-0"
            : ""
      }`}
    >
      {isAvailable ? <FaCheck className="mx-auto" /> : null}
    </TableCell>
  );
}

export default GameDetailsLangTable;
