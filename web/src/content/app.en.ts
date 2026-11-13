// Copy and sample data for the family app preview. Everything here is made up for the demo.

export const appEn = {
  page: {
    eyebrow: "The family app",
    title: "See that all is well, from anywhere.",
    lede: "This is what you will see on your phone: where your parent is, how the watch is doing, and exactly what was done about every alert.",
    badge: "Preview · sample data",
    note: "This is a demo with made-up data. The real app launches with the watch.",
    simulate: "Simulate a fall",
    running: "Demo running…",
    hint: "Press the button to watch what happens in the app when the watch detects a fall.",
    points: [
      { title: "One glance", body: "A single screen tells you your parent is fine, the watch is charged and the signal is good." },
      { title: "Nothing hidden", body: "Every alert has a full log: who was called, when, and how it ended." },
      { title: "A note every day", body: "On the care plan, you see a short note from each daily call." },
    ],
  },

  teaser: {
    eyebrow: "The family app",
    title: "Try the app before the watch exists.",
    body: "Open the preview, press \"Simulate a fall\", and watch the response happen step by step.",
    cta: "Open the app preview",
  },

  tabs: { home: "Home", map: "Location", alerts: "Alerts", calls: "Check-ins" },

  home: {
    greeting: "Good morning",
    name: "Maa",
    status: "All is well",
    sub: "Wearing her watch · at home",
    battery: "Battery",
    batteryValue: "82%",
    signal: "Signal",
    signalValue: "Good",
    plan: "Care plan",
    planValue: "Active",
    lastCheck: "Today's check-in",
    lastCheckTime: "9:10 am",
    lastNote: "Slept well. Going to the temple at five with Sharma aunty.",
    lastAlert: "Last alert",
    lastAlertValue: "10 days ago · resolved",
  },

  map: {
    title: "Maa's location",
    place: "At home",
    address: "Rajpur Road, Dehradun",
    updated: "Updated 2 min ago",
    home: "Home",
    temple: "Temple",
    market: "Market",
  },

  alerts: {
    title: "Alerts",
    log: "What was done",
    resolved: "Resolved",
    falseAlarm: "False alarm",
    items: [
      {
        kind: "fall",
        title: "Fall detected",
        when: "3 Nov, 7:42 am",
        outcome: "Neighbour reached her · closed in 14 min",
        log: [
          { t: "7:42", text: "The watch detected a fall at home." },
          { t: "7:42", text: "Saathi called Maa's watch. No answer." },
          { t: "7:44", text: "Saathi called Sharma ji next door." },
          { t: "7:49", text: "Sharma ji reached Maa. She had slipped and was awake and talking." },
          { t: "7:51", text: "Saathi called you with the update." },
          { t: "7:56", text: "Maa was resting with Sharma ji. No ambulance needed. Alert closed." },
        ],
      },
      {
        kind: "false",
        title: "SOS pressed by mistake",
        when: "27 Oct, 6:15 pm",
        outcome: "Maa said she was fine on the call",
        log: [
          { t: "6:15", text: "The SOS button was pressed." },
          { t: "6:15", text: "Saathi called Maa's watch. She answered." },
          { t: "6:16", text: "Maa said she pressed it by mistake while washing up. Alert closed." },
        ],
      },
    ],
  },

  calls: {
    title: "Daily check-ins",
    by: "Called by Anita, Saathi care team",
    items: [
      { day: "Today", time: "9:10 am", note: "Slept well. Going to the temple at five with Sharma aunty." },
      { day: "Yesterday", time: "9:05 am", note: "Knee was a little sore, so she skipped the walk. Reminded her to charge the watch." },
      { day: "Sunday", time: "9:20 am", note: "In good spirits. Asked us to order atta and tea; delivered by noon." },
      { day: "Saturday", time: "9:12 am", note: "All fine. Her sister is visiting next week." },
    ],
  },

  sim: {
    live: "Live",
    title: "Fall detected",
    sub: "Maa's watch · just now",
    steps: [
      { title: "Fall detected at home", body: "The alert went to Saathi and to you at the same moment." },
      { title: "Saathi is calling Maa's watch", body: "Anita from the care team is on the line." },
      { title: "No answer. Calling Sharma ji", body: "Your neighbour is going over to check." },
      { title: "Ambulance called", body: "Maa's location was shared with the ambulance and with you." },
      { title: "Help has arrived", body: "Sharma ji is with Maa. Anita is staying on the line." },
    ],
    doneTitle: "Maa is in safe hands",
    doneBody: "The full log is now saved under Alerts.",
    close: "Back to the app",
    newTitle: "Fall detected (demo)",
    newWhen: "Just now",
    newOutcome: "Ambulance called · help arrived",
  },
};

export type AppContent = typeof appEn;
