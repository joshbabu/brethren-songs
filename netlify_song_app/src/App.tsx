import React, { useMemo, useState } from "react";
import { Search, Star, ChevronLeft, Grid3X3, BookOpen, Music2 } from "lucide-react";

type Language = "en" | "te";

type CategoryItem = { id: string; titleTe: string; titleEn: string; range: string };
type Category = { id: number; titleTe: string; titleEn: string; range: string; items: CategoryItem[] };
type Song = {
  id: number;
  sectionId: string;
  songNo: number;
  oldNo: number | string;
  categoryTe: string;
  categoryEn: string;
  titleTe: string;
  titleEn: string;
  authorTe: string;
  authorEn: string;
  lyricsTe: string[];
  lyricsEn: string[];
};

type SectionSong = { id: number; songNo: number; oldNo: number | string; titleTe: string; titleEn: string };
type AlphabetSong = { no: number; songNo: number; oldNo: number | string; letterTe: string; titleTe: string; titleEn: string; linkedSongId: number };

type CardProps = React.PropsWithChildren<{ className?: string }>;
function Card({ className = "", children }: CardProps) {
  return <div className={className}>{children}</div>;
}
function CardContent({ className = "", children }: CardProps) {
  return <div className={className}>{children}</div>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}

const TELUGU_LETTERS = [
  "అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఋ", "ౠ", "ఎ", "ఏ", "ఐ", "ఒ", "ఓ", "ఔ", "అం", "అః",
  "క", "ఖ", "గ", "ఘ", "ఙ", "చ", "ఛ", "జ", "ఝ", "ఞ", "ట", "ఠ", "డ", "ఢ", "ణ",
  "త", "థ", "ద", "ధ", "న", "ప", "ఫ", "బ", "భ", "మ", "య", "ర", "ల", "వ",
  "శ", "ష", "స", "హ", "ళ", "క్ష", "ఱ",
];

