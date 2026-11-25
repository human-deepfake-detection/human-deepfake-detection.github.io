/* All accuracy values are descriptive means transcribed from Table 3 of the paper.
 * The two training groups have different participants and different baselines.
 * Never interpret differences in post-training means alone as causal treatment effects.
 */
window.DFAT_DATA = {
  models: ["StyleGAN2", "StyleGAN3", "GRAM-HD", "SD3.5", "GPT-5"],
  accuracy: {
    general: {
      single: [[56.5,67.6,54],[65.3,72.0,55],[72.8,77.3,60],[88.0,81.2,60],[75.1,75.7,49]],
      paired: [[62.0,74.1,54],[67.5,81.6,55],[79.2,86.8,60],[92.7,93.2,60],[80.8,85.3,49]]
    },
    specific: {
      single: [[58.0,68.4,50],[65.1,79.2,51],[70.0,83.3,49],[89.4,97.4,50],[82.0,93.9,46]],
      paired: [[62.0,74.6,50],[66.5,89.2,51],[77.8,93.7,49],[97.2,98.8,50],[89.1,96.1,46]]
    }
  },
  training: [
    { id:"general", name:"General-purpose", duration:"4:56", questions:10, description:"A shared inspection routine across all five generators. Start with the overall style and background, then examine facial features and accessories." },
    { id:"stylegan2", name:"StyleGAN2", duration:"2:30", questions:5, description:"Model-specific guidance for inspecting StyleGAN2 faces, including local facial details, background consistency, and accessories." },
    { id:"stylegan3", name:"StyleGAN3", duration:"2:37", questions:5, description:"Model-specific guidance for StyleGAN3. Magnify the image to examine subtle skin texture, hair boundaries, and accessory details." },
    { id:"gram-hd", name:"GRAM-HD", duration:"2:58", questions:5, description:"Model-specific guidance for GRAM-HD, with attention to skin patterns, face–background boundaries, and accessory rendering." },
    { id:"sd35", name:"SD3.5", duration:"1:42", questions:5, description:"Model-specific guidance for Stable Diffusion 3.5, including overly smooth textures, idealized style, and simplified backgrounds." },
    { id:"gpt5", name:"GPT-5", duration:"1:27", questions:5, description:"Model-specific guidance for images generated through the GPT-5 interface, including overall idealization and overly smooth hair textures." }
  ],
  taxonomy: [
    { id:"face", name:"Face", count:7, heading:"Look closer at the face.", description:"Inspect individual features and local texture. Some patterns become visible only after magnification.", cues:[
      {name:"Abnormal skin patterns", text:"This StyleGAN3-generated face shows repeating oval or diamond-like patterns on the forehead. Magnification reveals structured skin texture that lacks natural pore structure.", images:["stylegan3-skin-full.png","stylegan3-skin-forehead.jpg"], captions:["StyleGAN3 · full image","Magnified forehead texture"], source:"StyleGAN3 study corpus (image 63); paper Appendix D"},
      {name:"Overly smooth skin", text:"Check whether skin retains plausible fine detail. An unnaturally smooth surface is one cue in the taxonomy.", images:[33], captions:["Overly smooth facial texture"], sourcePage:2},
      {name:"Hair fused with skin", text:"Follow the hairline. Strands may blend into facial skin or form implausible clumps and boundaries.", images:[29,30], captions:["Full image","Annotated hairline"], sourcePage:1},
      {name:"Overly smooth hair", text:"Inspect the hair for missing strand-level detail and unusually smooth, uniform textures.", images:[27,28], captions:["Full image","Annotated hair texture"], sourcePage:1},
      {name:"Tooth anomalies", text:"Inspect tooth number, shape, and arrangement. The taxonomy records malformed or implausible dental structures.", images:[25,26], captions:["Full image","Annotated teeth"], sourcePage:1},
      {name:"Pupil anomalies", text:"Inspect pupil shape and appearance. Look for irregular forms or inconsistencies between the eyes.", images:[34,38], captions:["Full image","Annotated eye detail"], sourcePage:2},
      {name:"Ears blending into hair", text:"Trace the ear contour. A poorly separated boundary may make the ear indistinguishable from neighboring hair.", images:[41,42], captions:["Full image","Annotated ear detail"], sourcePage:3}
    ]},
    { id:"style", name:"Style", count:1, heading:"Step back and see the whole image.", description:"Some cues concern the overall visual style of the image.", cues:[
      {name:"Overly perfect and idealized", text:"Consider whether the overall image has an excessively refined, idealized aesthetic. This global cue was frequent in the sampled SD3.5 and GPT-5 images.", images:[43,44], captions:["Idealized style · example 1","Idealized style · example 2"], sourcePage:3}
    ]},
    { id:"background", name:"Background", count:4, heading:"Look beyond the face.", description:"Examine the scene and its relationship to the subject: boundaries, detail, and lighting.", cues:[
      {name:"Unreal backgrounds", text:"Look for meaningless textures or scene elements that fail to form a coherent background.", images:[48,49], captions:["Full image","Annotated background"], sourcePage:4},
      {name:"Unnatural boundary blur", text:"Follow the face and hair boundary. Uneven blur or an implausible transition can reveal a rendering problem.", images:[45], captions:["Annotated face–background boundary"], sourcePage:3},
      {name:"Simplified backgrounds", text:"Check whether the background is unusually simplified. Read this cue together with other evidence in the image.", images:[50], captions:["Simplified background example"], sourcePage:4},
      {name:"Unnatural lighting", text:"Inspect whether the subject and scene have consistent illumination, light sources, and shadows.", images:[51], captions:["Lighting example"], sourcePage:4}
    ]},
    { id:"accessories", name:"Accessories", count:6, heading:"Inspect the little details.", description:"Jewelry, clothing, and glasses can reveal problems with shape, symmetry, and object boundaries.", cues:[
      {name:"Earring inconsistency", text:"Compare earring size, shape, and appearance on both sides. The reference material highlights inconsistent rendering.", images:[52,53,54], captions:["Full image","Annotated detail · left","Annotated detail · right"], sourcePage:4},
      {name:"Abnormal earring shapes", text:"Inspect the shape and attachment of jewelry. Small structures may be distorted or merge into the ear.", images:[57,58], captions:["Full image","Annotated earring"], sourcePage:5},
      {name:"Clothing inconsistency", text:"Compare corresponding clothing details, including collars, seams, and shoulder patterns.", images:[59,60,61], captions:["Full image","Annotated collar · left","Annotated collar · right"], sourcePage:5},
      {name:"Abnormal clothing shapes", text:"Trace seams and fabric boundaries to find implausible shapes and inconsistent structures.", images:[62,63,64], captions:["Full image","Annotated detail · left","Annotated detail · right"], sourcePage:5},
      {name:"Eyeglasses inconsistency", text:"Compare frame geometry and lens shape across both sides. Precisely structured objects can reveal local rendering errors.", images:[65,66], captions:["Full image","Annotated eyeglasses"], sourcePage:5},
      {name:"Glasses blending into skin", text:"Follow the glasses frame where it meets the face. Unclear boundaries and merging surfaces are a separate DFAT cue.", images:[69,70], captions:["Reference example 1","Reference example 2"], sourcePage:6}
    ]}
  ]
};
