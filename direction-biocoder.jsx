// Direction — "Bio-Coder" (Torrington Scholars Institute traineeship + application)
// Ported from the Claude Design canvas "Bio-Coder Banded.dc.html". Same brand system as
// direction-lumen.jsx, with its own forest-dark panels and a teal→cyan gradient variant.

// ---- tiny CSS-string -> style-object helper (keeps the ported markup close to source) ----
function cs(str) {
  const out = {};
  if (!str) return out;
  str.split(';').forEach((rule) => {
    const i = rule.indexOf(':');
    if (i === -1) return;
    const k = rule.slice(0, i).trim();
    const v = rule.slice(i + 1).trim();
    if (!k || !v) return;
    const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = v;
  });
  return out;
}

// ---- Bio-Coder palette (extends the main site's tokens) ----
const BC_BLUE = '#3DA8C8';
const BC_TEAL = '#5BAE9D';
const BC_CYAN = '#44BEDB';
const BC_GRAD = `linear-gradient(135deg,${BC_TEAL} 0%,${BC_CYAN} 100%)`;
const BC_INK = '#0f1a24';
const BC_INK2 = '#2a3a4a';
const BC_DIM = '#6b7c8c';
const BC_LINE = 'rgba(15,26,36,0.08)';
const BC_PAPER = '#ffffff';
const BC_PAPER2 = '#f6f9fb';
const BC_FOREST = '#0d201e'; // dark panel background used for hero/pathway/footer

const INTAKE_MONTH = 'November'; // e.g. 'January 2027' — blank falls back to a generic label

// Contact form endpoint — sign up at https://formspree.io, create a form for applications,
// and replace YOUR_FORM_ID below with the ID from its endpoint URL.
const BIOCODER_FORM_ENDPOINT = 'https://formspree.io/f/mvkoejek';

const t = (arr) => arr.map((x) => ({ text: x }));

// ---- Curriculum data (verbatim from the design) ----
const BRIDGE = [
  { code: 'B1', title: 'Scope and Evolution of Research and Diagnostic Bioinformatics',
    blurb: 'How the field developed, how research and diagnostic bioinformatics differ, and where AI is taking both.',
    topics: [
      { group: 'The development of the field', items: t(['Origins of computational biology', 'The Human Genome Project', 'Emergence of high-throughput sequencing']) },
      { group: 'Research vs diagnostic bioinformatics', items: t(['Clinical genomics and precision medicine']) },
      { group: 'AI-assisted bioinformatics and large language models', items: t(['Biological foundation models and general-purpose large language models', 'Using AI in bioinformatics: literature review, code generation, debugging and documentation', 'Professional limits: hallucination, non-reproducibility, and verification as a professional discipline']) }
    ] },
  { code: 'B2', title: 'Fundamentals of Molecular Biology, Genetics and Genomics',
    blurb: 'The vocabulary the rest of the pathway rests on. A variant misclassified here stays misclassified no matter how good the code downstream is.',
    topics: [
      { group: 'Core molecular concepts', items: t(['Central dogma in the genomic era', 'Genome, transcriptome, proteome and multi-omics', 'Reference genomes']) },
      { group: 'Genetic variation', items: t(['SNVs, CNVs, fusions and structural variants', 'Germline vs somatic variants', 'Polymorphisms vs pathogenic mutations', 'Five-tier classification of variants']) },
      { group: 'Population genetics', items: t(['Minor allele frequency (MAF) and frequency calculation', 'Linkage disequilibrium and conceptual Hardy–Weinberg equilibrium', 'Haplotypes, tag SNPs and imputation', 'GWAS overview']) },
      { group: 'Clinical interpretation principles', items: t(['Pathogenicity spectrum', 'ACMG framework', 'Variant annotation and prioritisation']) }
    ] },
  { code: 'B3', title: 'Biological Databases and Genome Resources',
    blurb: 'How to find and read the major resources everyone cites — and how to identify the provenance of an annotation before you trust it.',
    topics: [
      { group: 'NCBI ecosystem', items: t(['GenBank, RefSeq, dbSNP, dbVar, ClinVar, PubMed']) },
      { group: 'Genome browsers', items: t(['UCSC Genome Browser, Ensembl, IGV']) },
      { group: 'Variation databases', items: t(['Population frequency databases', 'Disease-associated repositories']) },
      { group: 'Computational methods in these resources', items: t(['Predicted protein structure resources alongside experimentally determined structures', 'Machine-learning-derived annotations and predictor scores']) }
    ] },
  { code: 'B4', title: 'Sequence Alignment and Similarity Analysis',
    blurb: 'Similarity is not homology. What alignment scores actually mean, and where learned representations complement classical alignment.',
    topics: [
      { group: 'Conceptual foundations', items: t(['Sequence similarity vs homology', 'Global vs local alignment', 'Scoring systems and substitution matrices', 'Gap penalties and alignment interpretation']) },
      { group: 'BLAST', items: t(['Algorithmic logic', 'E-value interpretation', 'Alignment statistics', 'Biological inference from similarity']) },
      { group: 'Beyond substitution matrices', items: t(['Learned sequence representations as a successor to matrix-based similarity search', 'Where embedding-based search complements, and where it does not replace, classical alignment']) }
    ] },
  { code: 'B5', title: 'Phylogenetics and Evolutionary Interpretation',
    blurb: 'Reading a tree properly: what the topology claims, what the branch lengths claim, and what neither of them claims.',
    topics: [
      { group: 'Principles', items: t(['Molecular evolution principles', 'Multiple sequence alignment (conceptual overview)', 'Phylogenetic tree structure and interpretation', 'Distance-based vs character-based methods']) }
    ] },
  { code: 'B6', title: 'In-Silico Molecular Assay Design, Validation and Synthetic Biology',
    blurb: 'Designing and checking assays before anyone touches a bench — primers, chromatograms, vectors, and regulatory parts as designable components.',
    topics: [
      { group: 'Primer design and validation', items: t(['Thermodynamics (Tm, GC content)', 'Secondary structure considerations', 'Primer3 and Primer-BLAST', 'Specificity analysis', 'In-silico PCR', 'Primer drop-out due to polymorphisms']) },
      { group: 'Sanger chromatogram interpretation', items: t(['Heterozygous peak detection', 'Troubleshooting artefacts', 'Forward–reverse consensus building']) },
      { group: 'Restriction mapping and vector design', items: t(['Plasmid architecture', 'Restriction site identification', 'Virtual cloning simulations']) },
      { group: 'Construct and genetic circuit design', items: t(['Regulatory elements as designable parts: promoters, ribosome binding sites, coding sequences, terminators', 'Genetic circuits', 'Worked examples in concept', 'Design as an in-silico discipline, and why prediction is harder in biology than in engineered systems']) },
      { group: 'AI and computational assistance in assay design', items: t(['Machine-learning-based primer, specificity and off-target prediction', 'Sequence-to-expression prediction tools for regulatory elements', 'Where predicted behaviour must still be confirmed experimentally']) }
    ] },
  { code: 'B7', title: 'Introduction to NGS and Genomic Data Formats and using Galaxy',
    blurb: 'What comes off a sequencer, in what shape, and how to judge whether it is fit to use.',
    topics: [
      { group: 'Overview of next-generation sequencing', items: t(['Transition from Sanger to NGS', 'Short-read vs long-read concepts', 'Depth and coverage', 'From raw reads to variant identification']) },
      { group: 'Core genomic data formats', items: t(['FASTA, FASTQ, BAM, VCF — what each represents biologically and how they relate within a sequencing workflow']) },
      { group: 'Quality assessment and filtering (conceptual)', items: t(['Phred quality scores', 'Read quality and mapping quality', 'Depth of coverage', 'Principles of variant filtering']) },
      { group: 'Computational methods in sequencing workflows', items: t(['Machine-learning basecalling and its effect on data quality', 'Learning-based variant callers alongside conventional statistical callers']) },
      { group: 'Introduction to Galaxy', items: t(['Web-based bioinformatics environment', 'Overview of commonly used tools', 'Pipeline execution in Galaxy']) }
    ] },
  { code: 'B8', title: 'Data Ethics and Genomic Responsibility',
    blurb: 'Human genomic data is not ordinary data. What that obliges you to do.',
    topics: [
      { group: 'Responsibilities', items: t(['Sensitivity of human genomic data', 'Public vs controlled-access repositories', 'Privacy and consent', 'Responsible data use in clinical and research settings']) }
    ] }
];

const T1 = [
  { code: '01', title: 'The Linux Environment and Scientific Computing', meta: 'Weeks 1–2',
    blurb: 'Establish the computational mindset required for high-throughput biological data analysis.',
    topics: [
      { group: 'Topics', items: t(['The power of Linux: why Unix-based systems are the global standard for scientific computing', 'Working on headless servers: navigating systems without a graphical interface', 'Industrial project organisation: the Linux filesystem and professional strategies for complex research directories', 'Remote connectivity (SSH): securely connecting to and operating on remote training servers', 'Data security and permissions: file ownership, permissions and protocols for safe deletion in a shared environment', 'Verifying data integrity: MD5 checksums to confirm genomic data remains uncorrupted in transfer and storage']) }
    ] },
  { code: '02', title: 'Genomic Data Architecture and Quality Control', meta: 'Weeks 2–3',
    blurb: 'Navigate, manipulate and validate the core files that drive modern genomics.',
    topics: [
      { group: 'Topics', items: t(['Genomic file anatomy: the structure and logic of FASTQ, SAM/BAM, VCF and FASTA', 'Command-line data extraction: grep, awk and sed against large datasets', 'Compression and storage strategies: Gzip, Bgzip and indexing for efficient storage and rapid access', 'The QC protocol: base qualities, adapter contamination and library complexity']) }
    ] },
  { code: '03', title: 'Software Environments and Reproducible Computing', meta: 'Weeks 4–5',
    blurb: 'Build stable, conflict-free software environments so that an analysis runs the same way every time.',
    topics: [
      { group: 'Topics', items: t(['The dependency challenge: why software breaks, and protocols for conflicting library versions', 'Conda and Mamba environments: creating isolated virtual environments', 'Introduction to containers (Docker and BioContainers) as the industrial packaging standard', 'Building reproducible bioinformatics workflows', 'Log file interpretation and troubleshooting: reading technical logs to fix pipeline failures']) }
    ] },
  { code: '04', title: 'Python and Bash for automation', meta: 'Weeks 5–6',
    blurb: 'Move from manual command execution to automated pipeline development using Bash and Python.',
    topics: [
      { group: 'Topics', items: t(['Automation with Bash scripting: processing multiple samples in a single run', 'Python for bio-data: scripting, parsing genomic files, manipulating data tables (filtering VCF or CSV)', 'Executing simplified pipelines: a start-to-finish analysis from raw data to QC report', 'Version control with Git: tracking changes and collaborating without losing work']) }
    ],
    deliverable: 'A version-controlled GitHub repository of clean, documented code — the portfolio artefact assessed at 20% of the applied stream.' }
];

const T2 = [
  { code: '05', title: 'NGS Technology and Library Architecture', meta: 'Week 7',
    blurb: 'How sequencing chemistry, library preparation and experimental design determine the properties of a dataset.',
    topics: [ { group: 'Topics', items: t(['Sequencing chemistries: short-read (second-generation) and long-read (third-generation) platforms', 'Library preparation and indexing: adapters and molecular barcodes, sample identification and compatibility', 'Multiplexing strategies: pooling samples to reduce per-sample cost', 'Experimental design: depth of coverage, biological replicates and avoiding batch effects', 'Platform selection: matching sequencing technology to research question and budget']) } ] },
  { code: '06', title: 'Germline Variant Calling', meta: 'Weeks 7–8',
    blurb: 'Raw reads to a filtered, annotated VCF and beyond',
    topics: [ { group: 'Topics', items: t(['The DNA analysis roadmap: standard workflows for WGS, WES and targeted panels', 'Sequencing quality metrics: reading alignment and coverage metrics to confirm data reliability', 'Pipeline automation: automated workflows rather than running each step manually', 'GATK best-practice analysis on server and cloud infrastructure', 'Separating real variants from artefacts: hard filtering, VQSR and the limits of each']) } ] },
  { code: '07', title: 'Somatic Variant Calling and Precision Oncology', meta: 'Weeks 8–9',
    blurb: 'Why somatic calling is not germline calling with different flags, and how clinical annotation actually works.',
    topics: [ { group: 'Topics', items: t(['Tumour biology for the analyst: clonality, tumour purity, ploidy', 'Tumour-normal and tumour-only workflows: matched and unmatched designs, panel of normals', 'Somatic callers in practice: running and comparing established callers', 'Copy number and structural variants in tumours', 'Clinical annotation: COSMIC, OncoKB, CIViC and the AMP/ASCO/CAP tier system', 'Tumour mutational burden and signature analysis — concepts, calculation and pitfalls']) } ] },
  { code: '08', title: 'Transcriptomics and Statistical Interpretation in R', meta: 'Week 10',
    blurb: 'From raw reads to an interpreted, defensible differential expression result with journal-ready figures.',
    topics: [ { group: 'Topics', items: t(['RNA-seq workflows: from raw reads to transcript quantification', 'Differential gene expression with R/Bioconductor', 'Statistical validation: p-values, fold changes and false discovery rate at scale', 'Publication-ready visualisation: volcano plots, heatmaps and PCA plots in R']) } ] },
  { code: '09', title: 'Applied Metagenomics and Pathogen Genomics', meta: 'Week 11',
    blurb: 'Profiling complex microbial communities, and tracking viral evolution and outbreaks.',
    topics: [ { group: 'Topics', items: t(['Microbial taxonomic profiling of environmental and clinical samples', 'Functional metagenomics: assessing the metabolic potential of a microbiome', 'Viral metagenomics and pathogen surveillance: identifying viral sequences and lineage assignment', 'Phylogenetic analysis: building trees to track mutations and transmission patterns']) } ] },
  { code: '10', title: 'Workflow Orchestration and Containerised Pipelines', meta: 'Week 12',
    blurb: 'Where Bash stops scaling, and what replaces it in production.',
    topics: [ { group: 'Topics', items: t(['Why workflow managers exist: the limits of Bash scripting at scale', 'Nextflow and Snakemake: processes, channels, rules and dependency resolution', 'Configuration and portability: execution profiles for local, server and cloud back-ends', 'Containerised execution: Docker and Singularity/Apptainer integration', 'Using and adapting nf-core pipelines', 'Resumability, logging and pipeline failure recovery']) } ],
    deliverable: 'A containerised workflow-manager pipeline (Nextflow or Snakemake) that executes reproducibly on a server — the pipeline build assignment, 35% of the tier.' }
];

