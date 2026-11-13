// Copy for the "Join the pilot" form.

export const joinEn = {
  eyebrow: "Join the pilot",
  title: "Tell us about your parent. We'll call you.",
  lede: "We are starting with 20 families so that each one gets our full attention. There is no payment today, and joining the list is not a commitment.",
  seatsLeft: "{left} of {total} pilot places left",
  seatsFull: "Pilot places are full. You can still join the waitlist.",
  steps: [
    { title: "You fill in this form", body: "It takes about a minute." },
    { title: "We call you", body: "A short call to understand your parent's situation and answer your questions." },
    { title: "You decide", body: "If Saathi is a good fit, we explain the pilot terms. Nothing is charged before that." },
  ],
  about: "About you",
  parent: "About your parent",
  fields: {
    name: { label: "Your name", hint: "" },
    phone: { label: "Your phone number", hint: "Preferably the one you use on WhatsApp." },
    email: { label: "Your email", hint: "Optional" },
    city: { label: "Your city", hint: "" },
    parentCity: { label: "Your parent's city or town", hint: "" },
    parentAge: { label: "Your parent's age", hint: "" },
    interest: { label: "What are you interested in?", hint: "" },
    message: { label: "Anything we should know?", hint: "Optional. For example: lives alone, had a fall last year." },
  },
  ages: { under60: "Under 60", "60-69": "60 to 69", "70-79": "70 to 79", "80plus": "80 or older" },
  interests: {
    pilot: { title: "The paid pilot", body: "Be one of the first 20 families to use Saathi." },
    waitlist: { title: "The waitlist", body: "Tell me when Saathi goes on sale in 2027." },
  },
  consent: "I agree that Saathi may call or message me about this. My details will be used only for that.",
  privacy: "Read our privacy page",
  submit: "Join the list",
  sending: "Sending…",
  errors: {
    required: "Please fill this in.",
    invalid: "Please check this.",
    phone: "Please enter a valid mobile number, for example 98765 43210.",
    email: "Please enter a valid email address, or leave it empty.",
    consent: "Please tick this box so we can contact you.",
    interest: "Please choose one.",
    parentAge: "Please choose one.",
    summary: "Please check the highlighted fields.",
    rate: "Too many attempts from this connection. Please try again in an hour.",
    network: "We couldn't send your details. Please check your connection and try again.",
  },
  done: {
    title: "Thank you. You're on the list.",
    body: "We will call you on {phone} within a few days. If you asked about the pilot, we'll explain the terms on that call.",
    again: "Back to home",
    preview: "Try the app preview",
  },
};

export type JoinContent = typeof joinEn;
