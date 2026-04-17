export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  content: string;
  titleEn?: string;
  descriptionEn?: string;
  readTimeEn?: string;
  contentEn?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'hoe-schrijf-je-een-sterk-cv-in-2026',
    title: 'Hoe schrijf je een sterk CV in 2026',
    description: 'Leer welke CV-elementen écht het verschil maken bij Nederlandse werkgevers. Van ATS-optimalisatie tot de perfecte samenvatting.',
    date: '2026-03-10',
    readTime: '6 min',
    content: `
## Waarom de meeste CV's direct worden afgewezen

Wist je dat recruiters gemiddeld slechts 7 seconden naar een CV kijken voordat ze beslissen? Nog alarmerender: bij grote bedrijven screent een ATS-systeem (Applicant Tracking System) je CV zelfs voordat een mens het ziet. Als jouw CV niet de juiste keywords bevat, kom je nooit door die eerste filter.

In 2026 is een sterk CV meer dan een lijst van je ervaringen. Het is een strategisch document dat zowel algoritmes als mensen overtuigt.

## De 5 elementen van een winnend CV

### 1. Een krachtige professionele samenvatting (3-4 zinnen)

De samenvatting staat bovenaan je CV en is het eerste dat recruiters lezen. Schrijf 3-4 zinnen die direct duidelijk maken:
- Wie je bent professioneel
- Wat je beste prestaties zijn
- Wat je zoekt in je volgende stap

**Fout:** "Ik ben een gemotiveerde professional met 5 jaar ervaring."

**Goed:** "Ervaren Digital Marketing Manager met 5 jaar ervaring bij B2B-techbedrijven. Groeide organisch websiteverkeer met 180% via SEO en content marketing. Beheerde een advertentiebudget van €300K en behaalde consistent een ROAS van 4.2x."

### 2. Kwantificeer je resultaten

Vage beweringen overtuigen niet. Cijfers wel. Vervang elke vage zin door een concrete prestatie:

- ❌ "Verantwoordelijk voor klantenservice"
- ✅ "Behandelde 50+ klantvragen per dag, beoordelingsscore steeg van 7.2 naar 9.1"

- ❌ "Werkte aan marketingcampagnes"
- ✅ "Leidde campagnes die €250K omzet genereerden met een ROI van 320%"

### 3. ATS-optimalisatie: de juiste keywords

Kopieer de kernwoorden uit de vacaturetekst letterlijk naar je CV. Als de vacature "projectmanagement" vermeldt, schrijf dan exact "projectmanagement" — niet "projectleiding" of "projectcoördinatie."

Zet keywords op logische plekken:
- In je professionele samenvatting
- In je vaardigheden sectie
- Verwerkt in je werkervaring

### 4. Heldere opmaak

De beste CV-opmaak voor 2026:
- **Lettertype:** Arial, Calibri of Helvetica — geen sierletters
- **Lettergrootte:** 10-12pt voor tekst, 14-16pt voor naam
- **Kleur:** Voornamelijk zwart, één accentkleur maximaal
- **Lengte:** Maximaal 2 pagina's
- **Bestandsformaat:** PDF (nooit .doc — opmaak kan verschuiven)

### 5. Gepersonaliseerde versie per vacature

De grootste fout: hetzelfde CV insturen voor elke sollicitatie. Maak voor elke baan een aangepaste versie:
- Pas je samenvatting aan op de specifieke rol
- Zet de meest relevante ervaringen bovenaan
- Voeg de keywords uit die specifieke vacature toe

## Checklist voor je CV

Controleer voor je verstuurt:

- [ ] Professioneel e-mailadres (voornaam.achternaam@gmail.com)
- [ ] LinkedIn-profiel URL bijgevoegd
- [ ] Geen foto (in Nederland steeds gebruikelijker om weg te laten)
- [ ] Geen geboortedatum (discriminatie-risico)
- [ ] Alle databrieven kloppen
- [ ] Spelling gecontroleerd (gebruik Grammarly)
- [ ] Saved als PDF
- [ ] Keywords uit de vacature verwerkt

## Gebruik AI voor een betere match

Met tools zoals Sollicitatie Coach kun je je CV direct analyseren op een specifieke vacature. Je krijgt een match score van 0-100, precies te zien welke keywords ontbreken en concrete verbeterpunten. Het scheelt uren werk en vergroot je kans op een interview aanzienlijk.

Een sterk CV is de eerste stap. Maar het gaat erom dat het perfect aansluit op elke specifieke vacature — en dat is precies wat AI-analyse je kan geven.
    `.trim(),
    titleEn: 'How to Write a Strong CV in 2026',
    descriptionEn: 'Learn which CV elements really make the difference with employers. From ATS optimisation to the perfect summary.',
    readTimeEn: '6 min',
    contentEn: `
## Why most CVs get rejected immediately

Did you know recruiters spend an average of just 7 seconds looking at a CV before deciding? Even more alarming: at large companies, an ATS system screens your CV before a human ever sees it. If your CV doesn't contain the right keywords, you'll never get through that first filter.

In 2026, a strong CV is more than a list of your experiences. It's a strategic document that convinces both algorithms and humans.

## The 5 elements of a winning CV

### 1. A powerful professional summary (3-4 sentences)

The summary sits at the top of your CV and is the first thing recruiters read. Write 3-4 sentences that immediately make clear:
- Who you are professionally
- What your best achievements are
- What you're looking for in your next role

**Weak:** "I am a motivated professional with 5 years of experience."

**Strong:** "Experienced Digital Marketing Manager with 5 years in B2B tech companies. Grew organic website traffic by 180% through SEO and content marketing. Managed a €300K ad budget and consistently achieved a ROAS of 4.2x."

### 2. Quantify your results

Vague claims don't convince. Numbers do. Replace every vague sentence with a concrete achievement:

- ❌ "Responsible for customer service"
- ✅ "Handled 50+ customer enquiries per day, satisfaction score rose from 7.2 to 9.1"

- ❌ "Worked on marketing campaigns"
- ✅ "Led campaigns generating €250K revenue with a 320% ROI"

### 3. ATS optimisation: the right keywords

Copy the key terms from the job posting literally into your CV. If the posting says "project management", write exactly "project management" — not "project leadership" or "project coordination."

### 4. Relevant work experience first

Put your most recent and relevant experience at the top. Use bullet points, not paragraphs. Recruiters scan, they don't read.

### 5. Clean, professional layout

No colours, no photos, no graphics. Use a clean template with clear headings and plenty of white space. A PDF is standard unless stated otherwise.

## Use AI for a better match

With tools like Sollicitatie Coach you can analyse your CV directly against a specific job posting. You get a match score from 0-100, see exactly which keywords are missing, and get concrete improvement tips. It saves hours of work and significantly increases your chances of getting an interview.

A strong CV is the first step. But what matters is that it perfectly matches each specific job — and that's exactly what AI analysis gives you.
    `.trim(),
  },
  {
    slug: 'top-10-sollicitatievragen-nederland',
    title: 'Top 10 sollicitatievragen in Nederland (+ sterke antwoorden)',
    description: 'De meest gestelde sollicitatievragen bij Nederlandse bedrijven en hoe je ze beantwoordt. Met voorbeeldantwoorden die indruk maken.',
    date: '2026-03-01',
    readTime: '8 min',
    content: `
## Voorbereiding is het geheim van succesvolle sollicitaties

Onderzoek toont aan dat kandidaten die zich grondig voorbereiden op veelgestelde vragen 3x vaker een tweede gesprek krijgen. Toch verschijnt de meerderheid van de sollicitanten slecht voorbereid.

Dit zijn de 10 vragen die je bij vrijwel elk Nederlandse bedrijf kunt verwachten — met sterke antwoordstrategieën.

## De 10 meest gestelde sollicitatievragen

### 1. "Vertel eens iets over jezelf"

Dit is altijd de openingsvraag. Het is geen uitnodiging om je CV voor te lezen — het is een kans om je persoonlijke pitch te geven.

**Structuur:** Heden → Verleden → Toekomst (2-3 minuten)

**Voorbeeld:**
"Ik werk nu 3 jaar als UX Designer bij een e-commerce bedrijf, waar ik verantwoordelijk ben voor de checkout-flow en app-ervaring. Daarvoor studeerde ik Communicatie & Multimedia Design in Eindhoven. Mijn passie ligt bij het oplossen van complexe gebruikersproblemen met simpele, doordachte oplossingen — en ik zoek nu een rol waar ik die aanpak op grotere schaal kan toepassen."

### 2. "Wat zijn je sterke punten?"

Noem 2-3 sterke punten die direct relevant zijn voor de functie. Onderbouw elk punt met een concreet voorbeeld.

**Fout:** "Ik ben een harde werker en leergierig."

**Goed:** "Mijn sterkste punt is data-gedreven besluitvorming. Bij mijn vorige werkgever analyseerde ik klantdata wekelijks en gebruikte die inzichten om de conversie met 28% te verhogen binnen 6 maanden."

### 3. "Wat zijn je zwakke punten?"

Noem een echte zwakte (geen verborgen kracht als "ik werk te hard"), maar koppel er direct aan hoe je eraan werkt.

**Voorbeeld:**
"Ik vond het aanvankelijk lastig om nee te zeggen tegen collega's die om hulp vroegen. Dit had invloed op mijn eigen planning. Ik heb dit aangepakt door mijn taken te beginnen te prioriteren met tijdblokken, en eerlijk te communiceren over mijn capaciteit. Het is beter geworden, maar ik blijf er bewust aan werken."

### 4. "Waarom wil je bij ons werken?"

Laat zien dat je onderzoek hebt gedaan. Noem specifieke dingen over het bedrijf — niet de website-boilerplate.

**Voorbereiding:** Lees recente persbericht, bekijk LinkedIn-posts van het team, zoek naar recente nieuwtjes.

**Voorbeeld:**
"Ik volg jullie al twee jaar. Wat mij aanspreekt is hoe jullie marketing team de move naar community-led growth hebben gemaakt — dat zie ik in jullie contentstrategie en de groei van de Discord-community. Ik wil bijdragen aan die aanpak op een bedrijf dat echt gelooft in organische groei."

### 5. "Waar zie je jezelf over 5 jaar?"

Wees ambitieus maar realistisch. Laat zien dat je bij dit bedrijf wilt groeien.

**Voorbeeld:**
"Over 5 jaar wil ik doorgegroeid zijn naar een senior of lead rol waarbij ik ook junior teamleden kan begeleiden. Ik zie jullie bedrijf als de perfecte plek om die stap te maken — jullie groeien snel en er zijn duidelijke doorgroeimogelijkheden."

### 6. "Vertel over een situatie waar iets misging en wat je deed"

Gebruik de STAR-methode: Situatie → Taak → Actie → Resultaat.

**Voorbeeld:**
"Tijdens een productlancering ontdekten we 2 dagen van tevoren een kritieke bug. [Situatie] Ik was verantwoordelijk voor de launch-communicatie. [Taak] Ik stelde direct voor om de lancering 1 week te vertragen en communiceerde dit transparant naar klanten met een persoonlijk bericht. [Actie] We kregen positieve reacties op de eerlijkheid en de uiteindelijke lancering was vlekkeloos — klanten waardeerden de communicatie. [Resultaat]"

### 7. "Hoe ga je om met werkdruk en stress?"

Geef concrete strategieën, geen algemeenheden.

**Voorbeeld:**
"Ik werk met wekelijkse sprintplanning en prioriteer taken met de Eisenhower-matrix. Als deadlines ophopen, communiceer ik proactief met mijn manager over wat realistisch haalbaar is. Ik heb geleerd dat vroeg communiceren veel beter is dan later uitleggen waarom iets niet lukte."

### 8. "Wat is je gewenste salaris?"

Onderzoek het marktconforme salaris voor je rol, regio en ervaringsniveau via LinkedIn Salary, Glassdoor of Intermediair.

**Strategie:** Geef een bandbreedte die iets hoger begint dan je minimum. "Ik denk aan €55.000 tot €62.000 bruto per jaar, afhankelijk van het totale pakket."

### 9. "Heb je vragen voor ons?"

**Altijd** vragen stellen. Geen vragen stellen wekt de indruk dat je niet geïnteresseerd bent.

Goede vragen:
- "Hoe ziet een gemiddelde week eruit in deze rol?"
- "Wat zijn de grootste uitdagingen voor de persoon in deze positie?"
- "Wat maakt jullie team uniek vergeleken met andere teams in het bedrijf?"
- "Hoe wordt succes gemeten in deze rol na 90 dagen?"

### 10. "Waarom verlaat je je huidige baan?"

Wees eerlijk maar positief. Spreek nooit negatief over je huidige werkgever.

**Voorbeeld:**
"Ik heb drie mooie jaren gehad bij mijn huidige bedrijf en veel geleerd. Ik merk dat ik toe ben aan een nieuwe uitdaging — ik wil mijn expertise verder uitbouwen in een omgeving die iets groter en internationaler is. Jullie positie past perfect bij die volgende stap."

## Gebruik de interview prep tool

Met de Interview Prep functie van Sollicitatie Coach kun je voor elke specifieke functie gepersonaliseerde vragen genereren — inclusief suggesties voor sterke antwoorden. Zo ga je altijd goed voorbereid het gesprek in.
    `.trim(),
    titleEn: 'Top 10 Interview Questions and How to Answer Them',
    descriptionEn: 'Prepare for the questions that come up in almost every job interview — with strong example answers you can adapt.',
    readTimeEn: '8 min',
    contentEn: `
## Why preparation makes all the difference

Most candidates walk into interviews unprepared. They give vague, generic answers. You can stand out simply by preparing 10 common questions — and structuring your answers well.

Use the STAR method: **Situation** → **Task** → **Action** → **Result**.

## The 10 most common interview questions

### 1. "Tell me about yourself"

This is not an invitation to give your life story. Give a 90-second pitch: who you are professionally, your most important achievement, and why you're here.

**Example:**
"I'm a software engineer with 5 years of experience in fintech. Most recently I led a team that rebuilt our payment infrastructure — we reduced downtime by 80% and processed over 2 million transactions daily. I'm looking for a role where I can take on more product responsibility alongside the technical side."

### 2. "What is your greatest weakness?"

Be honest, but choose something you've actively worked on. Don't say "I'm a perfectionist."

**Example:**
"I used to find it difficult to delegate. I wanted to do everything myself to ensure quality. I've learned to trust colleagues and give clear briefs — which actually led to better results and a better team dynamic."

### 3. "Why do you want to leave your current job?"

Stay positive. Never criticise your current employer.

**Example:**
"I've had three great years at my current company and learned a lot. I feel ready for a new challenge — I want to build my expertise further in a slightly larger and more international environment. This role is exactly that next step."

### 4. "Why do you want to work here?"

Show that you've done your research. Mention specific things about the company — not generic website copy.

**Preparation:** Read recent press releases, check the team's LinkedIn posts, look for recent news.

**Example:**
"I've been following you for two years. What appeals to me is how your marketing team has made the move to community-led growth — I see it in your content strategy and the growth of your Discord community. I want to contribute to that approach at a company that genuinely believes in organic growth."

### 5. "Where do you see yourself in 5 years?"

Be ambitious but realistic. Show that you want to grow within this company.

**Example:**
"I want to develop into a senior role where I'm leading a team and helping shape the product direction. I see a clear path for that here, given the growth trajectory you're on."

### 6. "Tell me about a time you had a conflict at work"

Use STAR. Show that you resolved it constructively.

**Example:**
"A colleague and I disagreed on the technical approach for a project. I asked for a one-on-one to understand their perspective. We mapped out the pros and cons together and ultimately combined both approaches — which turned out to be the best solution."

### 7. "What motivates you?"

Be specific and genuine. Connect it to the role.

**Example:**
"I get energy from solving complex problems and seeing the impact. When a feature I built gets used by thousands of people — that's what drives me."

### 8. "What is your biggest achievement?"

Prepare a specific, quantified example that's relevant to the role.

### 9. "How do you handle pressure?"

Give a concrete example of a high-pressure situation and how you handled it.

### 10. "Do you have any questions for us?"

Always have questions ready. Ask about team culture, growth opportunities, or the biggest challenge in the role.

## Prepare with AI

With Sollicitatie Coach's Interview Prep feature you can generate personalised questions for any specific role — including suggestions for strong answers. So you always walk into the interview well prepared.
    `.trim(),
  },
  {
    slug: 'sneller-aangenomen-worden',
    title: 'Zo word je sneller aangenomen: 7 bewezen strategieën',
    description: 'Verklein de tijd van sollicitatie tot jobaanbieding met deze 7 strategieën die écht werken op de Nederlandse arbeidsmarkt.',
    date: '2026-02-15',
    readTime: '5 min',
    content: `
## De gemiddelde sollicitatieprocedure duurt 23 dagen

Dat is lang als je snel een nieuwe baan nodig hebt. Maar er zijn concrete dingen die je kunt doen om dit proces te versnellen én je kansen aanzienlijk te vergroten.

## Strategie 1: Kwantiteit + kwaliteit tegelijk

De meeste mensen kiezen: óf veel sollicitaties insturen (kwantiteit), óf elke sollicitatie grondig personaliseren (kwaliteit). De winnende strategie combineert beide.

Gebruik AI-tools om je CV en motivatiebrief snel te personaliseren voor elke vacature. Wat vroeger 2 uur per sollicitatie kostte, kost nu 15 minuten. Zo kun je 5-7 kwalitatieve sollicitaties per dag versturen in plaats van 1-2.

## Strategie 2: Reageer binnen 24 uur

Vacatures die minder dan 48 uur online staan, hebben de hoogste conversieratio. Zodra je een interessante vacature ziet:
- Lees de volledige beschrijving
- Pas je CV aan (5 minuten met AI)
- Schrijf een gepersonaliseerde motivatiebrief (10 minuten met AI)
- Stuur dezelfde dag in

Bedrijven die snel reageren op sollicitaties, waarderen ook kandidaten die snel reageren.

## Strategie 3: Warm netwerk boven koud netwerk

80% van de vacatures wordt via netwerk ingevuld. Dat betekent dat de meeste goede banen nooit online komen. Activeer je netwerk:

1. **LinkedIn optimaliseren:** Zet je profiel op "Open to Work" (zichtbaar alleen voor recruiters, niet je baas)
2. **Reconnect met oud-collega's:** Een kort berichtje: "Hé, we werkten samen bij X. Ik oriënteer me nu op nieuwe kansen — ken jij toevallig iemand bij [bedrijf]?"
3. **Informatie-interviews:** Vraag om een 20-minuten gesprek met iemand die werkt bij een bedrijf dat je interesseert. Geen formele sollicitatie, gewoon kennis opdoen.

## Strategie 4: Personaliseer je LinkedIn-profiel

Veel recruiters bereiken kandidaten direct via LinkedIn. Zorg dat jouw profiel sterk is:
- **Headline:** Niet alleen je functietitel, maar ook je waarde. "Marketing Manager | Groeide B2B-omzet 3x | SEO & Paid | Open to opportunities"
- **About sectie:** 3 alinea's over wie je bent, wat je doet en wat je zoekt
- **Featured sectie:** Zet je beste werk, resultaten of publicaties hier
- **Skills:** Voeg alle relevante skills toe en vraag collega's om endorsements

## Strategie 5: Follow-up na 5-7 werkdagen

De meeste kandidaten horen niets na het insturen van hun sollicitatie en wachten passief. Onderscheid jezelf met een professionele follow-up e-mail:

"Beste [naam], Ik stuurde vorige week een sollicitatie in voor de positie [functie]. Ik wil graag benadrukken dat ik erg enthousiast ben over deze kans — met name vanwege [specifiek aspect]. Als er aanvullende informatie handig is voor uw selectie, hoor ik dat graag."

Dit werkt. Recruiters waarderen initiatief.

## Strategie 6: Bereid je voor op elk type gesprek

Er zijn drie veelvoorkomende gespreksformaten. Weet hoe je je op elk voorbereidt:

**Telefonische screening (15-30 min):** Voorbereiding minimaal. Zorg dat je je CV en de vacature naast je hebt. Beantwoord "vertel eens over jezelf" en "waarom dit bedrijf?" soepel.

**Videogesprek (45-60 min):** Test je camera, microfoon en achtergrond van tevoren. Kleed je professioneel. Oogcontact = kijk in de camera, niet het scherm.

**Technisch gesprek / case study:** Vraag vooraf of er een voorbereiding verwacht wordt. Oefen hardop denken. Het proces telt net zo zwaar als het antwoord.

## Strategie 7: Gebruik data om je aanpak te verbeteren

Houd bij welke sollicitaties responsiviteit genereren en welke niet:
- Welk type vacature reageert het meest?
- Welke versie van je motivatiebrief werkt beter?
- Bij welke bedrijven word je gebeld?

Met de applicatietracker van Sollicitatie Coach kun je al je sollicitaties op één plek bijhouden. Zo zie je patronen en optimaliseer je je aanpak continu.

## Tot slot: consistentie wint

Solliciteren is een tijdelijk fulltime project. Blokkeer elke ochtend 2 uur specifiek voor sollicitatieactiviteiten. Na 2-3 weken volhouden zie je de eerste resultaten — gesprekken, aanbiedingen en een nieuwe baan.
    `.trim(),
    titleEn: 'Get Hired Faster: 7 Proven Strategies',
    descriptionEn: 'Reduce the time from application to job offer with these 7 strategies that actually work.',
    readTimeEn: '5 min',
    contentEn: `
## The average hiring process takes 23 days

That's a long time when you need a new job quickly. But there are concrete things you can do to speed up the process and significantly increase your chances.

## 7 strategies that actually work

### 1. Tailor every application

Generic applications get generic results. For every job you apply for, adjust your CV and cover letter to match the specific role. This takes 15 extra minutes but doubles your response rate.

The most effective approach: analyse the job posting, identify the 5 most important keywords, and make sure they appear in your CV and cover letter.

### 2. Apply within the first 24 hours

Candidates who apply within 24 hours of a posting going live are significantly more likely to get an interview. Set up job alerts on LinkedIn and Indeed so you never miss an opportunity.

### 3. Use your network

More than 70% of jobs are filled through networks — many without ever being posted. Tell people you're looking. Be specific: "I'm looking for a marketing manager role at a tech company."

### 4. Follow up after applying

Three days after applying, send a short follow-up email. Most candidates don't do this — so you immediately stand out.

**Template:** "Hi [name], I applied for [role] on [date]. I wanted to confirm my strong interest and am happy to answer any questions."

### 5. Prepare for interviews

The difference between candidates who get offers and those who don't is almost always preparation. Research the company, prepare STAR-method answers, and have concrete examples ready.

### 6. Optimise your LinkedIn profile

Recruiters search LinkedIn actively. Make sure your headline is specific, your summary is compelling, and you have recent recommendations. Turn on "Open to Work."

### 7. Track every application

Use a tracker to record company, role, date applied, status and next steps. Patterns become visible: which roles get responses? Which don't? Use this to optimise your approach continuously.

## Track everything in one place

With Sollicitatie Coach's application tracker you can keep all your applications in one place — so you spot patterns and keep improving your approach.
    `.trim(),
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}