const categories: Category[] = [
  { id: 1, titleTe: "ప్రభువ దినము - ఆరాధన", titleEn: "Lord's Day - Worship", range: "1 - 191", items: [
    { id: "1-94", titleTe: "స్తుతి", titleEn: "Praise", range: "1 - 94" },
    { id: "95-116", titleTe: "ఆరాధన", titleEn: "Worship", range: "95 - 116" },
    { id: "117-177", titleTe: "సిలువ ధ్యానము", titleEn: "Meditation on the Cross", range: "117 - 177" },
    { id: "178-191", titleTe: "అర్పణలు - కానుకలు", titleEn: "Offerings", range: "178 - 191" },
  ]},
  { id: 2, titleTe: "ప్రభుభోజన యేసు క్రీస్తు", titleEn: "Lord's Supper - Jesus Christ", range: "192 - 232", items: [
    { id: "192-194", titleTe: "శరీరధారి", titleEn: "Incarnation", range: "192 - 194" },
    { id: "195-196", titleTe: "పునరుత్థానము", titleEn: "Resurrection", range: "195 - 196" },
    { id: "197-203", titleTe: "నిత్యత్వము", titleEn: "Eternality", range: "197 - 203" },
    { id: "204-216", titleTe: "జన్మత్వము", titleEn: "Birth", range: "204 - 216" },
    { id: "217-218", titleTe: "ఉపదేశములు", titleEn: "Teachings", range: "217 - 218" },
    { id: "219-232", titleTe: "యేసు నామము", titleEn: "Name of Jesus", range: "219 - 232" },
  ]},
  { id: 3, titleTe: "స్తుతి కీర్తనలు", titleEn: "Songs of Praise", range: "233 - 274", items: [
    { id: "233-261", titleTe: "కృతజ్ఞతా స్తుతి", titleEn: "Thanksgiving Praise", range: "233 - 261" },
    { id: "262-270", titleTe: "ఉదయకాల స్తుతి", titleEn: "Morning Praise", range: "262 - 270" },
    { id: "271-274", titleTe: "సాయంకాల ప్రార్థన", titleEn: "Evening Prayer", range: "271 - 274" },
  ]},
  { id: 4, titleTe: "దేవుని - యేసు ప్రేమ - కృప", titleEn: "God - Love and Grace of Jesus", range: "275 - 321", items: [
    { id: "275-316", titleTe: "ప్రేమ", titleEn: "Love", range: "275 - 316" },
    { id: "317-321", titleTe: "కృప", titleEn: "Grace", range: "317 - 321" },
  ]},
  { id: 5, titleTe: "దేవుని సదుపాయములు", titleEn: "Blessings of God", range: "322 - 408", items: [
    { id: "322-359", titleTe: "నడుపుదల", titleEn: "Guidance", range: "322 - 359" },
    { id: "360-378", titleTe: "కాపుదల", titleEn: "Protection", range: "360 - 378" },
    { id: "379-392", titleTe: "తోడు - విశ్వాస్యత", titleEn: "Support - Faithfulness", range: "379 - 392" },
    { id: "393-408", titleTe: "ఆదరణ", titleEn: "Comfort", range: "393 - 408" },
  ]},
  { id: 6, titleTe: "పరిశుద్ధ లేఖనములు", titleEn: "Holy Scriptures", range: "409 - 426", items: [] },
  { id: 7, titleTe: "ప్రార్థన", titleEn: "Prayer", range: "427 - 457", items: [] },
  { id: 8, titleTe: "క్రైస్తవ జీవితము", titleEn: "Christian Life", range: "458 - 618", items: [
    { id: "458-459", titleTe: "నూతన జన్మము", titleEn: "New Birth", range: "458 - 459" },
    { id: "460-462", titleTe: "బాప్తిస్మము", titleEn: "Baptism", range: "460 - 462" },
    { id: "463-491", titleTe: "అనుదిన జీవితము", titleEn: "Daily Life", range: "463 - 491" },
    { id: "492-506", titleTe: "పురోగతి", titleEn: "Progress", range: "492 - 506" },
    { id: "507-547", titleTe: "హెచ్చరిక", titleEn: "Warning", range: "507 - 547" },
    { id: "548-556", titleTe: "ఉజ్జీవము", titleEn: "Revival", range: "548 - 556" },
    { id: "557-576", titleTe: "సంఘము", titleEn: "Church", range: "557 - 576" },
    { id: "577-593", titleTe: "క్రైస్తవ యువ జనము", titleEn: "Christian Youth", range: "577 - 593" },
    { id: "594-603", titleTe: "క్రైస్తవ స్త్రీలు", titleEn: "Christian Women", range: "594 - 603" },
    { id: "604-618", titleTe: "సమర్పణ", titleEn: "Dedication", range: "604 - 618" },
  ]},
  { id: 9, titleTe: "సువార్త", titleEn: "Gospel", range: "619 - 803", items: [
    { id: "619-658", titleTe: "సాక్ష్యము - సేవ", titleEn: "Testimony - Service", range: "619 - 658" },
    { id: "659-722", titleTe: "సువార్త ప్రకటన", titleEn: "Gospel Proclamation", range: "659 - 722" },
    { id: "723-731", titleTe: "యౌవనస్థులకు సువార్త", titleEn: "Gospel for Youth", range: "723 - 731" },
    { id: "732-746", titleTe: "పాపి పశ్చాత్తాపము", titleEn: "Repentance of the Sinner", range: "732 - 746" },
    { id: "747-791", titleTe: "ఆగమనము - రెండవ రాకడ", titleEn: "Coming - Second Coming", range: "747 - 791" },
    { id: "792-803", titleTe: "పరలోకము", titleEn: "Heaven", range: "792 - 803" },
  ]},
  { id: 10, titleTe: "ప్రత్యేక సమయములు", titleEn: "Special Occasions", range: "804 - 853", items: [
    { id: "804-815", titleTe: "వివాహము", titleEn: "Marriage", range: "804 - 815" },
    { id: "816-828", titleTe: "క్రొత్త సంవత్సరము", titleEn: "New Year", range: "816 - 828" },
    { id: "829-837", titleTe: "మందిరము - మందిర ప్రతిష్ట", titleEn: "Temple - Dedication", range: "829 - 837" },
    { id: "838-839", titleTe: "గృహ ప్రవేశము", titleEn: "House Warming", range: "838 - 839" },
    { id: "840-853", titleTe: "మరణము - భూస్థాపనము", titleEn: "Death - Burial", range: "840 - 853" },
  ]},
];

function normalizeText(value: string): string {
  return typeof value === "string" ? value : "";
}
function normalizeLyrics(lines: string[] = []): string[] {
  return Array.isArray(lines) ? lines.map((line) => normalizeText(line)) : [];
}
function stripChorusFromTitle(title: string): string {
  const clean = normalizeText(title);
  const match = clean.match(/\s*\|\|\s*([^|]+?)\s*\|\|\s*$/);
  if (!match) return clean;
  return clean.slice(0, match.index).trim();
}
function normalizeSong(song: Song): Song {
  return {
    ...song,
    titleTe: stripChorusFromTitle(song.titleTe),
    titleEn: stripChorusFromTitle(song.titleEn),
    authorTe: normalizeText(song.authorTe),
    authorEn: normalizeText(song.authorEn),
    lyricsTe: normalizeLyrics(song.lyricsTe),
    lyricsEn: normalizeLyrics(song.lyricsEn),
  };
}
function getInitialTeluguLetter(text: string): string {
  const cleaned = normalizeText(text).trim();
  if (!cleaned) return "అ";
  if (cleaned.startsWith("క్ష")) return "క్ష";
  return cleaned[0];
}

