export interface Service {
  name: string;
  price: string;
  description?: string;
}

export interface ServiceGroup {
  title: string;
  note?: string;
  services: Service[];
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: "Sew Ins",
    services: [
      { name: "Traditional Sew In", price: "$260", description: "Basic sew in with leave out, choice of middle or side part." },
      { name: "Closure Sew In", price: "$290", description: "Includes bleaching of knots, customizing, install & style. 5x5 & 6x6 must be dropped off 3–5 days before service." },
      { name: "Frontal Sew In", price: "$320", description: "Option of glue or glueless. Includes bleaching knots, frontal customization, install & style. Up to 3 bundles, additional bundles $20 each. Frontal must be dropped off 3–5 days before." },
      { name: "Half Up Half Down Sew In", price: "$240", description: "Can be done with straight or curly hair. May require minimal leave out." },
      { name: "Two Part Sew In", price: "$285" },
      { name: "Flip Over Sew In", price: "$250", description: "Minimal leave out of front perimeter, can be curly or styled with curls. 3 bundles minimum required." },
      { name: "Versatile Sew In with Pin Up Bun", price: "$320", description: "Sew in able to go up into ponytail, styled with curls and fishtail braids into pin up bun." },
      { name: "Sew In Maintenance", price: "$130", description: "Includes wash and restyling for leave out sew ins ONLY." },
      { name: "Take Down & Reinstall", price: "$380", description: "Old weave removed, natural hair and bundles washed, reinstalled and styled. Closure $40 extra, frontal reinstall $75 extra." },
      { name: "Take Down, Wash & Treatment", price: "$120", description: "Includes take down, wash, steam treatment & blow dry." },
    ],
  },
  {
    title: "Wigs",
    services: [
      { name: "Wig Install with Closure", price: "$150", description: "ONLY if wig was made/provided by me. Includes braid down & install." },
      { name: "Wig Installation with Frontal", price: "$190", description: "ONLY if wig was made/provided by me." },
      { name: "Full Lace Wig Install", price: "$220", description: "Includes bleaching of knots, customizing & installing. NEW UNIT ONLY. Bring hair 3–5 days before service." },
      { name: "Bring Your Own Closure Wig Install", price: "$175", description: "For closure wigs not made by me. Must be new & dropped off 3–5 days in advance." },
      { name: "Custom Closure Unit", price: "$250", description: "50% deposit required. Your hair & closure. Includes bleaching of knots, customization and styling. Does NOT include install. Text or call to book." },
      { name: "Frontal Unit", price: "$300", description: "50% deposit required. Your hair & frontal provided by you. Does NOT include install. Text or call to book." },
      { name: "Wig Restoration", price: "$120", description: "Washed and brought back to life, tracks tightened and styled. Drop off service, pick up in 3–5 days." },
      { name: "Rush Fee", price: "$50" },
    ],
  },
  {
    title: "Pixie Cut",
    services: [
      { name: "Pixie Quick Weave (No Closure)", price: "$200", description: "Pixie glue-in with no lace closure, styled to your liking." },
      { name: "Pixie Quick Weave (Hair Included)", price: "$250", description: "Hair provided by me." },
      { name: "Pixie Cut Quick Weave with 5x5 Closure", price: "$250", description: "Hair NOT provided by me." },
      { name: "Pixie Quick Weave with Closure Package", price: "$375", description: "Hair AND 5x5 closure provided by me." },
    ],
  },
  {
    title: "Quick Weave",
    services: [
      { name: "Quick Weave", price: "$200", description: "Braid down, mold, glued tracks & style." },
    ],
  },
  {
    title: "Clip Ins Services",
    services: [
      { name: "Clip Ins Quick Weave", price: "$185", description: "Achieve a sew in look without the sew in. Hair braided down, net sewn on, clip ins attached to net. 2 sets required." },
      { name: "Claudelande Collection Clip In Package", price: "$490", description: "2 sets of 16\" clip ins body wave or straight, clip in quick weave install. Luxury clip ins equivalent to 3 full bundles." },
    ],
  },
  {
    title: "Ponytails",
    services: [
      { name: "Sleek Ponytail", price: "$130", description: "Sleek parted down the middle or high sleek pony." },
      { name: "Side Swoop Invisible Pony", price: "$140" },
      { name: "Freestyle Ponytail", price: "$150", description: "Front freestyled with stitch braids or rubber bands into high pony." },
      { name: "Frontal Ponytail", price: "$225", description: "Requires 16\" frontal, drop off 3 days before for customization. Come washed, blow dried and straightened." },
    ],
  },
  {
    title: "Natural Hair",
    services: [
      { name: "Silk Press (Fine/Medium Hair)", price: "$170", description: "Includes wash, steam treatment, pressed straight or lovely curls." },
      { name: "Silk Press (Thick/Long Hair)", price: "$180", description: "Wash, steam treatment, pressed and styled." },
      { name: "Wash & Go (Blow Dry)", price: "$55", description: "Wash, steam treatment, blow dry, and trim. Styled in bun or two braids." },
      { name: "Braid Down Only", price: "$40" },
    ],
  },
  {
    title: "Color Services for Bundles / Wigs",
    services: [
      { name: "Dark Roots", price: "$55", description: "For platinum hair ONLY. Bring hair 3 days before. 13x6 frontal extra $20." },
      { name: "Fantasy Colors", price: "$90", description: "For 613 hair only. Soft light colors & greys. Up to 2 colors." },
      { name: "Highlights", price: "$150+", description: "Starting price. Up to 3 bundles & closure/frontal. Bring hair 5–7 days before." },
      { name: "Jet Black", price: "$90", description: "Up to 3 bundles." },
      { name: "Single Process", price: "$100" },
      { name: "Double Process", price: "$140", description: "Up to 3 bundles." },
    ],
  },
  {
    title: "Color Services for Natural Hair",
    note: "All include Olaplex Treatment.",
    services: [
      { name: "Single Process Dye", price: "$290", description: "Adding a few shades lighter or darker. Includes color, treatment, cut and style. Consultation required." },
      { name: "Double Process", price: "$330", description: "Lifting followed by toner/rinse. Includes treatment, cut, color and style. Consultation required." },
      { name: "Color Block", price: "$360", description: "Front and back lifted to desired color. Includes treatment, cut and style. Consultation required." },
      { name: "Half Head Highlights", price: "$375", description: "Highlights in front with toning. Includes treatment, cut and style. Consultation required." },
      { name: "Full Head Highlights", price: "$450", description: "Full head with toning. Includes treatment, cut and style. Consultation required." },
      { name: "Root Touch Up", price: "$175", description: "Must be at least 1.5–2 inches of new growth. Includes treatment, cut and style. Consultation required." },
      { name: "Custom Color", price: "$100", description: "Single process, up to 3 bundles & closure/frontal. Color provided by me." },
      { name: "Custom Color Double Process", price: "$130", description: "Up to 3 bundles & closure/frontal. Color provided by me." },
    ],
  },
  {
    title: "Consultation",
    services: [
      { name: "Consultation", price: "$10", description: "20 minutes." },
    ],
  },
];
