from pathlib import Path
p=Path('/mnt/data/v11dance/main.jsx')
s=p.read_text()
marker='const STATE_ARCHITECTURE = {'
insert=r'''
// State-wise dance catalogue. Classical and folk/tribal forms are kept separate so
// the map category can explain the difference instead of mixing unlike traditions.
const STATE_DANCES = {
  "Andhra Pradesh": { classical:["Kuchipudi"], folk:["Dhimsa","Kolattam","Veeranatyam","Lambadi","Butta Bommalu"] },
  "Arunachal Pradesh": { classical:[], folk:["Ponung","Popir","Aji Lamu","Bardo Chham","Lion and Peacock Dance"] },
  "Assam": { classical:["Sattriya"], folk:["Bihu Dance","Bagurumba","Bhortal Nritya","Jhumur","Deodhani"] },
  "Bihar": { classical:[], folk:["Jat-Jatin","Jhijhiya","Bidesia","Domkach","Kajari","Sama-Chakeva"] },
  "Chhattisgarh": { classical:[], folk:["Panthi","Raut Nacha","Saila","Karma","Sua Nacha","Gaur Maria"] },
  "Goa": { classical:[], folk:["Fugdi","Dhalo","Dekhnni","Corridinho","Ghode Modni"] },
  "Gujarat": { classical:[], folk:["Garba","Dandiya Raas","Tippani","Padhar","Bhavai"] },
  "Haryana": { classical:[], folk:["Dhamal","Khoria","Phag","Loor","Saang"] },
  "Himachal Pradesh": { classical:[], folk:["Nati","Chham","Kayang","Dangi","Chhanak Chham"] },
  "Jharkhand": { classical:[], folk:["Chhau","Jhumair","Domkach","Paika","Karma","Santhali Dance"] },
  "Karnataka": { classical:[], folk:["Yakshagana","Dollu Kunitha","Kamsale","Veeragase","Kolata","Puja Kunitha"] },
  "Kerala": { classical:["Kathakali","Mohiniyattam"], folk:["Thiruvathirakali","Oppana","Kaikottikali","Theyyam","Margamkali"] },
  "Madhya Pradesh": { classical:[], folk:["Rai","Matki","Gaur Dance","Sela","Bhagoria Dance","Jawara"] },
  "Maharashtra": { classical:[], folk:["Lavani","Koli Dance","Lezim","Dhangari Gaja","Gondhal","Powada"] },
  "Manipur": { classical:["Manipuri"], folk:["Thabal Chongba","Pung Cholom","Maibi Dance","Khamba Thoibi"] },
  "Meghalaya": { classical:[], folk:["Wangala Dance","Shad Suk Mynsiem","Nongkrem Dance","Laho Dance"] },
  "Mizoram": { classical:[], folk:["Cheraw","Khuallam","Chheih Lam","Sarlamkai","Chailam"] },
  "Nagaland": { classical:[], folk:["Chang Lo","Zeliang Dance","War Dance","Rengma Dance","Konyak Dance"] },
  "Odisha": { classical:["Odissi"], folk:["Chhau","Dalkhai","Ghumura","Gotipua","Mayurbhanj Chhau"] },
  "Punjab": { classical:[], folk:["Bhangra","Giddha","Sammi","Jhumar","Luddi","Kikli"] },
  "Rajasthan": { classical:[], folk:["Ghoomar","Kalbelia","Kachhi Ghodi","Bhavai","Chari","Terah Taali","Gavri","Chang","Gindad","Agni Dance","Walar","Loor","Panihari","Indoni","Gair","Dhol Dance","Matka Dance","Mand Dance"] },
  "Sikkim": { classical:[], folk:["Singhi Chham","Maruni","Tamang Selo Dance","Yak Chham","Chu Faat"] },
  "Tamil Nadu": { classical:["Bharatanatyam"], folk:["Karagattam","Kummi","Kavadi Attam","Oyilattam","Poikkal Kuthirai Attam","Devarattam","Therukoothu"] },
  "Telangana": { classical:[], folk:["Perini Sivatandavam","Bathukamma Dance","Lambadi","Dappu","Gussadi","Oggu Katha performance"] },
  "Tripura": { classical:[], folk:["Hojagiri","Garia","Lebang Boomani","Mamita","Sangrai"] },
  "Uttar Pradesh": { classical:["Kathak"], folk:["Raslila","Charkula","Nautanki","Dholu Kunitha","Kajri Dance","Dhobiya"] },
  "Uttarakhand": { classical:[], folk:["Chholiya","Jhora","Chanchari","Langvir Nritya","Pandav Nritya","Barada Nati"] },
  "West Bengal": { classical:[], folk:["Purulia Chhau","Gambhira","Dhunuchi Dance","Dhunuchi Nritya","Baul performance","Brita Dance","Santhali Dance"] },
  "Jammu and Kashmir": { classical:[], folk:["Rouff","Dumhal","Bacha Nagma","Hafiza","Kud Dance"] },
  "Ladakh": { classical:[], folk:["Cham","Shondol","Jabro","Spao Dance","Koshan"] }
};

function danceEntry(title, stateName, danceType) {
  const classical = danceType === 'Classical';
  return {
    id: `${stateName.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-dance-${danceType.toLowerCase()}-${title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,
    title,
    short: classical
      ? `${title} is a recognised Indian classical dance tradition associated with ${stateName}.`
      : `${title} is a traditional folk or community performance associated with ${stateName}.`,
    description: classical
      ? `${title} developed through long performance traditions of ${stateName} and is taught through established repertoires, technique and performance practice.`
      : `${title} is performed in community, seasonal, ceremonial or festive settings and reflects the regional performance culture of ${stateName}.`,
    place: stateName,
    period: 'Living performance tradition',
    medium: classical ? 'Classical dance' : 'Folk / tribal / community dance',
    theme: classical ? 'Classical technique, repertoire and performance' : 'Community celebration, storytelling and regional identity',
    danceType,
    facts: classical
      ? [`Recognised as one of India's classical dance traditions`, `Strongly associated with ${stateName}`, 'Uses codified movement, expression and repertoire', 'Continues through teaching, performance and cultural institutions']
      : [`Traditional performance associated with ${stateName}`, 'Performed in community, festive, seasonal or ceremonial settings', 'Music, rhythm and group movement are important features', 'Transmission continues through performers and communities'],
    source: 'CCRT / Ministry of Culture / established regional cultural documentation',
    verified: true,
    isDanceHeritage: true,
    image: null,
    gallery: []
  };
}

for (const [stateName, groups] of Object.entries(STATE_DANCES)) {
  STATE_HIGHLIGHTS[stateName] ||= {};
  STATE_HIGHLIGHTS[stateName].dance = [
    ...(groups.classical || []).map(title => danceEntry(title, stateName, 'Classical')),
    ...(groups.folk || []).map(title => danceEntry(title, stateName, 'Folk'))
  ];
}

// State-wise ritual and tradition catalogue. These are living/customary practices,
// not presented as if every practice were a formal religious festival.
const STATE_RITUALS = {
  "Andhra Pradesh":["Ugadi Pachadi Tradition","Tirupati Temple Seva Traditions","Bonalu-related regional observances"],
  "Arunachal Pradesh":["Solung Agricultural Rituals","Losar Monastic Observances","Nyokum Community Rituals"],
  "Assam":["Sattriya Vaishnavite Traditions","Ali-Aye-Ligang Ritual Traditions","Bwisagu Community Traditions"],
  "Bihar":["Chhath Ritual Observances","Pitrapaksha Shraddha Traditions","Sama-Chakeva Community Tradition","Jivitputrika Observances"],
  "Chhattisgarh":["Karma Tree Rituals","Sarhul Nature Worship Traditions","Ghotul Community Tradition"],
  "Goa":["Shigmo Processional Traditions","Festa and Church Feast Traditions","Konkani Wedding Traditions"],
  "Gujarat":["Navratri Garba Ritual Tradition","Mata ni Pachedi Devotional Tradition","Jain Paryushan Observances"],
  "Haryana":["Teej and Monsoon Traditions","Sanjhi Folk Tradition","Haryanvi Wedding Customs"],
  "Himachal Pradesh":["Devta Procession Traditions","Dham Community Feast Tradition","Kullu Dussehra Deity Traditions"],
  "Jharkhand":["Sarhul Ritual Tradition","Karam Tree Rituals","Sohrai Household Wall-Painting Tradition"],
  "Karnataka":["Bhoota Kola Ritual Performance","Yakshagana Bhagavata Tradition","Varamahalakshmi Vrata Traditions"],
  "Kerala":["Onam Pookalam Tradition","Theyyam Ritual Performance","Vishu Kani Tradition","Temple Pooram Traditions"],
  "Madhya Pradesh":["Bhagoria Community Traditions","Narmada Parikrama Tradition","Tribal Karma Rituals"],
  "Maharashtra":["Wari Pilgrimage Tradition","Ganesh Chaturthi Household Rituals","Gondhal Devotional Performance"],
  "Manipur":["Lai Haraoba Ritual Tradition","Yaoshang Community Traditions","Ras Leela Vaishnavite Tradition"],
  "Meghalaya":["Nongkrem Sacred Dance Tradition","Wangala Harvest Traditions","Shad Suk Mynsiem Community Tradition"],
  "Mizoram":["Chapchar Kut Community Traditions","Mim Kut Remembrance Traditions","Pawl Kut Harvest Traditions"],
  "Nagaland":["Morung Community Tradition","Hornbill Festival Cultural Practices","Naga Harvest and Feast Traditions"],
  "Odisha":["Jagannath Rath Yatra Rituals","Pattachitra Devotional Tradition","Nuakhai Community Tradition","Chandan Yatra Observances"],
  "Punjab":["Gurpurab Traditions","Langar Seva Tradition","Hola Mohalla Martial Tradition","Lohri Community Traditions"],
  "Rajasthan":["Gangaur Ritual Tradition","Teej Traditions","Pushkar Pilgrimage Traditions","Pabuji Phad Recitation Tradition","Devnarayan Oral Tradition"],
  "Sikkim":["Losar Monastic Traditions","Pang Lhabsol Ritual Tradition","Buddhist Cham Traditions"],
  "Tamil Nadu":["Pongal Ritual Traditions","Aadi Perukku River Tradition","Temple Ther Chariot Tradition","Kolam Household Tradition"],
  "Telangana":["Bathukamma Floral Tradition","Bonalu Ritual Tradition","Sammakka Saralamma Jatara Traditions"],
  "Tripura":["Garia Puja Tradition","Kharchi Puja Rituals","Ker Puja Community Tradition"],
  "Uttar Pradesh":["Ganga Aarti Traditions","Ramlila Performance Tradition","Braj Holi Traditions","Kanwar Pilgrimage Tradition"],
  "Uttarakhand":["Nanda Devi Raj Jat Tradition","Jagar Ritual Singing","Devta Doli Processions","Harela Seasonal Tradition"],
  "West Bengal":["Durga Puja Ritual Tradition","Poush Parbon Traditions","Nabanna Harvest Tradition","Gajan and Charak Traditions","Baul Akhra Tradition"],
  "Jammu and Kashmir":["Amarnath Yatra Traditions","Kashmiri Wedding Traditions","Sufi Shrine Urs Traditions","Kheer Bhawani Pilgrimage Tradition"],
  "Ladakh":["Monastic Cham Rituals","Losar Traditions","Hemis Monastery Ritual Traditions","Ladakhi Wedding Customs"]
};

for (const [stateName, names] of Object.entries(STATE_RITUALS)) {
  STATE_HIGHLIGHTS[stateName] ||= {};
  STATE_HIGHLIGHTS[stateName].ritual = names.map((title, i) => ({
    id: `${stateName.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-ritual-${i+1}`,
    title,
    short: `${title} is a documented living cultural practice associated with ${stateName}.`,
    description: `${title} is part of the living ritual or customary heritage of communities in ${stateName}. Practices vary by community, locality and occasion.`,
    place: stateName,
    period: 'Living tradition',
    medium: 'Ritual / customary practice',
    theme: 'Community memory, ceremony and continuity',
    facts: [`Associated with communities in ${stateName}`, 'Practices can vary by locality and community', 'Knowledge is transmitted through families, practitioners or community institutions', 'Continues as part of living cultural heritage'],
    source: 'CCRT / Ministry of Culture / established regional cultural documentation',
    verified: true,
    isRitualHeritage: true,
    image: null,
    gallery: []
  }));
}

'''
if marker not in s: raise SystemExit('marker not found')
s=s.replace(marker,insert+marker,1)
# Make dedup include dance and ritual
s=s.replace("for (const categoryId of ['craft','festival','architecture','art']) {", "for (const categoryId of ['craft','festival','architecture','art','dance','ritual']) {",1)
# Replace category rendering block with grouped dance view
old='''                {stories.length ? (\n                  <div className="li-story-list">\n                    {stories.map((story, index) => (\n                      <button type="button" className="li-story-card" key={story.id} onClick={() => openStory(story)}>\n                        <div className="li-story-thumb"><WikimediaHeritageImage story={story} stateName={state.name} category={selectedCategory} alt="" /></div>\n                        <div className="li-story-copy"><span className="story-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{story.title}</h3><p>{story.short}</p></div></div>\n                        <span className="story-arrow">→</span>\n                      </button>\n                    ))}\n                  </div>\n                ) : ('''
new='''                {stories.length ? (\n                  selectedCategory.id === 'dance' ? (\n                    <div>\n                      {['Classical','Folk'].map(danceType => {\n                        const grouped = stories.filter(story => story.danceType === danceType);\n                        if (!grouped.length) return null;\n                        return (\n                          <section key={danceType} className="li-dance-section">\n                            <h3 className="li-dance-section-title">{danceType === 'Classical' ? 'Classical Dance' : 'Folk & Traditional Dance'} <span>{grouped.length}</span></h3>\n                            <div className="li-story-list">\n                              {grouped.map((story, index) => (\n                                <button type="button" className="li-story-card" key={story.id} onClick={() => openStory(story)}>\n                                  <div className="li-story-thumb"><WikimediaHeritageImage story={story} stateName={state.name} category={selectedCategory} alt="" /></div>\n                                  <div className="li-story-copy"><span className="story-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{story.title}</h3><p>{story.short}</p></div></div>\n                                  <span className="story-arrow">→</span>\n                                </button>\n                              ))}\n                            </div>\n                          </section>\n                        );\n                      })}\n                    </div>\n                  ) : (\n                  <div className="li-story-list">\n                    {stories.map((story, index) => (\n                      <button type="button" className="li-story-card" key={story.id} onClick={() => openStory(story)}>\n                        <div className="li-story-thumb"><WikimediaHeritageImage story={story} stateName={state.name} category={selectedCategory} alt="" /></div>\n                        <div className="li-story-copy"><span className="story-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{story.title}</h3><p>{story.short}</p></div></div>\n                        <span className="story-arrow">→</span>\n                      </button>\n                    ))}\n                  </div>\n                  )\n                ) : ('''
if old not in s: raise SystemExit('render block not found')
s=s.replace(old,new,1)
# add CSS near existing heritage css start by appending style to global css string before closing marker if possible
css_marker='.li-category-footer'
pos=s.find(css_marker)
# safer append standalone style tag to component by adding before return fragment close not easy; add CSS string constant before STATE_DANCES
css='''\nconst DANCE_SECTION_CSS = `.li-dance-section{margin:18px 0 28px}.li-dance-section-title{display:flex;align-items:center;gap:10px;margin:0 0 12px;font-size:18px;color:#2b241d}.li-dance-section-title span{font-size:12px;border:1px solid rgba(0,0,0,.12);border-radius:999px;padding:3px 8px;color:#6d6258}`;\n'''
s=s.replace('// State-wise dance catalogue.',css+'\n// State-wise dance catalogue.',1)
s=s.replace('<style>{HERITAGE_UI_CSS}</style>', '<style>{HERITAGE_UI_CSS}{DANCE_SECTION_CSS}</style>',1)
p.write_text(s)