const songs: Record<number, Song> = JSON.parse(String.raw`
{
  "1": {
    "id": 1,
    "sectionId": "1-94",
    "songNo": 1,
    "oldNo": 1,
    "categoryTe": "స్తుతి",
    "categoryEn": "Sthuthi",
    "titleTe": "పరిశుద్ధ పరిశుద్ధ - పరిశుద్ధ ప్రభువా\\nవరదూత లైననిన్‌ వర్ణింపగలరా || పరిశుద్ధ ||",
    "titleEn": "Parisudha Parisudha - Parisudha Prabhuvaa\\nVaradoota Lainanin Varnimpagalaraa || Parisudha ||",
    "authorTe": "యెషయా వీరమార్టిన్ ఆ.క్రై.",
    "authorEn": "Yeshayaa Veeramartin A. Krai.",
    "lyricsTe": [
      "1)పరిశుద్ధ జనకుడ - పరమాత్మ రూపుడ\\nనిరుపమ బలబుద్ధి నీతి ప్రభావా  || పరిశుద్ధ ||",
      "2)పరిశుద్ధ తనయుడ నరరూప ధారుడా\\nనరులను రక్షించు కరుణా సముద్రా  || పరిశుద్ధ ||",
      "3)పరిశుద్ధమగు నాత్మ వరము లిడు నాత్మ\\nపరమానంద ప్రేమ భక్తులకిడుమా  || పరిశుద్ధ ||",
      "4)జనక కుమారాత్మ లనునేక దేవా\\nఘనమహిమ చెల్లును - దనర నిత్యముగా  || పరిశుద్ధ ||"
    ],
    "lyricsEn": [
      "1)Parisudha Janakuda - Paramaatma Roopuda\\nNirupama Balabuddhi Neeti Prabhaavaa  || Parisudha ||",
      "2)Parisudha Tanayuda Nararoopa Dhaarudaa\\nNarulanu Rakshinchu Karunaa Samudraa  || Parisudha ||",
      "3)Parisudhamagu Naatma Varamu Lidu Naatma\\nParamaananda Prema Bhaktulakidumaa  || Parisudha ||",
      "4)Janaka Kumaaraatma Lanuneka Devaa\\nGhanamahima Chellunu - Danara Nityamugaa  || Parisudha ||"
    ]
  },
  "2": {
    "id": 2,
    "sectionId": "1-94",
    "songNo": 2,
    "oldNo": 2,
    "categoryTe": "స్తుతి",
    "categoryEn": "Sthuthi",
    "titleTe": "స్తుతియు మహిమ ఘనత నీకే - యుగయుగముల వరకు\\nఎంతో ...... నమ్మదగిన దేవా - ఎంతో... నమ్మదగిన దేవా",
    "titleEn": "Sthuthiyu Mahima Ghanata Neeke - Yugayugamula Varaku\\nEnto ...... Nammadagina Devaa - Ento... Nammadagina Devaa",
    "authorTe": "సీయోను గీతములు",
    "authorEn": "Seeyonu Geetamulu",
    "lyricsTe": [
      "1)మా దేవుడవై మాకిచ్చితివి ఎంతో గొప్ప శుభదినము\\nమేమందరము ఉత్సాహించి సంతోషించెదము\\nకొనియాడెదము మరువబడని మేలుల జేసెనని || స్తుతియు ||",
      "2)నీ ఒక్కడవే గొప్పదేవుడవు ఘనకార్యములు జేయుదువు\\nనీదు కృపయే నిరంతరము నిలిచి యుండునుగా\\nనిన్ను మేము ఆనందముతో ఆరాధించెదము || స్తుతియు ||",
      "3)నూతనముగ దినదినము నిలుచు నీదు వాత్సల్యతమాపై\\nఖ్యాతిగా నిలిచే నీ నామమును కీర్తించెద మెప్పుడు\\nప్రీతితో మా స్తుతులర్పించెదము దాక్షిణ్య ప్రభువా || స్తుతియు ||",
      "4)నీవే మాకు పరమ ప్రభుడవై నీ చిత్తము నెరవేర్చితివి\\nజీవము నిచ్చి నడిపించెదవు నీ ఆత్మ ద్వారా\\nసేవించెదము సమ భూమి గల ప్రదేశములో నిన్ను || స్తుతియు ||",
      "5)భరియించితివి శ్రమలు నిందలు ఓర్చితివన్ని మా కొరకు\\nమరణము గెల్చి ఓడించితివి సాతాను బలమున్‌\\nపరము నుండి మాకై వచ్చే ప్రభు యేసు జయము || స్తుతియు ||"
    ],
    "lyricsEn": [
      "1)Maa Devudavai Maakichchitivi Ento Goppa Subhadinamu\\nMemandaramu Utsaahinchi Santoshinchedamu\\nKoniyaadedamu Maruvabadani Melula Jesenani || Sthuthiyu ||",
      "2)Nee Okkadave Goppadevudavu Ghanakaaryamulu Jeyuduvu\\nNeedu Krupaye Nirantaramu Nilichi Yundunugaa\\nNinnu Memu Aanandamuto Aaraadhinchedamu || Sthuthiyu ||",
      "3)Nootanamuga Dinadinamu Niluchu Needu Vaatsalyatamaapai\\nKhyaatiga Niliche Nee Naamamunu Keertincheda Meppudu\\nPreetito Maa Stutularpinchedamu Daakshinya Prabhuvaa || Sthuthiyu ||",
      "4)Neeve Maaku Parama Prabhudavai Nee Chittamu Neraverchitivi\\nJeevamu Nichchi Nadipinchedavu Nee Aatma Dvaaraa\\nSevinchedamu Sama Bhoomi Gala Pradesamulo Ninnu || Sthuthiyu ||",
      "5)Bhariyinchitivi Sramalu Nindalu Orchitivanni Maa Koraku\\nMaranamu Gelchi Odinchitivi Saataanu Balamun\\nParamu Nundi Maakai Vachche Prabhu Yesu Jayamu || Sthuthiyu ||"
    ]
  },
  "3": {
    "id": 3,
    "sectionId": "1-94",
    "songNo": 3,
    "oldNo": 3,
    "categoryTe": "స్తుతి",
    "categoryEn": "Sthuthi",
    "titleTe": "రండి యుత్సాహించి పాడుదము - రక్షణ దుర్గము మన ప్రభువే",
    "titleEn": "Randi Yutsahinchi Paadudamu - Rakshana Durgamu Mana Prabhuve",
    "authorTe": "",
    "authorEn": "",
    "lyricsTe": [
      "1)రండి కృతాజ్ఞత స్తోత్రముతో - రారాజు సన్నిధి కేగుదము\\nసత్ప్రభు నామము కీర్తనలన్‌ - సంతోషగానము చేయుదము  || రం ||"
    ],
    "lyricsEn": [
      "1)Randi Krutaagnata Stotramuto - Raaraaju Sannidhi Kegudamu\\nSatprabhu Naamamu Keertanalan - Santoshagaanamu Cheyudamu  || Ram ||"
    ]
  },
  "4": {
    "id": 4,
    "sectionId": "1-94",
    "songNo": 4,
    "oldNo": 4,
    "categoryTe": "స్తుతి",
    "categoryEn": "Sthuthi",
    "titleTe": "అందుకొనుము నాదు వందనము - నా యేసు ప్రభువా!",
    "titleEn": "Andukonumu Naadu Vandanamu - Naa Yesu Prabhuvaa!",
    "authorTe": "",
    "authorEn": "",
    "lyricsTe": [
      "స్వీకరించుము నాదు స్తోత్రములు - స్వీకరించుము నాదు స్తోత్రము - నీదు ప్రేమను మరువజాల మహిమ వీడి మానవుడవై మరణ మొంది తిరిగి లేచితి || అందు ||"
    ],
    "lyricsEn": [
      "Sweekarinchumu Naadu Stotramulu - Sweekarinchumu Naadu Stotramu - Needu Premanu Maruvajaala Mahima Veedi Maanavudavai Marana Mondi Tirigi Lechiti || Andu ||"
    ]
  },
  "5": {
    "id": 5,
    "sectionId": "1-94",
    "songNo": 5,
    "oldNo": 5,
    "categoryTe": "స్తుతి",
    "categoryEn": "Sthuthi",
    "titleTe": "అమూల్య రక్తము ద్వారా - రక్షణ పొందిన జనులారా",
    "titleEn": "Amoolya Raktamu Dvaaraa - Rakshana Pondina Janulaaraa",
    "authorTe": "",
    "authorEn": "",
    "lyricsTe": [
      "సర్వశక్తుని ప్రజలారా పరిశుద్ధులారా పాడెదము"
    ],
    "lyricsEn": [
      "Sarvasaktuni Prajalaaraa Parisuddhulaaraa Paadedamu"
    ]
  },
  "6": {
    "id": 6,
    "sectionId": "1-94",
    "songNo": 6,
    "oldNo": 8,
    "categoryTe": "స్తుతి",
    "categoryEn": "Sthuthi",
    "titleTe": "ఎంత జాలి యేసువా - ఇంతయని వర్ణింతునా !",
    "titleEn": "Enta Jaali Yesuvaa - Intayani Varnintunaa !",
    "authorTe": "",
    "authorEn": "",
    "lyricsTe": [
      "1)హానికరుడ - హంతకుడను - కాని పనులు చేసినాడ\\nహీనమైన చావునొంది - హీనుని రక్షించితివి ! || ఎంత ||"
    ],
    "lyricsEn": [
      "1)Haanikaruda - Hantakudanu - Kaani Panulu Chesinaada\\nHeenamaina Chaavunondi - Heenuni Rakshinchitivi ! || Enta ||"
    ]
  },
  "7": {
    "id": 7,
    "sectionId": "1-94",
    "songNo": 7,
    "oldNo": 9,
    "categoryTe": "స్తుతి",
    "categoryEn": "Sthuthi",
    "titleTe": "స్తోత్రములు - స్తోత్రములు శ్రీయేసువా!",
    "titleEn": "Stotramulu - Stotramulu Sreeyesuvaa!",
    "authorTe": "",
    "authorEn": "",
    "lyricsTe": [
      "స్తోత్రములు - మా రక్షణకై స్తోత్రముల్‌"
    ],
    "lyricsEn": [
      "Stotramulu - Maa Rakshanakai Stotramul"
    ]
  },
  "8": {
    "id": 8,
    "sectionId": "1-94",
    "songNo": 8,
    "oldNo": 11,
    "categoryTe": "స్తుతి",
    "categoryEn": "Sthuthi",
    "titleTe": "నన్నెంతో ప్రేమించి స్వర్గాన్ని విడిచి భూమికి దిగినట్టి",
    "titleEn": "Nannento Preminchi Svargaanni Vidichi Bhoomiki Diginatti",
    "authorTe": "",
    "authorEn": "",
    "lyricsTe": [
      "ప్రాణనాథా నన్ను రక్షింపను - శాపాన్ని సహిస్తు కల్వరికెక్కిన జీవరాజా!"
    ],
    "lyricsEn": [
      "Praananaathaa Nannu Rakshinpanu - Saapaanni Sahistu Kalvarikekkina Jeevaraajaa!"
    ]
  },
  "9": {
    "id": 9,
    "sectionId": "1-94",
    "songNo": 9,
    "oldNo": 12,
    "categoryTe": "స్తుతి",
    "categoryEn": "Sthuthi",
    "titleTe": "నా ప్రాణమా యేసుప్రభుని - సన్నుతించుమా",
    "titleEn": "Naa Praanamaa Yesuprabhuni - Sannutinchumaa",
    "authorTe": "",
    "authorEn": "",
    "lyricsTe": [
      "ఆయన చేసిన ఉపకారములలో - దేనిని మరువకుమా"
    ],
    "lyricsEn": [
      "Aayana Chesina Upakaaramulalo - Denini Maruvakumaa"
    ]
  },
  "10": {
    "id": 10,
    "sectionId": "1-94",
    "songNo": 10,
    "oldNo": 17,
    "categoryTe": "స్తుతి",
    "categoryEn": "Sthuthi",
    "titleTe": "కృప కనికరముల - మా దేవా - కృతజ్ఞతనర్పింతు",
    "titleEn": "Krupa Kanikaramula - Maa Devaa - Krutagnaatanarpintu",
    "authorTe": "",
    "authorEn": "",
    "lyricsTe": [
      "1)యోహోవా చేసిన ఉపకారములకై ఆయన కేమి చెల్లింతును?\\nయోహోవా నామమున - ప్రార్థనజేసెదను రక్షణ పాత్రచేబూని || కృప ||"
    ],
    "lyricsEn": [
      "Yohovaa Chesina Upakaaramulakai Aayana Kemi Chellintunu?\\nYohovaa Naamamuna - Praarthanajesedanu Rakshana Paatrachebooni || Krupa ||"
    ]
  }
}
`);

