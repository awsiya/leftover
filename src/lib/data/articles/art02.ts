import { ArticleRecord } from "@/lib/types/article";

export const ARTICLE_02: ArticleRecord = {
  "id": "art-02",
  "slug": "ceramic-vs-porcelain-vs-terracotta",
  "localizedSlugs": {
    "en": "ceramic-vs-porcelain-vs-terracotta",
    "de": "keramik-vs-feinsteinzeug-vs-terrakotta-wasseraufnahme",
    "fr": "ceramique-gres-cerame-terre-cuite-absorption-eau",
    "es": "ceramica-porcelanico-terracota-absorcion-agua"
  },
  "title": "Ceramic vs. Porcelain vs. Terracotta: Water Absorption, Vitrification Ratings, and Substrate Compatibility",
  "subtitle": "A materials science deep dive into clay mineralogy, firing vitrification curves, ASTM C373 porosity thresholds, and adhesive chemistry for upcycling surplus tiles.",
  "excerpt": "Understand how kiln temperatures, feldspathic fluxing, and water absorption rates govern freeze-thaw durability, thermal shock resistance, and thinset bonding in home DIY tile projects.",
  "author": "Ceramic Materials Research Group",
  "publishedAt": "2026-09-18T08:00:00Z",
  "updatedAt": "2026-10-18T10:00:00Z",
  "readingTimeMinutes": 9,
  "category": "Material Science",
  "featuredImageUrl": "/images/articles/clay-science.webp",
  "metaTitle": "Ceramic vs. Porcelain vs. Terracotta: Water Absorption & Density Guide",
  "metaDescription": "Detailed engineering comparison of ceramic, porcelain, and terracotta tiles: ASTM C373 water absorption, vitrification, frost resistance, and adhesive bonding.",
  "relatedProjectSlugs": [
    "terracotta-garden-stepping-stones",
    "terracotta-window-herb-planter",
    "mediterranean-mosaic-trivet"
  ],
  "relatedArticleSlugs": [
    "adhesive-chemistry-thinset-vs-mastic",
    "outdoor-tile-weatherproofing-freeze-thaw",
    "how-to-seal-porous-tile-and-grout"
  ],
  "translations": {
    "de": {
      "title": "Keramik, Feinsteinzeug und Terrakotta: Wasseraufnahme, Verglasung und Eignung",
      "metaTitle": "Keramik vs. Feinsteinzeug vs. Terrakotta: Materialkunde für Heimwerker",
      "metaDescription": "Materialwissenschaftlicher Vergleich: Brenntemperatur, Porosität nach ASTM C373, Frostbeständigkeit und Kleberhaftung bei Restfliesen.",
      "excerpt": "Verstehen Sie die Unterschiede zwischen Steingut, Steinzeug und Terrakotta für eine fachgerechte Wiederverwendung im Innen- und Außenbereich."
    },
    "fr": {
      "title": "Céramique, grès cérame et terre cuite : Absorption d'eau, vitrification et compatibilité",
      "metaTitle": "Faïence vs Grès Cérame vs Terre Cuite : Guide technique des matériaux",
      "metaDescription": "Analyse des propriétés des argiles, taux d'absorption d'eau ASTM C373, résistance au gel et compatibilité des mortiers-colles.",
      "excerpt": "Analysez les caractéristiques des terres cuites et grès cérame pour réussir vos projets de recyclage sans risque d'éclatement ou décollement."
    },
    "es": {
      "title": "Cerámica vs. Porcelánico vs. Terracota: Absorción de agua y compatibilidad",
      "metaTitle": "Cerámica, Porcelánico y Terracota: Clasificación y absorción de agua",
      "metaDescription": "Comparativa técnica: mineralogía, vitrificación, absorción según ASTM C373, resistencia a heladas y selección del mortero adhesivo.",
      "excerpt": "Aprenda a clasificar sus azulejos sobrantes según su porosidad y resistencia al hielo para elegir el adhesivo y soporte estructural idóneos."
    }
  },
  "tableOfContents": [
    {
      "id": "mineral-clay-basics",
      "title": "1. Mineralogical Composition: Clays, Feldspars, and Silicates"
    },
    {
      "id": "vitrification-thermodynamics",
      "title": "2. The Thermodynamics of Kiln Vitrification"
    },
    {
      "id": "astm-porosity-classes",
      "title": "3. ASTM C373 Water Absorption Classifications"
    },
    {
      "id": "frost-spalling-mechanics",
      "title": "4. Freeze-Thaw Spalling Mechanics in Outdoor Settings"
    },
    {
      "id": "glaze-chemistry-pei",
      "title": "5. Surface Glaze Chemistry and PEI Wear Ratings"
    },
    {
      "id": "adhesive-shear-strengths",
      "title": "6. Adhesive Bond Chemistry: Mastic vs. Polymer-Modified Thinset"
    },
    {
      "id": "diy-selection-matrix",
      "title": "7. Architectural Project Selection and Fabrication Matrix"
    }
  ],
  "sections": [
    {
      "id": "mineral-clay-basics",
      "title": "1. Mineralogical Composition: Clays, Feldspars, and Silicates",
      "content": "To successfully upcycle leftover tile remnants into permanent household artifacts, you must look past surface color and examine the raw mineral chemistry of the fired body (the bisque). Architectural tiles fall into three broad compositional families: earthenware (traditional ceramics), stoneware and porcelain, and terracotta.\n\nTraditional ceramic wall tiles originate from hydrous aluminum silicates—primarily kaolinite (Al2Si2O5(OH)4) and secondary ball clays—mixed with calcium carbonate (limestone or chalk) and quartz sand. The calcium carbonate acts as a fluxing and stabilizing agent that controls thermal expansion, allowing the bisque to match the expansion curve of low-temperature glazes. This mineral mixture remains relatively open-grained and porous after firing, resulting in a lightweight, easily cut tile with modest structural load tolerance.\n\nTerracotta represents one of humanity's oldest clay formulations, composed of iron-rich sedimentary earthenware clays found in river basins. The intense red-orange hue of unglazed terracotta derives from oxidized iron compounds (ferric oxide, Fe2O3). Terracotta contains minimal fluxes and higher concentrations of coarse organic silt, producing a body with large capillary pores, high vapor permeability, and exceptional warmth, but minimal intrinsic resistance to freeze-thaw weathering unless sealed.\n\nPorcelain, by contrast, represents an engineered ceramic summit. The raw porcelain formulation—frequently termed the triaxial blend—consists of roughly 50% high-purity kaolin clay, 25% quartz silica, and 25% feldspathic minerals (orthoclase or albite). The feldspars serve as active fluxing agents that melt during firing into a viscous liquid glass phase. This molten glass flows through capillary voids between quartz crystals, dissolving edges and fusing the entire mineral matrix into a monolithic, vitreous structure of extraordinary density and hardness."
    },
    {
      "id": "vitrification-thermodynamics",
      "title": "2. The Thermodynamics of Kiln Vitrification",
      "content": "The ultimate physical performance of any tile is dictated by its time-temperature firing profile within the kiln. As raw pressed clay tiles journey through modern roller-hearth kilns, they undergo irreversible thermodynamic phase changes.\n\nBetween 100°C and 200°C, mechanical pore water evaporates. At 450°C to 600°C, dehydroxylation occurs as chemically bound hydroxyl groups (OH-) are expelled from the kaolinite crystal lattice, transforming the clay into amorphous metakaolin. Up to 900°C, traditional terracotta completes its firing cycle; carbonaceous matter burns off and sintering begins, but the mineral grains merely fuse at their contact points without widespread melting. Capillary channels remain interconnected and open.\n\nCeramic wall tiles continue firing to approximately 1050°C to 1150°C. Sintering accelerates and calcite fluxes react with alumina and silica to form anorthite and gehlenite crystalline phases. These newly formed crystals stabilize the dimension of the bisque, but the microstructure still retains microscopic interconnected pores.\n\nPorcelain tiles are pushed far past this threshold, reaching peak temperatures between 1200°C and 1300°C under prolonged soaking cycles. At these extreme thermal levels, feldspathic fluxes melt completely into a liquid silicate phase. Simultaneously, metakaolin breaks down and recrystallizes as primary and secondary mullite (3Al2O3·2SiO2)—needle-like microscopic crystals that interlock like structural reinforcing rebar within the vitreous liquid matrix. As the kiln cools, the molten silicate solidifies into an amorphous glass that fills every interstitial void. The resulting porcelain body is thoroughly vitrified, non-porous, and mechanically impervious."
    },
    {
      "id": "astm-porosity-classes",
      "title": "3. ASTM C373 Water Absorption Classifications",
      "content": "In architectural engineering, the definitive metric separating tile types is water absorption rate, standardized under ASTM C373 and international standard ISO 10545-3. The test protocol involves drying tile specimens to constant mass, boiling them in distilled water for five hours, soaking them for an additional twenty-four hours, and measuring the percentage mass gain:\n\nPercent Water Absorption = [(Saturated Mass - Dry Mass) / Dry Mass] x 100\n\nASTM standards divide tiles into four rigorous performance categories:\n\n1. Non-Vitreous (Absorption > 7.0%): Typically ranging from 7% to 18%. This class includes virtually all glazed ceramic interior wall tiles and unglazed indoor terracotta. These tiles absorb water rapidly through capillary suction. They must strictly be reserved for interior dry or semi-dry wall applications.\n2. Semi-Vitreous (Absorption 3.0% to 7.0%): Common among moderately dense glazed ceramic floor tiles and commercial quarry pavers. They offer improved compressive strength and moderate moisture resistance suitable for residential floors and light-duty indoor furniture inlays.\n3. Vitreous (Absorption 0.5% to 3.0%): High-density floor tiles and heavy quarry stones. They withstand moisture, foot traffic, and moderate environmental stress without structural softening.\n4. Impervious Porcelain (Absorption <= 0.5%): Fired to near-total vitrification. Water absorption is virtually undetectable. These tiles are completely frost-proof, chemically inert, stain-resistant, and suitable for continuous exterior water immersion, heavy commercial traffic, and severe thermal cycling.\n\nWhen planning an upcycled tile project, determining whether your leftover tile is non-vitreous or impervious porcelain determines whether your finished piece can survive outdoors or whether it must remain in a climate-controlled interior."
    },
    {
      "id": "frost-spalling-mechanics",
      "title": "4. Freeze-Thaw Spalling Mechanics in Outdoor Settings",
      "content": "The primary cause of catastrophic failure in outdoor tile projects is freeze-thaw spalling. Understanding the physics of this failure prevents ruined garden stepping stones, cracked outdoor planters, and shattered patio tabletops.\n\nWater possesses a unique physical anomaly: when it freezes from liquid into crystalline ice at 0°C, its volume expands by approximately 9.05%. If water enters the open capillary pores of a non-vitreous ceramic tile or unsealed terracotta, it becomes trapped within microscopic voids. When temperatures drop below freezing, ice crystals form at the surface, sealing the capillary exits. As freezing proceeds inward, the expanding ice exerts enormous hydraulic pressure—often exceeding 2,000 atmospheres (200 MPa)—against the brittle clay pore walls.\n\nBecause fired clay has modest tensile strength (typically 10 to 30 MPa), the internal hydraulic pressure exceeds the cohesive strength of the ceramic matrix. Micro-fissures propagate rapidly, leading to spalling: the decorative glaze shears off in flakes, the tile delaminates along laminar planes, and the entire body crumbles into loose silt during spring thaws.\n\nOnly impervious porcelain tiles (water absorption under 0.5%) are immune to internal freeze-thaw destruction because their closed-pore vitreous structure contains no continuous capillary pathways for liquid water to enter. If your leftover tiles are ceramic or terracotta, they must never be deployed in exterior freeze-thaw regions unless 100% encapsulated and shielded from moisture ingress."
    },
    {
      "id": "glaze-chemistry-pei",
      "title": "5. Surface Glaze Chemistry and PEI Wear Ratings",
      "content": "While the clay bisque provides structural bulk, the surface glaze governs abrasion resistance, stain vulnerability, and visual aesthetics. Glazes are specially formulated vitreous glasses composed of silica formers, alumina stabilizers, alkaline fluxes, and metallic oxide colorants melted directly onto the clay body during a single firing (monocottura) or secondary firing (bicottura).\n\nThe Porcelain Enamel Institute (PEI) classifies glazed tiles into five distinct abrasion resistance categories under ASTM C1027:\n- PEI 1 (Very Light): Wall tiles and decorative accents only. Glaze scratches easily under minimal abrasive contact. Zero foot traffic.\n- PEI 2 (Light Traffic): Residential bathroom walls and light-duty vanity counters where soft footwear is worn.\n- PEI 3 (Medium Traffic): Residential living rooms, hallways, and kitchen countertops subject to normal footwear and everyday domestic wear.\n- PEI 4 (Heavy Traffic): Entrances, commercial corridors, restaurants, and active home kitchens where gritty dirt is tracked in.\n- PEI 5 (Extra Heavy / Commercial): Airports, shopping malls, and industrial transit zones capable of withstanding intense abrasive wear.\n\nFor DIY craft projects such as serving trays, kitchen hot trivets, and cheese boards, utilizing tiles with a PEI rating of at least PEI 3 ensures that knife blades, metal pots, and abrasive cups will not etch, scratch, or dull the decorative surface glaze over decades of domestic use."
    },
    {
      "id": "adhesive-shear-strengths",
      "title": "6. Adhesive Bond Chemistry: Mastic vs. Polymer-Modified Thinset",
      "content": "The structural density of your tile directly dictates which adhesive can form a permanent chemical and mechanical bond. The most common DIY failure occurs when crafters attempt to install dense impervious porcelain using organic premixed tile mastic (Type 1 mastic).\n\nType 1 mastic is an organic polyvinyl acetate or acrylic emulsion that cures purely through ambient evaporation of its water vehicle. Non-vitreous ceramic tiles have an open porous bisque that readily absorbs moisture from mastic, facilitating cure. However, when mastic is applied beneath an impervious porcelain tile (absorption < 0.5%) over a non-porous substrate, water cannot escape. The center of the adhesive bed remains permanently wet and gummy, resulting in complete bond failure under light shear loads.\n\nDense porcelain requires polymer-modified thinset mortar conforming to ANSI A118.4 or ANSI A118.15. Modified thinsets are Portland cement formulations enriched with redispersible dry polymers (typically ethylene-vinyl acetate or acrylic copolymers). Portland cement cures via hydraulic chemical hydration—it does not dry; it crystallizes through chemical reaction with water. The polymers create microscopic elastomeric bridges that penetrate the ultra-fine surface micro-texture of vitrified porcelain, developing shear bond strengths exceeding 400 psi (2.8 MPa).\n\nFor porous terracotta tiles, polymer-modified thinsets are equally essential, but care must be taken: the thirsty bisque of dry terracotta can rapidly suck water out of fresh mortar, starving the cement of the hydration moisture it needs to cure. Terracotta tiles should be lightly misted with clean water or treated with an open-pore primer before bedding."
    },
    {
      "id": "diy-selection-matrix",
      "title": "7. Architectural Project Selection and Fabrication Matrix",
      "content": "Armed with a rigorous understanding of vitrification, absorption, and bonding mechanics, you can match your leftover tile inventory to ideal DIY projects:\n\n- Glazed Ceramic Wall Tiles (Non-Vitreous, Absorption 7-18%): Soft, easily scored with manual snap cutters. Perfect for decorative framed wall mirrors, mosaic picture frames, vertical coat hook plaques, and interior wall hangings. Never use for outdoor planters, shower floors, or heavy cutting boards.\n- Unglazed Terracotta Remnants (Absorption 8-15%): Warm, earthy, highly porous. Ideal for Mediterranean herb planter boxes, rustic window sill trays, and indoor plant saucers. Must be treated with a penetrating fluoropolymer sealer to prevent moisture discoloration and mineral salt blooming.\n- Vitrified Porcelain Offcuts (Impervious, Absorption < 0.5%): Rock-hard (Mohs hardness 7-8), heavy, completely frost-proof. The elite choice for heavy-duty kitchen trivets, hot Dutch oven rests, outdoor garden stepping stones, patio tabletop inlays, and birdbath basins. Must be cut with continuous-rim diamond wet blades and bonded exclusively with ANSI A118.4 polymer-modified thinset or two-part epoxy mortar.\n- Natural Slate and Granite Fragments: Highly dense natural minerals with variable cleavage planes. Excellent for cheese boards, rustic bookends, and fireplace surrounds. Require diamond abrasive edge profiling and water-repellent food-safe mineral sealing.\n\nBy respecting the materials science of each clay body, you ensure that your handcrafted upcycling projects achieve commercial-grade durability, structural integrity, and generational longevity."
    }
  ],
  "wordCount": 1743
};
