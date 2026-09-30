import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness, Check, ChevronDown, Download, Eye, FileText,
  GraduationCap, LayoutTemplate, Plus, Save, Settings2, Sparkles,
  Trash2, UserRound, X
} from "lucide-react";

const API = "http://localhost:5000/api";

const blankResume = {
  title: "My Resume",
  template: "creative",
  accent: "#C96F4A",
  personal: {
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: ""
  },
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: []
};

const starterResume = {
  ...blankResume,
  personal: {
    fullName: "Alex Morgan",
    headline: "Frontend Developer",
    email: "alex@example.com",
    phone: "+92 300 1234567",
    location: "Karachi, Pakistan",
    website: "alexmorgan.dev",
    summary: "Frontend developer focused on building accessible, responsive and polished digital experiences."
  },
  skills: ["JavaScript", "React", "CSS", "Git"],
  education: [{
    degree: "BS Computer Science",
    institution: "University Name",
    startDate: "2023",
    endDate: "2027",
    description: ""
  }],
  experience: [{
    role: "Frontend Developer Intern",
    company: "Company Name",
    startDate: "Jun 2025",
    endDate: "Aug 2025",
    description: "Built responsive interfaces and collaborated with designers to improve user experience."
  }],
  projects: [{
    name: "CivicFix",
    link: "github.com/example/civicfix",
    description: "A civic issue reporting platform with a React interface and REST API."
  }],
  certifications: ["Cisco HTML Essentials"]
};