const normalizedSongs = Object.fromEntries(
  Object.entries(songs).map(([key, value]) => [key, normalizeSong(value)])
) as Record<string, Song>;

const sectionSongsMap = Object.values(normalizedSongs).reduce<Record<string, SectionSong[]>>((acc, song) => {
  if (!acc[song.sectionId]) acc[song.sectionId] = [];
  acc[song.sectionId].push({ id: song.id, songNo: song.songNo, oldNo: song.oldNo, titleTe: song.titleTe, titleEn: song.titleEn });
  return acc;
}, {});
Object.values(sectionSongsMap).forEach((list) => list.sort((a, b) => a.songNo - b.songNo));

const alphabeticalSongs: AlphabetSong[] = Object.values(normalizedSongs)
  .map((song) => ({
    no: song.id,
    songNo: song.songNo,
    oldNo: song.oldNo,
    letterTe: getInitialTeluguLetter(song.titleTe),
    titleTe: song.titleTe,
    titleEn: song.titleEn,
    linkedSongId: song.id,
  }))
  .sort((a, b) => a.titleTe.localeCompare(b.titleTe, "te"));

function getSongById(id: number): Song {
  return normalizedSongs[String(id)] ?? normalizedSongs["1"];
}
function getLanguageLabel<T>(language: Language, teluguText: T, englishText: T): T {
  return language === "en" ? teluguText : englishText;
}
function getSongsForSection(sectionId?: string): SectionSong[] {
  if (!sectionId) return [];
  return sectionSongsMap[sectionId] ?? [];
}
function splitTrailingChorus(line: string): { body: string; chorus: string } {
  const cleanLine = normalizeText(line).trim();
  const match = cleanLine.match(/\s*\|\|\s*([^|]+?)\s*\|\|\s*$/);
  if (!match) return { body: cleanLine, chorus: "" };
  return { body: cleanLine.slice(0, match.index).trim(), chorus: normalizeText(match[1]).trim() };
}

