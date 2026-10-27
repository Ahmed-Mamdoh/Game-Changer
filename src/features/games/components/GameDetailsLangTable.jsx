import { Check } from "lucide-react";

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
  if (!language_supports?.length) return null;

  const supports = (language, type) =>
    language_supports.some(
      (s) =>
        s?.language?.id === language.id &&
        s?.language_support_type?.name === type,
    );

  return (
    <section
      id="Supported languages"
      aria-label="Language support"
      className="mx-auto w-full max-w-[1440px] px-4 pt-14 md:px-8"
    >
      <h2 className="mb-4">Language support</h2>
      <div className="border-stroke-subtle max-w-2xl overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-stroke-subtle bg-bg-surface border-b">
              <th className="text-text-dim h-9 px-4 text-left font-semibold">
                Language
              </th>
              {LANGUAGES_TYPES.map((type) => (
                <th
                  key={type.id}
                  className="text-text-dim h-9 w-28 px-4 text-center font-semibold"
                >
                  {type.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-stroke-subtle divide-y">
            {LANGUAGES.map((language) => (
              <tr key={language.id} className="hover:bg-bg-surface">
                <td className="text-text-main h-9 px-4" dir="auto">
                  {language.native_name}
                </td>
                {LANGUAGES_TYPES.map((type) => (
                  <td key={type.id} className="h-9 px-4 text-center">
                    {supports(language, type.name) ? (
                      <Check
                        className="text-pulse-success mx-auto h-4 w-4"
                        aria-label="Supported"
                      />
                    ) : (
                      <span
                        className="text-text-muted"
                        aria-label="Not supported"
                      >
                        —
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default GameDetailsLangTable;