const templates = [
  { id: "professional", name: "Professional", desc: "Clean two-column layout" },
  { id: "minimal", name: "Minimal", desc: "Simple single-column layout" },
  { id: "creative", name: "Creative", desc: "Bold accent and modern sections" }
];

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function App() {
  const [resume, setResume] = useState(clone(starterResume));
  const [resumeId, setResumeId] = useState(null);
  const [active, setActive] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);

  const completion = useMemo(() => {
    const p = resume.personal;
    const checks = [
      p.fullName, p.headline, p.email, p.summary,
      resume.skills.length, resume.education.length,
      resume.experience.length, resume.projects.length
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [resume]);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${API}/resumes`);
        if (!r.ok) return;
        const data = await r.json();
        const list = data.resumes || [];
        if (list[0]) {
          setResume(list[0]);
          setResumeId(list[0]._id);
        }
      } catch {
        // Demo mode keeps the local starter data.
      }
    };
    load();
  }, []);

  const update = (path, value) => {
    setSaved(false);
    setResume(prev => {
      const next = clone(prev);
      const keys = path.split(".");
      let target = next;
      keys.slice(0, -1).forEach(k => { target = target[k]; });
      target[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      const method = resumeId ? "PUT" : "POST";
      const url = resumeId ? `${API}/resumes/${resumeId}` : `${API}/resumes`;
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume)
      });
      if (!response.ok) throw new Error();
      const payload = await response.json();
      const data = payload.resume;
      setResume(data);
      setResumeId(data._id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch {
      // Keep editing available even if backend isn't running.
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } finally {
      setSaving(false);
    }
  };

  const addItem = (type, item) => {
    setSaved(false);
    setResume(prev => ({ ...prev, [type]: [...prev[type], item] }));
  };

  const removeItem = (type, index) => {
    setResume(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const updateArrayItem = (type, index, field, value) => {
    setSaved(false);
    setResume(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const nav = [
    ["personal", "Personal", UserRound],
    ["experience", "Experience", BriefcaseBusiness],
    ["education", "Education", GraduationCap],
    ["projects", "Projects", LayoutTemplate],
    ["skills", "Skills", Sparkles],
    ["certifications", "Certifications", FileText]
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><FileText size={18}/></div>
          <span>Paper<span>Mint</span></span>
        </div>
        <div className="top-actions">
          <div className="completion"><span>{completion}% complete</span><i><b style={{width:`${completion}%`}}/></i></div>
          <button className="ghost-btn" onClick={() => setMobilePreview(v => !v)}>
            <Eye size={16}/> <span>{mobilePreview ? "Editor" : "Preview"}</span>
          </button>
          <button className="primary-btn" onClick={saveResume} disabled={saving}>
            {saved ? <Check size={16}/> : <Save size={16}/>}
            {saving ? "Saving..." : saved ? "Saved" : "Save Resume"}
          </button>
        </div>
      </header>

      <main className="workspace">
        <aside className={`sidebar ${mobilePreview ? "mobile-hide" : ""}`}>
          <div className="side-heading">
            <div>
              <small>RESUME BUILDER</small>
              <h1>Shape your<br/><em>next chapter.</em></h1>
            </div>
            <button className="icon-btn" title="Settings"><Settings2 size={17}/></button>
          </div>

          <label className="title-input">
            <span>Resume title</span>
            <input value={resume.title} onChange={e => update("title", e.target.value)} />
          </label>

          <div className="nav-list">
            {nav.map(([id, label, Icon]) => (
              <button key={id} className={active === id ? "nav-item active" : "nav-item"} onClick={() => setActive(id)}>
                <Icon size={17}/><span>{label}</span>
                {id === "personal" && resume.personal.fullName ? <Check size={14} className="done"/> : null}
              </button>
            ))}
          </div>

          <div className="template-card">
            <div className="template-card-top">
              <span><LayoutTemplate size={15}/> Template</span>
              <span className="pill">3 styles</span>
            </div>
            <div className="template-mini-grid">
              {templates.map(t => (
                <button key={t.id} className={resume.template === t.id ? "template-mini selected" : "template-mini"} onClick={() => update("template", t.id)}>
                  <div className={`mini-paper ${t.id}`}><b/><i/><i/><i/></div>
                  <strong>{t.name}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="accent-row">
            <span>Accent</span>
            <div className="color-options">
              {["#C96F4A","#7A8B5B","#B58B52","#8E6C88","#C05C4B"].map(c =>
                <button key={c} className={resume.accent === c ? "color active" : "color"} style={{background:c}} onClick={() => update("accent", c)} />
              )}
            </div>
          </div>

          <button className="print-side-btn" onClick={() => window.print()}><Download size={16}/> Print / Save PDF</button>
        </aside>

        <section className={`editor ${mobilePreview ? "mobile-show" : ""}`}>
          <div className="editor-header">
            <div>
              <span className="eyebrow">EDITOR</span>
              <h2>{nav.find(n => n[0] === active)?.[1]}</h2>
            </div>
            <div className="autosave"><span/> Changes are saved when you click Save</div>
          </div>

          <div className="form-area">
            {active === "personal" && <Personal resume={resume} update={update}/>}
            {active === "experience" && <Experience items={resume.experience} addItem={addItem} removeItem={removeItem} updateItem={updateArrayItem}/>}
            {active === "education" && <Education items={resume.education} addItem={addItem} removeItem={removeItem} updateItem={updateArrayItem}/>}
            {active === "projects" && <Projects items={resume.projects} addItem={addItem} removeItem={removeItem} updateItem={updateArrayItem}/>}
            {active === "skills" && <Skills resume={resume} setResume={setResume}/>}
            {active === "certifications" && <Certifications resume={resume} setResume={setResume}/>}
          </div>
        </section>

        <section className={`preview-panel ${mobilePreview ? "preview-mobile" : ""}`}>
          <div className="preview-toolbar">
            <div><span className="live-dot"/> Live preview</div>
            <div className="zoom">A4 <ChevronDown size={14}/></div>
          </div>
          <div className="paper-wrap">
            <ResumePreview resume={resume}/>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionCard({ title, subtitle, children, onDelete }) {
  return (
    <div className="section-card">
      <div className="card-title">
        <div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
        {onDelete && <button className="delete-btn" onClick={onDelete}><Trash2 size={15}/></button>}
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type="text", wide=false }) {
  return <label className={wide ? "field wide" : "field"}>
    <span>{label}</span>
    <input type={type} value={value || ""} placeholder={placeholder} onChange={e => onChange(e.target.value)}/>
  </label>;
}

function Textarea({ label, value, onChange, placeholder }) {
  return <label className="field wide"><span>{label}</span><textarea value={value || ""} placeholder={placeholder} onChange={e => onChange(e.target.value)}/></label>;
}

function Personal({ resume, update }) {
  return <div className="form-stack">
    <div className="section-intro"><span className="intro-icon"><UserRound size={19}/></span><div><h3>Tell us about yourself</h3><p>Start with the information recruiters should see first.</p></div></div>
    <SectionCard title="Basic information" subtitle="Keep your headline specific to the role you want.">
      <div className="form-grid">
        <Input label="Full name" value={resume.personal.fullName} onChange={v=>update("personal.fullName",v)} placeholder="e.g. Areeba Khan"/>
        <Input label="Professional headline" value={resume.personal.headline} onChange={v=>update("personal.headline",v)} placeholder="e.g. Frontend Developer"/>
        <Input label="Email" type="email" value={resume.personal.email} onChange={v=>update("personal.email",v)} placeholder="you@example.com"/>
        <Input label="Phone" value={resume.personal.phone} onChange={v=>update("personal.phone",v)} placeholder="+92 300 1234567"/>
        <Input label="Location" value={resume.personal.location} onChange={v=>update("personal.location",v)} placeholder="Karachi, Pakistan"/>
        <Input label="Website / LinkedIn" value={resume.personal.website} onChange={v=>update("personal.website",v)} placeholder="linkedin.com/in/you"/>
        <Textarea label="Professional summary" value={resume.personal.summary} onChange={v=>update("personal.summary",v)} placeholder="2–4 lines describing your strengths, focus and what you bring."/>
      </div>
    </SectionCard>
  </div>
}

function Experience({items, addItem, removeItem, updateItem}) {
  return <div className="form-stack">
    <div className="section-intro"><span className="intro-icon"><BriefcaseBusiness size={19}/></span><div><h3>Work experience</h3><p>Show impact, not just responsibilities. Start with your most recent role.</p></div></div>
    {items.map((item,i)=><SectionCard key={i} title={item.role || `Experience ${i+1}`} subtitle={item.company || "Add company"} onDelete={()=>removeItem("experience",i)}>
      <div className="form-grid">
        <Input label="Job title" value={item.role} onChange={v=>updateItem("experience",i,"role",v)} placeholder="Frontend Developer"/>
        <Input label="Company" value={item.company} onChange={v=>updateItem("experience",i,"company",v)} placeholder="Company name"/>
        <Input label="Start date" value={item.startDate} onChange={v=>updateItem("experience",i,"startDate",v)} placeholder="Jun 2025"/>
        <Input label="End date" value={item.endDate} onChange={v=>updateItem("experience",i,"endDate",v)} placeholder="Present"/>
        <Textarea label="Description" value={item.description} onChange={v=>updateItem("experience",i,"description",v)} placeholder="Describe your work, achievements and measurable impact."/>
      </div>
    </SectionCard>)}
    <button className="add-btn" onClick={()=>addItem("experience",{role:"",company:"",startDate:"",endDate:"",description:""})}><Plus size={17}/> Add experience</button>
  </div>
}

function Education({items, addItem, removeItem, updateItem}) {
  return <div className="form-stack">
    <div className="section-intro"><span className="intro-icon"><GraduationCap size={19}/></span><div><h3>Education</h3><p>Add your degree, institution and the years you attended.</p></div></div>
    {items.map((item,i)=><SectionCard key={i} title={item.degree || `Education ${i+1}`} subtitle={item.institution || "Add institution"} onDelete={()=>removeItem("education",i)}>
      <div className="form-grid">
        <Input label="Degree / program" value={item.degree} onChange={v=>updateItem("education",i,"degree",v)} placeholder="BS Computer Science"/>
        <Input label="Institution" value={item.institution} onChange={v=>updateItem("education",i,"institution",v)} placeholder="University name"/>
        <Input label="Start" value={item.startDate} onChange={v=>updateItem("education",i,"startDate",v)} placeholder="2023"/>
        <Input label="End" value={item.endDate} onChange={v=>updateItem("education",i,"endDate",v)} placeholder="2027"/>
        <Textarea label="Additional details" value={item.description} onChange={v=>updateItem("education",i,"description",v)} placeholder="Relevant coursework, achievement, GPA, etc. (optional)"/>
      </div>
    </SectionCard>)}
    <button className="add-btn" onClick={()=>addItem("education",{degree:"",institution:"",startDate:"",endDate:"",description:""})}><Plus size={17}/> Add education</button>
  </div>
}

function Projects({items, addItem, removeItem, updateItem}) {
  return <div className="form-stack">
    <div className="section-intro"><span className="intro-icon"><LayoutTemplate size={19}/></span><div><h3>Projects</h3><p>Great projects can replace missing professional experience for students.</p></div></div>
    {items.map((item,i)=><SectionCard key={i} title={item.name || `Project ${i+1}`} subtitle={item.link || "Add project link"} onDelete={()=>removeItem("projects",i)}>
      <div className="form-grid">
        <Input label="Project name" value={item.name} onChange={v=>updateItem("projects",i,"name",v)} placeholder="CivicFix"/>
        <Input label="Project link" value={item.link} onChange={v=>updateItem("projects",i,"link",v)} placeholder="github.com/you/project"/>
        <Textarea label="Description" value={item.description} onChange={v=>updateItem("projects",i,"description",v)} placeholder="What did you build? Mention technologies and outcomes."/>
      </div>
    </SectionCard>)}
    <button className="add-btn" onClick={()=>addItem("projects",{name:"",link:"",description:""})}><Plus size={17}/> Add project</button>
  </div>
}

function Skills({resume,setResume}) {
  const [value,setValue] = useState("");
  const add = () => {
    const v=value.trim();
    if (!v || resume.skills.includes(v)) return;
    setResume({...resume, skills:[...resume.skills,v]});
    setValue("");
  };
  return <div className="form-stack">
    <div className="section-intro"><span className="intro-icon"><Sparkles size={19}/></span><div><h3>Skills</h3><p>Use specific, searchable skills relevant to the jobs you want.</p></div></div>
    <SectionCard title="Your skill set" subtitle="Add technical and professional skills.">
      <div className="skill-input-row"><input value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>e.key==="Enter" && add()} placeholder="e.g. React"/><button onClick={add}><Plus size={17}/> Add</button></div>
      <div className="skill-list">{resume.skills.map((s,i)=><span key={i}>{s}<button onClick={()=>setResume({...resume,skills:resume.skills.filter((_,x)=>x!==i)})}><X size={13}/></button></span>)}</div>
    </SectionCard>
  </div>
}

function Certifications({resume,setResume}) {
  const [value,setValue]=useState("");
  const add=()=>{const v=value.trim();if(!v)return;setResume({...resume,certifications:[...resume.certifications,v]});setValue("")};
  return <div className="form-stack">
    <div className="section-intro"><span className="intro-icon"><FileText size={19}/></span><div><h3>Certifications</h3><p>Add certificates that strengthen your application.</p></div></div>
    <SectionCard title="Certificates" subtitle="Include relevant courses, certifications or credentials.">
      <div className="skill-input-row"><input value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="e.g. Cisco HTML Essentials"/><button onClick={add}><Plus size={17}/> Add</button></div>
      <div className="skill-list">{resume.certifications.map((s,i)=><span key={i}>{s}<button onClick={()=>setResume({...resume,certifications:resume.certifications.filter((_,x)=>x!==i)})}><X size={13}/></button></span>)}</div>
    </SectionCard>
  </div>
}

function ResumePreview({resume}) {
  const p=resume.personal;
  const has = v => Array.isArray(v) ? v.length>0 : Boolean(v);
  return <article className={`resume-paper template-${resume.template}`} style={{"--accent":resume.accent}}>
    <header className="resume-head">
      <div>
        <h1>{p.fullName || "Your Name"}</h1>
        <h2>{p.headline || "Professional Headline"}</h2>
      </div>
      <div className="contact">
        {p.email && <span>{p.email}</span>}
        {p.phone && <span>{p.phone}</span>}
        {p.location && <span>{p.location}</span>}
        {p.website && <span>{p.website}</span>}
      </div>
    </header>

    {has(p.summary) && <ResumeSection title="Profile"><p>{p.summary}</p></ResumeSection>}

    {has(resume.experience) && <ResumeSection title="Experience">
      {resume.experience.map((x,i)=><div className="resume-item" key={i}><div className="item-top"><strong>{x.role || "Job Title"}</strong><span>{x.startDate}{x.startDate && x.endDate ? " — " : ""}{x.endDate}</span></div><div className="item-sub">{x.company}</div>{x.description && <p>{x.description}</p>}</div>)}
    </ResumeSection>}

    {has(resume.education) && <ResumeSection title="Education">
      {resume.education.map((x,i)=><div className="resume-item" key={i}><div className="item-top"><strong>{x.degree || "Degree"}</strong><span>{x.startDate}{x.startDate && x.endDate ? " — " : ""}{x.endDate}</span></div><div className="item-sub">{x.institution}</div>{x.description && <p>{x.description}</p>}</div>)}
    </ResumeSection>}

    {has(resume.projects) && <ResumeSection title="Projects">
      {resume.projects.map((x,i)=><div className="resume-item" key={i}><div className="item-top"><strong>{x.name || "Project"}</strong>{x.link && <span>{x.link}</span>}</div>{x.description && <p>{x.description}</p>}</div>)}
    </ResumeSection>}

    {has(resume.skills) && <ResumeSection title="Skills"><div className="resume-skills">{resume.skills.map((s,i)=><span key={i}>{s}</span>)}</div></ResumeSection>}
    {has(resume.certifications) && <ResumeSection title="Certifications"><ul className="cert-list">{resume.certifications.map((s,i)=><li key={i}>{s}</li>)}</ul></ResumeSection>}
  </article>
}

function ResumeSection({title,children}) {
  return <section className="resume-section"><h3>{title}</h3>{children}</section>
}

export default App;