function AppHeader({ language, setLanguage, title, onSearchChange, searchValue, onMenuAction, showSearch = true }: { language: Language; setLanguage: React.Dispatch<React.SetStateAction<Language>>; title: string; onSearchChange: (value: string) => void; searchValue: string; onMenuAction: (label: string) => void; showSearch?: boolean; }) {
  const tabs = ["Home", "Content Index", "Alphabetical Index"];
  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_30%),linear-gradient(135deg,#7c3aed_0%,#db2777_52%,#f97316_100%)] text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20"><Music2 className="h-5 w-5" /></div>
            <div className="min-w-0"><div className="truncate text-xl font-semibold md:text-2xl">{title}</div><div className="hidden text-xs text-white/80 md:block">A modern browser experience for Telugu Christian songs</div></div>
          </div>
          <div className="hidden gap-2 lg:flex">{tabs.map((label) => <button key={label} type="button" onClick={() => onMenuAction(label)} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20">{label}</button>)}</div>
          <button type="button" onClick={() => setLanguage(language === "en" ? "te" : "en")} className="rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-bold text-slate-800">{language === "en" ? "En" : "Te"}</button>
        </div>
        {showSearch && <div className="mt-4 rounded-[28px] bg-white/12 p-2 ring-1 ring-white/15"><Input value={searchValue} onChange={(e) => onSearchChange(e.target.value)} placeholder={language === "en" ? "Search by song no, old no, title, or keyword..." : "పాట సంఖ్య, పాత సంఖ్య, శీర్షిక లేదా పదంతో వెతకండి..."} className="w-full rounded-[22px] border-0 bg-white px-5 py-4 text-base text-slate-900 placeholder:text-slate-400" /></div>}
      </div>
    </div>
  );
}

function SectionCard({ title, range, bold = false, onClick }: { title: string; range: string; bold?: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="w-full text-left"><Card className="mb-3 overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-sm hover:shadow-md"><CardContent className="flex items-center justify-between gap-4 px-5 py-5 md:px-6 md:py-6"><div className={`pr-4 text-xl text-slate-900 md:text-2xl ${bold ? "font-bold" : "font-medium"}`}>{title}</div><div className="shrink-0 rounded-full bg-gradient-to-r from-rose-50 to-violet-50 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 md:text-base">{range}</div></CardContent></Card></button>;
}

function HomeView({ onOpen }: { onOpen: (screen: string) => void }) {
  const cards = [
    { label: "Content Index", icon: BookOpen, target: "index", description: "Browse songs by section and range" },
    { label: "Alphabetical Index", icon: Grid3X3, target: "alphabetical", description: "Find songs by Telugu starting letter" },
    { label: "Favorite Songs", icon: Star, target: "favorites", description: "Keep your most-used songs together" },
    { label: "Recently Opened", icon: Music2, target: "recent", description: "Return to songs you viewed last" },
  ];
  return <div className="mx-auto max-w-5xl px-4 py-10"><div className="mb-8 overflow-hidden rounded-[28px] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 px-6 py-7 text-white shadow-lg"><div className="text-2xl font-semibold md:text-3xl">Telugu Christian Brethren Songs</div><div className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">Read, browse, and organize songs in a clean web experience for desktop and mobile.</div></div><div className="grid gap-4 sm:grid-cols-2">{cards.map((card) => { const Icon = card.icon; return <button key={card.label} type="button" onClick={() => onOpen(card.target)} className="group rounded-2xl bg-white px-5 py-5 text-left shadow-sm ring-1 ring-slate-200 hover:shadow-md"><div className="flex items-start gap-4"><div className="rounded-xl bg-slate-100 p-3 text-slate-700 group-hover:bg-violet-50 group-hover:text-violet-700"><Icon className="h-6 w-6" /></div><div><div className="text-lg font-semibold text-slate-800">{card.label}</div><div className="mt-1 text-sm text-slate-500">{card.description}</div></div></div></button>; })}</div></div>;
}

function IndexView({ language, search, openSection }: { language: Language; search: string; openSection: (item: CategoryItem) => void }) {
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;
    return categories.map((cat) => ({ ...cat, items: cat.items.filter((item) => {
      const sectionList = getSongsForSection(item.id);
      const target = [item.titleTe, item.titleEn, item.range, cat.titleTe, cat.titleEn].join(" ").toLowerCase();
      const songMatch = sectionList.some((song) => [song.titleTe, song.titleEn, String(song.songNo), String(song.oldNo)].join(" ").toLowerCase().includes(q));
      return target.includes(q) || songMatch;
    })})).filter((cat) => [cat.titleTe, cat.titleEn, cat.range].join(" ").toLowerCase().includes(q) || cat.items.length > 0);
  }, [search]);
  return <div className="px-3 py-4"><div className="mb-4 grid grid-cols-[1fr_110px] px-5 text-lg font-bold text-slate-800"><div>Title</div><div className="text-right">From-To</div></div>{filtered.map((cat) => <div key={cat.id} className="mb-2"><SectionCard title={`${cat.id}) ${getLanguageLabel(language, cat.titleTe, cat.titleEn)}`} range={cat.range} bold onClick={() => undefined} />{cat.items.map((item) => <SectionCard key={item.id} title={getLanguageLabel(language, item.titleTe, item.titleEn)} range={item.range} onClick={() => openSection(item)} />)}</div>)}</div>;
}

