import { useMemo, useState } from "react";
import { BadgeCheck, ShieldCheck, Trash2 } from "lucide-react";
import { useCollectionStore } from "../features/collections/collection.store";
import { useGradingStore, type GradingCompany } from "../features/grading/grading.store";
import { money } from "../features/cart/cart.utils";
import "./clientPages.css";

export function GradingCenterPage() {
  const items = useCollectionStore((s) => s.items);
  const records = useGradingStore((s) => s.records);
  const addRecord = useGradingStore((s) => s.addRecord);
  const removeRecord = useGradingStore((s) => s.removeRecord);
  const [itemId, setItemId] = useState("");
  const [company, setCompany] = useState<GradingCompany>("PSA");
  const [grade, setGrade] = useState("10");
  const [certNumber, setCertNumber] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [notes, setNotes] = useState("");

  const selectedItem = items.find((item) => item.id === itemId);
  const totalValue = records.reduce((sum, record) => sum + record.estimatedValue, 0);
  const averageGrade = useMemo(() => {
    const grades = records.map((record) => Number(record.grade)).filter((gradeValue) => Number.isFinite(gradeValue));
    return grades.length ? (grades.reduce((sum, value) => sum + value, 0) / grades.length).toFixed(1) : "—";
  }, [records]);

  function handleAddRecord() {
    if (!selectedItem) return;
    addRecord({
      itemId: selectedItem.id,
      name: selectedItem.name,
      collection: selectedItem.collection,
      company,
      grade,
      certNumber: certNumber.trim() || `${company}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      estimatedValue: Number(estimatedValue) || selectedItem.estimatedValue,
      image: selectedItem.image,
      notes: notes.trim(),
    });
    setCertNumber("");
    setEstimatedValue("");
    setNotes("");
  }

  return (
    <main className="client-page">
      <div className="client-hero client-hero--compact">
        <p className="client-kicker">COLLECTION TOOLS / GRADING CENTER</p>
        <h1>Track graded cards<span className="client-period">.</span></h1>
        <p>Register slabbed copies, keep certification details and monitor the value of your graded portfolio.</p>
      </div>

      <div className="collection-metrics">
        <div><span>GRADED CARDS</span><strong>{records.length}</strong></div>
        <div><span>PORTFOLIO VALUE</span><strong>{money(totalValue)}</strong></div>
        <div><span>AVERAGE GRADE</span><strong>{averageGrade}</strong></div>
        <div><span>COMPANIES</span><strong>{new Set(records.map((record) => record.company)).size}</strong></div>
      </div>

      <div className="client-fields" style={{ alignItems: "start" }}>
        <section className="client-panel">
          <h2>Add grading record</h2>
          <div className="profile-form">
            <label>Collection item<select value={itemId} onChange={(e) => setItemId(e.target.value)}><option value="">Select a card…</option>{items.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.collection}</option>)}</select></label>
            <div className="client-fields">
              <label>Company<select value={company} onChange={(e) => setCompany(e.target.value as GradingCompany)}><option>PSA</option><option>BGS</option><option>CGC</option><option>TAG</option></select></label>
              <label>Grade<input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g. 9.5" /></label>
            </div>
            <div className="client-fields">
              <label>Certification number<input value={certNumber} onChange={(e) => setCertNumber(e.target.value)} placeholder="Optional" /></label>
              <label>Estimated value<input type="number" min="0" value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)} placeholder="MXN" /></label>
            </div>
            <label>Notes<textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Surface, centering, whitening, provenance…" /></label>
            <button className="client-button" type="button" onClick={handleAddRecord} disabled={!selectedItem}><BadgeCheck size={16} /> Save grading record</button>
          </div>
        </section>

        <section className="client-panel">
          <h2>Grading checklist</h2>
          <div className="client-note" style={{ display: "grid", gap: 8 }}>
            <p>• Mockup workflow only: records are stored locally in your browser.</p>
            <p>• No live verification against PSA, BGS, CGC or TAG databases.</p>
            <p>• Use the notes field for provenance, flaws and certificate context.</p>
          </div>
          <div className="checkout-placeholder" style={{ marginTop: 16 }}>
            <ShieldCheck size={22} />
            <div>
              <strong>Potential next step</strong>
              <p>Later we can add submission batches, shipping steps and certificate lookups.</p>
            </div>
          </div>
        </section>
      </div>

      <section className="client-panel" style={{ marginTop: 28 }}>
        <div className="client-section-head"><div><p className="client-kicker">GRADED REGISTRY</p><h2>My slabbed cards</h2></div><span className="client-muted">{records.length} records</span></div>
        {records.length ? <div className="orders-list">{records.map((record) => <article key={record.id} className="client-panel" style={{ padding: 18, background: "#fafafa" }}><div className="client-section-head" style={{ margin: 0 }}><div><p className="client-kicker">{record.company} · GRADE {record.grade}</p><h2 style={{ marginBottom: 8 }}>{record.name}</h2><p style={{ margin: 0 }}>{record.collection} · Certificate {record.certNumber}</p></div><button className="client-text-button" onClick={() => removeRecord(record.id)}><Trash2 size={15} /> Remove</button></div><div className="client-fields"><div><strong>{money(record.estimatedValue)}</strong><p className="client-note">Estimated slab value</p></div><div><strong>{new Date(record.addedAt).toLocaleDateString()}</strong><p className="client-note">Added to registry</p></div></div>{record.notes && <p className="client-note" style={{ marginTop: 10 }}>{record.notes}</p>}</article>)}</div> : <div className="client-empty"><BadgeCheck size={30} /><h3>No graded cards yet</h3><p>Register certified cards from your personal collection to build a grading registry.</p></div>}
      </section>
    </main>
  );
}
