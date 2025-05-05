// src/data.ts

  // -----Drug Data
  export const drugNames = [
    'acid', 'cocaine', 'hash', 'heroin', 'ludes', 'molly',
    'opium', 'pcp', 'crack', 'shrooms', 'meth', 'weed'
  ];
  
  export const drugMinPrices = [
    1000, 15000, 480, 5500, 11, 1500,
    540, 1000, 220, 630, 90, 315
  ];
  
  export const drugMaxPrices = [
    4400, 29000, 1280, 13000, 60, 4400,
    1250, 2500, 700, 1300, 250, 890
  ];
  
 
  export const drugCanBeCheap = [
    1, 0, 1, 0, 1, 0,
    0, 0, 0, 0, 0, 1
  ];
  
  export const drugCanBeExpensive = [
    0, 1, 0, 1, 0, 0,
    1, 0, 0, 0, 1, 0
  ];
  
  export const drugRarity = [
    40, 60, 40, 50, 50, 50,
    50, 50, 70, 30, 80, 100
  ];
  
  // -----Location Data
  export const locationNames = [
    'The Bronx', 'The Ghetto', 'Central Park', 'Manhattan',
    'Coney Island', 'Brooklyn', 'Queens', 'Staten Island'
  ];
  
  export const locationMinDrugs = [7, 8, 6, 4, 6, 4, 6, 6];
  export const locationMaxDrugs = [12, 12, 12, 10, 12, 11, 12, 12];
  export const locationPoliceChance = [10, 5, 15, 90, 20, 70, 50, 20];
  export const locationBitchOfferChance = [20, 25, 5, 6, 7, 15, 5, 5];
  
  // -----Drug Market Events
  export const cheapDrugMessages = [
    "{ltblu}The market is flooded with cheap, home-made acid!",
    "INVALID CHEAP DRUG MESSAGE",
    "{ltgrn}The Marakesh Express has arrived!",
    "INVALID CHEAP DRUG MESSAGE",
    "{gray3}Some guys raided a pharmacy, and are selling cheap ludes!",
    "INVALID CHEAP DRUG MESSAGE","INVALID CHEAP DRUG MESSAGE","INVALID CHEAP DRUG MESSAGE","INVALID CHEAP DRUG MESSAGE","INVALID CHEAP DRUG MESSAGE","INVALID CHEAP DRUG MESSAGE",
    "{pink}Columbian freighters dusted the Coast Guard! Weed prices have bottomed out!"
  ];
  
  export const expensiveDrugMessages = {
    e1: '{yellow}Cops made a big ',
    e2: ' bust! Prices are outrageous!',
    e3: '{purple}Addicts are buying ',
    e4: ' at ridiculous prices!'
  };
  
  // -----Lady on the Subway
  export const subwayLadyLines = [
    "Wouldn't it be funny if everyone suddenly quacked at once?",
    "The Pope was once Jewish, you know.",
    "I'll bet you have some really interesting dreams.",
    "So I think... I'm going to Amsterdam this year.",
    "Son, you need a yellow haircut.",
    "It's wonderful what they're doing with incense these days.",
    "I wasn't always a woman, you know.",
    "Does your mother know you're a dope dealer?",
    "Are you high on something?",
    "Oh, you must be from California.",
    "I used to be a hippie, myself.",
    "There's nothing like having lots of money.",
    "You look like an aardvark!",
    "I don't believe in Ronald Reagan.",
    "Courage!  Bush is a noodle!",
    "Haven't I seen you on TV?",
    "I think hemorrhoid commercials are really neat!",
    "We're winning the war for drugs!",
    "A day without dope is like night.",
    "We only use 20% of our brains, why not burn out the other 80%?",
    "I'm soliciting contributions for Zombies for Christ.",
    "I'd like to sell you an edible poodle.",
    "Winners don't do drugs... unless they do.",
    "I am the walrus!",
    "I feel an unaccountable urge to dye my hair blue.",
    "Wasn't Jane Fonda wonderful in Barbarella?",
    "Just say No... well, maybe... ok, what the hell!",
    "Would you like a jelly baby?",
    "Drugs can be your friend!",
    "My cat has a podcast. He only interviews ghosts.",
    "The number 7 has been following me for weeks.",
    "I put LSD on my cereal and now I *see* the truth.",
    "You remind me of my third husband. I’ve never been married.",
    "I swallowed a lightbulb. Now I dream in Morse code.",
    "Do you think pigeons are government agents or just perverts?",
    "Don’t trust the vending machines. They remember.",
    "I knit sweaters for spiders. Wanna see?",
    "Be careful with your aura. It’s leaking.",
    "I once kissed a narwhal. Best Thursday of my life.",
    "If you lick a Game Boy cartridge, it tells your fortune.",
    "I collect lint from celebrities. Wanna buy some?",  
  ];
  
  // -----Stopped To Lines
  export const stoppedToLines = [
    'have a beer.',
    'smoke a joint.',
    'smoke a cigar.',
    'smoke a Djarum.',
    'smoke a cigarette.',
    'have a wank.',
    "feed a stray ferret wearing sunglasses.",
    "argue with a mime about tax policy.",
    "stare at a puddle and contemplate existence.",
    "buy incense from a man named 'Claw'.",
    "watch a rat try to hotwire a scooter.",
    "trade pogs with a 9-year-old drug dealer.",
    "sign a petition to legalize teleportation.",
    "take part in an impromptu kazoo parade.",  
  ];
  
  // -----Music Playing
  export const musicTracks = [
    "'Are you Experienced' by Jimi Hendrix.",
    "'Cheeba Cheeba' by Tone Loc.",
    "'Comin' in to Los Angeles' by Arlo Guthrie.",
    "'Commercial' by Spanky and Our Gang.",
    "'Late in the Evening' by Paul Simon.",
    "'Light Up' by Styx.",
    "'Mexico' by Jefferson Airplane.",
    "'One toke over the line' by Brewer & Shipley.",
    "'The Smokeout' by Shel Silverstein.",
    "'White Rabbit' by Jefferson Airplane.",
    "'Itchycoo Park' by Small Faces.",
    "'White Punks on Dope' by the Tubes.",
    "'Legend of a Mind' by the Moody Blues.",
    "'Eight Miles High' by the Byrds.",
    "'Acapulco Gold' by Riders of the Purple Sage.",
    "'Kicks' by Paul Revere & the Raiders.",
    "'Legalize It' by Mojo Nixon & Skid Roper.",
    "'Bong Hits & Binary' by Acid Spreadsheet",
    "'Static on the Hotline' by The Sysops",
    "'Funkadelic Packet Loss' by TCP Groove",
    "'Cheese Pizza Rebellion' by The Doorbell Mods",
    "'Bitrate Blues' by 56k Johnny",
    "'Mind the Parity' by The BBS Bandits",
    "'Soda Machine Lobotomy' by The ANSI Vandals",
    "'Alt-F4 Romance' by The Dialtones",
    "'Welcome to Llamaville' by DJ Zork",
    "'CRT Tanlines' by DemoScene Dreamz",    
  ];
  
  // -----Cops
  export const copNames = ["Officer Hardass", "Officer Lardass", "Sergent Stedanko"];
  export const copToughness = [50, 30, 60];
  export const copDeputies = [5, 3, 8];
  export const copToHit = [50, 60, 50];
  
  // -----Gun Data
  export const gunNames = [
    ".22 revolver", ".38 special", "9mm pistol",
    "12ga shotgun", "AK47", "rocket launcher"
  ];
  
  export const gunPrices = [1000, 2000, 3000, 4000, 10000, 20000];
  export const gunDamages = [10, 20, 30, 40, 60, 80];
  
  // -----Bitch Naming
  export const bitchSingular = 'bitch';
  export const bitchPlural = 'bitches';
  
// Cursing in the pub (mildly explicit content — used in bar event)
export const cursingStart = [
  'shit', 'fuck', 'cock', 'cunt', 'piss',
  'hell', 'damn', 'ass', 'bastard', 'felch',
  'goddamn', 'assfucking', 'motherfucking', 'fucked up',
];

export const cursingEnd = [
  'cocks', 'holes', 'hamsters', 'knuckles',
  'in the ass', 'your mom', 'in hell', 'dot com',
  'upside your head', 'motherfucker', 'squirrels',
  'donkey balls', 'horsefucker', 'cocksucker',
];