function SectionSongsView({ language, selectedSection, openSong, goBack, search }: { language: Language; selectedSection: CategoryItem | null; openSong: (songId: number) => void; goBack: () => void; search: string }) {
  const songsForSection = useMemo(() => {
    const sectionList = getSongsForSection(selectedSection?.id);
    const q = search.toLowerCase().trim();
    if (!q) return sectionList;
    return sectionList.filter((song) => [song.titleTe, song.titleEn, String(song.songNo), String(song.oldNo)].join(" ").toLowerCase().includes(q));
  }, [selectedSection, search]);
  return <div className="mx-auto max-w-6xl px-2 py-3 md:px-3 md:py-5"><div className="mb-4 flex items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200"><button type="button" onClick={goBack} className="rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"><ChevronLeft className="h-5 w-5" /></button><div><div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Section</div><div className="text-xl font-semibold text-slate-800 md:text-2xl">{getLanguageLabel(language, selectedSection?.titleTe ?? "", selectedSection?.titleEn ?? "")}</div></div></div><div className="mb-3 grid grid-cols-[1fr_90px_90px] rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 md:text-base"><div>Song Title</div><div className="text-center">Song No</div><div className="text-center">Old No</div></div>{songsForSection.map((song) => <button key={song.id} type="button" onClick={() => openSong(song.id)} className="mb-3 w-full text-left"><Card className="rounded-[22px] border border-slate-200 bg-white shadow-sm hover:shadow-md"><CardContent className="grid grid-cols-[1fr_90px_90px] items-center gap-3 px-5 py-5"><div className="flex items-center gap-4 text-base text-slate-800"><div className="rounded-full bg-slate-100 p-2 text-slate-500"><Star className="h-5 w-5" /></div><div className="line-clamp-2">{getLanguageLabel(language, song.titleTe, song.titleEn)}</div></div><div className="text-center text-lg font-semibold text-slate-700">{song.songNo}</div><div className="text-center text-lg font-semibold text-slate-700">{song.oldNo}</div></CardContent></Card></button>)}{songsForSection.length === 0 && <div className="rounded-[24px] bg-white px-5 py-6 text-slate-500 shadow-sm ring-1 ring-slate-200">No songs matched your search in this section.</div>}</div>;
}

