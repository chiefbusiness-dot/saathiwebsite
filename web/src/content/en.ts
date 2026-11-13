// All English copy for the site lives here, so it can later be edited from the admin page.
// hi.ts mirrors this file exactly. Wording rule: Saathi "alerts your family and gets help".
// Never medical, never a guarantee of rescue.
import { joinEn } from "./join.en";
import { appEn } from "./app.en";

export const en = {
  ui: {
    skip: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    home: "Saathi home",
    back: "Back to home",
    yes: "Yes",
    no: "No",
    product: "Product",
    soon: "This page is being built next.",
    language: "Language",
    notFound: { title: "Page not found", lede: "That page doesn't exist." },
  },

  watch: {
    label: "Saathi 4G safety watch",
    date: "Tuesday 12",
    ok: "All is well",
    calling: "Calling Saathi…",
    help: "Help is on the line",
  },

  nav: {
    links: [
      { to: "/how-it-works", label: "How it works" },
      { to: "/care-plan", label: "Care plan" },
      { to: "/pricing", label: "Pricing" },
      { to: "/our-story", label: "Our story" },
      { to: "/faq", label: "FAQ" },
    ],
    more: [{ to: "/why-saathi", label: "Why Saathi" }, { to: "/app-preview", label: "Family app" }],
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
    call: {
      team: "Saathi response team",
      calling: "Calling Maa on her watch…",
      steps: ["Fall alert received", "Family notified on WhatsApp", "Neighbour on standby"],
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
    link: "More about the care plan",
  },

  pricing: {
    eyebrow: "Pricing",
    title: "Buy the watch once. Add care if you want it.",
    watch: {
      name: "Saathi watch",
      price: "₹9,999",
      unit: "one-time",
      points: ["Fall detection, SOS, GPS and voice calling", "Alerts to the family's phones", "Works without any subscription"],
      badge: "",
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
      { name: "Health rings", cells: [true, false, false], highlight: false },
      { name: "Fall-detection watches", cells: [true, true, false], highlight: false },
      { name: "SOS pendants", cells: [true, false, false], highlight: false },
      { name: "Room sensors", cells: [false, true, false], highlight: false },
      { name: "Saathi", cells: [true, true, true], highlight: true },
    ],
    link: "See the full comparison",
  },

  story: {
    eyebrow: "Our story",
    title: "Built in Dehradun, for our own grandparents first.",
    body: [
      "Saathi began with a simple worry: our grandparents live on their own, and we would not know if something happened to them.",
      "We tried the rings and the gadgets. They tracked plenty, but none of them made sure a person showed up. So we are building the part that was missing: a local response team, one city at a time, starting at home.",
    ],
    link: "Read our story",
    place: "Dehradun, Uttarakhand",
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

  app: appEn,

  join: joinEn,

  pages: {
    how: {
      eyebrow: "How it works",
      title: "A watch on the wrist. A person on the line.",
      lede: "Saathi is two things that work together. The watch notices when something is wrong, anywhere your parent goes. A trained person makes sure something is done about it.",
      daily: {
        eyebrow: "Day to day",
        title: "Simple enough to forget it's there.",
        items: [
          { title: "We set it up before it arrives", body: "The SIM, your family's numbers and the neighbour's number are loaded before the watch reaches your parent." },
          { title: "Your parent just wears it", body: "No app, no password, no screen to learn. It tells the time and stays out of the way." },
          { title: "Charge it once a week", body: "About a week on one charge. On the care plan, our daily call includes a gentle reminder." },
          { title: "You see that all is well", body: "The family app shows location, battery and every alert, with a note of what was done." },
        ],
      },
      limit: {
        title: "One honest limit",
        body: "The watch only helps when it is worn and charged. We chose a wearable anyway, because a fall can happen in the kitchen, on the stairs or outside, and a device fixed to one room would miss it.",
      },
    },

    care: {
      eyebrow: "The care plan",
      title: "The part that makes Saathi different.",
      lede: "For ₹199 a month, a trained person answers every alert from your parent's watch, calls every day, and helps with small things. It is optional, and you can add it at any time.",
      day: {
        eyebrow: "A day with the care plan",
        title: "Quietly there, all day.",
        items: [
          { time: "Morning", title: "The daily call", body: "\"Namaste, how are you today? Did you sleep well?\" A minute or two, in Hindi or English." },
          { time: "Afternoon", title: "A small errand", body: "Your parent mentions they are out of atta and tea. We place the grocery order for them." },
          { time: "Any time", title: "If the watch raises an alert", body: "We call back at once, and if there is no answer we call the neighbour, the ambulance and you." },
          { time: "Evening", title: "A note for you", body: "You see that the call happened, and anything your parent wanted you to know." },
        ],
      },
      does: {
        title: "What we do",
        items: [
          "Answer every fall and SOS alert with a call to your parent",
          "Call your chosen neighbour or local contact if there is no answer",
          "Call an ambulance when it is needed, and share the location",
          "Keep you updated until help has arrived",
          "Call your parent once a day, and remind them to charge the watch",
        ],
      },
      doesnt: {
        title: "What we don't promise",
        items: [
          "We are not doctors, and we do not give medical advice",
          "We cannot guarantee how fast an ambulance or a neighbour arrives",
          "We do not replace 112 or any emergency service",
        ],
      },
      without: {
        title: "And without the care plan?",
        body: "The watch still works. Fall and SOS alerts go straight to your family's phones, with the location, and your parent can call you from the wrist. There is no monthly fee.",
      },
    },

    pricing: {
      eyebrow: "Pricing",
      title: "One price for the watch. One small price for care.",
      lede: "No starter kits, no tiers, no lock-in. These are our planned launch prices; nothing is on sale until 2027.",
      qTitle: "Pricing questions",
      items: [
        { q: "Do I have to take the care plan?", a: "No. The watch works on its own and sends alerts to your family's phones. The care plan adds a trained person who answers those alerts and calls every day." },
        { q: "Is there any other monthly cost?", a: "The watch needs a SIM with a small data and calling pack to stay connected. We will confirm exactly how that is handled, and what it costs, before we take any orders." },
        { q: "Can I pay today?", a: "No. We are not taking payments yet. Join the pilot list and we will call you to explain the next steps." },
        { q: "What does the pilot cost?", a: "The pilot is a paid trial for 20 families. We will share the exact terms on a call before you decide anything." },
        { q: "Can I cancel the care plan?", a: "Yes. The plan is monthly and you can stop it whenever you like. The watch keeps working without it." },
      ],
    },

    why: {
      eyebrow: "Why Saathi",
      title: "Other products tell someone. We make sure someone acts.",
      lede: "There are good devices for older people in India. Almost all of them stop at the same point: they send an alert, and hope somebody sees it in time.",
      tableTitle: "What exists, and what it misses",
      rows: [
        { name: "Health rings", gives: "Track sleep, steps and heart rate", misses: "Cannot call for help after a fall" },
        { name: "Fall-detection watches", gives: "Detect a fall and send an alert", misses: "Nobody is guaranteed to act on the alert" },
        { name: "SOS pendants", gives: "A button to press for help", misses: "Your parent must be able to press it, and someone must answer" },
        { name: "Room sensors", gives: "Watch over one room without a wearable", misses: "A fall in the kitchen or outside is missed" },
        { name: "Hospitals and ambulances", gives: "Care once someone reaches them", misses: "Nothing in the gap between the fall and the call" },
      ],
      gives: "What it gives",
      misses: "What it misses",
      edge: {
        eyebrow: "What we do differently",
        title: "The response is the product.",
        items: [
          { title: "A local team, city by city", body: "We open in a city only when we have people there who know the neighbourhoods, the hospitals and the ambulance services." },
          { title: "The same steps, every time", body: "Every alert follows a written process: call the parent, call the neighbour, call the ambulance, update the family." },
          { title: "Open, never hidden", body: "The watch is worn by choice. We will not make a device that tracks someone without their knowledge." },
        ],
      },
    },

    story: {
      eyebrow: "Our story",
      title: "It started with our own grandparents.",
      paragraphs: [
        "Our grandparents live in Dehradun, on their own. Like many families, the rest of us are spread across other cities. Every unanswered phone call brought the same thought: what if something has happened, and nobody knows?",
        "So we went looking. We tried a health ring; they did not like charging it, and it could not call anyone anyway. We looked at fall-detection watches and SOS pendants. They all did the easy part, which is noticing. None of them did the hard part, which is making sure a person responds.",
        "That is the part we decided to build. The watch is something anyone can buy. A trusted team that picks up, calls the neighbour, calls the ambulance and stays with the family is not, and it has to be built on the ground, one city at a time.",
        "We are starting at home, in Dehradun, with a small group of families, so we can get the response right before we grow.",
      ],
      values: {
        eyebrow: "What we believe",
        title: "Three promises we work by.",
        items: [
          { title: "Dignity first", body: "Parents are not patients. Saathi should feel like a watch and a friendly voice, not like being monitored." },
          { title: "Honest about limits", body: "We alert and we coordinate. We will never claim to be a medical device or to guarantee a rescue." },
          { title: "Small before big", body: "Twenty families served properly matter more to us than two thousand served badly." },
        ],
      },
    },

    faq: {
      eyebrow: "Questions",
      title: "Everything families ask us.",
      lede: "If your question isn't here, join the pilot list and ask us on the call.",
      groups: [
        {
          title: "The watch",
          items: [
            { q: "Does my parent need a smartphone?", a: "No. The watch has its own 4G SIM and makes calls by itself. Your parent only needs to wear it and charge it about once a week." },
            { q: "How often does it need charging?", a: "About once a week. On the care plan, our daily call includes a reminder when the battery is getting low." },
            { q: "Does it work outside the house?", a: "Yes. It works anywhere there is mobile signal: at home, at the market, on a walk or while travelling." },
            { q: "What if the signal is weak where my parent lives?", a: "This is one of the things we test in the pilot. We check signal at your parent's home before you commit to anything." },
            { q: "What if my parent refuses to wear a watch?", a: "Then Saathi may not be right for them, and we will tell you so. The watch only helps if it is worn, and it must be their choice." },
          ],
        },
        {
          title: "The response",
          items: [
            { q: "Who answers the alert?", a: "A trained member of the Saathi team, who has your parent's details, your family's numbers and your local contact in front of them." },
            { q: "What if it's a false alarm?", a: "We call your parent first. If they say they are fine, we note it and let you know. Nobody is sent to the house without need." },
            { q: "Do you send someone to the house?", a: "We call the neighbour or local contact you have chosen, and an ambulance when it is needed." },
            { q: "Which cities do you cover?", a: "We are starting in Dehradun. We will add cities one at a time, as we build a local team in each." },
          ],
        },
        {
          title: "Privacy",
          items: [
            { q: "Is my parent being watched?", a: "No. The watch is worn openly and by choice. Location is shared only with the people listed in the next answer." },
            { q: "Who can see the location?", a: "Only the family members you choose, and our response team while they are handling an alert." },
            { q: "What do you do with the details I give you?", a: "We use them to contact you about Saathi, and for nothing else. We do not sell or share them. See our privacy page for the detail." },
          ],
        },
        {
          title: "Buying",
          items: [
            { q: "When can I buy Saathi?", a: "We plan to start selling in 2027, once the watch has completed its Indian certifications. Before that we are running a small paid pilot with 20 families." },
            { q: "How much will it cost?", a: "The planned prices are ₹9,999 once for the watch, and ₹199 a month for the optional care plan." },
            { q: "Is Saathi a medical device?", a: "No. Saathi alerts your family and coordinates help. It does not diagnose or treat anything and does not replace emergency services." },
          ],
        },
      ],
    },

    contact: {
      eyebrow: "Contact",
      title: "Talk to the people building Saathi.",
      lede: "We are a small team in Dehradun. The quickest way to reach us is to join the pilot list: leave your number and we will call you.",
      cards: [
        { title: "Families", body: "Thinking about Saathi for your parent? Join the pilot list and we will call you back.", cta: "Join the pilot", to: "/join" },
        { title: "Questions", body: "Most questions about the watch, the care plan and privacy are answered on our FAQ page.", cta: "Read the FAQ", to: "/faq" },
      ],
      emergency: "Saathi is not an emergency service. In an emergency, call 112.",
    },

    privacy: {
      title: "Privacy",
      updated: "Last updated: November 2026",
      intro: "Saathi is built for families, and it only works if families trust us. This page explains, in plain words, what we collect on this website and what we do with it.",
      sections: [
        { h: "What we collect", p: ["When you join the pilot list or contact us, we collect what you type into the form: your name, your phone number, your email if you give it, your city, your parent's city and age range, and any message you write.", "We do not ask for your parent's name, address or health details on this website."] },
        { h: "What we use it for", p: ["We use your details to contact you about Saathi and the pilot. That is all.", "We do not sell your details, share them with advertisers, or add you to anyone else's list."] },
        { h: "Cookies and tracking", p: ["This website has no advertising trackers and no third-party analytics.", "We store one small setting in your browser: the language you chose, so the site remembers it next time."] },
        { h: "Where it is kept", p: ["Your details are stored in our database, hosted by our cloud providers, and can be seen only by the Saathi team."] },
        { h: "Your choices", p: ["You can ask us to show you, correct or delete your details at any time. Tell us on a call, or through the contact page, and we will do it."] },
        { h: "The watch and the family app", p: ["The watch and the app are not on sale yet. Before they are, we will publish a separate, clear policy covering location and alert data, and families will agree to it before anything is switched on."] },
      ],
    },

    terms: {
      title: "Terms",
      updated: "Last updated: November 2026",
      intro: "These are the terms for using this website. Terms for the watch, the care plan and the pilot will be shared separately with each family before they pay for anything.",
      sections: [
        { h: "This website is for information", p: ["Saathi is not on sale yet. Nothing on this site is an offer to sell, and joining the pilot list is not an order or a commitment to buy."] },
        { h: "Prices and dates may change", p: ["The prices and launch dates shown are our plans. They may change before launch, and we will tell everyone on our list if they do."] },
        { h: "Saathi is not a medical device", p: ["Saathi alerts your family and coordinates help. It does not diagnose, treat or prevent any condition, and it does not replace a doctor or an emergency service.", "In an emergency, call 112."] },
        { h: "What the service can and cannot do", p: ["When Saathi is live, our team will answer alerts and try to reach your parent, your local contact and the emergency services. We cannot guarantee that a fall will always be detected, that a call will always connect, or how quickly help will arrive."] },
        { h: "Your details", p: ["How we handle the details you give us is explained on our privacy page."] },
        { h: "Law", p: ["These terms are governed by the laws of India."] },
      ],
    },

  },
};

export type Content = typeof en;
