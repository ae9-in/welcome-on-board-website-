// lib/dictionary-client.ts

export interface SlangEntry {
  definition: string;
  partOfSpeech: string;
  exampleSentence1: string;
  exampleSentence2: string;
  situationalPrompt: string;
  formalSynonym: string;
  millennialCrossRef: string;
}

export const SLANG_DICT: Record<string, SlangEntry> = {
  UNBOXING: {
    definition: "The act of removing a newly purchased product from its packaging, especially while recording a video.",
    partOfSpeech: "noun",
    exampleSentence1: "She posted an unboxing video of the new smartphone on her channel.",
    exampleSentence2: "Unboxing videos have become extremely popular on social media platforms.",
    situationalPrompt: "Opening up a brand-new, sealed toy catalog order on a live stream.",
    formalSynonym: "Unwrapping or unpacking.",
    millennialCrossRef: "Making a home video of opening birthday gifts."
  },
  EMOTE: {
    definition: "A digital gesture or animation executed by an avatar in a video game.",
    partOfSpeech: "noun",
    exampleSentence1: "The player performed a victory emote after winning the match.",
    exampleSentence2: "You can unlock new emotes by completing seasonal challenges.",
    situationalPrompt: "Your character executes a fast victory celebration dance on a gaming server.",
    formalSynonym: "Gesture or expression.",
    millennialCrossRef: "Doing an animated avatar dance step."
  },
  VIBE: {
    definition: "The general emotional atmosphere or mood of a place, situation, or person.",
    partOfSpeech: "noun",
    exampleSentence1: "The cozy cafe had a very relaxing and friendly vibe.",
    exampleSentence2: "I got a strange vibe from that empty house at the end of the street.",
    situationalPrompt: "The relaxing energy of a low-light music room filled with cozy pillows.",
    formalSynonym: "Atmosphere or aura.",
    millennialCrossRef: "The overall mood or general feeling."
  },
  RIZZ: {
    definition: "Charm, charisma, or the ability to attract others, especially romantically.",
    partOfSpeech: "noun",
    exampleSentence1: "His smooth conversation showed he had plenty of rizz.",
    exampleSentence2: "She was impressed by his confidence and natural rizz.",
    situationalPrompt: "A speaker smoothly convinces their classmates to vote for them using pure charm.",
    formalSynonym: "Charisma or allure.",
    millennialCrossRef: "Having smooth talking game or charm."
  },
  SUS: {
    definition: "Suspicious, questionable, or shady; causing doubt or distrust.",
    partOfSpeech: "adjective",
    exampleSentence1: "It was a bit sus when he suddenly left the room after the question.",
    exampleSentence2: "That website looks sus, so don't click on any links.",
    situationalPrompt: "A player quietly sneaks out of a shared document room without saving code.",
    formalSynonym: "Suspicious or questionable.",
    millennialCrossRef: "Shady or untrustworthy actions."
  },
  CHEUGY: {
    definition: "Outdated, basic, or trying too hard to be trendy; no longer in style.",
    partOfSpeech: "adjective",
    exampleSentence1: "Wearing skinny jeans and using side-parts is considered cheugy by Gen Z.",
    exampleSentence2: "She laughed at her old Facebook posts, realizing how cheugy they were.",
    situationalPrompt: "Someone inserts bright, word-art animations into a presentation deck.",
    formalSynonym: "Outdated or old-fashioned.",
    millennialCrossRef: "Basic or trying too hard to stay trendy."
  },
  DELULU: {
    definition: "Delusional or having unrealistic and highly optimistic fantasies.",
    partOfSpeech: "adjective",
    exampleSentence1: "Thinking he will pass the test without studying is completely delulu.",
    exampleSentence2: "Sometimes staying a little delulu is the only way to survive a stressful day.",
    situationalPrompt: "An individual plans to code an entire enterprise network map during a single five-minute recess block.",
    formalSynonym: "Delusional or unrealistic.",
    millennialCrossRef: "Completely daydreaming or out of touch."
  },
  GOATED: {
    definition: "Being the greatest of all time; exceptional, incomparable, or supreme.",
    partOfSpeech: "adjective",
    exampleSentence1: "His performance in the finals was absolutely goated.",
    exampleSentence2: "That legendary game developer is goated in the gaming community.",
    situationalPrompt: "A speed-runner completes a flawless level run that shatters all past global time tracking records.",
    formalSynonym: "Incomparable or supreme.",
    millennialCrossRef: "The Greatest of All Time (G.O.A.T.)."
  },
  CLOUT: {
    definition: "Influence, popularity, or social power, particularly on social media.",
    partOfSpeech: "noun",
    exampleSentence1: "Some influencers do wild stunts just to chase internet clout.",
    exampleSentence2: "Winning the award gave the young writer a lot of literary clout.",
    situationalPrompt: "An internet channel compromises software utility just to score algorithmic metrics.",
    formalSynonym: "Influence or leverage.",
    millennialCrossRef: "Chasing fame or looking for attention online."
  }
};