const T3 = [
  { code: '11', title: 'Research Methodology and Benchmarking Studies', meta: 'Phase 1',
    blurb: 'Specialisation and methodological rigour. You choose a mentored track here; the five track specifications follow below.',
    topics: [
      { group: 'Topics', items: t(['Systematic literature review: formal frameworks for identifying knowledge gaps and synthesising research', 'Bioinformatics benchmarking: objectively comparing tools (for example DeepVariant vs GATK) on accuracy, sensitivity and computational cost', 'Validation with gold-standard data: curated sets such as Genome in a Bottle (GIAB) to test pipeline reliability and precision']) },
      { group: 'How the tracks work', items: t(['Each track specification describes the typical shape of a project, not a fixed syllabus', 'In the first weeks you and your mentor agree a project definition — research question, data, methods in scope, deliverable, and what completion looks like', 'If you bring your own research question or dataset, the project is built around it']) }
    ] },
  { code: 'T1', title: 'Genomics: Advanced Germline and Somatic Variant Analysis', meta: 'Mentored track',
    blurb: 'From running an established pipeline to evaluating and adapting one against a specific dataset, with attention to the edge cases a standard pipeline handles poorly.',
    topics: [
      { group: 'Topics drawn on, as the project requires', items: t(['Pipeline evaluation: comparing callers on the same dataset against GIAB or an equivalent truth set', 'Difficult regions and variant classes: low-complexity regions, segmental duplications, CNV and structural variants', 'Advanced filtering and prioritisation: population frequency, in-silico predictors, conservation and structural evidence in one framework', 'Cohort-level analysis: joint genotyping, case-control comparison and basic burden testing', 'Clinical and research reporting: distinguishing pipeline output from clinical interpretation']) }
    ],
    deliverable: "A variant analysis report on the agreed dataset — usually pipeline justification, prioritised and classified variants with supporting evidence, and a discussion of the pipeline's limitations on that data." },
  { code: 'T2', title: 'Transcriptomics: RNA-seq Modelling and Single-Cell Sequencing', meta: 'Mentored track',
    blurb: 'Independent statistical analysis of expression data, plus an introduction to single-cell methods.',
    topics: [
      { group: 'Topics drawn on, as the project requires', items: t(['Experimental design for RNA-seq: replicates, batch effects, confounding, and how design constrains conclusions', 'Advanced differential expression: model choice, covariate adjustment, interaction terms', 'Pathway and gene set analysis: GSEA and over-representation approaches, and their common misuses', 'Introduction to single-cell RNA-seq: cell calling, quality filtering, doublet detection', 'Dimensionality reduction and clustering: PCA, UMAP, and cluster annotation against marker genes']) }
    ],
    deliverable: 'A transcriptomic analysis report running from raw counts to interpreted result, with statistical justification of method choices and publication-quality figures.' },
  { code: 'T3', title: 'Structural Bioinformatics: Protein Modelling and Structure-Based Prediction', meta: 'Mentored track',
    blurb: 'Structure prediction and molecular modelling applied to variant interpretation.',
    topics: [
      { group: 'Topics drawn on, as the project requires', items: t(['Protein structure prediction: AlphaFold and related tools, confidence metrics (pLDDT, PAE) and their proper interpretation', 'Variant effect on structure: stability prediction (FoldX, DynaMut2 or equivalent) and interaction-interface effects', 'Molecular dynamics simulation: setup, run parameters, and interpretation of trajectory data', 'Comparative structural analysis: cross-checking predictions across tools and the known failure modes of each', 'Structure-based evidence in variant classification — where it fits the ACMG framework, and its limits']) }
    ],
    deliverable: 'A structural evidence report on the agreed variant or protein — the modelled structure, stability and interaction analysis, a molecular dynamics component where warranted, and a statement of the strength and limits of the evidence.' },
  { code: 'T4', title: 'Cloud-Based Pipeline Engineering: Scalable Architectures', meta: 'Mentored track',
    blurb: 'Workflow orchestration taken into cloud-native, production-scale pipeline design.',
    topics: [
      { group: 'Topics drawn on, as the project requires', items: t(['Cloud fundamentals for bioinformatics: compute, storage and networking at genomic scale', 'Portable pipeline configuration: execution profiles, resource requests, writing once for multiple back-ends', 'Cost and resource management: estimating and controlling spend on large workloads', 'Data handling and access control in the cloud: encryption, access policy, and the extra care genomic data requires', 'Scaling and parallelisation, and the failure modes unique to distributed execution', 'Deployment and handover documentation']) }
    ],
    deliverable: 'A deployed, documented pipeline — usually targeting at least two execution back-ends, with a cost estimate, access-control documentation and a handover document sufficient for someone else to deploy it.' },
  { code: 'T5', title: 'Computational Synthetic Biology and Gene Circuit Design', meta: 'Mentored track · in silico only',
    blurb: 'Design, modelling and simulation of genetic constructs and regulatory circuits.',
    topics: [
      { group: 'Topics drawn on, as the project requires', items: t(['Parts, devices and chassis: promoters, RBSs, coding sequences, terminators and insulators; standardised registries and what characterisation data does not transfer', 'Sequence-to-expression prediction: promoter strength models, RBS calculators, codon optimisation, and why predictions fail', 'Transcriptional logic design: repressor and activator architectures, logic gates, CRISPRi and CRISPRa', 'Circuit dynamics and modelling: deterministic ODE and stochastic simulation; toggle switches, feedback loops, oscillators; sensitivity and robustness', 'Structural modelling of engineered regulators', 'Host context and burden: metabolic load, resource competition, and why a circuit that simulates correctly may still fail in a cell', 'Biosafety and biosecurity by design: containment strategies, kill-switch architectures in concept, dual-use considerations']) }
    ],
    deliverable: 'An in-silico design report — annotated construct design, sequence-level justification, dynamic simulation, structural assessment of any engineered protein component, a biosafety section, and what experimental validation would be required. Assessed as a design document, not a validated result.' },
  { code: '12', title: 'Industrial Project Integration, Execution and Technical Troubleshooting', meta: 'Phase 2',
    blurb: 'Fellows operate within a professional research framework, handling real-world complexity with expert oversight.',
    topics: [ { group: 'Topics', items: t(['Large-scale data integration: multi-sample datasets from public repositories or research collaborations', 'Operational troubleshooting: resolving complex pipeline failures with TGB technical leads', 'Weekly technical reviews: presenting progress and defending methodology', 'Applied industrial R&D: optimisation of active workflows in the Torrington Genomics ecosystem']) } ] },
  { code: '13', title: 'Scientific Communication and Final Deliverables', meta: 'Phase 3',
    blurb: 'Proof of work. Mentored scientific writing, journal-ready figures, and one final deliverable with your name on it.',
    topics: [
      { group: 'Topics', items: t(['Mentored scientific writing: rigorous Methods and Results sections reviewed by senior researchers', 'Advanced data visualisation: journal-ready figures for multi-omic findings']) },
      { group: 'Final deliverable — choose one', items: t(['A research manuscript suitable for submission to a peer-reviewed journal or preprint server', 'A production-ready containerised pipeline (Docker/Singularity)', 'A structured industry white paper analysing a biological problem or tool performance', 'An open-source contribution: a new or significantly improved tool or package on GitHub']) }
    ],
    deliverable: 'Defined in the project scoping agreement reached with your mentor at the start of the tier — not fixed in advance by track.' }
];

const PROGS = {
  bridge: {
    code: 'TBBP', name: 'Bridge Programme', kicker: 'A Pre-internship Foundation in Genomics and Bioinformatics (Included free)',
    full: 'Torrington Bioinformatics Bridge Programme',
    lead: 'This is a structured pre-fellowship course designed for biomedical and biotechnology graduates, life scientists and research professionals preparing to transition into computational genomics and bioinformatics. It provides rigorous grounding in genomic variation, biological databases, sequence alignment, and the theoretical foundations of bioinformatics, serving as the intellectual entry point into advanced bioinformatics training and TGB scientific fellowships and internships.',
    audience: t(['Life science undergraduates and graduates', 'Biomedical and molecular biology professionals', 'Medical laboratory scientists', 'Early-career researchers moving into genomics', 'Candidates preparing for the advanced traineeship tiers']),
    assessment: '80% attendance is required for the Certificate of Completion.',
    count: '8 modules', modules: BRIDGE
  },
  t1: {
    code: 'Tier 1', name: 'Applied Bioinformatics Practice', kicker: 'Weeks 1–6 · From the wet-lab to the digital lab',
    full: 'Certificate in Applied Bioinformatics Practice',
    lead: 'Six weeks in which you build the practical computing skills and the biology background needed to work with real genomic data, and finish with a certificate and a portfolio of your own code.',
    audience: t(['Life science undergraduates and recent graduates', 'Biomedical science students who have never done bioinformatics', 'Early-career researchers entering computational genomics', 'Postgraduate researchers']),
    assessment: 'Applied stream: continuous practical assessment and 80% attendance',
    count: '4 applied modules + B1–B8', modules: T1
  },
  t2: {
    code: 'Tier 2', name: 'Multi-omic Bioinformatics & NGS', kicker: 'Weeks 7–12 · NGS analysis pipelines, comprehensive, end to end',
    full: 'Professional Certificate in Multi-omic Bioinformatics and Next-Generation Sequencing',
    lead: "A six-week specialist extension which, combined with Tier 1, forms a 12-week industrial traineeship. You move from running other people's tools to building your own working pipelines.",
    audience: t(['Final-year students and graduates applying to PhD or Master’s programmes', 'MSc, MPhil and PhD candidates analysing their own data', 'Graduates targeting clinical diagnostics, biotech R&D or genomic data science', 'Researchers moving from wet-lab benchwork into computational roles']),
    assessment: 'Continuous practical assessment, a pipeline build assignment and 80% attendance.',
    count: '6 modules · weeks 7–12', modules: T2
  },
  t3: {
    code: 'Tier 3', name: 'Research Traineeship', kicker: 'Months 4–6 · Advanced Research Traineeship · competitive selection',
    full: 'Professional research capstone in Bioinformatics and Computational Genomics',
    lead: 'This phase is highly mentored by senior research professionals. Trainees are integrated into the Torrington Genomics research environment. You specialise in one of six mentored tracks, and every project is scoped individually with your mentor.',
    audience: t(['Final-year students and graduates needing demonstrable proof of work', 'MSc, MPhil and PhD candidates needing end-to-end technical autonomy', 'Graduates targeting senior analyst and R&D roles', 'Established researchers moving into computational leadership']),
    assessment: 'Research logbook and weekly technical reviews (30%), an oral defence of methodology (20%) and the final deliverable (50%).',
    count: '4 modules · 5 tracks', modules: T3
  },
  custom: {
    code: 'Custom', name: 'Custom track', kicker: 'Shaped to your requirement · includes a mini research project',
    full: 'Custom Track',
    lead: "For requirements the fixed tiers don't cover. Tell us the focus area, duration and format you need when you apply, and we scope a track around it — delivered with the same mentorship and lab access as the tiered pathway.",
    audience: t(['Organisations sponsoring a trainee for a specific need', 'Applicants whose goals fall outside the fixed tiers']),
    assessment: 'Agreed individually as part of the scoping conversation.',
    count: 'Scoped with you',
    modules: [{
      code: 'C1', title: 'Scoped to what you need',
      blurb: 'Every custom track starts as a conversation, not a fixed syllabus.',
      topics: [{ group: 'How it works', items: t(['You tell us the focus area, duration and format you need', 'We scope a track and a mini research project around it', 'Delivered with the same mentorship and lab access as the tiered pathway']) }],
      deliverable: 'A mini research project, agreed with your mentor at the start of the track.'
    }]
  }
};

const STEP_LABELS = ['You', 'Background', 'Programme and Pricing', 'Intent', 'Review'];
const STEP_HINTS = ['So we can reach you.', 'None of this disqualifies you.', 'You can change this before the cohort starts.', 'Read honestly, in confidence.', 'Last look before it goes to the panel.'];
const ROLES = ['Undergraduate', 'Recent graduate', 'Postgraduate researcher', 'Laboratory professional', 'Clinician', 'Other'];
const COMPUTING = [
  { v: 'none', label: 'None at all', hint: 'This is the common case.' },
  { v: 'some', label: 'Some exposure', hint: 'A module or two, a tutorial, or occasional scripting.' },
  { v: 'confident', label: 'Confident', hint: 'I have sound bioinformatics knowledge and can work independently.' }
];
const DATA_OPTS = [{ v: 'yes', label: 'Yes, my own data' }, { v: 'maybe', label: 'My lab holds some' }, { v: 'no', label: 'No' }];
const DISTRICTS = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'];
const DEGREE_LEVELS = ['BSc', 'MPhil / PhD', 'Other'];
const FIELDS = ['Biomedical and Biotechnology', 'Plant Science', 'Immunology', 'Bioinformatics', 'Other'];
const TIERS = [
  { v: 't1', duration: '6 weeks', label: 'Tier 1 (Bridge Programme included)', hint: 'Applied Bioinformatics Practice', price: 'LKR 48,000' },
  { v: 't2', duration: '3 months', label: 'Tier 1 + 2', hint: 'Multi-omic Bioinformatics & NGS', price: 'LKR 125,000' },
  { v: 'full', duration: '6 months', label: 'Full pathway', hint: 'Through the Tier 3 research capstone', price: 'LKR 220,000' },
  { v: 'custom', duration: 'Custom', label: 'Custom track', hint: 'Shaped to your requirement, with a mini research project', price: '' }
];
const TRACKS = ['Genomics', 'Transcriptomics', 'Structural bioinformatics', 'Cloud pipeline engineering', 'Computational synthetic biology', 'Undecided'];
const FEES = [
  { v: 'full', label: 'No', hint: 'The fee covers what the programme costs to run.' },
  { v: 'waiver', label: 'Yes — I am applying for a fee waiver', hint: 'Decided case by case, and never held against your application.' }
];