function AlphabeticalView({ language, search, setSelectedSongId, setScreen }: { language: Language; search: string; setSelectedSongId: React.Dispatch<React.SetStateAction<number>>; setScreen: React.Dispatch<React.SetStateAction<string>> }) {
  const [activeLetter, setActiveLetter] = useState("అ");
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (q) return alphabeticalSongs.filter((song) => [song.titleTe, song.titleEn, String(song.songNo), String(song.oldNo)].join(" ").toLowerCase().includes(q));
    return alphabeticalSongs.filter((song) => song.letterTe === activeLetter);
  }, [search, activeLetter]);
  return <div className="bg-[#f6efef]"><div className="overflow-x-auto border-b border-slate-200 bg-[#f3ecec]"><div className="flex min-w-max">{TELUGU_LETTERS.map((letter) => <button key={letter} type="button" onClick={() => setActiveLetter(letter)} className={`min-w-[92px] border-r border-slate-200 px-6 py-6 text-3xl ${activeLetter === letter ? "bg-[#9f4c58] text-white" : "text-slate-800"}`}>{letter}</button>)}</div></div><div className="px-2 py-3 md:px-3 md:py-4">{search.trim() && <div className="mb-3 px-5 text-sm text-slate-500">Showing matches for: <span className="font-semibold">{search}</span></div>}<div className="mb-3 grid grid-cols-[1fr_110px_110px] px-5 text-lg font-bold text-slate-800 md:text-xl"><div>Song Title</div><div className="text-center">Song No</div><div className="text-center">Old No</div></div>{filtered.map((song) => <button key={song.no} type="button" onClick={() => { setSelectedSongId(song.linkedSongId); setScreen("song"); }} className="mb-3 w-full text-left"><Card className="rounded-[26px] border border-slate-200 bg-[#f3ecec] shadow-sm hover:shadow-md"><CardContent className="grid grid-cols-[1fr_110px_110px] items-center gap-3 px-5 py-6"><div className="flex items-center gap-4 text-base"><Star className="h-7 w-7 shrink-0 text-slate-500" /><div>{getLanguageLabel(language, song.titleTe, song.titleEn)}</div></div><div className="text-center text-xl">{song.songNo}</div><div className="text-center text-xl">{song.oldNo}</div></CardContent></Card></button>)}{filtered.length === 0 && <div className="rounded-[24px] bg-white px-5 py-6 text-slate-500 shadow-sm">{search.trim() ? `No songs matched your search: ${search}` : `No songs matched your search for letter ${activeLetter}.`}</div>}</div></div>;
}