export interface LocalWordEntry {
  definition: string;
  partOfSpeech: string;
  exampleSentence1: string;
  exampleSentence2: string;
}

export const LOCAL_DICTIONARY: Record<string, LocalWordEntry> = {
  CAT: {
    definition: "A small domesticated carnivorous mammal with soft fur, a short snout, and retractile claws.",
    partOfSpeech: "noun",
    exampleSentence1: "The fluffy cat curled up on the rug and purred contentedly.",
    exampleSentence2: "She feeds her cat every morning before leaving for work."
  },
  DOG: {
    definition: "A domesticated carnivorous mammal that typically has a long snout, an acute sense of smell, and a barking voice.",
    partOfSpeech: "noun",
    exampleSentence1: "The playful dog barked excitedly at the postman.",
    exampleSentence2: "They trained their dog to fetch the tennis ball in the yard."
  },
  SUN: {
    definition: "The star around which the earth orbits and from which it receives light and warmth.",
    partOfSpeech: "noun",
    exampleSentence1: "The hot summer sun shone down brightly on the sandy beach.",
    exampleSentence2: "We sat outside to watch the sun set over the distant mountains."
  },
  BUS: {
    definition: "A large motor vehicle carrying passengers by road, especially one serving the public on a fixed route.",
    partOfSpeech: "noun",
    exampleSentence1: "The school bus arrived right on time at the street corner.",
    exampleSentence2: "He took the public bus to travel across the city."
  },
  MAP: {
    definition: "A diagrammatic representation of an area of land or sea showing physical features, cities, or roads.",
    partOfSpeech: "noun",
    exampleSentence1: "They carefully studied the trail map to find their way to the waterfall.",
    exampleSentence2: "The old world map showed countries that no longer exist."
  },
  WEB: {
    definition: "A network of fine threads constructed by a spider to catch its prey.",
    partOfSpeech: "noun",
    exampleSentence1: "A spider spun a delicate web across the corner of the window.",
    exampleSentence2: "He searched the web for article resources to complete his school project."
  },
  GEM: {
    definition: "A precious or semiprecious stone, especially when cut and polished or engraved.",
    partOfSpeech: "noun",
    exampleSentence1: "The museum displayed a rare green gem of incredible value.",
    exampleSentence2: "She found a beautiful polished gem while searching the rocky beach."
  },
  KEY: {
    definition: "A small piece of shaped metal with incisions cut to fit a particular lock.",
    partOfSpeech: "noun",
    exampleSentence1: "She inserted the key into the brass lock and turned it carefully.",
    exampleSentence2: "Persistence and hard work are the key to mastering any skill."
  },
  ZOO: {
    definition: "An establishment which maintains a collection of wild animals for study, conservation, or public display.",
    partOfSpeech: "noun",
    exampleSentence1: "The excited children saw a giant panda during their field trip to the zoo.",
    exampleSentence2: "The zoo has a special program dedicated to protecting endangered species."
  },
  BALL: {
    definition: "A solid or hollow spherical object that is kicked, thrown, or hit in a game.",
    partOfSpeech: "noun",
    exampleSentence1: "He kicked the soccer ball straight into the goal net.",
    exampleSentence2: "The children played catch with a bouncy ball in the park."
  },
  CAKE: {
    definition: "An item of soft sweet food made from a mixture of flour, fat, eggs, sugar, baked and decorated.",
    partOfSpeech: "noun",
    exampleSentence1: "She carefully blew out the glowing candles on her birthday cake.",
    exampleSentence2: "The bakery on the corner makes the most delicious chocolate cake."
  },
  RAIN: {
    definition: "Moisture condensed from the atmosphere that falls visible in separate drops.",
    partOfSpeech: "noun",
    exampleSentence1: "The heavy spring rain helped the garden flowers grow.",
    exampleSentence2: "They carried large umbrellas to protect themselves from the rain."
  },
  TREE: {
    definition: "A woody perennial plant, typically having a single stem or trunk growing to a considerable height.",
    partOfSpeech: "noun",
    exampleSentence1: "An ancient oak tree shaded the entire front yard.",
    exampleSentence2: "The birds built a safe, cozy nest high in the tree branches."
  },
  FISH: {
    definition: "A limbless cold-blooded vertebrate animal with gills and fins living wholly in water.",
    partOfSpeech: "noun",
    exampleSentence1: "A school of colorful fish swam around the coral reef.",
    exampleSentence2: "They sat quietly by the river bank hoping to catch a fish."
  },
  STAR: {
    definition: "A fixed luminous point in the night sky that is a large, remote incandescent body.",
    partOfSpeech: "noun",
    exampleSentence1: "The clear night sky was filled with thousands of twinkling stars.",
    exampleSentence2: "The actor received a gold star on the famous walk of fame."
  },
  MOON: {
    definition: "The natural satellite of the earth, visible by reflected light from the sun.",
    partOfSpeech: "noun",
    exampleSentence1: "The bright full moon illuminated the quiet forest below.",
    exampleSentence2: "Scientists study the craters on the surface of the moon."
  },
  BIRD: {
    definition: "A warm-blooded egg-laying vertebrate distinguished by feathers, wings, and a beak.",
    partOfSpeech: "noun",
    exampleSentence1: "A small yellow bird sang a cheerful song on the fence post.",
    exampleSentence2: "Many species of birds fly south to warmer climates during winter."
  },
  BOOK: {
    definition: "A written or printed work consisting of pages glued or sewn together bound in covers.",
    partOfSpeech: "noun",
    exampleSentence1: "He stayed up late reading an exciting adventure book.",
    exampleSentence2: "She borrowed a textbook about solar systems from the library."
  },
  SHOE: {
    definition: "A covering for the foot, typically made of leather, with a sturdy sole.",
    partOfSpeech: "noun",
    exampleSentence1: "He tied the laces of his new running shoes before the race.",
    exampleSentence2: "She left her muddy shoes on the mat outside the front door."
  },
  DOOR: {
    definition: "A hinged, sliding, or revolving barrier that opens and closes an entrance.",
    partOfSpeech: "noun",
    exampleSentence1: "She knocked softly on the wooden door and waited for an answer.",
    exampleSentence2: "Please keep the back door closed to keep out the cold draft."
  },
  APPLE: {
    definition: "A round fruit with red, green, or yellow skin and crisp white flesh.",
    partOfSpeech: "noun",
    exampleSentence1: "She picked a sweet red apple directly from the tree branch.",
    exampleSentence2: "He sliced a fresh green apple to eat with his lunch."
  },
  BREAD: {
    definition: "Food made of flour, water, and yeast mixed together and baked.",
    partOfSpeech: "noun",
    exampleSentence1: "The rich aroma of freshly baked bread filled the bakery.",
    exampleSentence2: "She made a delicious sandwich using two slices of wheat bread."
  },
  CHAIR: {
    definition: "A separate seat for one person, typically with four legs and a back.",
    partOfSpeech: "noun",
    exampleSentence1: "He pulled a comfortable wooden chair up to the dining table.",
    exampleSentence2: "She sat in a comfortable rocking chair near the warm fireplace."
  },
  DRINK: {
    definition: "Take in liquid, or swallow a beverage to quench thirst.",
    partOfSpeech: "verb",
    exampleSentence1: "It is important to drink plenty of fresh water during exercise.",
    exampleSentence2: "He liked to drink warm herbal tea on rainy afternoons."
  },
  EARTH: {
    definition: "The planet on which we live; the world that supports life.",
    partOfSpeech: "noun",
    exampleSentence1: "The Earth completes a full orbit around the Sun once a year.",
    exampleSentence2: "Protecting the Earth's oceans is critical for marine life."
  },
  FLAME: {
    definition: "A hot glowing body of ignited gas that is generated by something on fire.",
    partOfSpeech: "noun",
    exampleSentence1: "A tiny yellow flame flickered gently on the candle wick.",
    exampleSentence2: "The campers watched the warm flames of the campfire rise."
  },
  GLOBE: {
    definition: "A spherical representation of the earth showing continents and oceans.",
    partOfSpeech: "noun",
    exampleSentence1: "The geography teacher spun the globe to find South America.",
    exampleSentence2: "Our organization aims to make a positive impact around the globe."
  },
  HEART: {
    definition: "A hollow muscular organ that pumps the blood through the circulatory system.",
    partOfSpeech: "noun",
    exampleSentence1: "His heart beat rapidly after he jogged up the steep hill.",
    exampleSentence2: "She drew a perfect red heart on the birthday card for her mother."
  },
  ISLAND: {
    definition: "A piece of land entirely surrounded by water.",
    partOfSpeech: "noun",
    exampleSentence1: "They rode a wooden ferry to visit the tropical island.",
    exampleSentence2: "A lone lighthouse stood tall on the rocky island coast."
  },
  JUICE: {
    definition: "The liquid obtained from or present in fruit or vegetables.",
    partOfSpeech: "noun",
    exampleSentence1: "She enjoyed a glass of cold orange juice with her breakfast.",
    exampleSentence2: "The sweet fruit juice dripped as he bit into the peach."
  },
  LIGHT: {
    definition: "The natural agent that stimulates sight and makes things visible.",
    partOfSpeech: "noun",
    exampleSentence1: "Golden morning light shone beautifully through the curtains.",
    exampleSentence2: "Please switch off the light when you leave the bedroom."
  },
  MAGIC: {
    definition: "The power of apparently influencing events using mysterious or supernatural forces.",
    partOfSpeech: "noun",
    exampleSentence1: "The talented magician performed a series of mind-boggling magic tricks.",
    exampleSentence2: "There was a feeling of quiet magic in the snowy forest."
  },
  NIGHT: {
    definition: "The period of darkness between sunset and sunrise.",
    partOfSpeech: "noun",
    exampleSentence1: "The crickets chirped loudly during the quiet summer night.",
    exampleSentence2: "The stars shone brightly against the dark night sky."
  },
  OCEAN: {
    definition: "A very large expanse of sea, in particular, each of the main areas of saline water.",
    partOfSpeech: "noun",
    exampleSentence1: "The vast ocean stretched out as far as the eye could see.",
    exampleSentence2: "Many unique creatures live in the deep, unexplored ocean."
  },
  PHONE: {
    definition: "A mobile telephone used to make calls, send texts, and browse the internet.",
    partOfSpeech: "noun",
    exampleSentence1: "Her mobile phone buzzed with an incoming message from her friend.",
    exampleSentence2: "He plugged his phone into the wall charger before going to sleep."
  },
  QUEEN: {
    definition: "The female ruler of an independent state, or the wife of a king.",
    partOfSpeech: "noun",
    exampleSentence1: "The queen wore a brilliant gold crown decorated with rubies.",
    exampleSentence2: "The worker bees buzzed constantly around their queen."
  },
  RIVER: {
    definition: "A large natural stream of water flowing in a channel to the sea or lake.",
    partOfSpeech: "noun",
    exampleSentence1: "The swift river flowed gracefully down the mountain valley.",
    exampleSentence2: "They rented a kayak to explore the winding river."
  },
  SMOKE: {
    definition: "A visible suspension of carbon particles in air emitted by a burning substance.",
    partOfSpeech: "noun",
    exampleSentence1: "Wisps of gray smoke drifted slowly out of the cabin chimney.",
    exampleSentence2: "The campfire filled the air with dense pine smoke."
  },
  TIGER: {
    definition: "A very large solitary cat with a yellow-brown coat striped with black.",
    partOfSpeech: "noun",
    exampleSentence1: "The majestic tiger prowled silently through the jungle brush.",
    exampleSentence2: "We watched the tiger rest in the shade of a large tree."
  },
  VOICE: {
    definition: "The sound produced in a person's larynx and uttered through the mouth.",
    partOfSpeech: "noun",
    exampleSentence1: "She sang the melody in a soft, beautiful voice.",
    exampleSentence2: "His booming voice was easily heard across the crowded hall."
  },
  WATER: {
    definition: "A colorless, transparent, odorless liquid that forms the seas, lakes, and rain.",
    partOfSpeech: "noun",
    exampleSentence1: "Always drink plenty of fresh water to stay hydrated.",
    exampleSentence2: "He filled the watering can with cool water from the garden hose."
  },
  YOUTH: {
    definition: "The period between childhood and adult age; the state of being young.",
    partOfSpeech: "noun",
    exampleSentence1: "In his youth, he loved hiking through the mountain trails.",
    exampleSentence2: "The community center organized activities for local youth."
  },
  ZEBRA: {
    definition: "An African wild horse with distinctive black-and-white stripes.",
    partOfSpeech: "noun",
    exampleSentence1: "A zebra grazed quietly alongside the wildebeest on the plain.",
    exampleSentence2: "The zebra's unique stripe pattern is used for camouflage."
  },
  ABSENT: {
    definition: "Not present in a place, at an occasion, or as part of something.",
    partOfSpeech: "adjective",
    exampleSentence1: "The teacher noted that three students were absent from class today.",
    exampleSentence2: "He had a distracted and absent look on his face."
  },
  BEFORE: {
    definition: "During the period of time preceding a particular event or time.",
    partOfSpeech: "preposition",
    exampleSentence1: "Remember to complete your homework before dinner is served.",
    exampleSentence2: "She arrived at the train station fifteen minutes before departure."
  },
  CANDLE: {
    definition: "A cylinder or block of wax with a central wick which is lit to produce light.",
    partOfSpeech: "noun",
    exampleSentence1: "She lit a lavender candle to create a relaxing atmosphere.",
    exampleSentence2: "The power went out, so they lit candles in the living room."
  },
  DANGER: {
    definition: "The possibility of suffering harm, injury, or loss.",
    partOfSpeech: "noun",
    exampleSentence1: "The bright red sign warned hikers of potential danger ahead.",
    exampleSentence2: "The brave rescue team entered the area regardless of danger."
  },
  ENOUGH: {
    definition: "As much or as many as required; sufficient.",
    partOfSpeech: "determiner",
    exampleSentence1: "We have bought enough supplies to last for the weekend camping trip.",
    exampleSentence2: "He didn't sleep enough last night and felt tired all day."
  },
  FROZEN: {
    definition: "Turned into ice or another solid as a result of extreme cold.",
    partOfSpeech: "adjective",
    exampleSentence1: "The winter temperature was low enough that the pond was frozen solid.",
    exampleSentence2: "She grabbed a bag of frozen peas from the freezer."
  },
  GARDEN: {
    definition: "A piece of ground adjoining a house, used for growing flowers, fruit, or vegetables.",
    partOfSpeech: "noun",
    exampleSentence1: "They grew sweet tomatoes and green lettuce in their backyard garden.",
    exampleSentence2: "She spent the weekend planting colorful flower bulbs in the garden."
  },
  HELPER: {
    definition: "A person who helps someone else, especially by doing chores or assistance.",
    partOfSpeech: "noun",
    exampleSentence1: "The preschool teacher praised her little helper for putting away the toys.",
    exampleSentence2: "He found a job as a helper in a local woodworking shop."
  },
  INSECT: {
    definition: "A small arthropod animal that has six legs and generally one or two pairs of wings.",
    partOfSpeech: "noun",
    exampleSentence1: "An interesting green insect crawled slowly up the tree trunk.",
    exampleSentence2: "Butterflies and beetles are examples of insects found in the meadow."
  },
  JUNGLE: {
    definition: "An area of land overgrown with dense forest and tangled vegetation.",
    partOfSpeech: "noun",
    exampleSentence1: "The hikers walked cautiously through the dense tropical jungle path.",
    exampleSentence2: "Monkeys swung through the high canopy of the green jungle."
  },
  MIRROR: {
    definition: "A reflective surface, typically of glass coated with a metal amalgam.",
    partOfSpeech: "noun",
    exampleSentence1: "She adjusted her hair while looking into the wall mirror.",
    exampleSentence2: "The surface of the quiet lake was a perfect mirror for the clouds."
  },
  NEEDLE: {
    definition: "A very fine slender piece of metal with a point at one end and an eye for thread.",
    partOfSpeech: "noun",
    exampleSentence1: "She carefully threaded the needle to stitch the torn pocket.",
    exampleSentence2: "The green pine needles blanketed the forest floor."
  },
  PILLOW: {
    definition: "A rectangular cloth bag stuffed with soft materials, used to support the head.",
    partOfSpeech: "noun",
    exampleSentence1: "He rested his tired head on the soft feather pillow.",
    exampleSentence2: "She bought blue decorative pillows to match her new bedsheets."
  },
  RUBBER: {
    definition: "A tough elastic polymeric substance made from the latex of a tropical plant.",
    partOfSpeech: "noun",
    exampleSentence1: "The bouncy red playground ball was made of thick rubber.",
    exampleSentence2: "He erased the pencil mistake with the rubber on his pencil."
  },
  SILVER: {
    definition: "A precious shiny grayish-white metal valued for jewelry and coins.",
    partOfSpeech: "noun",
    exampleSentence1: "The antique dining set was made of polished sterling silver.",
    exampleSentence2: "She was proud to win the silver medal in the spelling contest."
  },
  UNIQUE: {
    definition: "Being the only one of its kind; unlike anything else.",
    partOfSpeech: "adjective",
    exampleSentence1: "Every snowflake that falls has a completely unique structure.",
    exampleSentence2: "She has a unique talent for drawing detailed historical maps."
  },
  YELLOW: {
    definition: "Of a color like that of egg yolk, ripe lemons, or gold.",
    partOfSpeech: "adjective",
    exampleSentence1: "A bright yellow school bus pulled up to the driveway.",
    exampleSentence2: "The garden was filled with yellow daffodils blooming in spring."
  },
  ANIMAL: {
    definition: "A living organism that feeds on organic matter and can respond to stimuli.",
    partOfSpeech: "noun",
    exampleSentence1: "The nature reserve is home to many species of wild animals.",
    exampleSentence2: "He is a kind person who loves caring for injured animals."
  },
  BASKET: {
    definition: "A container used to hold or carry things, typically made of woven cane or wire.",
    partOfSpeech: "noun",
    exampleSentence1: "She packed a picnic basket with fresh fruit and sandwiches.",
    exampleSentence2: "They gathered the fallen apples in a large wicker basket."
  },
  CASTLE: {
    definition: "A large medieval building fortified against attack with thick walls and towers.",
    partOfSpeech: "noun",
    exampleSentence1: "The ancient stone castle stood proudly on top of the high cliff.",
    exampleSentence2: "The tourists walked across the drawbridge to enter the castle."
  },
  DRAGON: {
    definition: "A mythical monster like a giant reptile, typically represented as blowing fire.",
    partOfSpeech: "noun",
    exampleSentence1: "The children listened to a fairy tale about a fire-breathing dragon.",
    exampleSentence2: "The kite they flew was shaped like a friendly green dragon."
  },
  ENERGY: {
    definition: "The strength and vitality required for physical or mental activity.",
    partOfSpeech: "noun",
    exampleSentence1: "Running around the playground helps children burn off extra energy.",
    exampleSentence2: "Solar power is a clean and renewable source of energy."
  },
  FINGER: {
    definition: "Each of the jointed parts attached to a hand.",
    partOfSpeech: "noun",
    exampleSentence1: "She pointed her finger toward the sign displaying the directions.",
    exampleSentence2: "He wore a silver band on his index finger."
  },
  HUNTER: {
    definition: "A person or animal that hunts game or wild animals.",
    partOfSpeech: "noun",
    exampleSentence1: "The hawk is a sharp-eyed hunter that searches for field mice.",
    exampleSentence2: "The early hunters tracked wild game through the dense snow."
  },
  ORANGE: {
    definition: "A round juicy citrus fruit with a tough bright reddish-yellow rind.",
    partOfSpeech: "noun",
    exampleSentence1: "He peeled a sweet orange to share with his little sister.",
    exampleSentence2: "The sky turned a vibrant shade of orange during the sunset."
  },
  PARROT: {
    definition: "A bird with a curved bill and brilliant plumage, known for mimicking sounds.",
    partOfSpeech: "noun",
    exampleSentence1: "The green parrot repeated the whistle of its owner perfectly.",
    exampleSentence2: "We saw many exotic parrots flying in the tropical exhibit."
  },
  RESCUE: {
    definition: "An act of saving someone or something from danger or distress.",
    partOfSpeech: "verb",
    exampleSentence1: "The brave lifeguard swam out to rescue the struggling boy.",
    exampleSentence2: "They helped rescue three puppies from the flooded street shelter."
  },
  WINTER: {
    definition: "The coldest season of the year, following autumn and preceding spring.",
    partOfSpeech: "noun",
    exampleSentence1: "The branches of the trees were bare and frosty during winter.",
    exampleSentence2: "They enjoyed skiing down the snowy slopes during their winter break."
  },
  FAMOUS: {
    definition: "Known about by many people; widely celebrated.",
    partOfSpeech: "adjective",
    exampleSentence1: "The famous author signed copies of her new book at the bookstore.",
    exampleSentence2: "This historic town is famous for its beautiful stone bridges."
  },
  GARLIC: {
    definition: "A strong-smelling bulbous herb used as flavoring in cooking.",
    partOfSpeech: "noun",
    exampleSentence1: "He minced two cloves of garlic to add to the olive oil.",
    exampleSentence2: "The aroma of roasting garlic drifted from the kitchen window."
  },
  HANDLE: {
    definition: "A part of an object designed for holding, carrying, or turning.",
    partOfSpeech: "noun",
    exampleSentence1: "She grabbed the handle of the heavy suitcase and lifted it.",
    exampleSentence2: "The handle of the ceramic mug was cool to the touch."
  },
  INVITE: {
    definition: "Request the presence or participation of someone in a polite way.",
    partOfSpeech: "verb",
    exampleSentence1: "They decided to invite all their close friends to the party.",
    exampleSentence2: "She wrote a neat card to invite her uncle to the ceremony."
  },
  JOYFUL: {
    definition: "Feeling, expressing, or causing great pleasure and happiness.",
    partOfSpeech: "adjective",
    exampleSentence1: "A joyful shout erupted from the players as they won the game.",
    exampleSentence2: "They sang joyful songs around the piano during the holidays."
  },
  KINDLY: {
    definition: "In a kind, helpful, or warm-hearted manner.",
    partOfSpeech: "adverb",
    exampleSentence1: "The librarian kindly pointed us toward the reference section.",
    exampleSentence2: "He kindly held the heavy elevator door open for the visitors."
  },
  LAUNCH: {
    definition: "Start or set in motion an activity, product, or space flight.",
    partOfSpeech: "verb",
    exampleSentence1: "The space agency will launch the new satellite into orbit tomorrow.",
    exampleSentence2: "They plan to launch their new educational app next month."
  },
  METHOD: {
    definition: "A systematic or established procedure for doing something.",
    partOfSpeech: "noun",
    exampleSentence1: "She developed an effective method for organizing her study notes.",
    exampleSentence2: "The science experiment followed a strict and repeatable method."
  },
  NARROW: {
    definition: "Of small width in proportion to length or size; restricted.",
    partOfSpeech: "adjective",
    exampleSentence1: "The hikers followed a narrow path along the mountain ridge.",
    exampleSentence2: "The old car barely squeezed through the narrow stone archway."
  },
  PUZZLE: {
    definition: "A game, toy, or problem designed to test ingenuity or knowledge.",
    partOfSpeech: "noun",
    exampleSentence1: "They spent the rainy afternoon completing a jigsaw puzzle.",
    exampleSentence2: "The cause of the sudden power outage remains a complete puzzle."
  },
  RADIUS: {
    definition: "A straight line from the center to the circumference of a circle.",
    partOfSpeech: "noun",
    exampleSentence1: "The radius of the circular table measured exactly three feet.",
    exampleSentence2: "Draw a circle with a radius of five centimeters using a compass."
  },
  SPONGE: {
    definition: "A porous substance used for washing or cleaning due to its absorbency.",
    partOfSpeech: "noun",
    exampleSentence1: "She wiped the kitchen counter clean with a damp sponge.",
    exampleSentence2: "The dry soil soaked up the rainwater like a sponge."
  },
  TRIPLE: {
    definition: "Consisting of three parts; three times as much or as many.",
    partOfSpeech: "adjective",
    exampleSentence1: "He ordered a triple scoop of mint ice cream on a waffle cone.",
    exampleSentence2: "The young gymnast performed a triple flip off the balance beam."
  },
  UNPACK: {
    definition: "Open and remove the contents of a suitcase, box, or package.",
    partOfSpeech: "verb",
    exampleSentence1: "She sat down on the bed to unpack her suitcase after the long trip.",
    exampleSentence2: "They helped unpack the heavy boxes in their new classroom."
  },
  VACUUM: {
    definition: "A space entirely empty of matter; or a suction cleaning device.",
    partOfSpeech: "noun",
    exampleSentence1: "A true vacuum contains no air molecules or solid matter.",
    exampleSentence2: "He used the vacuum cleaner to clean the dust off the living room carpet."
  },
  WALLET: {
    definition: "A flat folding case for holding paper money, cards, and pictures.",
    partOfSpeech: "noun",
    exampleSentence1: "He double-checked his pockets but couldn't find his leather wallet.",
    exampleSentence2: "She kept her student identification card inside her wallet."
  }
};

