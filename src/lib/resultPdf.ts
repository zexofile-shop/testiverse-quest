import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoAdhyay from "@/assets/logo-adhyayx.png";
import type { Question, Test } from "@/lib/testApi";
import { correctIndex, parseOptions } from "@/lib/testApi";

export interface ResultPdfInput {
  test: Test;
  questions: Question[];
  answers: (number | null)[];
  /** Optional user details — wired later when auth is added. */
  user?: { name?: string; email?: string };
}

const BRAND_INK: [number, number, number] = [24, 22, 60];
const BRAND_PURPLE: [number, number, number] = [92, 38, 138];
const SUCCESS: [number, number, number] = [34, 139, 94];
const DANGER: [number, number, number] = [220, 70, 70];
const MUTED: [number, number, number] = [140, 140, 155];
const SOFT_BG: [number, number, number] = [247, 246, 252];

function imageToDataURL(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = src;
  });
}

function fmtDate(d = new Date()): string {
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function generateResultPdf(input: ResultPdfInput): Promise<void> {
  const { test, questions, answers, user } = input;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 40; // margin

  // Pre-compute stats
  const rows = questions.map((q) => {
    const opts = parseOptions(q.options);
    const correctIdx = correctIndex(q.correct, opts);
    const userIdx = answers[questions.indexOf(q)] ?? null;
    let state: "correct" | "wrong" | "skipped" = "skipped";
    let delta = 0;
    if (userIdx === null || userIdx === undefined) state = "skipped";
    else if (correctIdx >= 0 && userIdx === correctIdx) {
      state = "correct";
      delta = q.marks || 0;
    } else {
      state = "wrong";
      delta = -(q.negative_marks || 0);
    }
    return { q, opts, correctIdx, userIdx, state, delta };
  });

  const correct = rows.filter((r) => r.state === "correct").length;
  const wrong = rows.filter((r) => r.state === "wrong").length;
  const skipped = rows.filter((r) => r.state === "skipped").length;
  const totalMarks = questions.reduce((s, q) => s + (q.marks || 0), 0);
  const score = rows.reduce((s, r) => s + r.delta, 0);
  const pct = totalMarks > 0 ? Math.max(0, Math.round((score / totalMarks) * 100)) : 0;
  const attempted = correct + wrong;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  // Subject map
  const subjectMap = new Map<string, { total: number; correct: number }>();
  rows.forEach((r) => {
    const k = r.q.subject || "General";
    if (!subjectMap.has(k)) subjectMap.set(k, { total: 0, correct: 0 });
    const e = subjectMap.get(k)!;
    e.total += 1;
    if (r.state === "correct") e.correct += 1;
  });

  // ===== Header band =====
  doc.setFillColor(...BRAND_INK);
  doc.rect(0, 0, pageW, 110, "F");
  doc.setFillColor(...BRAND_PURPLE);
  doc.circle(pageW - 30, 20, 90, "F");

  // Logo
  try {
    const logoData = await imageToDataURL(logoAdhyay);
    doc.addImage(logoData, "PNG", M, 22, 60, 60);
  } catch {
    /* ignore */
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("AdhyayX", M + 72, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Powered by EduSpark  ·  Har Adhyay, Ek Nayi Jeet", M + 72, 64);
  doc.setFontSize(8);
  doc.text(`Generated ${fmtDate()}`, M + 72, 78);

  // ===== Title block =====
  let y = 140;
  doc.setTextColor(...BRAND_INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Score Report", M, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  doc.text(`${test.name} · ${test.stream ?? "General"} · ${questions.length} questions · ${test.duration_minutes} min`, M, y);

  if (user?.name || user?.email) {
    y += 14;
    doc.setTextColor(...BRAND_INK);
    doc.setFont("helvetica", "bold");
    doc.text(`Candidate: ${user.name ?? "—"}`, M, y);
    if (user.email) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      doc.text(user.email, M + 200, y);
    }
  }

  // ===== Score gauge (simple ring) =====
  y += 30;
  const gaugeX = M + 70;
  const gaugeY = y + 70;
  const r = 55;
  // background ring
  doc.setDrawColor(230, 228, 240);
  doc.setLineWidth(14);
  doc.circle(gaugeX, gaugeY, r, "S");
  // progress arc — drawn as polyline approximation
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * pct) / 100;
  const color = pct >= 50 ? SUCCESS : pct >= 35 ? ([200, 145, 30] as [number, number, number]) : DANGER;
  doc.setDrawColor(...color);
  doc.setLineWidth(14);
  const steps = Math.max(2, Math.round((pct / 100) * 60));
  for (let i = 0; i < steps; i++) {
    const a1 = startAngle + ((endAngle - startAngle) * i) / steps;
    const a2 = startAngle + ((endAngle - startAngle) * (i + 1)) / steps;
    doc.line(
      gaugeX + Math.cos(a1) * r,
      gaugeY + Math.sin(a1) * r,
      gaugeX + Math.cos(a2) * r,
      gaugeY + Math.sin(a2) * r,
    );
  }
  doc.setTextColor(...color);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text(`${pct}%`, gaugeX, gaugeY + 4, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("OVERALL SCORE", gaugeX, gaugeY + 20, { align: "center" });

  // ===== Stat boxes to the right =====
  const boxX = gaugeX + 90;
  const boxY = y + 10;
  const boxW = pageW - M - boxX;
  const lineH = 22;

  const statLine = (label: string, val: string, yPos: number, color?: [number, number, number]) => {
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.text(label.toUpperCase(), boxX, yPos);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...(color ?? BRAND_INK));
    doc.text(val, boxX + boxW, yPos, { align: "right" });
  };

  statLine("Marks", `${score.toFixed(2)} / ${totalMarks}`, boxY + lineH);
  statLine("Accuracy", `${accuracy}%`, boxY + lineH * 2);
  statLine("Correct", `${correct}`, boxY + lineH * 3, SUCCESS);
  statLine("Wrong", `${wrong}`, boxY + lineH * 4, DANGER);
  statLine("Skipped", `${skipped}`, boxY + lineH * 5, MUTED);

  // ===== Subject bar chart =====
  y = gaugeY + 70;
  if (subjectMap.size > 0) {
    doc.setTextColor(...BRAND_INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Subject-wise performance", M, y);
    y += 14;

    const subjects = Array.from(subjectMap.entries());
    const barH = 14;
    const gap = 10;
    const labelW = 120;
    const barAreaX = M + labelW + 8;
    const barAreaW = pageW - M - barAreaX - 50;

    subjects.forEach(([name, v]) => {
      const p = Math.round((v.correct / v.total) * 100);
      // label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...BRAND_INK);
      doc.text(name, M, y + barH - 3);
      // track
      doc.setFillColor(...SOFT_BG);
      doc.roundedRect(barAreaX, y, barAreaW, barH, 3, 3, "F");
      // fill
      const c = p >= 50 ? SUCCESS : p >= 30 ? ([200, 145, 30] as [number, number, number]) : DANGER;
      doc.setFillColor(...c);
      doc.roundedRect(barAreaX, y, Math.max(4, (barAreaW * p) / 100), barH, 3, 3, "F");
      // value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...MUTED);
      doc.text(`${v.correct}/${v.total}  ${p}%`, pageW - M, y + barH - 3, { align: "right" });
      y += barH + gap;
    });
  }

  // ===== Distribution donut-ish (simple stacked bar) =====
  y += 10;
  doc.setTextColor(...BRAND_INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Attempt distribution", M, y);
  y += 10;
  const distW = pageW - M * 2;
  const distH = 18;
  const total = Math.max(1, correct + wrong + skipped);
  let xCursor = M;
  const cw = (correct / total) * distW;
  const ww = (wrong / total) * distW;
  const sw = distW - cw - ww;
  doc.setFillColor(...SUCCESS);
  doc.rect(xCursor, y, cw, distH, "F");
  xCursor += cw;
  doc.setFillColor(...DANGER);
  doc.rect(xCursor, y, ww, distH, "F");
  xCursor += ww;
  doc.setFillColor(220, 220, 230);
  doc.rect(xCursor, y, sw, distH, "F");
  y += distH + 14;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BRAND_INK);
  doc.text(`Correct ${correct}    Wrong ${wrong}    Skipped ${skipped}`, M, y);

  // ===== Answer review table =====
  autoTable(doc, {
    startY: y + 18,
    head: [["#", "Subject", "Your Ans", "Correct", "Result", "Marks"]],
    body: rows.map((r, i) => {
      const letter = (idx: number | null) =>
        idx === null || idx < 0 ? "—" : String.fromCharCode(65 + idx);
      return [
        String(i + 1),
        r.q.subject ?? "—",
        letter(r.userIdx),
        letter(r.correctIdx),
        r.state === "correct" ? "Correct" : r.state === "wrong" ? "Wrong" : "Skipped",
        `${r.delta > 0 ? "+" : ""}${r.delta}`,
      ];
    }),
    theme: "grid",
    headStyles: { fillColor: BRAND_INK, textColor: 255, fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: BRAND_INK },
    alternateRowStyles: { fillColor: SOFT_BG },
    columnStyles: {
      0: { halign: "center", cellWidth: 28 },
      2: { halign: "center", cellWidth: 50 },
      3: { halign: "center", cellWidth: 50 },
      4: { halign: "center", cellWidth: 60 },
      5: { halign: "right", cellWidth: 50 },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 4) {
        const v = String(data.cell.raw ?? "");
        if (v === "Correct") data.cell.styles.textColor = SUCCESS;
        else if (v === "Wrong") data.cell.styles.textColor = DANGER;
        else data.cell.styles.textColor = MUTED;
        data.cell.styles.fontStyle = "bold";
      }
    },
    margin: { left: M, right: M },
  });

  // ===== Detailed review pages =====
  rows.forEach((r, i) => {
    doc.addPage();
    // page header strip
    doc.setFillColor(...BRAND_INK);
    doc.rect(0, 0, pageW, 36, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("AdhyayX  ·  Answer Review", M, 23);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(test.name, pageW - M, 23, { align: "right" });

    let yy = 60;
    // chip
    const chipText = r.state === "correct" ? "CORRECT" : r.state === "wrong" ? "WRONG" : "SKIPPED";
    const chipColor = r.state === "correct" ? SUCCESS : r.state === "wrong" ? DANGER : MUTED;
    doc.setFillColor(...chipColor);
    doc.roundedRect(M, yy - 12, 70, 18, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(chipText, M + 35, yy, { align: "center" });

    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "bold");
    doc.text(`Q${i + 1}  ·  ${r.q.subject ?? "General"}`, M + 80, yy);

    yy += 22;
    doc.setTextColor(...BRAND_INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const qText = r.q.question_text ?? "(Question is provided as an image — open the test to view it.)";
    const lines = doc.splitTextToSize(qText, pageW - M * 2);
    doc.text(lines, M, yy);
    yy += lines.length * 14 + 6;

    // options
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    r.opts.forEach((opt, oi) => {
      const isCorrect = oi === r.correctIdx;
      const isUser = oi === r.userIdx;
      let bg: [number, number, number] = [255, 255, 255];
      let border: [number, number, number] = [220, 220, 230];
      let txt: [number, number, number] = BRAND_INK;
      let tag = "";
      if (isCorrect) {
        bg = [232, 248, 240];
        border = SUCCESS;
        tag = "  ✓ Correct answer";
      } else if (isUser) {
        bg = [253, 232, 232];
        border = DANGER;
        tag = "  ✗ Your answer";
      }
      const optLines = doc.splitTextToSize(`${String.fromCharCode(65 + oi)}.  ${opt}${tag}`, pageW - M * 2 - 14);
      const h = optLines.length * 12 + 10;
      if (yy + h > pageH - 50) {
        doc.addPage();
        yy = 40;
      }
      doc.setFillColor(...bg);
      doc.setDrawColor(...border);
      doc.setLineWidth(1);
      doc.roundedRect(M, yy, pageW - M * 2, h, 4, 4, "FD");
      doc.setTextColor(...txt);
      doc.text(optLines, M + 8, yy + 14);
      yy += h + 6;
    });

    // marks badge
    if (yy + 30 > pageH - 50) {
      doc.addPage();
      yy = 40;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(r.delta > 0 ? SUCCESS[0] : r.delta < 0 ? DANGER[0] : MUTED[0], r.delta > 0 ? SUCCESS[1] : r.delta < 0 ? DANGER[1] : MUTED[1], r.delta > 0 ? SUCCESS[2] : r.delta < 0 ? DANGER[2] : MUTED[2]);
    doc.text(`Marks: ${r.delta > 0 ? "+" : ""}${r.delta}    (+${r.q.marks} / -${r.q.negative_marks})`, M, yy + 16);
  });

  // ===== Footer on every page =====
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(230, 228, 240);
    doc.setLineWidth(0.5);
    doc.line(M, pageH - 30, pageW - M, pageH - 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("AdhyayX  ·  Powered by EduSpark  ·  Har Adhyay, Ek Nayi Jeet", M, pageH - 16);
    doc.text(`Page ${p} of ${pageCount}`, pageW - M, pageH - 16, { align: "right" });
  }

  const safeName = test.name.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 40);
  doc.save(`AdhyayX_Result_${safeName}.pdf`);
}
