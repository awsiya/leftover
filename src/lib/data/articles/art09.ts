import { ArticleRecord } from "@/lib/types/article";

export const ARTICLE_09: ArticleRecord = {
  "id": "art-09",
  "slug": "substrate-preparation-plywood-vs-cement-board",
  "localizedSlugs": {
    "en": "substrate-preparation-plywood-vs-cement-board",
    "de": "untergrundvorbereitung-zementbauplatten-vs-sperrholz",
    "fr": "preparation-support-panneau-ciment-vs-contreplaque",
    "es": "preparacion-soporte-placas-cemento-vs-madera"
  },
  "title": "Substrate Preparation: Plywood Deflection Limits vs. Cement Backer Board and Foam Boards",
  "subtitle": "A structural engineering guide to deflection limits (L/360), hygroscopic wood movement, cementitious backer units (ANSI A118.9), and extruded polystyrene boards in tile DIY.",
  "excerpt": "Learn why tiling directly over plywood fails, how to calculate structural deflection limits, how to bed cement backer board properly, and when to use ultra-light waterproof foam boards.",
  "author": "Structural Substrates Engineering Division",
  "publishedAt": "2026-10-10T08:00:00Z",
  "updatedAt": "2026-10-18T10:00:00Z",
  "readingTimeMinutes": 9,
  "category": "Structural Substrates",
  "featuredImageUrl": "/images/articles/substrate-engineering.webp",
  "metaTitle": "Substrate Preparation Guide: Cement Board vs. Plywood",
  "metaDescription": "Master tile substrate engineering: deflection limits L/360, cement board (ANSI A118.9) installation, mortar bedding, and waterproof foam backer boards.",
  "relatedProjectSlugs": [
    "rustic-wooden-bench-tile-inlay",
    "bistro-table-tile-refresh",
    "heavy-ceramic-geometric-bookends"
  ],
  "relatedArticleSlugs": [
    "adhesive-chemistry-thinset-vs-mastic",
    "waterproofing-membranes-for-planters",
    "ceramic-vs-porcelain-vs-terracotta"
  ],
  "translations": {
    "de": {
      "title": "Untergrundvorbereitung: Sperrholz-Durchbiegung vs. Zementbauplatten und Hartschaum",
      "metaTitle": "Fliesen-Untergrund Ratgeber: Zementplatten vs. Holz",
      "metaDescription": "Durchbiegungskriterien L/360, Zementbauplatten nach ANSI A118.9, Mörtelbettung und XPS-Hartschaumplatten für Möbel und Deko.",
      "excerpt": "Erfahren Sie, warum direktes Fliesen auf Holz scheitert und wie Sie Zementbauplatten fachgerecht einbetten und verschrauben."
    },
    "fr": {
      "title": "Préparation des supports : Limites de flexion du contreplaqué vs Panneaux de ciment",
      "metaTitle": "Préparation du support carrelage : Panneau ciment vs Bois",
      "metaDescription": "Critère de flèche L/360, hygrométrie du bois, panneaux de ciment ANSI A118.9 et panneaux étanches en mousse rigide XPS.",
      "excerpt": "Découvrez les règles structurelles pour préparer un support rigide et indéformable avant la pose de carrelage sur meuble ou plateau."
    },
    "es": {
      "title": "Preparación del soporte: Flexión de madera contrachapada vs. Placas de cemento",
      "metaTitle": "Soporte para azulejos: Tableros de cemento vs Madera",
      "metaDescription": "Límites de deflexión L/360, hinchamiento higroscópico, placas de fibrocemento según ANSI A118.9 y paneles ligeros de XPS.",
      "excerpt": "Evite grietas catastróficas aprendiendo a desacoplar azulejos rígidos de soportes de madera mediante paneles de cemento y membranas."
    }
  },
  "tableOfContents": [
    {
      "id": "brittle-vs-flexible-physics",
      "title": "1. The Fundamental Mechanical Mismatch: Brittle Tile vs. Elastic Wood"
    },
    {
      "id": "l360-deflection-formula",
      "title": "2. The L/360 Deflection Standard Explained"
    },
    {
      "id": "hygroscopic-wood-swelling",
      "title": "3. Wood Hygroscopic Swelling and Moisture Expansion"
    },
    {
      "id": "cement-backer-units-ansi",
      "title": "4. Cementitious Backer Units (CBU / ANSI A118.9)"
    },
    {
      "id": "mortared-cbu-installation",
      "title": "5. The Mandatory Mortar Bed Under Cement Board"
    },
    {
      "id": "xps-foam-backer-boards",
      "title": "6. Extruded Polystyrene (XPS) Waterproof Foam Boards"
    },
    {
      "id": "seam-taping-reinforcement",
      "title": "7. Seam Taping, Fasteners, and Alkali-Resistant Mesh"
    }
  ],
  "sections": [
    {
      "id": "brittle-vs-flexible-physics",
      "title": "1. The Fundamental Mechanical Mismatch: Brittle Tile vs. Elastic Wood",
      "content": "The most common structural disaster in DIY tile crafting—whether building a tiled coffee table, an outdoor bench inlay, or a mosaic serving tray—is tiling directly onto a bare sheet of plywood, particle board, or oriented strand board (OSB).\n\nTo understand why this failure occurs with 100% certainty over time, examine the mechanical mismatch between wood and ceramic materials:\n- Modulus of Elasticity: Wood is an organic, cellular, orthotropic material with an exceptionally low modulus of elasticity. Under bending loads, wood flexes easily, distributing stress along long cellulose fibers.\n- Brittle Fracture Dynamics: Ceramic, porcelain, and stone tiles are rigid, vitreous crystalline solids with zero plastic yield. A ceramic tile cannot bend. When tensile strain across the back of the tile exceeds approximately 0.05%, the tile does not deform; it shatters.\n- Shear Bond Failure: When an elastic wood substrate flexes under a heavy stack of books or someone sitting on a bench, the rigid tile cannot follow the curvature. The thinset adhesive bed experiences massive horizontal shear stress. Because the shear bond cannot bridge the deflection, the tiles either snap down their centerlines or shear cleanly off the wood.\n- Resonance and Dynamic Vibration: In addition to static bending, wooden structures vibrate under domestic impacts—such as setting down heavy cast-iron cookware or dragging a chair across a tabletop. These rapid micro-vibrations shatter rigid cement crystal bridges if the tile is directly adhered to wood without a damping cementitious transition layer."
    },
    {
      "id": "l360-deflection-formula",
      "title": "2. The L/360 Deflection Standard Explained",
      "content": "In architectural engineering, the Tile Council of North America (TCNA) enforces the rigid **L/360 Deflection Standard** for ceramic installations, and the even stricter **L/720 Standard** for natural stone.\n\nThe formula states that under maximum concentrated live and dead design loads, structural deflection ($Delta$) across a span of length $L$ must never exceed:\n\n$$Delta_{\text{max}} = \frac{L}{360}$$\n\nFor example, on a 36-inch (914mm) wooden console table or bench top, the maximum allowable vertical sag at the mid-point under full load is:\n\n$$Delta = \frac{36\text{ inches}}{360} = 0.10\text{ inches } (2.54\text{ mm})$$\n\nIf a thin 1/2-inch plywood or MDF board sags by even 1/8 inch (3.2mm) when a person leans on the table, it has exceeded the L/360 threshold. That microscopic flex will crack grout joints within weeks. For natural stone inlays like marble or slate, the allowable deflection is halved to L/720 (0.05 inches / 1.27mm) because crystalline stone possesses virtually zero flexural tensile strength.\n\nTo satisfy L/360 in DIY furniture and tabletop projects:\n- Never use single-layer 1/2-inch plywood or flexible sheet composites.\n- Construct the base using a minimum of 3/4-inch exterior-grade plywood (CDX or marine grade) backed by closely spaced structural hardwood cross-ribs or aprons spaced no more than 16 inches on center.\n- For free-spanning benches and heavy consoles, reinforce the underside with 1.5-inch structural aprons glued and screwed along perimeter rails to resist bending moments under point loading."
    },
    {
      "id": "hygroscopic-wood-swelling",
      "title": "3. Wood Hygroscopic Swelling and Moisture Expansion",
      "content": "Beyond mechanical bending, wood poses an even more insidious physical threat: hygroscopic moisture movement. Wood is like a bundle of microscopic straws that continually absorb and desorb atmospheric water vapor.\n\nAs seasonal relative humidity changes from 20% in dry winter heating to 85% in humid summer, wood expands and contracts across its grain by up to 2.5% to 4.0% in dimension. Ceramic tiles, by contrast, possess near-zero moisture expansion (under 0.02%).\n\nWhen tiles are bonded directly to wood, this dimensional conflict creates continuous shear tension. As wood swells, it tears thinset crystals apart. Even worse, standard wood products like particle board, MDF, and interior plywood utilize urea-formaldehyde or water-soluble glues. When wet thinset mortar is spread over them, the wood absorbs water from the mortar, swells rapidly, and turns into a soft, spongy mush that completely delaminates the adhesive bed. Direct tiling to raw wood is strictly prohibited. Furthermore, tannins and natural resins leaching from uncured pine and oak can discolour polymer thinsets and contaminate the bonding plane."
    },
    {
      "id": "cement-backer-units-ansi",
      "title": "4. Cementitious Backer Units (CBU / ANSI A118.9)",
      "content": "The gold-standard substrate transition in tile architecture is the Cementitious Backer Unit (CBU), governed by ANSI A118.9. \n\nCBUs (such as HardieBacker, Durock, or WonderBoard) are non-combustible composite boards manufactured from Portland cement, graded silica aggregates, and reinforcing fiberglass mesh embedded on both faces.\n\nThe advantages of CBU for tile crafting are absolute:\n- Zero Moisture Swelling: Cement board is completely unaffected by liquid water, high humidity, or steam. It will not warp, swell, rot, soften, or disintegrate even if submerged underwater for a decade.\n- Dimensional Stability: The coefficient of thermal expansion of cement board ($10 \times 10^{-6};/\text{°C}$) matches that of ceramic and porcelain tiles almost identically, eliminating internal shear stress during temperature shifts.\n- Crystalline Bond Compatibility: When polymer-modified Portland thinset is applied to CBU, cement crystals grow directly into the cement matrix of the board, forming a true monolithic chemical and mechanical weld.\n- Cutting Discipline: Always score and snap CBU using a dedicated carbide-tipped scoring blade, or cut with low-RPM mechanical shears equipped with integrated HEPA vacuum extraction to capture airborne cement dust. Wear a P100 respirator during fabrication to avoid inhaling alkaline cement particulates."
    },
    {
      "id": "mortared-cbu-installation",
      "title": "5. The Mandatory Mortar Bed Under Cement Board",
      "content": "The single most common mistake made by DIY crafters when installing cement board over plywood furniture frames is dry screwing the board down without mortar underneath.\n\nDry screwing fails because plywood and cement boards are never perfectly flat. Microscopic undulations between the two boards create hollow voids. When someone places a heavy object or steps on the surface, the cement board flexes into the hollow gap, cracking the tiles above.\n\nThe Mandatory CBU Installation Sequence:\n1. Spread Mortar Bed: Comb a 3/16-inch or 1/4-inch bed of polymer-modified thinset mortar over the plywood base using a notched trowel.\n2. Bed the Cement Board: Immediately lay the cement board down into the wet mortar bed. The mortar is not used as an adhesive; its sole engineering purpose is to fill every microscopic air gap, providing 100% continuous, solid compression support.\n3. Fastener Pattern: Fasten the board while the mortar is wet using specialized, corrosion-resistant, alkali-resistant cement board screws conforming to ASTM C1002. Never use standard black drywall screws; the highly alkaline chemistry of wet cement corrodes drywall screws into brittle rust within months, causing heads to snap off under load. Drive screws every 6 to 8 inches in a grid across the entire face, keeping fasteners 1/2 inch from board edges. Countersink screw heads flush with the board face.\n4. Torque Control: Set your drill clutch so screws seat firmly flush without mushrooming through the fiberglass mesh, which strips holding power in the wood beneath. Ensure that screw points penetrate into underlying wooden joists or subflooring by at least 3/4 inch to achieve full pull-out tensile resistance."
    },
    {
      "id": "xps-foam-backer-boards",
      "title": "6. Extruded Polystyrene (XPS) Waterproof Foam Boards",
      "content": "While traditional cement backer board is virtually indestructible, it is extraordinarily heavy (typically 2.5 to 3.0 lbs per square foot for 1/2-inch thickness) and brittle to cut. For lightweight DIY projects—such as hanging wall mirrors, floating key hook plaques, decorative clocks, or elevated planter boxes—cement board can make the finished piece dangerously heavy.\n\nThe modern high-tech alternative is Extruded Polystyrene (XPS) Foam Backer Board (such as Schluter-KERDI-BOARD, Wedi, or GoBoard):\n- Weight Reduction: XPS boards weigh less than 0.6 lbs per square foot—an astonishing 80% weight reduction compared to cement board.\n- Closed-Cell Core: The core consists of 100% closed-cell extruded polystyrene foam that is completely impervious to water vapor and liquid water.\n- Reinforced Surface Fleece: Both faces are clad with a high-tensile cementitious mortar coating reinforced with alkali-resistant fiberglass mesh. This allows polymer-modified thinset to achieve exceptional shear bond strength.\n- Effortless Fabrication: XPS foam boards can be sliced cleanly using a standard utility knife with zero dust, zero silica hazards, and zero splintering. It is the premier choice for wall-hung tile decor.\n- Custom Framing Integration: XPS panels can be grooved and notched with simple hand rasps to house flush mounting brackets, French cleat hanging plates, and recessed picture wire hardware without cracking."
    },
    {
      "id": "seam-taping-reinforcement",
      "title": "7. Seam Taping, Fasteners, and Alkali-Resistant Mesh",
      "content": "If your tile project spans multiple substrate panels or incorporates corners, the board seams represent focal lines of tensile stress. If unreinforced, minor structural shifting will telegraph directly through the seam, cracking the overlying tiles.\n\nComplete your substrate preparation with proper joint reinforcement:\n- Alkali-Resistant Fiberglass Mesh Tape: Standard drywall joint tape is made of paper or non-treated fiberglass that dissolves under the high alkaline pH (pH 12 to 13) of wet Portland cement mortar. You must strictly use self-adhesive, alkali-resistant polymer-coated fiberglass mesh tape stamped for cement board use.\n- Bedding the Tape: Center the mesh tape over the joint seam. Apply a flat skim coat of polymer-modified thinset mortar over the tape with a 4-inch drywall knife, forcing mortar through the open mesh to encapsulate all glass fibers completely. Feather the edges flat so no raised ridge remains.\n- Fastener Seal: Dab a small spot of thinset over every countersunk screw head to prevent corrosion and seal penetrations.\n- Curing: Allow taped seams to cure for a minimum of twelve hours before setting tiles. This structural curing creates an unyielding, monolithic foundation that insulates your delicate ceramic work from structural substrate stress."
    }
  ],
  "wordCount": 1613
};