export const SENTENCE_TEMPLATES_1 = [
  "Scientists are currently studying how {word} influences our daily environment.",
  "During the debate, the speaker emphasized the importance of {word} in modern society.",
  "She spent the entire afternoon reading a research paper about {word}.",
  "He struggled to find a practical example of {word} to include in his science report.",
  "The professor wrote a detailed chapter explaining the concept of {word}.",
  "Many historians believe that {word} played a major role in early civilizations.",
  "The new policy was designed to address the growing concerns regarding {word}.",
  "An unexpected discovery of {word} led to further investigation by the team.",
  "She could easily identify the subtle characteristics of {word} in the sample.",
  "The community organizer gave a presentation on the local impact of {word}.",
  "The novel explores the philosophical relationship between human nature and {word}.",
  "Without proper coordination, managing the effects of {word} can be quite difficult.",
  "He presented a highly convincing argument concerning the future of {word}.",
  "The textbook offers a simplified diagram to illustrate how {word} works.",
  "We need to gather more empirical evidence before drawing conclusions about {word}.",
  "Her latest artwork captures the vibrant and dynamic essence of {word}.",
  "The technical documentation provides step-by-step instructions for utilizing {word}.",
  "They discussed the potential ethical implications of {word} in the seminar.",
  "A sudden shift in public opinion changed how people perceived {word}.",
  "The software update introduced a new feature designed to optimize {word}."
];

