type ContactIconProps = {
  name:
    | "phone"
    | "email"
    | "location"
    | "delivery"
    | "globe"
    | "whatsapp"
    | "facebook"
    | "instagram";
  className?: string;
};

export function ContactIcon({
  name,
  className = "h-5 w-5",
}: ContactIconProps) {
  const isCallAction = name === "phone" || name === "whatsapp";
  const paths = {
    phone: (
      <path
        fill="currentColor"
        stroke="none"
        d="M6.6 10.8a15.7 15.7 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 3.8c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.2 1.1l-2.3 2.2Z"
      />
    ),
    email: (
      <>
        <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
        <path d="m3.5 6 8.5 7 8.5-7" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    delivery: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </>
    ),
    whatsapp: (
      <path
        fill="currentColor"
        stroke="none"
        d="M16 3A13 13 0 0 0 4.7 22.4L3 29l6.8-1.6A13 13 0 1 0 16 3Zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-4 .9 1-3.9-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.3-.4.3-.7.1-1.9-.9-3.2-1.7-4.5-3.9-.3-.6.3-.6.9-1.9.1-.2 0-.4 0-.6l-1-2.5c-.3-.7-.6-.6-.9-.6h-.7c-.2 0-.6.1-.9.4-1 1-1.4 2.1-1.4 3.5 0 2.1 1.5 4.1 1.7 4.4.2.3 3 4.6 7.4 6.4 2.8 1.2 3.9 1.3 5.3 1.1.8-.1 2.6-1.1 2.9-2.1.4-1 .4-1.9.3-2.1-.1-.2-.3-.3-.6-.4Z"
      />
    ),
    facebook: (
      <path
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
        fill="currentColor"
        stroke="none"
      />
    ),
    instagram: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle
          cx="17.2"
          cy="6.8"
          r="1.1"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),
  };

  return (
    <svg
      viewBox={name === "whatsapp" ? "0 0 32 32" : "0 0 24 24"}
      aria-hidden="true"
      className={`${className} shrink-0${
        isCallAction
          ? " fill-current !text-[#800517]"
          : " fill-none stroke-current"
      }`}
      strokeWidth={isCallAction ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
