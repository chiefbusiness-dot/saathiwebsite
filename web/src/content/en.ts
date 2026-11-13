// All English copy for the site lives here, so it can later be edited from the admin page
// and mirrored in Hindi. Wording rule: Saathi "alerts your family and gets help".
// Never medical, never a guarantee of rescue.

export const en = {
  nav: {
    links: [
      { to: "/how-it-works", label: "How it works" },
      { to: "/care-plan", label: "Care plan" },
      { to: "/pricing", label: "Pricing" },
      { to: "/our-story", label: "Our story" },
      { to: "/faq", label: "FAQ" },
    ],
    cta: "Join the pilot",
  },

  hero: {
    pill: "Launching 2027 · Pilot places now open",
    title: ["Someone", "actually answers."],
    lede: "Saathi is a 4G safety watch for your parent, with a real person on the other end of every alert. The watch raises the alarm. We make sure help actually comes.",
    primary: "Join the pilot",
    secondary: "See how it works",
    note: "No payment today. We'll call you before anything else happens.",
  },

  problem: {
    eyebrow: "The gap",
    title: "Most safety devices beep. Then nothing happens.",
    lede: "Your parent lives alone. You live in another city. A fall in the kitchen, a sudden chest pain, and the alert goes to a phone that's on silent in a meeting.",
    cards: [
      { title: "The alert reaches a busy phone", body: "You're in a meeting, on a flight, or asleep. The notification sits there unread." },
      { title: "The button never gets pressed", body: "After a fall, many people can't reach a pendant, or don't want to make a fuss." },
      { title: "The device covers one room", body: "A sensor in the bedroom can't see the kitchen, the stairs or the morning walk." },
    ],
    close: "Detecting a fall is a solved problem. Making sure someone responds is not. That is what Saathi does.",
  },

  two: {
    eyebrow: "What Saathi is",
    title: "A watch that goes everywhere. A person who picks up.",
    watch: {
      title: "The watch",
      body: "Worn on the wrist, with its own SIM. It works in the kitchen, on the stairs and on the morning walk, not just in one room.",
    },
    person: {
      title: "The person",
      body: "When the watch raises an alert, a trained member of our team calls your parent back, and keeps going until help has arrived.",
    },
  },

  features: {
    eyebrow: "The watch",
    title: "Six things. Nothing to learn.",
    items: [
      { icon: "fall", title: "Automatic fall detection", body: "The watch senses a hard fall and raises the alert on its own." },
      { icon: "sos", title: "One SOS button", body: "A single, easy-to-find button your parent can press any time." },
      { icon: "pin", title: "GPS location", body: "The family can see where the watch is, at home or outside." },
      { icon: "phone", title: "Two-way voice calling", body: "Your parent can talk to you, or to Saathi, straight from the wrist." },
      { icon: "battery", title: "About a week of battery", body: "Charge it once a week, not every night. We remind them." },
      { icon: "signal", title: "Its own 4G SIM", body: "No phone, no Wi-Fi and no app needed on your parent's side." },
    ],
  },

  minutes: {
    eyebrow: "The first five minutes",
    title: "What happens after a fall.",
    lede: "A trained person follows the same steps every time, and stays with your family until help has arrived.",
    steps: [
      { time: "00:00", title: "The watch detects a fall", body: "An alert reaches Saathi and your phone at the same moment." },
      { time: "00:30", title: "We call your parent on the watch", body: "\"Namaste, this is Saathi. Are you all right?\" Often that is all it takes." },
      { time: "02:00", title: "No answer? We call the neighbour", body: "The local contact you chose is asked to go and check in person." },
      { time: "03:00", title: "We call the ambulance and you", body: "You get the location and a live update on WhatsApp, wherever you are." },
      { time: "Until help arrives", title: "We stay on the line", body: "Someone from Saathi stays with your family until your parent is in safe hands." },
    ],
    note: "Illustrative timeline. Actual times depend on the situation and local services.",
  },

  care: {
    eyebrow: "The care plan",
    title: "A real person, every day.",
    lede: "The watch works on its own, with alerts to your phone at no monthly fee. Add the care plan when you want a human in the loop.",
    items: [
      { icon: "headset", title: "Every alert answered", body: "A trained person calls back, then calls the neighbour, the ambulance and you." },
      { icon: "calendar", title: "A daily check-in call", body: "A short, friendly call each day. You see a note that it happened." },
      { icon: "bag", title: "Small errands, done", body: "Your parent tells us, and we get it done, like placing a grocery order." },
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    title: "Buy the watch once. Add care if you want it.",
    watch: {
      name: "Saathi watch",
      price: "₹9,999",
      unit: "one-time",
      points: ["Fall detection, SOS, GPS and voice calling", "Alerts to the family's phones", "Works without any subscription"],
    },
    plan: {
      name: "Care plan",
      price: "₹199",
      unit: "per month, optional",
      points: ["A trained person answers every alert", "Daily check-in call", "Small errands on request", "Cancel any time"],
      badge: "The heart of Saathi",
    },
    note: "Planned launch prices. Saathi goes on sale in 2027; join the pilot to be first.",
    cta: "Join the pilot",
  },

  compare: {
    eyebrow: "Why Saathi",
    title: "Everything else stops at the alert.",
    cols: ["Goes everywhere", "Detects a fall", "A person responds"],
    rows: [
      { name: "Health rings", cells: [true, false, false] },
      { name: "Fall-detection watches", cells: [true, true, false] },
      { name: "SOS pendants", cells: [true, false, false] },
      { name: "Room sensors", cells: [false, true, false] },
      { name: "Saathi", cells: [true, true, true], highlight: true },
    ],
  },

  story: {
    eyebrow: "Our story",
    title: "Built in Dehradun, for our own grandparents first.",
    body: [
      "Saathi began with a simple worry: our grandparents live on their own, and we would not know if something happened to them.",
      "We tried the rings and the gadgets. They tracked plenty, but none of them made sure a person showed up. So we are building the part that was missing: a local response team, one city at a time, starting at home.",
    ],
    link: "Read our story",
  },

  faq: {
    eyebrow: "Questions",
    title: "Good to know.",
    items: [
      { q: "When can I buy Saathi?", a: "We plan to start selling in 2027, once the watch has completed its Indian certifications. Before that we are running a small paid pilot with 20 families. Join the list and we will call you." },
      { q: "Does my parent need a smartphone?", a: "No. The watch has its own 4G SIM and makes calls by itself. Your parent only needs to wear it and charge it about once a week." },
      { q: "What if it's a false alarm?", a: "We call your parent first. If they say they are fine, we note it and let you know. Nobody is sent to the house without need." },
      { q: "Is my parent being watched?", a: "No. The watch is worn openly and by choice. Location is shared only with the family members you choose, and with our team during an alert." },
      { q: "Is Saathi a medical device?", a: "No. Saathi alerts your family and coordinates help. It does not diagnose or treat anything and does not replace emergency services." },
    ],
    link: "All questions",
  },

  cta: {
    title: "Be one of our first 20 families.",
    lede: "We are starting with a small pilot so every family gets our full attention. Tell us about your parent and we will call you.",
    button: "Join the pilot",
  },

  footer: {
    tagline: "A watch for your parent. A person who answers.",
    disclaimer:
      "Saathi alerts your family and coordinates help. It is not a medical device and does not replace emergency services. In an emergency, call 112.",
    made: "Made in Dehradun, India.",
    legal: [
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
      { to: "/contact", label: "Contact" },
    ],
  },
};

export type Content = typeof en;
