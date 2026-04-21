import { Dialog } from "@material-tailwind/react";
import { useState } from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";

const SharePdtDialog = ({ openShare, handleOpenShare }) => {
  const [copied, setCopied] = useState(false);

  const url = window.location.href;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Dialog
      open={openShare}
      handler={handleOpenShare}
      size="sm"
      className="bg-transparent shadow-none p-0"
    >
      <div className="relative rounded-[28px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-4 md:p-7 flex flex-col gap-4">

        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-gray-100/40 to-white pointer-events-none" />

        {/* Header */}
        <div className="relative text-center space-y-1">
          <h2 className="text-[20px] font-semibold text-gray-900">
            Share this product
          </h2>
          <p className="text-xs text-gray-500 tracking-wide">
            Quick share with your circle
          </p>
        </div>

        {/* Social Icons */}
        <div className="relative flex justify-center gap-4">
          {[ 
            { Comp: FacebookShareButton, Icon: FacebookIcon },
            { Comp: WhatsappShareButton, Icon: WhatsappIcon },
            { Comp: TelegramShareButton, Icon: TelegramIcon },
          ].map(({ Comp, Icon }, i) => (
            <Comp url={url} key={i}>
              <div className="p-1 rounded-full hover:scale-110 hover:-translate-y-1 transition duration-300 ease-out">
                <Icon size={46} round />
              </div>
            </Comp>
          ))}
        </div>

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <span className="px-3 text-xs text-gray-400 tracking-widest">
            COPY LINK
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        {/* Copy Section */}
        <div className="relative flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-2">

          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 bg-transparent text-xs text-gray-800 px-2 outline-none truncate"
          />

          <button
            onClick={handleCopy}
            className={`relative px-4 py-2 text-xs font-medium rounded-sm transition-all duration-300 active:scale-95 ${
              copied
                ? "bg-green-500 text-white"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            <span className={`${copied ? "opacity-0" : "opacity-100"} transition`}>
              Copy
            </span>

            <span
              className={`absolute inset-0 flex items-center justify-center text-white transition ${
                copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              ✓
            </span>
          </button>
        </div>

      </div>
    </Dialog>
  );
};

export default SharePdtDialog;