// ---- Access-tile line-art icons (ported 1:1 from the design canvas) ----
function AccessLabIcon() {
  return (
    <svg viewBox="0 0 260 120" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
      <path d="M10 16 H96" stroke="rgba(15,26,36,0.14)" strokeWidth="1.5" />
      <rect x="18" y="4" width="9" height="11" rx="2" fill="#5BAE9D" opacity="0.45" />
      <rect x="32" y="2" width="9" height="13" rx="2" fill="#44BEDB" opacity="0.40" />
      <rect x="46" y="5" width="9" height="10" rx="2" fill="#5BAE9D" opacity="0.32" />
      <rect x="60" y="3" width="9" height="12" rx="2" fill="#44BEDB" opacity="0.32" />
      <rect x="8" y="86" width="244" height="6" rx="2" fill="#5BAE9D" opacity="0.45" />
      <rect x="14" y="92" width="58" height="26" rx="2" fill="none" stroke="rgba(15,26,36,0.14)" />
      <path d="M43 92 V118" stroke="rgba(15,26,36,0.14)" />
      <rect x="196" y="92" width="52" height="26" rx="2" fill="none" stroke="rgba(15,26,36,0.14)" />
      <path d="M222 92 V118" stroke="rgba(15,26,36,0.14)" />
      <path d="M84 92 V118 M180 92 V118" stroke="rgba(15,26,36,0.14)" />
      <rect x="16" y="58" width="44" height="28" rx="3" fill="#5BAE9D" opacity="0.22" />
      <rect x="22" y="64" width="32" height="15" rx="2" fill="#2c7466" opacity="0.85" />
      <circle cx="27" cy="82" r="2" fill="#2c7466" />
      <circle cx="34" cy="82" r="2" fill="#44BEDB" />
      <path d="M78 86 V70 h4 v16" fill="#6b7c8c" opacity="0.45" />
      <path d="M74 70 h12 v-4 h-12 z" fill="#2c7466" />
      <path d="M80 66 v-8 a7 7 0 0 1 12 4" fill="none" stroke="#2c7466" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="93" cy="63" r="3.5" fill="#2c7466" />
      <rect x="72" y="84" width="18" height="3" rx="1.5" fill="#2c7466" opacity="0.6" />
      <rect x="104" y="74" width="26" height="12" rx="1.5" fill="none" stroke="rgba(15,26,36,0.14)" />
      <rect x="107" y="66" width="4" height="20" rx="1.5" fill="#44BEDB" opacity="0.65" />
      <rect x="114" y="64" width="4" height="22" rx="1.5" fill="#5BAE9D" opacity="0.65" />
      <rect x="121" y="67" width="4" height="19" rx="1.5" fill="#44BEDB" opacity="0.5" />
      <path d="M146 62 v10 l-9 14 h22 l-9 -14 v-10 z" fill="#5BAE9D" opacity="0.30" stroke="#5BAE9D" strokeWidth="1.2" />
      <path d="M141 80 h14 l4 6 h-22 z" fill="#5BAE9D" opacity="0.55" />
      <rect x="142" y="58" width="8" height="4" rx="1.5" fill="#2c7466" />
      <rect x="196" y="54" width="52" height="32" rx="3" fill="#5BAE9D" opacity="0.22" />
      <rect x="202" y="60" width="40" height="19" rx="2" fill="none" stroke="#2c7466" strokeWidth="1.2" />
      <path d="M205 74 l7 -8 l6 5 l7 -11 l6 9 l6 -6" fill="none" stroke="#2c7466" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="240" cy="83" r="2" fill="#44BEDB" />
      <circle cx="172" cy="47" r="6" fill="#2c7466" />
      <path d="M161 86 a11 11 0 0 1 22 0 z" fill="#2c7466" />
      <path d="M183 72 l10 6" stroke="#2c7466" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
function AccessRemoteIcon() {
  return (
    <svg viewBox="0 0 260 120" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
      <circle cx="26" cy="36" r="7" fill="#2c7466" />
      <path d="M13 62 a13 13 0 0 1 26 0 z" fill="#2c7466" />
      <path d="M39 54 l11 4" stroke="#2c7466" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="10" y="64" width="34" height="3" rx="1.5" fill="#2c7466" opacity="0.35" />
      <rect x="54" y="42" width="58" height="38" rx="4" fill="none" stroke="rgba(15,26,36,0.14)" />
      <rect x="54" y="42" width="58" height="38" rx="4" fill="#5BAE9D" opacity="0.10" />
      <rect x="63" y="51" width="40" height="4" rx="2" fill="#6b7c8c" opacity="0.5" />
      <rect x="63" y="60" width="28" height="4" rx="2" fill="#6b7c8c" opacity="0.35" />
      <rect x="63" y="69" width="34" height="4" rx="2" fill="#6b7c8c" opacity="0.35" />
      <rect x="48" y="84" width="70" height="4" rx="2" fill="#6b7c8c" opacity="0.30" />
      <path d="M118 61 H176" stroke="#5BAE9D" strokeWidth="1.5" strokeDasharray="5 5" />
      <circle cx="147" cy="61" r="8" fill="none" stroke="#44BEDB" strokeWidth="1.5" />
      <circle cx="147" cy="61" r="3" fill="#44BEDB" />
      <rect x="184" y="26" width="64" height="20" rx="3" fill="#5BAE9D" opacity="0.30" />
      <rect x="184" y="50" width="64" height="20" rx="3" fill="#5BAE9D" opacity="0.30" />
      <rect x="184" y="74" width="64" height="20" rx="3" fill="#5BAE9D" opacity="0.30" />
      <circle cx="194" cy="36" r="3" fill="#2c7466" />
      <circle cx="194" cy="60" r="3" fill="#2c7466" />
      <circle cx="194" cy="84" r="3" fill="#2c7466" />
    </svg>
  );
}
function AccessMentorIcon() {
  return (
    <svg viewBox="0 0 260 120" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
      <circle cx="56" cy="60" r="26" fill="#5BAE9D" opacity="0.22" />
      <circle cx="56" cy="52.3" r="8.1" fill="#2c7466" opacity="1" /><path d="M43 76.35 a13 13 0 0 1 26 0 z" fill="#2c7466" opacity="1" />
      <path d="M82 60 H120" stroke="#5BAE9D" strokeWidth="1.5" />
      <path d="M82 60 C104 60 104 28 126 28" fill="none" stroke="#5BAE9D" strokeWidth="1.5" />
      <path d="M82 60 C104 60 104 92 126 92" fill="none" stroke="#5BAE9D" strokeWidth="1.5" />
      <circle cx="134" cy="22.8" r="5.0" fill="#44BEDB" opacity="0.75" /><path d="M126 37.6 a8 8 0 0 1 16 0 z" fill="#44BEDB" opacity="0.75" />
      <circle cx="128" cy="54.8" r="5.0" fill="#44BEDB" opacity="0.75" /><path d="M120 69.6 a8 8 0 0 1 16 0 z" fill="#44BEDB" opacity="0.75" />
      <circle cx="134" cy="86.8" r="5.0" fill="#44BEDB" opacity="0.75" /><path d="M126 101.6 a8 8 0 0 1 16 0 z" fill="#44BEDB" opacity="0.75" />
      <rect x="158" y="34" width="86" height="6" rx="3" fill="#44BEDB" opacity="0.45" />
      <rect x="158" y="48" width="66" height="6" rx="3" fill="#44BEDB" opacity="0.28" />
      <rect x="158" y="62" width="78" height="6" rx="3" fill="#44BEDB" opacity="0.28" />
      <rect x="158" y="76" width="52" height="6" rx="3" fill="#44BEDB" opacity="0.28" />
    </svg>
  );
}
function AccessNetworkIcon() {
  return (
    <svg viewBox="0 0 260 120" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
      <circle cx="130" cy="60" r="14" fill="#2c7466" />
      <circle cx="130" cy="60" r="30" fill="none" stroke="rgba(15,26,36,0.14)" />
      <circle cx="130" cy="60" r="48" fill="none" stroke="rgba(15,26,36,0.14)" />
      <path d="M130 60 L130 12 M130 60 L172 36 M130 60 L172 84 M130 60 L130 108 M130 60 L88 84 M130 60 L88 36" stroke="#5BAE9D" strokeWidth="1.2" opacity="0.7" />
      <circle cx="130" cy="12" r="6" fill="#5BAE9D" />
      <circle cx="172" cy="36" r="6" fill="#44BEDB" />
      <circle cx="172" cy="84" r="6" fill="#5BAE9D" />
      <circle cx="130" cy="108" r="6" fill="#44BEDB" />
      <circle cx="88" cy="84" r="6" fill="#5BAE9D" />
      <circle cx="88" cy="36" r="6" fill="#44BEDB" />
      <circle cx="24" cy="60" r="5" fill="none" stroke="rgba(15,26,36,0.14)" />
      <circle cx="236" cy="60" r="5" fill="none" stroke="rgba(15,26,36,0.14)" />
    </svg>
  );
}
function AccessPracticeIcon() {
  return (
    <svg viewBox="0 0 260 120" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
      <rect x="10" y="20" width="240" height="8" rx="4" fill="rgba(15,26,36,0.14)" />
      <rect x="10" y="20" width="200" height="8" rx="4" fill="#5BAE9D" opacity="0.75" />
      <rect x="10" y="44" width="240" height="8" rx="4" fill="rgba(15,26,36,0.14)" />
      <rect x="10" y="44" width="148" height="8" rx="4" fill="#5BAE9D" opacity="0.6" />
      <rect x="10" y="68" width="240" height="8" rx="4" fill="rgba(15,26,36,0.14)" />
      <rect x="10" y="68" width="96" height="8" rx="4" fill="#44BEDB" opacity="0.55" />
      <rect x="10" y="92" width="240" height="8" rx="4" fill="rgba(15,26,36,0.14)" />
      <rect x="10" y="92" width="52" height="8" rx="4" fill="#44BEDB" opacity="0.4" />
      <circle cx="210" cy="24" r="5" fill="#2c7466" />
      <circle cx="158" cy="48" r="5" fill="#2c7466" />
      <circle cx="106" cy="72" r="5" fill="#2c7466" />
      <circle cx="62" cy="96" r="5" fill="#2c7466" />
    </svg>
  );
}
function AccessLectureIcon() {
  return (
    <svg viewBox="0 0 260 120" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
      <rect x="46" y="10" width="168" height="62" rx="4" fill="none" stroke="rgba(15,26,36,0.14)" />
      <rect x="60" y="24" width="94" height="7" rx="3.5" fill="#5BAE9D" opacity="0.6" />
      <rect x="60" y="38" width="140" height="5" rx="2.5" fill="#6b7c8c" opacity="0.35" />
      <rect x="60" y="49" width="120" height="5" rx="2.5" fill="#6b7c8c" opacity="0.35" />
      <rect x="60" y="60" width="132" height="5" rx="2.5" fill="#6b7c8c" opacity="0.35" />
      <path d="M130 72 V84" stroke="rgba(15,26,36,0.14)" />
      <circle cx="46" cy="93.7" r="4.3" fill="#44BEDB" opacity="0.55" /><path d="M39 106.65 a7 7 0 0 1 14 0 z" fill="#44BEDB" opacity="0.55" />
      <circle cx="74" cy="93.7" r="4.3" fill="#5BAE9D" opacity="0.55" /><path d="M67 106.65 a7 7 0 0 1 14 0 z" fill="#5BAE9D" opacity="0.55" />
      <circle cx="102" cy="93.7" r="4.3" fill="#44BEDB" opacity="0.55" /><path d="M95 106.65 a7 7 0 0 1 14 0 z" fill="#44BEDB" opacity="0.55" />
      <circle cx="130" cy="93.25" r="4.7" fill="#2c7466" opacity="1" /><path d="M122.5 107.125 a7.5 7.5 0 0 1 15 0 z" fill="#2c7466" opacity="1" />
      <circle cx="158" cy="93.7" r="4.3" fill="#44BEDB" opacity="0.55" /><path d="M151 106.65 a7 7 0 0 1 14 0 z" fill="#44BEDB" opacity="0.55" />
      <circle cx="186" cy="93.7" r="4.3" fill="#5BAE9D" opacity="0.55" /><path d="M179 106.65 a7 7 0 0 1 14 0 z" fill="#5BAE9D" opacity="0.55" />
      <circle cx="214" cy="93.7" r="4.3" fill="#44BEDB" opacity="0.55" /><path d="M207 106.65 a7 7 0 0 1 14 0 z" fill="#44BEDB" opacity="0.55" />
    </svg>
  );
}
function AccessCompanyIcon() {
  return (
    <svg viewBox="0 0 260 120" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
      <path d="M34 108 V18 a3 3 0 0 1 3 -3 h186 a3 3 0 0 1 3 3 V108" fill="none" stroke="rgba(15,26,36,0.14)" strokeWidth="1.2" />
      <path d="M8 108 H252" stroke="rgba(15,26,36,0.14)" strokeWidth="1.5" />
      <path d="M28 15 h204 l-6 -7 h-192 z" fill="#5BAE9D" opacity="0.35" />
      <rect x="40" y="21" width="86" height="26" rx="2" fill="#5BAE9D" opacity="0.14" />
      <rect x="134" y="21" width="86" height="26" rx="2" fill="#5BAE9D" opacity="0.14" />
      <rect x="40" y="53" width="86" height="26" rx="2" fill="#5BAE9D" opacity="0.14" />
      <rect x="134" y="53" width="86" height="26" rx="2" fill="#5BAE9D" opacity="0.14" />
      <rect x="40" y="85" width="180" height="23" rx="2" fill="#5BAE9D" opacity="0.10" />
      <path d="M40 47 H220 M40 79 H220 M40 85 H220" stroke="rgba(15,26,36,0.14)" />
      <path d="M130 21 V108" stroke="rgba(15,26,36,0.14)" strokeDasharray="3 3" />
      <rect x="46" y="38" width="30" height="5" rx="1.5" fill="#2c7466" opacity="0.55" />
      <circle cx="52" cy="30.9" r="3.4" fill="#2c7466" opacity="1" /><path d="M46.73 38 a5.3 5.3 0 0 1 10.5 0 z" fill="#2c7466" opacity="1" />
      <circle cx="64" cy="30.9" r="3.4" fill="#44BEDB" opacity="0.8" /><path d="M58.73 38 a5.3 5.3 0 0 1 10.5 0 z" fill="#44BEDB" opacity="0.8" />
      <rect x="88" y="27" width="32" height="12" rx="1.5" fill="none" stroke="#2c7466" strokeWidth="1" />
      <path d="M91 35 l6 -5 l5 4 l6 -7 l5 6" fill="none" stroke="#2c7466" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="88" y="41" width="32" height="3" rx="1.5" fill="#2c7466" opacity="0.35" />
      <rect x="140" y="38" width="34" height="5" rx="1.5" fill="#2c7466" opacity="0.55" />
      <circle cx="146" cy="30.9" r="3.4" fill="#44BEDB" opacity="0.8" /><path d="M140.73 38 a5.3 5.3 0 0 1 10.5 0 z" fill="#44BEDB" opacity="0.8" />
      <circle cx="158" cy="30.9" r="3.4" fill="#2c7466" opacity="1" /><path d="M152.73 38 a5.3 5.3 0 0 1 10.5 0 z" fill="#2c7466" opacity="1" />
      <rect x="186" y="26" width="26" height="17" rx="2" fill="#5BAE9D" opacity="0.4" />
      <circle cx="192" cy="31" r="1.8" fill="#2c7466" />
      <circle cx="199" cy="31" r="1.8" fill="#2c7466" />
      <rect x="190" y="36" width="18" height="3" rx="1.5" fill="#2c7466" opacity="0.5" />
      <ellipse cx="72" cy="70" rx="24" ry="7" fill="#44BEDB" opacity="0.28" />
      <circle cx="54" cy="62.9" r="3.4" fill="#2c7466" opacity="1" /><path d="M48.73 70 a5.3 5.3 0 0 1 10.5 0 z" fill="#2c7466" opacity="1" />
      <circle cx="90" cy="62.9" r="3.4" fill="#2c7466" opacity="1" /><path d="M84.73 70 a5.3 5.3 0 0 1 10.5 0 z" fill="#2c7466" opacity="1" />
      <circle cx="72" cy="54.9" r="3.4" fill="#44BEDB" opacity="0.85" /><path d="M66.73 62 a5.3 5.3 0 0 1 10.5 0 z" fill="#44BEDB" opacity="0.85" />
      <rect x="140" y="60" width="34" height="14" rx="1.5" fill="none" stroke="#2c7466" strokeWidth="1" />
      <rect x="144" y="64" width="26" height="3" rx="1.5" fill="#44BEDB" opacity="0.6" />
      <rect x="144" y="69" width="18" height="3" rx="1.5" fill="#44BEDB" opacity="0.4" />
      <circle cx="190" cy="64.4" r="3.6" fill="#2c7466" opacity="1" /><path d="M184.42 72 a5.6 5.6 0 0 1 11.2 0 z" fill="#2c7466" opacity="1" />
      <circle cx="204" cy="64.4" r="3.6" fill="#44BEDB" opacity="0.8" /><path d="M198.42 72 a5.6 5.6 0 0 1 11.2 0 z" fill="#44BEDB" opacity="0.8" />
      <rect x="48" y="92" width="18" height="12" rx="1.5" fill="#5BAE9D" opacity="0.45" />
      <rect x="70" y="92" width="18" height="12" rx="1.5" fill="#5BAE9D" opacity="0.32" />
      <rect x="92" y="92" width="18" height="12" rx="1.5" fill="#5BAE9D" opacity="0.45" />
      <path d="M120 98 H150" stroke="#2c7466" strokeWidth="1.2" strokeDasharray="4 3" />
      <path d="M150 98 l-5 -3 v6 z" fill="#2c7466" />
      <rect x="158" y="90" width="54" height="16" rx="2" fill="#44BEDB" opacity="0.22" />
      <path d="M163 100 l8 -6 l6 4 l8 -8 l7 7 l6 -4" fill="none" stroke="#2c7466" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AccessCertIcon() {
  return (
    <svg viewBox="0 0 260 120" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
      <rect x="14" y="12" width="110" height="96" rx="4" fill="none" stroke="rgba(15,26,36,0.14)" />
      <rect x="28" y="28" width="66" height="6" rx="3" fill="#5BAE9D" opacity="0.6" />
      <rect x="28" y="42" width="82" height="4" rx="2" fill="#6b7c8c" opacity="0.32" />
      <rect x="28" y="52" width="74" height="4" rx="2" fill="#6b7c8c" opacity="0.32" />
      <rect x="28" y="62" width="80" height="4" rx="2" fill="#6b7c8c" opacity="0.32" />
      <circle cx="46" cy="88" r="12" fill="none" stroke="#2c7466" strokeWidth="1.5" />
      <circle cx="46" cy="88" r="5" fill="#2c7466" />
      <rect x="136" y="12" width="110" height="96" rx="4" fill="#5BAE9D" opacity="0.12" />
      <rect x="150" y="28" width="52" height="6" rx="3" fill="#44BEDB" opacity="0.6" />
      <rect x="150" y="42" width="82" height="4" rx="2" fill="#6b7c8c" opacity="0.32" />
      <rect x="150" y="52" width="70" height="4" rx="2" fill="#6b7c8c" opacity="0.32" />
      <rect x="150" y="62" width="78" height="4" rx="2" fill="#6b7c8c" opacity="0.32" />
      <rect x="150" y="72" width="58" height="4" rx="2" fill="#6b7c8c" opacity="0.32" />
      <path d="M150 92 C160 84 168 98 178 90 C186 84 192 94 202 88" fill="none" stroke="#2c7466" strokeWidth="1.5" />
    </svg>
  );
}

const ACCESS = [
  { n: '01', Icon: AccessLabIcon, label: 'Our laboratory', body: 'Work alongside others in our purpose-built bioinformatics laboratory, with staff on hand during opening hours.' },
  { n: '02', Icon: AccessRemoteIcon, label: 'Remote access', body: 'Log in to our training servers from home and keep working outside laboratory hours.' },
  { n: '03', Icon: AccessMentorIcon, label: 'Mentoring', body: 'Practical sessions led by the bioinformaticians and scientists who do this professionally.' },
  { n: '04', Icon: AccessNetworkIcon, label: 'People worth knowing', body: 'Regular sessions with senior figures from academia and industry — to understand how they think about problems, and to build the contacts that matter later.' },
  { n: '05', Icon: AccessPracticeIcon, label: 'Practice, at your pace', body: 'Structured computing exercises you work through on your own time.' },
  { n: '06', Icon: AccessLectureIcon, label: 'Focused lectures', body: 'From our genomics and bioinformatics panel, including guest lecturers from universities and institutes.' },
  { n: '07', Icon: AccessCompanyIcon, label: 'A company, up close', body: 'You are inside an active bioinformatics business, so you see how one actually runs day to day.' },
  { n: '08', Icon: AccessCertIcon, label: 'Certificate & reference', body: 'A recognised certificate on completion, and a letter of recommendation from the scientist who supervised you, written on what you actually did.' }
];

const LETTER_STOPS = [
  { title: 'Research students', body: 'sitting on their own sequencing data, waiting on someone else to analyse it, and then unable to defend the methods at a viva because they did not run them.' },
  { title: "Graduates applying abroad", body: "competing for PhD and Master's places against applicants who submit a code repository alongside their transcript." },
  { title: 'Laboratory professionals', body: 'whose diagnostic work is moving to sequencing faster than their training has.' },
  { title: 'Anyone', body: 'who has been told the bioinformatician will handle it, and has no way to judge whether the bioinformatician handled it correctly.' }
];

const LETTER_ACCESS = ACCESS.map((a) => ({ label: a.label, body: a.body }));

// ---- Nav ----
function BCNav() {
  const [open, setOpen] = React.useState(false);
  const goTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const items = [['Why it exists', 'note'], ['Pathway & curriculum', 'curriculum'], ['What you get', 'access']];
  return (
    <nav style={cs('position:sticky; top:0; z-index:40; background:rgba(255,255,255,0.85); backdrop-filter:blur(14px); border-bottom:1px solid ' + BC_LINE)}>
      <style>{`
        .bc-nav-links, .bc-nav-cta { display: flex; align-items: center; }
        .bc-nav-toggle { display: none; }
        @media (max-width: 900px) {
          .bc-nav-links, .bc-nav-cta { display: none !important; }
          .bc-nav-toggle { display: flex !important; }
        }
      `}</style>
      <div style={cs('max-width:1240px; margin:0 auto; padding:14px clamp(20px,5vw,56px); display:flex; align-items:center; gap:24px; flex-wrap:wrap')}>
        <img src="assets/TGB-logo-trimmed.png" alt="Torrington Genomics & Bioinformatics" style={cs('height:34px; width:auto; object-fit:contain')} />
        <img src="assets/tsi-lockup-30.png" alt="Torrington Scholars Institute" style={cs('height:30px; width:auto; object-fit:contain')} />
        <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' + BC_DIM + '; padding:5px 11px; border:1px solid ' + BC_LINE + '; border-radius:999px')}>Bio-Coder</span>
        <div style={{ flex: 1 }} />
        <div className="bc-nav-links" style={{ gap: 22, flexWrap: 'wrap' }}>
          {items.map(([label, id]) => (
            <span key={id} onClick={() => goTo(id)} style={cs('font-size:13px; cursor:pointer; color:' + BC_INK2)}>{label}</span>
          ))}
        </div>
        <div className="bc-nav-cta">
          <a href="#apply" onClick={(e) => { e.preventDefault(); goTo('apply'); }} style={cs('padding:10px 20px; border-radius:999px; background:' + BC_GRAD + '; color:#fff; font-size:13px; font-weight:600; box-shadow:0 12px 36px -14px rgba(44,116,102,0.55); cursor:pointer; text-decoration:none')}>Apply →</a>
        </div>
        <button
          className="bc-nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={cs('align-items:center; justify-content:center; width:38px; height:38px; border:1px solid ' + BC_LINE + '; border-radius:10px; background:rgba(255,255,255,0.7); cursor:pointer; flex-direction:column; gap:4px')}>
          <span style={cs('width:18px; height:1.5px; background:' + BC_INK)} />
          <span style={cs('width:18px; height:1.5px; background:' + BC_INK)} />
          <span style={cs('width:18px; height:1.5px; background:' + BC_INK)} />
        </button>
      </div>
      {open &&
      <div style={cs('border-top:1px solid ' + BC_LINE + '; padding:10px clamp(20px,5vw,56px) 22px; display:flex; flex-direction:column; gap:2px; background:' + BC_PAPER)}>
        {items.map(([label, id]) => (
          <span key={id} onClick={() => goTo(id)} style={cs('padding:13px 4px; border-bottom:1px solid ' + BC_LINE + '; font-size:15px; color:' + BC_INK + '; font-weight:500; cursor:pointer')}>{label}</span>
        ))}
        <a href="#apply" onClick={() => setOpen(false)} style={cs('margin-top:14px; text-align:center; padding:12px 20px; border-radius:999px; background:' + BC_GRAD + '; color:#fff; font-size:14px; font-weight:600; text-decoration:none')}>Apply →</a>
      </div>}
    </nav>
  );
}

// ---- Hero ----
function BCHero() {
  const intakeLabel = INTAKE_MONTH ? INTAKE_MONTH + ' intake open' : 'Intake open';
  const stats = [
    ['6', ' months', 'Full pathway, three exit points'],
    ['40', '+h', 'Complete bioinformatics course — Bridge Programme, free of charge'],
    ['20', '+', 'Modules across the Bridge Programme and three tiers'],
    ['Unlimited', '', 'Hours of industrial exposure — as much as you are willing to put in']
  ];
  return (
    <div style={cs('max-width:1240px; margin:0 auto; padding:0 clamp(20px,5vw,56px)')}>
      <header style={cs('position:relative; overflow:hidden; margin-top:clamp(18px,3vw,30px); border-radius:16px; background:' + BC_FOREST + '; padding:clamp(40px,7vw,84px) clamp(26px,5vw,60px) clamp(38px,6vw,68px)')}>
        <style>{`@keyframes bcAuraBob { 0%,100% { transform: translate(0,0); } 50% { transform: translate(0,-22px); } }`}</style>
        <div style={cs('position:absolute; top:-40px; right:-60px; width:520px; height:520px; border-radius:999px; background:radial-gradient(circle, rgba(44,116,102,0.13) 0%, rgba(44,116,102,0) 70%); pointer-events:none; animation:bcAuraBob 11s ease-in-out infinite')} />
        <div style={cs('position:relative; display:flex; flex-direction:column; gap:26px; max-width:860px')}>
          <div style={cs('display:inline-flex; flex-wrap:wrap; align-items:center; gap:10px; padding:6px; border:1px solid rgba(255,255,255,0.14); border-radius:999px; background:rgba(255,255,255,0.08); backdrop-filter:blur(8px)')}>
            <span style={cs('display:inline-flex; align-items:center; gap:7px; padding:7px 15px; border-radius:999px; background:' + BC_GRAD + '; color:#fff; font-family:"JetBrains Mono",monospace; font-size:12px; font-weight:700; letter-spacing:1.6px; text-transform:uppercase; white-space:nowrap')}>
              <span style={cs('width:6px; height:6px; border-radius:999px; background:#fff')} />
              {intakeLabel}
            </span>
            <span style={cs('padding-right:12px; font-size:12px; color:rgba(255,255,255,0.68)')}>Reviewed individually, by invitation</span>
          </div>
          <h1 style={cs('margin:0; font-family:Newsreader,serif; font-weight:300; font-size:clamp(46px,8vw,104px); line-height:0.98; letter-spacing:-3.5px; color:#fff')}>
            An industrial traineeship in bioinformatics, <em style={{ fontStyle: 'italic', background: BC_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>built for Sri Lankan scientists</em>
          </h1>
          <p style={cs('margin:0; max-width:62ch; font-size:16.5px; line-height:1.65; color:rgba(255,255,255,0.68)')}>Sharpen your knowledge and skills inside a working genomics company, taught on live data by practising academics and the people who do this commercially every day.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#note" style={cs('padding:16px 30px; border-radius:999px; background:rgba(255,255,255,0.08); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.14); color:#fff; font-size:14px; font-weight:600; text-decoration:none')}>Why this is important</a>
            <a href="#curriculum" style={cs('padding:16px 30px; border-radius:999px; background:rgba(255,255,255,0.08); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.14); color:#fff; font-size:14px; font-weight:600; text-decoration:none')}>Read the pathways and curriculum</a>
            <a href="#apply" style={cs('padding:16px 30px; border-radius:999px; background:' + BC_GRAD + '; color:#fff; font-size:14px; font-weight:600; box-shadow:0 12px 36px -10px rgba(44,116,102,0.55); text-decoration:none')}>Start your application →</a>
          </div>
        </div>
        <div style={cs('position:relative; margin-top:clamp(40px,6vw,72px); display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:1px; background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.14); border-radius:14px; overflow:hidden')}>
          {stats.map(([n, suffix, label]) => (
            <div key={label} style={cs('background:rgba(255,255,255,0.05); padding:24px 18px; min-width:0')}>
              <div style={cs('font-family:Newsreader,serif; font-weight:300; font-size:clamp(24px,2.6vw,40px); line-height:1; letter-spacing:-2px; color:#fff')}>{n}<span style={cs('font-size:55%; letter-spacing:-0.5px; color:#7fd0b8')}>{suffix}</span></div>
              <div style={cs('margin-top:10px; font-size:12.5px; line-height:1.5; color:rgba(255,255,255,0.68)')}>{label}</div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

// ---- "Why this exists" section + founder's-letter modal ----
function BCNote() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={cs('max-width:1240px; margin:0 auto; padding:0 clamp(20px,5vw,56px)')}>
      <section id="note" style={cs('padding:clamp(28px,4vw,52px) 0; border-top:1px solid ' + BC_LINE)}>
        <div style={cs('display:flex; align-items:center; gap:10px; margin-bottom:26px')}>
          <span style={{ width: 24, height: 1, background: BC_GRAD }} />
          <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:' + BC_DIM)}>01 — Why this exists</span>
        </div>
        <h2 style={cs('margin:0 0 8px; max-width:34ch; font-family:Newsreader,serif; font-weight:300; font-size:clamp(34px,5vw,64px); line-height:1.02; letter-spacing:-2.4px; color:' + BC_INK)}>
          Bioinformatics is no longer the future of biology — <em style={{ fontStyle: 'italic', background: BC_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>it is its present</em>
        </h2>
        <p style={cs('margin:0 0 22px; font-size:13px; color:' + BC_DIM)}>An open letter from Nilaksha Freeson, Co-Founder, Director & CEO, Torrington Genomics & Bioinformatics</p>
        <p style={cs('margin:0 0 16px; max-width:62ch; font-family:Newsreader,serif; font-style:italic; font-size:15px; line-height:1.7; color:' + BC_INK2)}>Hi there, I hope this letter finds you well. Congratulations on choosing to become a scientist in Sri Lanka, a decision that takes real courage. I wanted to share a few thoughts with you.</p>
        <p style={cs('margin:0 0 22px; max-width:62ch; font-family:Newsreader,serif; font-style:italic; font-size:15px; line-height:1.7; color:' + BC_INK2)}>By the time you finish a life science or biomedical degree in Sri Lanka, you are competent in a great many ways. Those fundamentals matter — but the world has already moved, and bioinformatics is no longer a discipline that sits on its own.</p>
        <button type="button" onClick={() => setOpen(true)} style={cs('display:inline-flex; align-items:center; gap:8px; padding:13px 24px; border-radius:999px; border:none; background:' + BC_GRAD + '; color:#fff; font-size:13px; font-weight:600; cursor:pointer; box-shadow:0 12px 36px -10px rgba(61,168,200,0.4)')}>Read the full letter →</button>
      </section>

      {open &&
      <div onClick={() => setOpen(false)} style={cs('position:fixed; inset:0; z-index:85; background:rgba(6,12,18,0.6); backdrop-filter:blur(4px); display:flex; align-items:flex-start; justify-content:center; padding:clamp(16px,4vw,40px); overflow:auto')}>
        <style>{`@keyframes bcPanelRise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div onClick={(e) => e.stopPropagation()} style={cs('position:relative; margin:auto; width:100%; max-width:760px; background:#fff; border-radius:16px; box-shadow:0 30px 80px -20px rgba(0,0,0,0.5); overflow:hidden; animation:bcPanelRise 0.25s ease')}>
          <button type="button" onClick={() => setOpen(false)} style={cs('position:absolute; top:18px; right:18px; z-index:2; width:34px; height:34px; border-radius:999px; border:1px solid rgba(15,26,36,0.12); background:rgba(255,255,255,0.9); color:#0f1a24; font-size:15px; cursor:pointer')}>✕</button>
          <div style={cs('padding:clamp(28px,4vw,48px) clamp(24px,4vw,44px); max-height:88vh; overflow:auto')}>
            <div style={cs('display:flex; align-items:center; justify-content:space-between; gap:24px; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid rgba(15,26,36,0.08)')}>
              <img src="assets/TGB-logo-trimmed.png" alt="Torrington Genomics & Bioinformatics" style={cs('height:32px; width:auto; display:block')} />
              <img src="assets/tsi-lockup-44.png" alt="Torrington Scholars Institute" style={cs('height:44px; width:auto; display:block')} />
            </div>
            <div style={cs('display:flex; align-items:baseline; justify-content:space-between; gap:24px; font-family:"JetBrains Mono",monospace; font-size:9.5px; letter-spacing:0.14em; text-transform:uppercase; color:' + BC_DIM)}>
              <span>To students, postgraduates &amp; colleagues in Sri Lankan life sciences</span>
              <span style={{ color: BC_BLUE }}>An open letter</span>
            </div>
            <h1 style={cs('font-family:Newsreader,serif; font-weight:300; font-size:clamp(24px,4vw,30px); line-height:1.1; letter-spacing:-1.3px; color:' + BC_INK + '; margin:12px 0 0; max-width:600px')}>
              An open letter on the <b>TGB Bio-Coder</b> Industrial Traineeship in Bioinformatics, <br />
              <em style={{ fontStyle: 'italic', background: `linear-gradient(135deg, ${BC_BLUE} 0%, ${BC_TEAL} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>and why we built it for you</em>
            </h1>
            <p style={cs('font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.13em; text-transform:uppercase; color:' + BC_BLUE + '; margin:9px 0 0')}>A note from Nilaksha Freeson, co-founder of Torrington Genomics &amp; Bioinformatics</p>
            <div style={cs('height:1px; background:linear-gradient(90deg, rgba(61,168,200,0.45), rgba(91,174,157,0.18), rgba(91,174,157,0)); margin:10px 0 16px')} />

            {[
              'Hi there,',
              'I hope this letter finds you well. Congratulations on choosing to become a scientist in Sri Lanka, a decision that takes real courage. I wanted to share a few thoughts with you.',
              'By the time you finish a life science or biomedical degree in Sri Lanka, you are competent in a great many ways. You will have studied human anatomy, biochemistry, microbiology and molecular biology, and perhaps a little bioinformatics along the way. You can design an experiment, run a PCR, read a gel and interpret a blot.',
              'Those fundamentals matter, and I do not want to suggest otherwise. But the world has already moved. Next-generation sequencing is now the first step in a great deal of research and diagnostic work, and artificial intelligence and machine learning have taken over the computational side of biology almost entirely.'
            ].map((p, i) => (
              <p key={i} style={cs('font-family:Newsreader,serif; font-size:15px; line-height:1.45; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:' + (i === 0 ? '0' : '10px') + ' 0 0; max-width:640px')}>{p}</p>
            ))}

            <p style={cs('font-family:Newsreader,serif; font-weight:300; font-size:21px; line-height:1.3; letter-spacing:-0.8px; color:' + BC_INK + '; margin:16px 0 0; max-width:600px')}>
              Which tells us one thing. <b>Bioinformatics</b> is no longer the future of biology — <em style={{ fontStyle: 'italic', background: `linear-gradient(135deg, ${BC_BLUE} 0%, ${BC_TEAL} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>it is its present.</em>
            </p>
            <p style={cs('font-family:Newsreader,serif; font-size:15px; line-height:1.45; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:10px 0 0; max-width:640px')}>It is a multi-billion dollar industry growing at double-digit rates year on year, driven by exactly those two forces, and it is not something we can afford to disregard here. Generating sequence data is no longer the difficult part — the machines are here, in hospitals, in universities, in laboratories across the country. The constraint now is the number of people who can turn what comes off them into an answer.</p>
            <p style={cs('font-family:Newsreader,serif; font-size:15px; line-height:1.45; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:10px 0 0; max-width:640px')}>So, whether you are stepping into a diagnostic laboratory, starting postgraduate research, applying abroad for a PhD, looking for a job, or building a case for residency in another country, bioinformatics matters to you. It has been absorbed into all of the life sciences. That leaves a specific group of people stuck:</p>

            <div style={cs('margin:12px 0 0; max-width:640px; border-top:1px solid rgba(15,26,36,0.08)')}>
              {LETTER_STOPS.map((s, i) => (
                <div key={i} style={cs('display:grid; grid-template-columns:30px 1fr; gap:16px; padding:8px 0; border-bottom:1px solid rgba(15,26,36,0.08)')}>
                  <div style={cs('font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:0.12em; color:' + BC_BLUE + '; padding-top:3px')}>{String(i + 1).padStart(2, '0')}</div>
                  <p style={cs('font-family:Newsreader,serif; font-size:14px; line-height:1.4; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:0')}><b>{s.title}</b> {s.body}</p>
                </div>
              ))}
            </div>

            <h2 style={cs('font-family:Newsreader,serif; font-size:18px; letter-spacing:-0.5px; color:' + BC_INK + '; margin:20px 0 0')}><b>What we are doing about it</b></h2>
            <p style={cs('font-family:Newsreader,serif; font-size:15px; line-height:1.45; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:8px 0 0; max-width:640px')}>The TGB Bio-Coder Programme is our contribution to the next generation of Sri Lankan scientists. We established the Torrington Scholars Institute as a subsidiary specifically to pass on the knowledge and industrial experience we have built up, at a level of access that makes a real difference.</p>
            <p style={cs('font-family:Newsreader,serif; font-size:15px; line-height:1.45; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:10px 0 0; max-width:640px')}>TGB has been running since 2018 as a commercial genomics and bioinformatics company, earning from real analyses for real clients, locally and internationally. Eight years on we are still doing exactly that, and it is what funds this. Teaching has never been our revenue model. We ask a reasonable fee to cover what the programme costs us to run, and nothing beyond it. <strong style={{ color: BC_INK }}>If the fee is a barrier, write to us.</strong> We set aside a limited number of reduced-fee and fully waived places in each cohort, decided case by case.</p>

            <h2 style={cs('font-family:Newsreader,serif; font-size:18px; letter-spacing:-0.5px; color:' + BC_INK + '; margin:20px 0 0')}><b>How the programme is built</b></h2>
            <p style={cs('font-family:Newsreader,serif; font-size:15px; line-height:1.45; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:10px 0 0; max-width:640px')}>Our programme has two parts that run together. The <strong style={{ color: BC_INK }}>industrial traineeship</strong> is the core of it — a tiered internship inside our working company, with three points at which you can stop. Each figure is your total time with us, not an addition to the one before it.</p>

            <div style={cs('display:grid; grid-template-columns:1fr 1fr 1fr; max-width:640px; margin:12px 0 0; gap:24px; padding:10px 0; border-top:1px solid rgba(15,26,36,0.08); border-bottom:1px solid rgba(15,26,36,0.08)')}>
              {[['6 weeks', 'TIER 1 · APPLIED BIOINFORMATICS'], ['3 months', 'TIER 2 · MULTI-OMIC BIOINFORMATICS & NGS'], ['6 months', 'TIER 3 · RESEARCH FELLOWSHIP']].map(([n, l]) => (
                <div key={l}>
                  <div style={cs('font-family:Newsreader,serif; font-weight:300; font-size:21px; letter-spacing:-1px; color:' + BC_INK + '; line-height:1')}>{n}</div>
                  <div style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.13em; text-transform:uppercase; color:' + BC_DIM + '; margin-top:7px')}>{l}</div>
                </div>
              ))}
            </div>

            <p style={cs('font-family:Newsreader,serif; font-size:15px; line-height:1.45; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:10px 0 0; max-width:640px')}>It is complemented by the <strong style={{ color: BC_INK }}>Bio-Coder Bridge Programme</strong>, offered free of charge: a complete foundation course in bioinformatics, molecular biology and genomics. What you get access to, in practice:</p>

            <div style={cs('margin:12px 0 0; max-width:640px; border-top:1px solid rgba(15,26,36,0.08)')}>
              {LETTER_ACCESS.map((a) => (
                <div key={a.label} style={cs('display:grid; grid-template-columns:152px 1fr; gap:18px; padding:8px 0; border-bottom:1px solid rgba(15,26,36,0.08); align-items:baseline')}>
                  <div style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:0.13em; text-transform:uppercase; color:' + BC_BLUE)}>{a.label}</div>
                  <p style={cs('font-family:Newsreader,serif; font-size:14px; line-height:1.38; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:0')}>{a.body}</p>
                </div>
              ))}
            </div>

            <h2 style={{ ...cs('font-family:Newsreader,serif; font-size:18px; letter-spacing:-0.5px; margin:20px 0 0'), color: BC_TEAL }}><span style={{ color: BC_INK }}><b>One thing I want to be honest about</b></span></h2>
            <p style={cs('font-family:Newsreader,serif; font-size:15px; line-height:1.45; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:10px 0 0; max-width:640px')}>Six weeks will not make you a professional bioinformatician, and I am not going to pretend otherwise. What it will put you in is the top 1% of scientists here who can handle real biological data at scale, and who can tell when an analysis has gone wrong.</p>
            <p style={cs('font-family:Newsreader,serif; font-size:15px; line-height:1.45; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:10px 0 0; max-width:640px')}><b><i>I hope you will make the most of this. We built it carefully, and we built it for you.</i></b></p>

            <div style={cs('margin:22px 0 0; max-width:640px; display:grid; grid-template-columns:1fr auto; gap:32px; align-items:end')}>
              <div>
                <p style={cs('font-family:Newsreader,serif; font-size:15px; line-height:1.45; color:' + BC_INK2 + '; margin:0')}>All the best,</p>
                <img src="assets/signature.png" alt="Nilaksha Freeson signature" style={cs('width:200px; height:auto; display:block; margin:4px 0 0; margin-left:-6px')} />
                <div style={cs('font-family:Newsreader,serif; font-weight:500; font-style:italic; font-size:24px; letter-spacing:-0.6px; color:' + BC_INK + '; margin-top:4px')}>Nilaksha Freeson</div>
                <div style={cs('font-family:Newsreader,serif; font-size:12.5px; line-height:1.45; color:' + BC_DIM + '; margin-top:4px')}>Co-Founder, Director and CEO, Torrington Genomics &amp; Bioinformatics (Pvt) Ltd<br />Former National Consultant in Bioinformatics for Apeksha Hospital<br />Visiting Bioinformatics Scientist, Faculty of Medicine, University of Colombo</div>
              </div>
            </div>

            <div style={cs('margin:18px 0 0; max-width:640px; padding-top:12px; border-top:1px solid rgba(15,26,36,0.08)')}>
              <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; letter-spacing:0.14em; text-transform:uppercase; color:' + BC_BLUE)}>P.S.</span>
              <p style={cs('font-family:Newsreader,serif; font-size:13px; line-height:1.45; color:' + BC_INK2 + '; text-align:justify; hyphens:auto; margin:8px 0 0')}>To ensure every trainee gets genuine hands-on supervision from our core team, we keep each intake small and strictly curated. We do not run open public registrations. If you feel this traineeship aligns with your goals, please visit <a href="/bio-coder" style={{ fontWeight: 600, color: BC_BLUE }}>torrington-gb.com/bio-coder</a> to complete our interactive application.</p>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

// ---- Pathway & curriculum (animated helix + 3 stops + module browser) ----
function helixRungs() {
  const H = 480, RUNGS = 21, SUB = 2, WIDTH = 190;
  const steps = (RUNGS - 1) * SUB + 1;
  const B = [61, 168, 200], T = [91, 174, 157];
  const mix = (a, b, tt) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * tt)).join(',') + ')';
  const out = [];
  for (let i = 0; i < steps; i++) {
    const tt = i / (steps - 1);
    const taper = Math.min(1, Math.sin(Math.PI * tt) * 1.9);
    const w = WIDTH * (0.72 + 0.28 * taper);
    const c1 = mix(B, T, tt), c2 = mix(T, B, tt);
    const isRung = i % SUB === 0;
    const d = isRung ? 7 * (0.7 + 0.3 * taper) : 3 * (0.7 + 0.3 * taper);
    out.push({
      wrap: 'position:absolute; left:50%; top:' + (tt * H).toFixed(1) + 'px; transform-style:preserve-3d; transform:rotateY(' + ((i / SUB) * 30) + 'deg)',
      bar: isRung ? 'position:absolute; left:' + (-w / 2).toFixed(1) + 'px; top:-0.5px; width:' + w.toFixed(1) + 'px; height:1px; border-radius:1px; background:linear-gradient(90deg,' + c1 + ',' + c2 + '); opacity:' + (0.42 * (0.4 + 0.6 * taper)).toFixed(3) : null,
      d1: 'position:absolute; left:' + (-w / 2 - d / 2).toFixed(1) + 'px; top:' + (-d / 2).toFixed(1) + 'px; width:' + d.toFixed(1) + 'px; height:' + d.toFixed(1) + 'px; border-radius:999px; background:' + c1 + '; box-shadow:0 0 8px ' + c1,
      d2: 'position:absolute; left:' + (w / 2 - d / 2).toFixed(1) + 'px; top:' + (-d / 2).toFixed(1) + 'px; width:' + d.toFixed(1) + 'px; height:' + d.toFixed(1) + 'px; border-radius:999px; background:' + c2 + '; box-shadow:0 0 8px ' + c2
    });
  }
  return out;
}
const HELIX_RUNGS = helixRungs();

function BCPathway() {
  const [stop, setStopN] = React.useState(1);
  const [prog, setProg] = React.useState('bridge');
  const [modIndex, setModIndex] = React.useState(0);

  const setStop = (n) => () => {
    setStopN(n);
    setProg(n === 1 ? 'bridge' : n === 2 ? 't2' : n === 3 ? 't3' : 'custom');
    setModIndex(0);
  };

  const pill = (n, topPx) => {
    const sel = stop === n;
    return cs('position:absolute; left:0; right:0; top:' + topPx + 'px; transform:translateY(-50%); z-index:3; display:flex; align-items:center; gap:12px; padding:10px 18px 10px 10px; border-radius:999px; cursor:pointer; text-align:left'
      + (sel ? '; border:1px solid transparent; background:#fff; color:#0d201e; box-shadow:inset 0 0 0 1.5px #7fd0b8'
             : '; border:1px solid rgba(255,255,255,0.18); background:#102623; color:rgba(255,255,255,0.72)'));
  };
  const disc = (n) => {
    const sel = stop === n;
    return cs('flex:none; width:34px; height:34px; border-radius:999px; display:flex; align-items:center; justify-content:center; font-family:"JetBrains Mono",monospace; font-size:11px; font-weight:700'
      + (sel ? '; background:' + BC_GRAD + '; color:#fff' : '; background:rgba(255,255,255,0.10); color:rgba(255,255,255,0.72)'));
  };

  const p = PROGS[prog];
  const mods = p.modules;
  const mi = Math.min(modIndex, mods.length - 1);
  const mod = mods[mi];
  const showSubTabs = stop === 1;
  const showWeeks = prog === 't1';

  return (
    <section id="pathway" style={cs('max-width:1240px; margin:0 auto clamp(28px,5vw,56px); padding:0 clamp(20px,5vw,56px)')}>
      <div style={cs('border-radius:16px; background:' + BC_FOREST + '; padding:clamp(28px,4vw,52px) clamp(24px,4vw,56px) clamp(32px,5vw,72px)')}>
        <style>{`
          @keyframes bcHelixSpin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
          @media (prefers-reduced-motion: reduce) { .bc-helix { animation: none !important; } }
          .bc-curriculum-grid { display: grid; grid-template-columns: minmax(0,300px) minmax(0,1fr); gap: clamp(24px,4vw,44px); align-items: start; }
          @media (max-width: 860px) { .bc-curriculum-grid { grid-template-columns: 1fr; } .bc-curriculum-grid > div:first-child { max-width: 340px; margin: 0 auto; width: 100%; } }
        `}</style>
        <div style={cs('display:flex; align-items:center; gap:10px; margin-bottom:26px')}>
          <span style={{ width: 24, height: 1, background: BC_GRAD }} />
          <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:rgba(255,255,255,0.62)')}>02 — The pathway &amp; curriculum</span>
        </div>
        <h2 style={cs('margin:0 0 14px; max-width:22ch; font-family:Newsreader,serif; font-weight:300; font-size:clamp(32px,4.6vw,58px); line-height:1.04; letter-spacing:-2.2px; color:#fff')}>
          One pathway, <em style={{ fontStyle: 'italic', background: BC_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>four places to stop</em>
        </h2>
        <p style={cs('margin:0 0 34px; max-width:64ch; font-size:15px; line-height:1.7; color:rgba(255,255,255,0.62)')}>Each figure is your total time with us, not an addition to the one before it. Pick a stop on the strand to see what it covers.</p>

        <div id="curriculum" className="bc-curriculum-grid">
          <div style={{ minWidth: 0 }}>
            <div style={cs('position:relative; height:480px; perspective:1400px; overflow:hidden')}>
              <div style={cs('position:absolute; left:50%; top:50%; width:340px; height:340px; transform:translate(-50%,-50%); background:radial-gradient(circle, rgba(91,174,157,0.14), transparent 65%); pointer-events:none')} />
              <div className="bc-helix" style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', animation: 'bcHelixSpin 34s linear infinite', pointerEvents: 'none' }}>
                {HELIX_RUNGS.map((r, i) => (
                  <div key={i} style={cs(r.wrap)}>
                    {r.bar && <div style={cs(r.bar)} />}
                    <div style={cs(r.d1)} />
                    <div style={cs(r.d2)} />
                  </div>
                ))}
              </div>
              <button type="button" onClick={setStop(1)} style={pill(1, 84)}>
                <span style={disc(1)}>01</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left', minWidth: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.25 }}>Tier 1 + Bridge Programme</span>
                  <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:1.4px; text-transform:uppercase; opacity:0.75')}>6 weeks</span>
                </span>
              </button>
              <button type="button" onClick={setStop(2)} style={pill(2, 188)}>
                <span style={disc(2)}>02</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left', minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25 }}>Tier 2</span>
                  <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:1.4px; text-transform:uppercase; opacity:0.75')}>3 months total</span>
                </span>
              </button>
              <button type="button" onClick={setStop(3)} style={pill(3, 292)}>
                <span style={disc(3)}>03</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left', minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25 }}>Tier 3</span>
                  <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:1.4px; text-transform:uppercase; opacity:0.75')}>6 months total</span>
                </span>
              </button>
              <button type="button" onClick={setStop(4)} style={pill(4, 396)}>
                <span style={disc(4)}>04</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left', minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25 }}>Custom track</span>
                  <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:1.4px; text-transform:uppercase; opacity:0.75')}>Scoped with you</span>
                </span>
              </button>
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            {showSubTabs &&
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {['bridge', 't1'].map((k) => {
                const sel = prog === k;
                return (
                  <button key={k} type="button" onClick={() => { setProg(k); setModIndex(0); }} style={cs('display:inline-flex; align-items:center; gap:10px; padding:10px 18px; border-radius:999px; cursor:pointer'
                    + (sel ? '; border:1px solid transparent; background:rgba(91,174,157,0.22); color:#fff; box-shadow:inset 0 0 0 1.5px #7fd0b8'
                           : '; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.72)'))}>
                    <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; font-weight:700; letter-spacing:1.6px; text-transform:uppercase')}>{PROGS[k].code}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{PROGS[k].name}</span>
                  </button>
                );
              })}
            </div>}

            <div style={cs('border:1px solid rgba(255,255,255,0.14); border-radius:16px; overflow:hidden')}>
              <div style={cs('padding:clamp(20px,2.6vw,28px); background:rgba(255,255,255,0.04); border-bottom:1px solid rgba(255,255,255,0.14)')}>
                <div style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:#7fd0b8; margin-bottom:10px')}>{p.kicker}</div>
                <h3 style={cs('margin:0 0 10px; font-family:Newsreader,serif; font-weight:300; font-size:clamp(23px,2.6vw,30px); line-height:1.1; letter-spacing:-1.2px; color:#fff')}>{p.full}</h3>
                <p style={cs('margin:0 0 8px; font-size:13.5px; line-height:1.65; color:rgba(255,255,255,0.80)')}>{p.lead}</p>
                <div>
                  <div style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:rgba(255,255,255,0.62); margin-bottom:7px')}>Assessment</div>
                  <p style={cs('margin:0; font-size:12.5px; line-height:1.6; color:rgba(255,255,255,0.80)')}>{p.assessment}</p>
                </div>
              </div>

              <div style={cs('display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:1px; background:rgba(255,255,255,0.14)')}>
                <div style={cs('background:rgba(255,255,255,0.02); min-width:0; display:flex; flex-direction:column')}>
                  <div style={cs('display:flex; align-items:baseline; justify-content:space-between; gap:12px; padding:14px 22px; border-bottom:1px solid rgba(255,255,255,0.14)')}>
                    <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:rgba(255,255,255,0.62)')}>Modules</span>
                    <span style={cs('font-family:"JetBrains Mono",monospace; font-size:10.5px; color:rgba(255,255,255,0.62)')}>{p.count}</span>
                  </div>
                  <div>
                    {mods.map((m, i) => {
                      const nested = /^T\d/.test(m.code);
                      const firstNested = nested && !/^T\d/.test((mods[i - 1] || {}).code || '');
                      return (
                        <React.Fragment key={m.code}>
                          {firstNested &&
                          <div style={cs('padding:9px 22px; background:rgba(127,208,184,0.10); border-bottom:1px solid rgba(255,255,255,0.07); font-family:"JetBrains Mono",monospace; font-size:9px; font-weight:700; letter-spacing:1.6px; text-transform:uppercase; color:#7fd0b8')}>Mentored tracks</div>}
                          <button type="button" onClick={() => setModIndex(i)} style={cs('position:relative; display:flex; gap:14px; align-items:baseline; width:100%; padding:14px 22px 14px ' + (nested ? '38px' : '22px') + '; border:none; border-bottom:1px solid rgba(255,255,255,0.07); cursor:pointer; text-align:left'
                            + (i === mi ? '; background:rgba(255,255,255,0.07); box-shadow:inset 2px 0 0 0 #7fd0b8' : '; background:rgba(255,255,255,0.02)'))}>
                            {nested && <div style={cs('position:absolute; left:22px; top:0; bottom:0; width:1px; background:rgba(127,208,184,0.35)')} />}
                            <span style={cs('font-family:"JetBrains Mono",monospace; font-size:10.5px; color:#7fd0b8; min-width:30px; text-align:left')}>{m.code}</span>
                            <span style={{ flex: 1, fontSize: 13, lineHeight: 1.45, color: '#fff', textAlign: 'left' }}>{m.title}</span>
                            <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; color:rgba(255,255,255,0.62)')}>{nested ? '' : m.meta || ''}</span>
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                <div key={mod.code} style={cs('padding:clamp(20px,2.6vw,28px); background:rgba(255,255,255,0.045); min-width:0; display:grid; gap:18px; align-content:start')}>
                  <style>{`@keyframes bcModRise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>
                  <div style={{ animation: 'bcModRise 0.25s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                      <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:#7fd0b8; padding:5px 10px; border-radius:999px; background:rgba(91,174,157,0.22)')}>{mod.code}</span>
                      {mod.meta && <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; letter-spacing:1.4px; text-transform:uppercase; color:rgba(255,255,255,0.62)')}>{mod.meta}</span>}
                    </div>
                    <h4 style={cs('margin:0 0 10px; font-family:Newsreader,serif; font-weight:400; font-size:22px; line-height:1.15; letter-spacing:-0.9px; color:#fff')}>{mod.title}</h4>
                    {!mod.code.startsWith('B') && <p style={cs('margin:0; font-size:13px; line-height:1.7; color:rgba(255,255,255,0.62)')}>{mod.blurb}</p>}
                  </div>
                  <div style={{ display: 'grid', gap: 18 }}>
                    {mod.topics.map((g) => (
                      <div key={g.group} style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{g.group}</div>
                        <div style={{ display: 'grid', gap: 6 }}>
                          {g.items.map((it) => (
                            <div key={it.text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                              <span style={cs('width:5px; height:5px; margin-top:6px; border-radius:999px; background:#7fd0b8; flex:none')} />
                              <span style={{ fontSize: 12.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.62)' }}>{it.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {mod.deliverable &&
                  <div style={cs('padding-top:14px; border-top:1px solid rgba(255,255,255,0.14)')}>
                    <div style={cs('font-family:"JetBrains Mono",monospace; font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:#7fd0b8; margin-bottom:8px')}>Deliverable</div>
                    <p style={cs('margin:0; font-size:12.5px; line-height:1.6; color:rgba(255,255,255,0.80)')}>{mod.deliverable}</p>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- What you get access to ----
function BCAccess() {
  return (
    <section id="access" style={cs('max-width:1240px; margin:0 auto; padding:clamp(28px,4vw,52px) clamp(20px,5vw,56px) clamp(48px,7vw,100px); border-top:1px solid ' + BC_LINE)}>
      <style>{`
        .bc-access-tile:hover { background: ${BC_PAPER2} !important; }
        .bc-access-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: ${BC_LINE}; border: 1px solid ${BC_LINE}; border-radius: 16px; overflow: hidden; }
        @media (max-width: 920px) { .bc-access-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .bc-access-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={cs('display:flex; align-items:center; gap:10px; margin-bottom:26px')}>
        <span style={{ width: 24, height: 1, background: BC_GRAD }} />
        <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:' + BC_DIM)}>03 — What you get access to</span>
      </div>
      <h2 style={cs('margin:0 0 34px; max-width:26ch; font-family:Newsreader,serif; font-weight:300; font-size:clamp(32px,4.6vw,58px); line-height:1.04; letter-spacing:-2.2px; color:' + BC_INK)}>
        Become practising scientists, <em style={{ fontStyle: 'italic', background: BC_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>not observers</em>
      </h2>
      <div className="bc-access-grid">
        {ACCESS.map((a) => (
          <div key={a.n} className="bc-access-tile" style={cs('background:' + BC_PAPER + '; padding:clamp(22px,2.6vw,30px); display:flex; flex-direction:column; gap:12px; min-width:0; transition:background 0.15s ease')}>
            <div style={cs('width:100%; height:150px; border-radius:10px; background:' + BC_PAPER2 + '; border:1px solid ' + BC_LINE + '; display:flex; flex-direction:column; justify-content:center; padding:16px 18px; box-sizing:border-box')}>
              <a.Icon />
            </div>
            <span style={cs('font-family:"JetBrains Mono",monospace; font-size:11px; color:#2c7466')}>{a.n}</span>
            <div style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' + BC_INK)}>{a.label}</div>
            <p style={cs('margin:0; font-size:13.5px; line-height:1.6; color:' + BC_DIM)}>{a.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- Apply (5-step wizard) ----
function BCApply() {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    fullName: '', email: '', phone: '', city: '', role: '',
    institution: '', degreeLevel: '', degreeLevelOther: '', fieldOfStudy: '', fieldOfStudyOther: '', year: '', computing: '', hasData: '', dataDetail: '',
    tier: '', track: '', customNeed: '', statement: '', refName: '', refEmail: '', fee: 'full', feeDetail: ''
  });
  const [formError, setFormError] = React.useState('');
  const [declared, setDeclared] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [appRef, setAppRef] = React.useState('');

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const miss = [];
    if (step === 1) {
      if (!form.fullName.trim()) miss.push('full name');
      if (!form.phone.trim()) miss.push('mobile number');
      if (!form.city.trim()) miss.push('city or district');
      if (!form.role) miss.push('how you would describe yourself');
    } else if (step === 2) {
      if (!form.institution.trim()) miss.push('institution');
      if (!form.computing) miss.push('computing experience');
      if (!form.hasData) miss.push('whether you have your own data');
    } else if (step === 3) {
      if (!form.tier) miss.push('exit point');
      if (form.tier === 'custom' && (form.customNeed.trim() ? form.customNeed.trim().split(/\s+/).length : 0) < 10) miss.push('what you need for the custom track (at least 10 words)');
      if (!form.fee) miss.push('whether you are applying for a fee waiver');
      if (form.fee === 'waiver' && (form.feeDetail.trim() ? form.feeDetail.trim().split(/\s+/).length : 0) < 15) miss.push('your circumstances (at least 15 words)');
    }
    return miss;
  };

  const next = () => {
    const miss = validate();
    if (miss.length) return setFormError('Still needed: ' + miss.join(', ') + '.');
    setFormError('');
    setStep((s) => Math.min(5, s + 1));
  };
  const back = () => { setFormError(''); setStep((s) => Math.max(1, s - 1)); };

  const submit = () => {
    if (!declared) return setFormError('Please confirm the declaration before submitting.');
    setSubmitting(true);
    setFormError('');
    fetch(BIOCODER_FORM_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        const ref = 'TGB-BC-' + String(Math.floor(1000 + Math.random() * 9000)) + '-' + String(new Date().getFullYear()).slice(2);
        setAppRef(ref);
        setSubmitted(true);
      })
      .catch(() => setFormError('Something went wrong sending your application — please email us directly at scholars@torrington-gb.com.'))
      .finally(() => setSubmitting(false));
  };

  const chipStyle = (sel) => cs('padding:10px 18px; border-radius:999px; cursor:pointer; font-size:13px; font-weight:600'
    + (sel ? '; border:1px solid transparent; background:rgba(91,174,157,0.20); color:' + BC_INK + '; box-shadow:inset 0 0 0 1.5px ' + BC_TEAL
           : '; border:1px solid ' + BC_LINE + '; background:' + BC_PAPER + '; color:' + BC_INK2));
  const rowStyle = (sel) => cs('display:flex; gap:16px; align-items:baseline; flex-wrap:wrap; width:100%; padding:16px 20px; border:none; cursor:pointer; text-align:left; color:' + BC_INK
    + (sel ? '; background:rgba(91,174,157,0.10); box-shadow:inset 0 0 0 1.5px ' + BC_TEAL : '; background:' + BC_PAPER));
  const fieldStyle = { width: '100%', boxSizing: 'border-box', padding: '13px 20px', border: `1px solid ${BC_LINE}`, borderRadius: 999, background: BC_PAPER2, fontSize: 14, color: BC_INK, outline: 'none', fontFamily: 'inherit' };
  const taStyle = { ...fieldStyle, borderRadius: 18, lineHeight: 1.65, resize: 'vertical' };
  const label = { display: 'grid', gap: 7 };
  const labelCap = cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' + BC_DIM);

  const words = form.statement.trim() ? form.statement.trim().split(/\s+/).length : 0;
  const feeWords = form.feeDetail.trim() ? form.feeDetail.trim().split(/\s+/).length : 0;
  const tierInfo = TIERS.find((x) => x.v === form.tier);
  const review = [
    ['Name', form.fullName || '—'],
    ['Email', form.email || '—'],
    ['Contact', (form.phone || '—') + ' · ' + (form.city || '—')],
    ['Position', form.role || '—'],
    ['Institution', form.institution || '—'],
    ['Degree level', (form.degreeLevel === 'Other' ? form.degreeLevelOther || 'Other' : form.degreeLevel) || '—'],
    ['Field of study', (form.fieldOfStudy === 'Other' ? form.fieldOfStudyOther || 'Other' : form.fieldOfStudy) || '—'],
    ['Year / graduation', form.year || '—'],
    ['Computing', (COMPUTING.find((x) => x.v === form.computing) || {}).label || '—'],
    ['Own data', ((DATA_OPTS.find((x) => x.v === form.hasData) || {}).label || '—') + (form.dataDetail ? ' — ' + form.dataDetail : '')],
    ['Applying for', tierInfo ? tierInfo.label + ' (' + tierInfo.duration + ')' + (tierInfo.price ? ' · ' + tierInfo.price : '') : '—'],
    ['Tier 3 track', form.tier === 'full' ? form.track || 'Undecided' : 'Not applicable'],
    ['Custom track details', form.tier === 'custom' ? form.customNeed || '—' : 'Not applicable'],
    ['Statement', form.statement || '—'],
    ['Referee', form.refName ? form.refName + (form.refEmail ? ' · ' + form.refEmail : '') : 'None given'],
    ['Fee waiver', ((FEES.find((x) => x.v === form.fee) || {}).label || '—') + (form.feeDetail ? ' — ' + form.feeDetail : '')]
  ];

  return (
    <section id="apply" style={cs('max-width:1240px; margin:0 auto; padding:clamp(28px,4vw,52px) clamp(20px,5vw,56px) clamp(48px,7vw,100px); border-top:1px solid ' + BC_LINE)}>
      <style>{`
        .bc-apply-grid { display: grid; grid-template-columns: minmax(260px,1fr) minmax(0,2fr); gap: clamp(28px,4vw,56px); align-items: start; }
        @media (max-width: 760px) { .bc-apply-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={cs('display:flex; align-items:center; gap:10px; margin-bottom:26px')}>
        <span style={{ width: 24, height: 1, background: BC_GRAD }} />
        <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:' + BC_DIM)}>04 — Application</span>
      </div>
      <div className="bc-apply-grid">
        <div style={{ minWidth: 0 }}>
          <h2 style={cs('margin:0 0 18px; font-family:Newsreader,serif; font-weight:300; font-size:clamp(32px,4.6vw,58px); line-height:1.04; letter-spacing:-2.2px; color:' + BC_INK)}>
            Apply to the <em style={{ fontStyle: 'italic', background: BC_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>next cohort</em>
          </h2>
          <p style={cs('margin:0 0 26px; max-width:52ch; font-size:15px; line-height:1.7; color:' + BC_DIM)}>Five short steps. We review every entry individually and issue formal invitations to the candidates selected for the next cohort, including those applying for a fee waiver.</p>
          <div style={cs('display:grid; gap:1px; background:' + BC_LINE + '; border:1px solid ' + BC_LINE + '; border-radius:14px; overflow:hidden')}>
            {STEP_LABELS.map((l, i) => {
              const n = i + 1, done = step > n, active = step === n;
              return (
                <div key={l} style={cs('display:flex; gap:14px; align-items:center; padding:15px 22px'
                  + (active ? '; background:rgba(91,174,157,0.10); color:' + BC_INK + '; box-shadow:inset 2px 0 0 0 ' + BC_TEAL : '; background:' + BC_PAPER + '; color:' + BC_DIM))}>
                  <span style={cs('font-family:"JetBrains Mono",monospace; font-size:11px; min-width:24px')}>{'0' + n}</span>
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{l}</span>
                  <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; letter-spacing:1.4px; text-transform:uppercase')}>{done ? 'Done' : active ? 'Now' : ''}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={cs('min-width:0; border:1px solid ' + BC_LINE + '; border-radius:16px; background:' + BC_PAPER + '; overflow:hidden')}>
          <div style={cs('padding:20px 26px; border-bottom:1px solid ' + BC_LINE + '; background:' + BC_PAPER2 + '; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap')}>
            <div style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' + BC_DIM)}>Step {step} of 5 — {STEP_LABELS[step - 1]}</div>
            <div style={cs('flex:1; min-width:90px; height:3px; border-radius:999px; background:' + BC_PAPER2 + '; overflow:hidden')}>
              <div style={{ height: '100%', width: (step / 5 * 100) + '%', background: BC_GRAD, borderRadius: 999, transition: 'width 0.28s ease' }} />
            </div>
          </div>

          <div style={cs('padding:clamp(24px,3vw,34px); display:grid; gap:20px')}>

            {step === 1 &&
            <div style={{ display: 'grid', gap: 18 }}>
              <label style={label}><span style={labelCap}>Full name</span>
                <input type="text" value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} placeholder="Your name" style={fieldStyle} />
              </label>
              <label style={label}><span style={labelCap}>Email</span>
                <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="Institutional address preferred — a personal one is fine" style={fieldStyle} />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
                <label style={label}><span style={labelCap}>Mobile</span>
                  <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+94 7X XXX XXXX" style={fieldStyle} />
                </label>
                <label style={label}><span style={labelCap}>City / district</span>
                  <select value={form.city} onChange={(e) => setField('city', e.target.value)} style={fieldStyle}>
                    <option value="" disabled>Select a district</option>
                    {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <span style={labelCap}>How would you describe yourself right now</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ROLES.map((r) => <button key={r} type="button" onClick={() => setField('role', r)} style={chipStyle(form.role === r)}>{r}</button>)}
                </div>
              </div>
            </div>}

            {step === 2 &&
            <div style={{ display: 'grid', gap: 18 }}>
              <label style={label}><span style={labelCap}>Institution</span>
                <input type="text" value={form.institution} onChange={(e) => setField('institution', e.target.value)} placeholder="University, hospital, institute or company" style={fieldStyle} />
              </label>
              <div style={{ display: 'grid', gap: 10 }}>
                <span style={labelCap}>Degree level <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>— optional</span></span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {DEGREE_LEVELS.map((r) => <button key={r} type="button" onClick={() => setField('degreeLevel', r)} style={chipStyle(form.degreeLevel === r)}>{r}</button>)}
                </div>
                {form.degreeLevel === 'Other' && <input type="text" value={form.degreeLevelOther} onChange={(e) => setField('degreeLevelOther', e.target.value)} placeholder="Please specify" style={fieldStyle} />}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <span style={labelCap}>Field of study <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>— optional</span></span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {FIELDS.map((r) => <button key={r} type="button" onClick={() => setField('fieldOfStudy', r)} style={chipStyle(form.fieldOfStudy === r)}>{r}</button>)}
                </div>
                {form.fieldOfStudy === 'Other' && <input type="text" value={form.fieldOfStudyOther} onChange={(e) => setField('fieldOfStudyOther', e.target.value)} placeholder="Please specify" style={fieldStyle} />}
              </div>
              <label style={{ ...label, maxWidth: 280 }}><span style={labelCap}>Year / graduation <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>— optional</span></span>
                <input type="text" value={form.year} onChange={(e) => setField('year', e.target.value)} placeholder="e.g. final year, 2027" style={fieldStyle} />
              </label>
              <div style={{ display: 'grid', gap: 10 }}>
                <span style={labelCap}>Bioinformatics experience</span>
                <div style={cs('display:grid; gap:1px; background:' + BC_LINE + '; border:1px solid ' + BC_LINE + '; border-radius:14px; overflow:hidden')}>
                  {COMPUTING.map((o) => (
                    <button key={o.v} type="button" onClick={() => setField('computing', o.v)} style={rowStyle(form.computing === o.v)}>
                      <span style={{ flex: 1, textAlign: 'left', fontSize: 13.5, fontWeight: 600 }}>{o.label}</span>
                      <span style={{ fontSize: 12, textAlign: 'left', color: BC_DIM }}>{o.hint}</span>
                    </button>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: BC_DIM }}>No programming or bioinformatics experience is required to apply. Most applicants arrive with none — the course is built for it.</p>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <span style={labelCap}>Do you have your own biological data</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {DATA_OPTS.map((o) => <button key={o.v} type="button" onClick={() => setField('hasData', o.v)} style={chipStyle(form.hasData === o.v)}>{o.label}</button>)}
                </div>
              </div>
              {(form.hasData === 'yes' || form.hasData === 'maybe') &&
              <label style={label}><span style={labelCap}>Tell us about the dataset</span>
                <textarea rows={3} value={form.dataDetail} onChange={(e) => setField('dataDetail', e.target.value)} placeholder="Organism, assay, approximate sample count, and who holds it" style={taStyle} />
              </label>}
            </div>}

            {step === 3 &&
            <div style={{ display: 'grid', gap: 18 }}>
              <div style={{ display: 'grid', gap: 10 }}>
                <span style={labelCap}>Which exit point are you applying for</span>
                <div style={cs('display:grid; gap:1px; background:' + BC_LINE + '; border:1px solid ' + BC_LINE + '; border-radius:14px; overflow:hidden')}>
                  <style>{`
                    .bc-tier-row { display: grid !important; grid-template-columns: 70px minmax(0,1.25fr) minmax(0,1fr) 132px; gap: 16px; align-items: center; }
                    @media (max-width: 560px) {
                      .bc-tier-row { grid-template-columns: 1fr auto; row-gap: 4px; }
                      .bc-tier-row .bc-tier-hint { grid-column: 1 / -1; }
                    }
                  `}</style>
                  {TIERS.map((o) => (
                    <button key={o.v} type="button" onClick={() => setField('tier', o.v)} className="bc-tier-row" style={rowStyle(form.tier === o.v)}>
                      <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10.5, color: '#2c7466', minWidth: 62, textAlign: 'left' }}>{o.duration}</span>
                      <span style={{ minWidth: 0, textAlign: 'left', fontSize: 13.5, fontWeight: 600 }}>{o.label}</span>
                      <span className="bc-tier-hint" style={{ minWidth: 0, fontSize: 12, textAlign: 'left', color: BC_DIM }}>{o.hint}</span>
                      <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 12.5, fontWeight: 700, color: BC_INK, textAlign: 'right', whiteSpace: 'nowrap' }}>{o.price}</span>
                    </button>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: BC_DIM }}>Fees are in Sri Lankan rupees and cover the whole period shown. Payment schemes available. The Bridge Programme is included at no extra cost.</p>
              </div>
              {form.tier === 'full' &&
              <div style={{ display: 'grid', gap: 10 }}>
                <span style={labelCap}>Preferred Tier 3 track</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {TRACKS.map((r) => <button key={r} type="button" onClick={() => setField('track', r)} style={chipStyle(form.track === r)}>{r}</button>)}
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: BC_DIM }}>Entry to Tier 3 is by competitive selection and places are limited by mentor capacity. This is a preference, not a commitment.</p>
              </div>}
              {form.tier === 'custom' &&
              <label style={label}><span style={labelCap}>What do you need</span>
                <textarea rows={5} value={form.customNeed} onChange={(e) => setField('customNeed', e.target.value)} placeholder="Tell us what you're looking for — focus area, duration, format, and anything about your situation that a fixed tier doesn't cover." style={taStyle} />
                <span style={cs('font-family:"JetBrains Mono",monospace; font-size:10px; color:' + BC_DIM)}>{form.customNeed.trim() ? form.customNeed.trim().split(/\s+/).length : 0} / 10 words minimum</span>
              </label>}
              <div style={{ display: 'grid', gap: 10 }}>
                <span style={labelCap}>Are you applying for a fee waiver</span>
                <div style={cs('display:grid; gap:1px; background:' + BC_LINE + '; border:1px solid ' + BC_LINE + '; border-radius:14px; overflow:hidden')}>
                  {FEES.map((o) => {
                    const sel = form.fee === o.v;
                    return (
                      <button key={o.v} type="button" onClick={() => setField('fee', o.v)} style={rowStyle(sel)}>
                        <span style={{ flex: '0 0 auto', width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: sel ? `1.5px solid ${BC_TEAL}` : '1.5px solid rgba(15,26,36,0.28)' }}>
                          <span style={{ width: 9, height: 9, borderRadius: '50%', background: sel ? BC_TEAL : 'transparent', transform: sel ? 'scale(1)' : 'scale(0)', transition: 'transform 0.15s ease' }} />
                        </span>
                        <span style={{ flex: 1, textAlign: 'left', fontSize: 13.5, fontWeight: 600 }}>{o.label}</span>
                        <span style={{ fontSize: 12, textAlign: 'left', color: BC_DIM }}>{o.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {form.fee === 'waiver' &&
              <label style={label}><span style={labelCap}>Your circumstances</span>
                <textarea rows={4} value={form.feeDetail} onChange={(e) => setField('feeDetail', e.target.value)} placeholder="Let us know your circumstances and the fee you would be able to pay for this traineeship. Reviewed case by case, and held in confidence." style={taStyle} />
                <span style={cs('font-family:"JetBrains Mono",monospace; font-size:10px; color:' + BC_DIM)}>{feeWords} / 15 words minimum</span>
              </label>}
            </div>}

            {step === 4 &&
            <div style={{ display: 'grid', gap: 18 }}>
              <label style={label}><span style={labelCap}>Why this programme, for you <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>— optional</span></span>
                <textarea rows={5} value={form.statement} onChange={(e) => setField('statement', e.target.value)} placeholder="What you want to be able to do at the end of it, and what you would use it for. A few honest sentences are better than a page." style={taStyle} />
                <span style={cs('font-family:"JetBrains Mono",monospace; font-size:10px; color:' + BC_DIM)}>{words} words</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
                <label style={label}><span style={labelCap}>Referee name (optional)</span>
                  <input type="text" value={form.refName} onChange={(e) => setField('refName', e.target.value)} placeholder="Supervisor or lecturer" style={fieldStyle} />
                </label>
                <label style={label}><span style={labelCap}>Referee email (optional)</span>
                  <input type="email" value={form.refEmail} onChange={(e) => setField('refEmail', e.target.value)} placeholder="name@university.ac.lk" style={fieldStyle} />
                </label>
              </div>
            </div>}

            {step === 5 &&
            <div style={{ display: 'grid', gap: 18 }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: BC_DIM }}>Check this over. Once submitted, your entry goes to the scientists who supervise the tier you have chosen.</p>
              <div style={cs('display:grid; gap:1px; background:' + BC_LINE + '; border:1px solid ' + BC_LINE + '; border-radius:14px; overflow:hidden')}>
                {review.map(([k, v]) => (
                  <div key={k} style={cs('background:' + BC_PAPER + '; padding:13px 20px; display:flex; gap:16px; align-items:baseline; flex-wrap:wrap')}>
                    <span style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:1.6px; text-transform:uppercase; color:' + BC_DIM + '; min-width:140px')}>{k}</span>
                    <span style={{ flex: 1, minWidth: 140, fontSize: 13.5, lineHeight: 1.55, color: BC_INK }}>{v}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setDeclared((d) => !d)} style={cs('display:flex; gap:14px; align-items:flex-start; width:100%; padding:18px 22px; border-radius:14px; cursor:pointer; text-align:left; color:' + BC_INK2
                + (declared ? '; border:1px solid transparent; background:rgba(91,174,157,0.10); box-shadow:inset 0 0 0 1.5px ' + BC_TEAL : '; border:1px solid ' + BC_LINE + '; background:' + BC_PAPER))}>
                <span style={{
                  width: 20, height: 20, flex: 'none', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                  background: declared ? BC_GRAD : BC_PAPER2, color: declared ? '#fff' : 'transparent', border: declared ? '1px solid transparent' : `1px solid ${BC_LINE}`
                }}>✓</span>
                <span style={{ flex: 1, textAlign: 'left', fontSize: 13, lineHeight: 1.6 }}>The information above is accurate, and I agree to TGB contacting me and my referee about this application under TGB's data governance terms.</span>
              </button>
            </div>}

            {formError &&
            <div style={cs('display:flex; gap:9px; align-items:flex-start; padding:12px 16px; border:1px solid rgba(44,116,102,0.18); background:rgba(91,174,157,0.10); border-radius:12px')}>
              <span style={cs('font-family:"JetBrains Mono",monospace; font-size:10px; color:#2c7466; line-height:1.6')}>!</span>
              <span style={{ fontSize: 12.5, lineHeight: 1.55, color: BC_INK2 }}>{formError}</span>
            </div>}

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', paddingTop: 4 }}>
              {step > 1 &&
              <button type="button" onClick={back} style={cs('padding:13px 26px; border-radius:999px; border:1px solid ' + BC_LINE + '; background:rgba(255,255,255,0.70); color:' + BC_INK + '; font-size:13px; font-weight:600; cursor:pointer')}>Back</button>}
              {step === 5
                ? <button type="button" disabled={submitting} onClick={submit} style={{ ...cs('padding:14px 28px; border:none; border-radius:999px; background:' + BC_GRAD + '; color:#fff; font-size:13.5px; font-weight:600; cursor:pointer; box-shadow:0 12px 36px -10px rgba(44,116,102,0.55)'), opacity: submitting ? 0.6 : 1, cursor: submitting ? 'default' : 'pointer' }}>{submitting ? 'Sending…' : 'Submit application →'}</button>
                : <button type="button" onClick={next} style={cs('padding:14px 28px; border:none; border-radius:999px; background:' + BC_GRAD + '; color:#fff; font-size:13.5px; font-weight:600; cursor:pointer; box-shadow:0 12px 36px -10px rgba(44,116,102,0.55)')}>Continue →</button>}
              <span style={{ fontSize: 12, color: BC_DIM }}>{STEP_HINTS[step - 1]}</span>
            </div>
          </div>
        </div>
      </div>

      {submitted &&
      <div style={cs('position:fixed; inset:0; z-index:80; background:rgba(6,12,18,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:24px')}>
        <div style={cs('width:100%; max-width:480px; background:' + BC_PAPER + '; border-radius:20px; padding:clamp(28px,4vw,40px); box-shadow:0 30px 80px -20px rgba(0,0,0,0.5); display:grid; gap:18px; justify-items:start')}>
          <div style={cs('width:56px; height:56px; border-radius:999px; background:' + BC_GRAD + '; display:flex; align-items:center; justify-content:center; color:#fff; font-size:24px')}>✓</div>
          <h3 style={cs('margin:0; font-family:Newsreader,serif; font-weight:300; font-size:30px; line-height:1.1; letter-spacing:-1.3px; color:' + BC_INK)}>Application received</h3>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: BC_DIM }}>Thank you. We review every entry individually and issue formal invitations to the candidates selected for the next cohort. You will hear from us at the email address you gave.</p>
          <div style={cs('width:100%; padding:14px 20px; border:1px solid ' + BC_LINE + '; border-radius:12px; background:' + BC_PAPER2)}>
            <div style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' + BC_DIM + '; margin-bottom:6px')}>Your reference</div>
            <div style={cs('font-family:"JetBrains Mono",monospace; font-size:15px; color:' + BC_INK)}>{appRef}</div>
          </div>
          <button type="button" onClick={() => setSubmitted(false)} style={cs('padding:13px 28px; border:none; border-radius:999px; background:' + BC_GRAD + '; color:#fff; font-size:13.5px; font-weight:600; cursor:pointer')}>Close</button>
        </div>
      </div>}
    </section>
  );
}

// ---- Footer ----
function BCFooter() {
  const stream = 'ACGTTGACCAGTTACGGATCCGTAAGCTTACGGTCAGATCCGTAAGGCATTACGGATCCGTTAGCACGTTGACCAGTTACGGATCCGTAAGCTTACGGTCAGATCCGTAAGGCATTACGGATCCGTTAGC'.repeat(4);
  return (
    <footer style={cs('position:relative; background:' + BC_FOREST + '; overflow:hidden; margin-top:clamp(40px,6vw,80px)')}>
      <style>{`@keyframes bcAtgcDrift { from { transform: translateY(0); } to { transform: translateY(-50%); } }`}</style>
      <div style={cs('position:absolute; inset:0; opacity:0.55; mask-image:linear-gradient(to bottom,#000,transparent); pointer-events:none')}>
        <div style={cs('font-family:"JetBrains Mono",monospace; font-size:11px; letter-spacing:7px; color:rgba(255,255,255,0.10); line-height:2.4; white-space:pre-wrap; word-break:break-all')}>{stream}</div>
      </div>
      <div style={cs('position:relative; max-width:1240px; margin:0 auto; padding:clamp(48px,7vw,90px) clamp(20px,5vw,56px)')}>
        <div style={cs('display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:clamp(28px,4vw,56px)')}>
          <div style={{ minWidth: 0 }}>
            <img src="assets/TGB-logo-trimmed.png" alt="Torrington Genomics & Bioinformatics" style={{ height: 36, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            <img src="assets/tsi-lockup-28.png" alt="Torrington Scholars Institute" style={{ height: 28, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginTop: 18, display: 'block' }} />
            <p style={cs('margin:22px 0 0; max-width:40ch; font-size:13.5px; line-height:1.65; color:rgba(255,255,255,0.70)')}>Torrington Genomics &amp; Bioinformatics (Pvt) Ltd · Orion Towers, Colombo. The Torrington Scholars Institute is our teaching subsidiary.</p>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:rgba(255,255,255,0.55); margin-bottom:16px')}>Bio-Coder</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <a href="#note" style={cs('font-size:13.5px; color:rgba(255,255,255,0.70); text-decoration:none')}>Why it exists</a>
              <a href="#curriculum" style={cs('font-size:13.5px; color:rgba(255,255,255,0.70); text-decoration:none')}>Pathway &amp; curriculum</a>
              <a href="#apply" style={cs('font-size:13.5px; color:rgba(255,255,255,0.70); text-decoration:none')}>Apply</a>
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={cs('font-family:"JetBrains Mono",monospace; font-size:9.5px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:rgba(255,255,255,0.55); margin-bottom:16px')}>Contact</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <a href="mailto:scholars@torrington-gb.com" style={cs('font-size:13.5px; color:rgba(255,255,255,0.70); text-decoration:none')}>scholars@torrington-gb.com</a>
              <a href="https://torrington-gb.com" style={cs('font-size:13.5px; color:rgba(255,255,255,0.70); text-decoration:none')}>torrington-gb.com</a>
            </div>
            <p style={cs('margin:22px 0 0; font-size:12px; line-height:1.6; color:rgba(255,255,255,0.55)')}>If the fee is a barrier, write to us. We are not here to sell courses.</p>
          </div>
        </div>
        <div style={cs('margin-top:clamp(32px,5vw,56px); padding-top:22px; border-top:1px solid rgba(255,255,255,0.12); display:flex; gap:16px; justify-content:space-between; flex-wrap:wrap')}>
          <span style={cs('font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:1.4px; text-transform:uppercase; color:rgba(255,255,255,0.55)')}>Colombo · est. 2018</span>
          <span style={cs('font-family:"JetBrains Mono",monospace; font-size:10px; letter-spacing:1.4px; text-transform:uppercase; color:rgba(255,255,255,0.55)')}>Intakes are small, curated and by invitation</span>
        </div>
      </div>
    </footer>
  );
}

function DirectionBioCoder() {
  return (
    <div style={{ background: BC_PAPER, color: BC_INK, fontFamily: 'Inter, sans-serif', minHeight: '100%' }}>
      <style>{`a { text-decoration: none; }`}</style>
      <BCNav />
      <BCHero />
      <BCNote />
      <BCPathway />
      <BCAccess />
      <BCApply />
      <BCFooter />
    </div>
  );
}

window.DirectionBioCoder = DirectionBioCoder;