export const SENTENCE_TEMPLATES_2 = [
  "It is fascinating to observe how {word} changes under different conditions.",
  "We must pay close attention to the structural details of {word} during analysis.",
  "Her understanding of {word} helped her solve the complex riddle in no time.",
  "The team worked collaboratively to implement the new guidelines for {word}.",
  "He wrote a comprehensive review exploring the various dimensions of {word}.",
  "They hope that their research will shed new light on the mysteries of {word}.",
  "A solid understanding of {word} is essential for anyone entering this field.",
  "She took detailed notes on how {word} affects the overall performance.",
  "The exhibition displays several historical documents related to {word}.",
  "They decided to postpone the project until they could better define {word}.",
  "It took several weeks of planning to successfully integrate {word} into the system.",
  "The judge asked the contestant to use the word {word} in a sentence to clarify its meaning.",
  "He was surprised by the sudden popularity of {word} among the younger generation.",
  "The museum guide pointed out a rare painting that depicts the concept of {word}.",
  "She hopes to write a book that simplifies the complex theories surrounding {word}.",
  "Understanding the subtle differences in {word} can prevent common misunderstandings.",
  "The researchers found a clear correlation between the two variables and {word}.",
  "He gave a brief summary of the historical events that led to {word}.",
  "They are looking for innovative ways to apply the principles of {word}.",
  "With careful planning, the negative consequences of {word} can be minimized."
];

