// Update this to your real business WhatsApp number (with country code, no +/spaces)
const WHATSAPP_NUMBER = "254700000000";

export function whatsappLink(message) {
  const defaultMessage = "Hi, I'd like to know more about your vehicles.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message || defaultMessage)}`;
}

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/40 hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.001 2.667c-7.364 0-13.334 5.97-13.334 13.333 0 2.353.615 4.646 1.783 6.666L2.667 29.333l6.84-1.793a13.27 13.27 0 0 0 6.494 1.653h.006c7.363 0 13.333-5.97 13.333-13.333S23.364 2.667 16.001 2.667zm0 24.4h-.005a11.06 11.06 0 0 1-5.636-1.542l-.404-.24-4.06 1.065 1.084-3.958-.264-.407a11.04 11.04 0 0 1-1.693-5.918c0-6.115 4.98-11.093 11.098-11.093 2.963 0 5.75 1.155 7.847 3.253a11.024 11.024 0 0 1 3.248 7.847c-.002 6.115-4.98 11.093-11.115 11.093zm6.086-8.31c-.334-.167-1.97-.972-2.274-1.083-.305-.111-.527-.167-.749.167-.222.333-.86 1.083-1.055 1.305-.194.222-.388.25-.722.084-.334-.167-1.409-.52-2.684-1.657-.992-.885-1.663-1.978-1.858-2.312-.194-.334-.02-.514.146-.68.15-.15.334-.389.5-.583.167-.195.222-.334.334-.556.111-.223.055-.417-.028-.584-.083-.166-.749-1.805-1.026-2.472-.27-.649-.545-.561-.749-.571-.194-.009-.416-.011-.638-.011-.222 0-.583.083-.888.417-.305.333-1.166 1.14-1.166 2.778 0 1.639 1.194 3.222 1.36 3.445.167.222 2.351 3.591 5.696 5.036.796.344 1.417.55 1.901.703.799.254 1.526.218 2.101.132.641-.096 1.97-.805 2.248-1.583.278-.778.278-1.445.194-1.584-.083-.139-.305-.222-.639-.389z" />
      </svg>
    </a>
  );
}
