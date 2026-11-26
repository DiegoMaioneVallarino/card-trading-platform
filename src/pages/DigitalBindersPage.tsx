import { useMemo, useState } from "react";
import { BookOpen, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useBinderStore, type BinderTheme } from "../features/binders/binders.store";
import { useCollectionStore } from "../features/collections/collection.store";
import { money } from "../features/cart/cart.utils";
import "./clientPages.css";

const themeStyles: Record<BinderTheme, { background: string; color: string }> = {
  classic: { background: "linear-gradient(135deg,#fafafa 0%,#e8e8e8 100%)", color: "#333" },
  midnight: { background: "linear-gradient(135deg,#222 0%,#555 100%)", color: "#fff" },
  ruby: { background: "linear-gradient(135deg,#3a0d12 0%,#8f2234 100%)", color: "#fff" },
  emerald: { background: "linear-gradient(135deg,#0f2d22 0%,#1f7b5b 100%)", color: "#fff" },
};

export function DigitalBindersPage() {
  const binders = useBinderStore((s) => s.binders);
  const createBinder = useBinderStore((s) => s.createBinder);
  const removeBinder = useBinderStore((s) => s.removeBinder);
  const renameBinder = useBinderStore((s) => s.renameBinder);
  const addPage = useBinderStore((s) => s.addPage);
  const updatePageTitle = useBinderStore((s) => s.updatePageTitle);
  const assignSlot = useBinderStore((s) => s.assignSlot);
  const items = useCollectionStore((s) => s.items);
  const [selectedBinderId, setSelectedBinderId] = useState(binders[0]?.id ?? "");
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [name, setName] = useState("Showcase Binder");
  const [description, setDescription] = useState("Cards I want to present on my public profile.");
  const [theme, setTheme] = useState<BinderTheme>("classic");

  const selectedBinder = binders.find((binder) => binder.id === selectedBinderId) ?? binders[0];
  const selectedPage = selectedBinder?.pages[selectedPageIndex];
  const showcaseCards = useMemo(() => items.filter((item) => item.visibility !== "private"), [items]);

  function handleCreateBinder() {
    const id = createBinder({ name: name.trim() || "Untitled Binder", description: description.trim(), theme });
    setSelectedBinderId(id);
    setSelectedPageIndex(0);
  }

  return (
    <main className="client-page">
      <div className="client-hero client-hero--compact">
        <p className="client-kicker">COLLECTION TOOLS / DIGITAL BINDERS</p>
        <h1>Curate digital albums<span className="client-period">.</span></h1>
        <p>Create personalized binders, choose a visual theme and place your showcase cards on album pages.</p>
      </div>

      <div className="client-fields" style={{ alignItems: "start" }}>
        <section className="client-panel">
          <h2>Create a new binder</h2>
          <div className="profile-form">
            <label>Binder name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label>Description<textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
            <label>Theme<select value={theme} onChange={(e) => setTheme(e.target.value as BinderTheme)}><option value="classic">Classic</option><option value="midnight">Midnight</option><option value="ruby">Ruby</option><option value="emerald">Emerald</option></select></label>
            <button className="client-button" type="button" onClick={handleCreateBinder}><Plus size={16} /> Create binder</button>
          </div>
        </section>

        <section className="client-panel">
          <h2>My binders</h2>
          {binders.length ? (
            <div style={{ display: "grid", gap: 12 }}>
              {binders.map((binder) => (
                <button
                  key={binder.id}
                  type="button"
                  onClick={() => {
                    setSelectedBinderId(binder.id);
                    setSelectedPageIndex(0);
                  }}
                  style={{
                    textAlign: "left",
                    padding: 16,
                    borderRadius: 12,
                    border: binder.id === selectedBinder?.id ? "1px solid #111" : "1px solid #eee",
                    background: "white",
                  }}
                >
                  <strong style={{ display: "block", marginBottom: 8 }}>{binder.name}</strong>
                  <p className="client-note" style={{ margin: 0 }}>{binder.description || "No description"}</p>
                  <small className="client-muted">{binder.pages.length} pages · theme: {binder.theme}</small>
                </button>
              ))}
            </div>
          ) : (
            <div className="client-empty"><BookOpen size={30} /><h3>No binders yet</h3><p>Create your first album to start arranging cards.</p></div>
          )}
        </section>
      </div>

      {selectedBinder && selectedPage && (
        <section className="client-panel" style={{ marginTop: 28 }}>
          <div className="client-section-head">
            <div>
              <p className="client-kicker">BINDER EDITOR</p>
              <h2>{selectedBinder.name}</h2>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="client-button client-button--light" type="button" onClick={() => addPage(selectedBinder.id)}>Add page</button>
              <button className="client-button client-button--light" type="button" onClick={() => removeBinder(selectedBinder.id)}><Trash2 size={15} /> Remove binder</button>
            </div>
          </div>

          <div className="client-fields" style={{ alignItems: "start" }}>
            <div>
              <div style={{ ...themeStyles[selectedBinder.theme], borderRadius: 18, padding: 18, marginBottom: 16 }}>
                <input
                  value={selectedBinder.name}
                  onChange={(e) => renameBinder(selectedBinder.id, { name: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,.18)", color: "inherit", border: 0, fontSize: 28, fontWeight: 700, padding: 8, borderRadius: 8 }}
                />
                <textarea
                  rows={2}
                  value={selectedBinder.description}
                  onChange={(e) => renameBinder(selectedBinder.id, { description: e.target.value })}
                  style={{ width: "100%", marginTop: 10, background: "rgba(255,255,255,.18)", color: "inherit", border: 0, padding: 10, borderRadius: 8 }}
                />
                <small style={{ display: "block", marginTop: 12, opacity: 0.85 }}>{selectedBinder.pages.length} pages · mockup album editor</small>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {selectedBinder.pages.map((page, index) => (
                  <button key={page.id} type="button" className="client-button" style={{ background: index === selectedPageIndex ? "#191919" : "#fff", color: index === selectedPageIndex ? "#fff" : "#191919", borderColor: "#ddd", minHeight: 38 }} onClick={() => setSelectedPageIndex(index)}>
                    {page.title}
                  </button>
                ))}
              </div>

              <label style={{ marginBottom: 12, display: "block" }}>
                Page title
                <input value={selectedPage.title} onChange={(e) => updatePageTitle(selectedBinder.id, selectedPage.id, e.target.value)} />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                {selectedPage.slots.map((itemId, slotIndex) => {
                  const item = showcaseCards.find((entry) => entry.id === itemId);
                  return (
                    <div key={slotIndex} style={{ aspectRatio: "4 / 5", borderRadius: 12, border: "1px dashed #ccc", background: "#fafafa", padding: 10, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 11, color: "#999" }}>Slot {slotIndex + 1}</div>
                      {item ? (
                        <>
                          <div style={{ textAlign: "center" }}>
                            {item.image ? <img src={item.image} alt={item.name} style={{ maxWidth: "72%", maxHeight: 120, objectFit: "contain" }} /> : <ImagePlus size={28} />}
                          </div>
                          <div>
                            <strong style={{ fontSize: 13 }}>{item.name}</strong>
                            <div className="client-note">{item.collection}</div>
                          </div>
                        </>
                      ) : (
                        <div className="client-note" style={{ textAlign: "center" }}>Empty slot</div>
                      )}
                      <select value={itemId ?? ""} onChange={(e) => assignSlot(selectedBinder.id, selectedPage.id, slotIndex, e.target.value || null)}>
                        <option value="">Select a card…</option>
                        {showcaseCards.map((card) => <option key={card.id} value={card.id}>{card.name} · {card.collection}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="client-panel" style={{ padding: 16, background: "#fafafa" }}>
              <strong>Album collection value</strong>
              <p className="client-note">Estimated from the cards you placed across binder pages.</p>
              <div style={{ fontSize: 28, fontWeight: 700, margin: "12px 0 18px" }}>
                {money(
                  selectedBinder.pages.flatMap((page) => page.slots).reduce((sum, itemId) => {
                    const item = showcaseCards.find((entry) => entry.id === itemId);
                    return sum + (item?.estimatedValue ?? 0);
                  }, 0),
                )}
              </div>
              <strong>Available showcase cards</strong>
              <ul style={{ margin: "10px 0 0", paddingLeft: 18 }}>
                {showcaseCards.slice(0, 6).map((card) => (
                  <li key={card.id} style={{ marginBottom: 6 }}>{card.name} · {card.collection}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