function SongView({ language, song, setLanguage, goBackToSection }: { language: Language; song: Song; setLanguage: React.Dispatch<React.SetStateAction<Language>>; goBackToSection: () => void }) {
  const lines = getLanguageLabel(language, song.lyricsTe, song.lyricsEn);
  const title = getLanguageLabel(language, song.titleTe, song.titleEn);
  const category = getLanguageLabel(language, song.categoryTe, song.categoryEn);
  const author = getLanguageLabel(language, song.authorTe, song.authorEn);
  const titleParts = splitTrailingChorus(title);
  return <div className="min-h-screen bg-[#f8f5f8] text-slate-900"><div className="sticky top-0 z-30 border-b border-white/10 bg-[linear-gradient(135deg,#be185d_0%,#7c3aed_100%)] text-white shadow-md"><div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6"><div className="flex items-center gap-4"><button type="button" aria-label="Back to section list" onClick={goBackToSection} className="rounded-full bg-white/10 p-2 hover:bg-white/20"><ChevronLeft className="h-6 w-6" /></button><div><div className="text-xs uppercase tracking-[0.18em] text-white/75">Song</div><div className="text-2xl font-semibold">{song.songNo}</div></div></div><div className="flex items-center gap-3"><button type="button" className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-slate-800" onClick={() => setLanguage(language === "en" ? "te" : "en")}>{language === "en" ? "En" : "Te"}</button><div className="rounded-full bg-white/10 p-2"><Search className="h-5 w-5" /></div></div></div></div><div className="mx-auto max-w-5xl px-4 pb-14 pt-8 md:px-6"><div className="mb-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">{category}</div><div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-start md:gap-6"><h1 className="whitespace-pre-line text-xl font-bold leading-snug text-slate-900 md:text-3xl">{titleParts.body}</h1>{titleParts.chorus ? <div className="text-right text-base font-semibold text-violet-700 md:pt-1 md:text-lg">|| {titleParts.chorus} ||</div> : null}</div></div><div className="space-y-4">{lines.map((line, i) => { const parts = splitTrailingChorus(line); return <div key={i} className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200"><div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-start md:gap-6"><p className="whitespace-pre-line text-base leading-7 text-slate-800 md:text-lg">{parts.body}</p>{parts.chorus ? <div className="text-right text-base font-semibold text-violet-700 md:pt-1 md:text-lg">|| {parts.chorus} ||</div> : null}</div></div>; })}</div>{author ? <div className="pt-6 text-right text-lg text-slate-500 md:text-xl">— {author}</div> : null}</div></div>;
}

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [screen, setScreen] = useState("home");
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState<CategoryItem | null>(categories[0].items[0] ?? null);
  const [selectedSongId, setSelectedSongId] = useState(1);
  const selectedSong = useMemo(() => getSongById(selectedSongId), [selectedSongId]);
  const pageTitle = useMemo(() => {
    if (screen === "home") return "Telugu Christian Brethren Songs";
    if (screen === "index") return getLanguageLabel(language, "విషయ సూచిక", "Content Index");
    if (screen === "sectionSongs") return getLanguageLabel(language, selectedSection?.titleTe ?? "", selectedSection?.titleEn ?? "");
    if (screen === "alphabetical") return getLanguageLabel(language, "అక్షరక్రమ సూచిక", "Alphabetical Index");
    return String(selectedSong.songNo);
  }, [screen, language, selectedSection, selectedSong]);
  const handleMenuAction = (label: string) => { setSearch(""); if (label === "Home") setScreen("home"); if (label === "Content Index") setScreen("index"); if (label === "Alphabetical Index") setScreen("alphabetical"); };
  const openSection = (item: CategoryItem) => { setSelectedSection(item); setSearch(""); setScreen("sectionSongs"); };
  const openSong = (songId: number) => { setSelectedSongId(songId); setScreen("song"); };
  return <div className="min-h-screen bg-[#f7f4f8] text-slate-900">{screen !== "song" && <AppHeader language={language} setLanguage={setLanguage} title={pageTitle} searchValue={search} onSearchChange={setSearch} onMenuAction={handleMenuAction} showSearch={screen !== "home"} />}{screen === "home" && <HomeView onOpen={setScreen} />}{screen === "index" && <IndexView language={language} search={search} openSection={openSection} />}{screen === "sectionSongs" && <SectionSongsView language={language} selectedSection={selectedSection} openSong={openSong} goBack={() => setScreen("index")} search={search} />}{screen === "alphabetical" && <AlphabeticalView language={language} search={search} setSelectedSongId={setSelectedSongId} setScreen={setScreen} />}{screen === "song" && <SongView language={language} song={selectedSong} setLanguage={setLanguage} goBackToSection={() => setScreen("sectionSongs")} />}</div>;
}