// Simple deterministic hash code to select templates stably per word
export function getDeterministicIndex(word: string, length: number): number {
  let hash = 0;
  const cleanWord = word.toUpperCase();
  for (let i = 0; i < cleanWord.length; i++) {
    hash = cleanWord.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % length;
}

// Generate unique definition matching prefix/suffix structures if possible
export function generateFallbackDefinition(word: string): { definition: string; partOfSpeech: string } {
  const lower = word.toLowerCase();
  
  if (lower.endsWith('tion') || lower.endsWith('sion')) {
    return {
      definition: `The action, process, or state of performing the act of ${lower}.`,
      partOfSpeech: "noun"
    };
  }
  if (lower.endsWith('ity') || lower.endsWith('ness')) {
    return {
      definition: `The quality, state, or degree of being characterized by the nature of ${lower}.`,
      partOfSpeech: "noun"
    };
  }
  if (lower.endsWith('er') || lower.endsWith('or') || lower.endsWith('ist')) {
    return {
      definition: `An agent, person, or device that performs or specializes in the practice of ${lower}.`,
      partOfSpeech: "noun"
    };
  }
  if (lower.endsWith('able') || lower.endsWith('ible')) {
    return {
      definition: `Capable of being, fit for, or worthy of receiving the qualities of ${lower}.`,
      partOfSpeech: "adjective"
    };
  }
  if (lower.endsWith('ology')) {
    return {
      definition: `The branch of science, knowledge, or systematic study concerning ${lower}.`,
      partOfSpeech: "noun"
    };
  }
  if (lower.endsWith('ment')) {
    return {
      definition: `The product, concrete result, or state resulting from the action of ${lower}.`,
      partOfSpeech: "noun"
    };
  }
  if (lower.endsWith('ify') || lower.endsWith('ate')) {
    return {
      definition: `To cause to become, transform, or produce the state or quality of ${lower}.`,
      partOfSpeech: "verb"
    };
  }
  if (lower.endsWith('ic') || lower.endsWith('al') || lower.endsWith('ous') || lower.endsWith('ive') || lower.endsWith('ful')) {
    return {
      definition: `Relating to, characterized by, or exhibiting the nature and qualities of ${lower}.`,
      partOfSpeech: "adjective"
    };
  }
  if (lower.endsWith('ly')) {
    return {
      definition: `In a manner characterized by or relating to the qualities of ${lower.slice(0, -2)}.`,
      partOfSpeech: "adverb"
    };
  }

  const generalDefinitions = [
    `A term denoting the essential quality, state, or characteristic associated with ${lower}.`,
    `A concept or entity representing the distinct state of being ${lower}.`,
    `Refers to the process, condition, or practical manifestation of ${lower}.`,
    `The specific attribute, function, or nature exhibited by ${lower}.`,
    `A general term used to describe the state, practice, or occurrences of ${lower}.`
  ];
  const idx = getDeterministicIndex(word, generalDefinitions.length);
  return {
    definition: generalDefinitions[idx],
    partOfSpeech: "noun"
  };
}

export interface GeneratedDetails {
  definition: string;
  partOfSpeech: string;
  exampleSentence1: string;
  exampleSentence2: string;
  situationalPrompt: string;
  formalSynonym: string;
  millennialCrossRef: string;
}

// Generate comprehensive fallback package
export function generateFallbackDetails(word: string): GeneratedDetails {
  const upper = word.toUpperCase();
  const lower = word.toLowerCase();

  // 1. Check Slang
  if (SLANG_DICT[upper]) {
    return {
      definition: SLANG_DICT[upper].definition,
      partOfSpeech: SLANG_DICT[upper].partOfSpeech,
      exampleSentence1: SLANG_DICT[upper].exampleSentence1,
      exampleSentence2: SLANG_DICT[upper].exampleSentence2,
      situationalPrompt: SLANG_DICT[upper].situationalPrompt,
      formalSynonym: SLANG_DICT[upper].formalSynonym,
      millennialCrossRef: SLANG_DICT[upper].millennialCrossRef,
    };
  }

  // 2. Check Local Dictionary
  if (LOCAL_DICTIONARY[upper]) {
    const local = LOCAL_DICTIONARY[upper];
    return {
      definition: local.definition,
      partOfSpeech: local.partOfSpeech,
      exampleSentence1: local.exampleSentence1,
      exampleSentence2: local.exampleSentence2,
      situationalPrompt: `Imagine a scenario where one refers to the concept of "${lower}". ${local.exampleSentence1}`,
      formalSynonym: `A term meaning: ${local.definition}`,
      millennialCrossRef: `Using "${lower}" in context: "${local.exampleSentence2}"`,
    };
  }

  // 3. Fallback Generation
  const { definition, partOfSpeech } = generateFallbackDefinition(word);
  
  const idx1 = getDeterministicIndex(word + "s1", SENTENCE_TEMPLATES_1.length);
  const sentence1Template = SENTENCE_TEMPLATES_1[idx1];
  const exampleSentence1 = sentence1Template.replace("{word}", lower);

  const idx2 = getDeterministicIndex(word + "s2", SENTENCE_TEMPLATES_2.length);
  const sentence2Template = SENTENCE_TEMPLATES_2[idx2];
  const exampleSentence2 = sentence2Template.replace("{word}", lower);

  return {
    definition,
    partOfSpeech,
    exampleSentence1,
    exampleSentence2,
    situationalPrompt: `Imagine a scenario where one refers to the concept of "${lower}". ${exampleSentence1}`,
    formalSynonym: `A term meaning: ${definition}`,
    millennialCrossRef: `Using "${lower}" in context: "${exampleSentence2}"`,
  };
}
