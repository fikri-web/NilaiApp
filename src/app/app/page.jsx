"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Plus,
  FileSpreadsheet,
  Trash2,
  LogOut,
  Camera,
  Layers,
  Settings,
  AlertCircle
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Panel from "@/components/ui/Panel";
import { authHelper } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { gradesHelper } from "@/lib/grades";
import XLSX from "xlsx-js-style";

export default function DashboardApp() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [newColName, setNewColName] = useState("");
  const [toast, setToast] = useState(null);
  const [template, setTemplate] = useState("rapor");
  const [customColumns, setCustomColumns] = useState([]);
  const [katalogSubjects, setKatalogSubjects] = useState(["B. Arab", "Akidah Akhlak"]);
  const [newSubjectInput, setNewSubjectInput] = useState("");

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => curr?.message === message ? null : curr);
    }, 4500);
  };

  // Spreadsheet Metadata States
  const [schoolName, setSchoolName] = useState("SMP NEGERI 9 PEMATANGSIANTAR");
  const [classNameVal, setClassNameVal] = useState("IX-1");
  const [subjectName, setSubjectName] = useState("B.arab");
  const [semesterVal, setSemesterVal] = useState("Ganjil");
  const [kkmVal, setKkmVal] = useState("75");
  const [tpVal, setTpVal] = useState("2016-2017");

  const [studentName, setStudentName] = useState("");
  const [simpleGrade, setSimpleGrade] = useState("");
  const [utsGrade, setUtsGrade] = useState("");
  const [uasGrade, setUasGrade] = useState("");
  const [harian1, setHarian1] = useState("");
  const [harian2, setHarian2] = useState("");
  const [harian3, setHarian3] = useState("");
  const [harian4, setHarian4] = useState("");
  const [customValues, setCustomValues] = useState({});

  async function loadGrades(userId) {
    try {
      const data = await gradesHelper.getGrades(userId);
      setGrades(data);
    } catch (err) {
      console.error("Gagal memuat nilai:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    authHelper.getSessionUser().then((sessionUser) => {
      if (!sessionUser) {
        router.push("/login");
      } else {
        setUser(sessionUser);

        // Load metadata
        if (typeof window !== "undefined") {
          const savedSchool = localStorage.getItem("nilai_school_name");
          const savedClass = localStorage.getItem("nilai_class_name");
          const savedSubject = localStorage.getItem("nilai_subject_name");
          const savedSemester = localStorage.getItem("nilai_semester");
          const savedKkm = localStorage.getItem("nilai_kkm");
          const savedTp = localStorage.getItem("nilai_tp");
          const savedTemplate = localStorage.getItem("nilai_selected_template");
          const savedCustomColumns = localStorage.getItem("nilai_custom_columns");

          if (savedSchool) setSchoolName(savedSchool);
          if (savedClass) setClassNameVal(savedClass);
          if (savedSubject) setSubjectName(savedSubject);
          if (savedSemester) setSemesterVal(savedSemester);
          if (savedKkm) setKkmVal(savedKkm);
          if (savedTp) setTpVal(savedTp);
          if (savedTemplate) setTemplate(savedTemplate);
          if (savedCustomColumns) {
            try {
              setCustomColumns(JSON.parse(savedCustomColumns));
            } catch (e) {
              console.error(e);
            }
          }
          const savedKatalogSubjects = localStorage.getItem("nilai_katalog_subjects");
          if (savedKatalogSubjects) {
            try {
              setKatalogSubjects(JSON.parse(savedKatalogSubjects));
            } catch (e) {
              console.error(e);
            }
          }

          // Check for pending cross-page toast notification
          const pendingMsg = localStorage.getItem("nilai_toast_message");
          const pendingType = localStorage.getItem("nilai_toast_type") || "info";
          if (pendingMsg) {
            showToast(pendingMsg, pendingType);
            localStorage.removeItem("nilai_toast_message");
            localStorage.removeItem("nilai_toast_type");
          }
        }

        // Initialize mock data if empty
        if (typeof window !== "undefined" && !localStorage.getItem("nilai_grades")) {
          const initialMock = [
            {
              id: "grade_1",
              user_id: sessionUser.id,
              nama: "ABDI SANJAYA",
              template_type: "rapor",
              nilai: JSON.stringify({ h1: 80, h2: 85, h3: 78, h4: 82, uts: 85, uas: 88, rtHarian: 81.3, rtUjian: 86.5, deskripsi: "Baik" }),
              rata: 83.1,
              created_at: new Date(Date.now() - 60000).toISOString()
            },
            {
              id: "grade_2",
              user_id: sessionUser.id,
              nama: "ABRAHAM MS",
              template_type: "rapor",
              nilai: JSON.stringify({ h1: 75, h2: 78, h3: 72, h4: 80, uts: 78, uas: 75, rtHarian: 76.3, rtUjian: 76.5, deskripsi: "Baik" }),
              rata: 76.4,
              created_at: new Date(Date.now() - 50000).toISOString()
            },
            {
              id: "grade_3",
              user_id: sessionUser.id,
              nama: "ADE SETIAWAN",
              template_type: "rapor",
              nilai: JSON.stringify({ h1: 90, h2: 92, h3: 88, h4: 94, uts: 90, uas: 92, rtHarian: 91.0, rtUjian: 91.0, deskripsi: "Sangat Baik" }),
              rata: 91.0,
              created_at: new Date(Date.now() - 40000).toISOString()
            },
            {
              id: "grade_m1",
              user_id: sessionUser.id,
              nama: "ABDI SANJAYA",
              template_type: "mapel",
              nilai: JSON.stringify({ n1: 85, n2: 90, n3: 80, jumlah: 255 }),
              rata: 85.0,
              created_at: new Date(Date.now() - 30000).toISOString()
            },
            {
              id: "grade_m2",
              user_id: sessionUser.id,
              nama: "ABRAHAM MS",
              template_type: "mapel",
              nilai: JSON.stringify({ n1: 70, n2: 75, n3: 72, jumlah: 217 }),
              rata: 72.3,
              created_at: new Date(Date.now() - 20000).toISOString()
            },
            {
              id: "grade_m3",
              user_id: sessionUser.id,
              nama: "ADE SETIAWAN",
              template_type: "mapel",
              nilai: JSON.stringify({ n1: 92, n2: 95, n3: 96, jumlah: 283 }),
              rata: 94.3,
              created_at: new Date(Date.now() - 10000).toISOString()
            },
            {
              id: "grade_k1",
              user_id: sessionUser.id,
              nama: "ABDI SANJAYA",
              template_type: "katalog",
              nilai: JSON.stringify({ "B. Arab": 85, "Akidah Akhlak": 90 }),
              rata: 87.5,
              created_at: new Date(Date.now() - 5000).toISOString()
            },
            {
              id: "grade_k2",
              user_id: sessionUser.id,
              nama: "ABRAHAM MS",
              template_type: "katalog",
              nilai: JSON.stringify({ "B. Arab": 78, "Akidah Akhlak": 82 }),
              rata: 80.0,
              created_at: new Date(Date.now() - 4000).toISOString()
            }
          ];
          localStorage.setItem("nilai_grades", JSON.stringify(initialMock));
        }

        loadGrades(sessionUser.id);
      }
    }).catch(() => {
      router.push("/login");
    });
  }, [router]);

  const handleLogout = async () => {
    await authHelper.signOut();
    router.push("/login");
  };

  // Local storage setters for metadata
  const handleSchoolChange = (val) => {
    setSchoolName(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_school_name", val);
    }
  };
  const handleClassChange = (val) => {
    setClassNameVal(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_class_name", val);
    }
  };
  const handleSubjectChange = (val) => {
    setSubjectName(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_subject_name", val);
    }
  };
  const handleSemesterChange = (val) => {
    setSemesterVal(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_semester", val);
    }
  };
  const handleKkmChange = (val) => {
    setKkmVal(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_kkm", val);
    }
  };
  const handleTpChange = (val) => {
    setTpVal(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_tp", val);
    }
  };

  const handleTemplateChange = (val) => {
    setTemplate(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_selected_template", val);
    }
  };

  const handleAddCustomColumn = (e) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    if (customColumns.includes(newColName.trim())) return;
    const updated = [...customColumns, newColName.trim()];
    setCustomColumns(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_custom_columns", JSON.stringify(updated));
    }
    setNewColName("");
  };

  const handleDeleteCustomColumn = (col) => {
    const updated = customColumns.filter((c) => c !== col);
    setCustomColumns(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_custom_columns", JSON.stringify(updated));
    }
    const cleanValues = { ...customValues };
    delete cleanValues[col];
    setCustomValues(cleanValues);
  };

  const handleAddKatalogSubject = (e) => {
    e.preventDefault();
    if (!newSubjectInput.trim()) return;
    if (katalogSubjects.includes(newSubjectInput.trim())) return;
    const updated = [...katalogSubjects, newSubjectInput.trim()];
    setKatalogSubjects(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_katalog_subjects", JSON.stringify(updated));
    }
    setNewSubjectInput("");
  };

  const handleDeleteKatalogSubject = (subj) => {
    const updated = katalogSubjects.filter((s) => s !== subj);
    setKatalogSubjects(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("nilai_katalog_subjects", JSON.stringify(updated));
    }
    const cleanValues = { ...customValues };
    delete cleanValues[subj];
    setCustomValues(cleanValues);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    let gradeEntry = {
      nama: studentName,
      template_type: template,
    };

    if (template === "simple") {
      const val1 = parseFloat(harian1) || 0;
      const val2 = parseFloat(harian2) || 0;
      const val3 = parseFloat(harian3) || 0;

      const sum = val1 + val2 + val3;
      const avg = parseFloat((sum / 3).toFixed(1));

      const simpleData = {
        n1: val1,
        n2: val2,
        n3: val3,
        jumlah: sum
      };

      gradeEntry.nilai = JSON.stringify(simpleData);
      gradeEntry.rata = avg;
    } else if (template === "rapor") {
      const h1 = parseFloat(harian1) || 0;
      const h2 = parseFloat(harian2) || 0;
      const h3 = parseFloat(harian3) || 0;
      const h4 = parseFloat(harian4) || 0;
      const utsVal = parseFloat(utsGrade) || 0;
      const uasVal = parseFloat(uasGrade) || 0;

      const rtHarian = parseFloat(((h1 + h2 + h3 + h4) / 4).toFixed(1));
      const rtUjian = parseFloat(((utsVal + uasVal) / 2).toFixed(1));
      const nrVal = parseFloat(((rtHarian + utsVal + uasVal) / 3).toFixed(1));

      let desc = "Kurang";
      if (nrVal >= 85) desc = "Sangat Baik";
      else if (nrVal >= 75) desc = "Baik";
      else if (nrVal >= 60) desc = "Cukup";

      const raporData = {
        h1, h2, h3, h4,
        uts: utsVal,
        uas: uasVal,
        rtHarian,
        rtUjian,
        deskripsi: desc
      };

      gradeEntry.nilai = JSON.stringify(raporData);
      gradeEntry.rata = nrVal;
    } else if (template === "mapel") {
      const val1 = parseFloat(harian1) || 0;
      const val2 = parseFloat(harian2) || 0;
      const val3 = parseFloat(harian3) || 0;

      const sum = val1 + val2 + val3;
      const avg = parseFloat((sum / 3).toFixed(1));

      const mapelData = {
        n1: val1,
        n2: val2,
        n3: val3,
        jumlah: sum
      };

      gradeEntry.nilai = JSON.stringify(mapelData);
      gradeEntry.rata = avg;
    } else if (template === "kosong") {
      const valuesArray = Object.values(customValues).map((v) => parseFloat(v) || 0);
      const sum = valuesArray.reduce((acc, curr) => acc + curr, 0);
      const avg = valuesArray.length > 0 ? parseFloat((sum / valuesArray.length).toFixed(1)) : 0;

      gradeEntry.nilai = JSON.stringify(customValues);
      gradeEntry.rata = avg;
    } else if (template === "katalog") {
      const catalogData = {};
      let totalSum = 0;
      katalogSubjects.forEach((subj) => {
        const sVals = customValues[subj] || {};
        const n1 = parseFloat(sVals.n1) || 0;
        const n2 = parseFloat(sVals.n2) || 0;
        const n3 = parseFloat(sVals.n3) || 0;
        catalogData[subj] = { n1, n2, n3 };
        totalSum += (n1 + n2 + n3) / 3;
      });
      const avg = katalogSubjects.length > 0 ? parseFloat((totalSum / katalogSubjects.length).toFixed(1)) : 0;

      gradeEntry.nilai = JSON.stringify(catalogData);
      gradeEntry.rata = avg;
    }

    try {
      const newRow = await gradesHelper.addGrade(user.id, gradeEntry);
      setGrades([newRow, ...grades]);

      setStudentName("");
      setSimpleGrade("");
      setHarian1("");
      setHarian2("");
      setHarian3("");
      setHarian4("");
      setUtsGrade("");
      setUasGrade("");
      setCustomValues({});
      showToast("Berhasil menambahkan data nilai siswa!", "success");
    } catch (err) {
      showToast("Gagal menambahkan nilai: " + err.message, "error");
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await gradesHelper.deleteGrade(user.id, id);
      setGrades(grades.filter((g) => g.id !== id));
      showToast("Berhasil menghapus data nilai siswa.", "success");
    } catch (err) {
      showToast("Gagal menghapus: " + err.message, "error");
    }
  };

  const handleReset = async () => {
    try {
      await gradesHelper.clearGrades(user.id);
      setGrades([]);
      showToast("Semua data nilai berhasil dihapus.", "success");
    } catch (err) {
      showToast("Gagal menghapus data: " + err.message, "error");
    }
  };

  const filteredGrades = grades.filter((g) => g.template_type === template);
  const rankedGrades = [...filteredGrades].sort((a, b) => {
    if (template === "simple") {
      return new Date(a.created_at) - new Date(b.created_at);
    }
    return b.rata - a.rata;
  });

  // Apply Styles Helper for Excel Generation — Plain / Polos style
  const applyExcelStyles = (worksheet, templateType, headerStartRow, customColCount = 0) => {
    // Set column widths
    const cols = [];
    for (let i = 0; i < 20; i++) {
      if (i === 0) cols.push({ wch: 5 });        // No
      else if (i === 1) cols.push({ wch: 25 });   // Nama
      else if (i === 11) cols.push({ wch: 25 });   // Deskripsi (rapor)
      else cols.push({ wch: 12 });
    }
    worksheet["!cols"] = cols;

    // Standard thin black border
    const thinBorder = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    };

    for (let key in worksheet) {
      if (key[0] === "!") continue;

      const cell = worksheet[key];
      const colLetter = key.match(/[A-Z]+/)[0];
      const rowNum = parseInt(key.match(/\d+/)[0]);
      const colIndex = XLSX.utils.decode_col(colLetter);
      const rowIndex = rowNum - 1;

      // Determine row type
      const isHeader = templateType === "rapor"
        ? (rowIndex === 7 || rowIndex === 8)
        : (templateType === "mapel" || templateType === "katalog")
          ? (rowIndex === 5 || rowIndex === 6)
          : (rowIndex === headerStartRow);

      const isMetadata = templateType === "rapor"
        ? (rowIndex < 7)
        : (templateType === "mapel" || templateType === "katalog")
          ? (rowIndex < 5)
          : (rowIndex < headerStartRow);

      // Default: plain black text, no fill
      let font = { name: "Arial", sz: 11 };
      let alignment = { vertical: "center", horizontal: "left" };
      let border = null;

      if (isMetadata) {
        // Title rows — no border, centered, bold for titles
        if (rowIndex === 0) {
          font = { name: "Arial", sz: 12, bold: true, underline: true };
          alignment = { horizontal: "center", vertical: "center" };
        } else if (rowIndex === 1) {
          font = { name: "Arial", sz: 11 };
          alignment = { horizontal: "center", vertical: "center" };
        } else if (rowIndex === 2) {
          font = { name: "Arial", sz: 10 };
          alignment = { horizontal: "center", vertical: "center" };
        } else if (
          (templateType === "rapor" && (rowIndex === 4 || rowIndex === 5)) ||
          (templateType === "mapel" && rowIndex === 3)
        ) {
          font = { name: "Arial", sz: 11, bold: colIndex === 0 };
          alignment = { horizontal: "left", vertical: "center" };
        }
      } else if (isHeader) {
        // Header rows — bold text, centered, black borders, NO fill
        font = { name: "Arial", sz: 11, bold: true };
        alignment = { horizontal: "center", vertical: "center", wrapText: true };
        border = thinBorder;
      } else {
        // Data rows — plain text, black borders, NO fill
        font = { name: "Arial", sz: 11 };
        alignment = { vertical: "center", horizontal: "center" };
        border = thinBorder;

        // Name column left-aligned
        if (colIndex === 1) {
          alignment = { vertical: "center", horizontal: "left" };
        }
      }

      // Apply style — no fill at all
      cell.s = { font, alignment };
      if (border) cell.s.border = border;
    }
  };

  const handleExportExcel = () => {
    if (filteredGrades.length === 0) {
      showToast("Tidak ada data untuk diekspor.", "error");
      return;
    }

    let worksheet;
    let filename = `Rekap_Nilai_${template}.xlsx`;

    if (template === "simple") {
      const metaRows = [
        ["Daftar Nilai"],
        [schoolName.toUpperCase()],
        [],
        ["Kelas :", classNameVal],
        []
      ];
      const headerRow1 = ["No", "Nama", subjectName, "", ""];
      const headerRow2 = ["", "", "1", "2", "3"];
      const dataRows = rankedGrades.map((g, idx) => {
        let simpleVals = {};
        if (g.nilai) {
          try {
            simpleVals = JSON.parse(g.nilai);
          } catch {
            simpleVals = {};
          }
        }
        return [
          idx + 1,
          g.nama.toUpperCase(),
          simpleVals.n1 || 0,
          simpleVals.n2 || 0,
          simpleVals.n3 || 0
        ];
      });

      const finalData = [...metaRows, headerRow1, headerRow2, ...dataRows];
      worksheet = XLSX.utils.aoa_to_sheet(finalData);

      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
        { s: { r: 5, c: 0 }, e: { r: 6, c: 0 } },
        { s: { r: 5, c: 1 }, e: { r: 6, c: 1 } },
        { s: { r: 5, c: 2 }, e: { r: 5, c: 4 } }
      ];

      applyExcelStyles(worksheet, "mapel", 5);
      filename = `Rekap_Nilai_Sederhana_${subjectName}_${classNameVal}.xlsx`;

    } else if (template === "rapor") {
      const metaRows = [
        ["DAFTAR NILAI RAPOR SISWA"],
        [schoolName.toUpperCase()],
        [`T.P ${tpVal}`],
        [],
        ["Semester :", semesterVal, "", "", "", "", "", "Mata Pelajaran :", subjectName],
        ["Kelas :", classNameVal, "", "", "", "", "", "KKM :", kkmVal],
        []
      ];
      const headerRow1 = ["No", "Nama Lengkap Siswa", "Nilai Harian", "", "", "", "", "Ujian", "", "", "Nilai Rapor (NR)", "Deskripsi"];
      const headerRow2 = ["", "", "1", "2", "3", "4", "RT", "UTS", "UAS", "RT", "", ""];
      const dataRows = rankedGrades.map((g, idx) => {
        let raporVals = {};
        if (g.nilai) {
          try {
            raporVals = JSON.parse(g.nilai);
          } catch {
            raporVals = {};
          }
        }
        return [
          idx + 1,
          g.nama.toUpperCase(),
          raporVals.h1 || 0,
          raporVals.h2 || 0,
          raporVals.h3 || 0,
          raporVals.h4 || 0,
          raporVals.rtHarian || 0,
          raporVals.uts || 0,
          raporVals.uas || 0,
          raporVals.rtUjian || 0,
          g.rata,
          raporVals.deskripsi || "Kurang"
        ];
      });

      const finalData = [...metaRows, headerRow1, headerRow2, ...dataRows];
      worksheet = XLSX.utils.aoa_to_sheet(finalData);

      worksheet["!merges"] = [
        // Title merges
        { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 11 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 11 } },

        // Metadata merges
        { s: { r: 4, c: 1 }, e: { r: 4, c: 3 } },
        { s: { r: 4, c: 8 }, e: { r: 4, c: 11 } },
        { s: { r: 5, c: 1 }, e: { r: 5, c: 3 } },
        { s: { r: 5, c: 8 }, e: { r: 5, c: 11 } },

        // Header merges (adjusted for 7 rows of meta/blank)
        { s: { r: 7, c: 0 }, e: { r: 8, c: 0 } },
        { s: { r: 7, c: 1 }, e: { r: 8, c: 1 } },
        { s: { r: 7, c: 2 }, e: { r: 7, c: 6 } },
        { s: { r: 7, c: 7 }, e: { r: 7, c: 9 } },
        { s: { r: 7, c: 10 }, e: { r: 8, c: 10 } },
        { s: { r: 7, c: 11 }, e: { r: 8, c: 11 } }
      ];

      applyExcelStyles(worksheet, "rapor", 7);
      filename = `Rekap_Rapor_${classNameVal}.xlsx`;

    } else if (template === "mapel") {
      const metaRows = [
        ["Daftar Nilai"],
        [schoolName.toUpperCase()],
        [],
        ["Kelas :", classNameVal],
        []
      ];
      const headerRow1 = ["No", "Nama", subjectName, "", "", "Rata-rata", "Jumlah", "Ranking"];
      const headerRow2 = ["", "", "1", "2", "3", "", "", ""];
      const dataRows = rankedGrades.map((g, idx) => {
        let mapelVals = {};
        if (g.nilai) {
          try {
            mapelVals = JSON.parse(g.nilai);
          } catch {
            mapelVals = {};
          }
        }
        return [
          idx + 1,
          g.nama.toUpperCase(),
          mapelVals.n1 || 0,
          mapelVals.n2 || 0,
          mapelVals.n3 || 0,
          g.rata,
          mapelVals.jumlah || 0,
          idx + 1
        ];
      });

      const finalData = [...metaRows, headerRow1, headerRow2, ...dataRows];
      worksheet = XLSX.utils.aoa_to_sheet(finalData);

      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
        { s: { r: 5, c: 0 }, e: { r: 6, c: 0 } },
        { s: { r: 5, c: 1 }, e: { r: 6, c: 1 } },
        { s: { r: 5, c: 2 }, e: { r: 5, c: 4 } },
        { s: { r: 5, c: 5 }, e: { r: 6, c: 5 } },
        { s: { r: 5, c: 6 }, e: { r: 6, c: 6 } },
        { s: { r: 5, c: 7 }, e: { r: 6, c: 7 } }
      ];

      applyExcelStyles(worksheet, "mapel", 5);
      filename = `Rekap_Nilai_${subjectName}_${classNameVal}.xlsx`;

    } else if (template === "kosong") {
      const metaRows = [
        ["REKAPITULASI NILAI KUSTOM"],
        [],
      ];
      const tableHeaders = ["Peringkat", "Nama Siswa", ...customColumns, "Rata-rata"];
      const dataRows = rankedGrades.map((g, idx) => {
        let studentCustomValues = {};
        if (g.nilai) {
          try {
            studentCustomValues = JSON.parse(g.nilai);
          } catch {
            studentCustomValues = {};
          }
        }
        const row = [
          idx + 1,
          g.nama.toUpperCase()
        ];
        customColumns.forEach((col) => {
          row.push(studentCustomValues[col] || 0);
        });
        row.push(g.rata);
        return row;
      });

      const finalData = [...metaRows, tableHeaders, ...dataRows];
      worksheet = XLSX.utils.aoa_to_sheet(finalData);
      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: customColumns.length + 2 } }
      ];

      applyExcelStyles(worksheet, "kosong", 2, customColumns.length);
      filename = `Rekap_Nilai_Kustom.xlsx`;
    } else if (template === "katalog") {
      const metaRows = [
        ["DAFTAR NILAI KATALOG (LEGER)"],
        [schoolName.toUpperCase()],
        [],
        ["Kelas :", classNameVal],
        []
      ];

      const headerRow1 = ["No", "Nama Siswa"];
      katalogSubjects.forEach((s) => {
        headerRow1.push(s, "", "");
      });
      headerRow1.push("Rata-rata", "Jumlah", "Ranking");

      const headerRow2 = ["", ""];
      katalogSubjects.forEach(() => {
        headerRow2.push("1", "2", "3");
      });
      headerRow2.push("", "", "");

      const dataRows = rankedGrades.map((g, idx) => {
        let studentVals = {};
        if (g.nilai) {
          try {
            studentVals = JSON.parse(g.nilai);
          } catch {
            studentVals = {};
          }
        }
        const row = [
          idx + 1,
          g.nama.toUpperCase()
        ];
        let totalSum = 0;
        katalogSubjects.forEach((subj) => {
          let sVals = studentVals[subj];
          if (typeof sVals !== "object" || sVals === null) {
            sVals = { n1: parseFloat(sVals) || 0, n2: 0, n3: 0 };
          }
          row.push(sVals.n1 || 0, sVals.n2 || 0, sVals.n3 || 0);
          totalSum += ((sVals.n1 || 0) + (sVals.n2 || 0) + (sVals.n3 || 0)) / 3;
        });
        row.push(
          g.rata,
          parseFloat(totalSum.toFixed(1)),
          idx + 1
        );
        return row;
      });

      const finalData = [...metaRows, headerRow1, headerRow2, ...dataRows];
      worksheet = XLSX.utils.aoa_to_sheet(finalData);

      const totalCols = 2 + katalogSubjects.length * 3 + 3;
      const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
        { s: { r: 5, c: 0 }, e: { r: 6, c: 0 } }, // No
        { s: { r: 5, c: 1 }, e: { r: 6, c: 1 } }  // Nama
      ];

      katalogSubjects.forEach((_, i) => {
        merges.push({
          s: { r: 5, c: 2 + i * 3 },
          e: { r: 5, c: 4 + i * 3 }
        });
      });

      const startIdx = 2 + katalogSubjects.length * 3;
      merges.push(
        { s: { r: 5, c: startIdx }, e: { r: 6, c: startIdx } },     // Rata-rata
        { s: { r: 5, c: startIdx + 1 }, e: { r: 6, c: startIdx + 1 } }, // Jumlah
        { s: { r: 5, c: startIdx + 2 }, e: { r: 6, c: startIdx + 2 } }  // Ranking
      );

      worksheet["!merges"] = merges;
      applyExcelStyles(worksheet, "katalog", 5);
      filename = `Rekap_Nilai_Katalog_${classNameVal}.xlsx`;
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Nilai");
    XLSX.writeFile(workbook, filename);
  };

  const meanScore = filteredGrades.length > 0
    ? (filteredGrades.reduce((acc, curr) => acc + curr.rata, 0) / filteredGrades.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center font-sans">
        <Panel className="text-center p-8 bg-[#f0f2f5]" variant="raised">
          <GraduationCap className="w-12 h-12 text-[#3b82f6] animate-pulse mx-auto mb-4" />
          <h2 className="text-[#2d3436] font-bold">Memuat Penilaian...</h2>
        </Panel>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e0e5ec] flex flex-col font-sans p-6">

      {/* Top Header */}
      <div className="max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between border-b border-[#babecc]/50 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f0f2f5] flex items-center justify-center border border-white/60 shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] bevel-top">
            <GraduationCap className="w-6 h-6 text-[#3b82f6]" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#4a5568] uppercase">ADMINISTRASI KELAS</span>
            <h1 className="text-xl md:text-2xl font-black text-[#2d3436] uppercase tracking-wide">Lembar Rekap Nilai</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-semibold text-[#4a5568] bg-[#f0f2f5] px-3.5 py-1.5 rounded-lg border border-white/60 shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] bevel-inset">
            Guru: {user?.email}
          </span>
          <Button variant="secondary" onClick={handleReset} className="text-xs px-3.5 py-2">
            Reset Data
          </Button>
          <Button variant="secondary" onClick={handleLogout} className="flex items-center gap-2 px-3.5 py-2">
            <LogOut className="w-4 h-4" />
            Keluar
          </Button>
        </div>
      </div>

      {/* Template Selector Banner */}
      <div className="max-w-7xl w-full mx-auto mb-6">
        <Panel variant="raised" className="bg-[#f0f2f5] p-5" contentClassName="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#3b82f6]" />
            <div>
              <h3 className="font-extrabold text-sm uppercase text-[#2d3436]">Pilih Template Kolom</h3>
              <p className="text-xs text-[#4a5568]">Struktur kolom tabel disesuaikan secara dinamis</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={template === "simple" ? "accent" : "primary"}
              onClick={() => handleTemplateChange("simple")}
              className="px-4 py-2"
            >
              Template Sederhana
            </Button>
            <Button
              variant={template === "rapor" ? "accent" : "primary"}
              onClick={() => handleTemplateChange("rapor")}
              className="px-4 py-2"
            >
              Template Rapor (Lengkap)
            </Button>
            <Button
              variant={template === "mapel" ? "accent" : "primary"}
              onClick={() => handleTemplateChange("mapel")}
              className="px-4 py-2"
            >
              Template Mapel (Dinamis)
            </Button>
            <Button
              variant={template === "katalog" ? "accent" : "primary"}
              onClick={() => handleTemplateChange("katalog")}
              className="px-4 py-2"
            >
              Template Mapel Lengkap
            </Button>
            <Button
              variant={template === "kosong" ? "accent" : "primary"}
              onClick={() => handleTemplateChange("kosong")}
              className="px-4 py-2"
            >
              Template Kustom
            </Button>
          </div>
        </Panel>
      </div>

      {/* Rapor Settings Panel */}
      {template === "rapor" && (
        <div className="max-w-7xl w-full mx-auto mb-6">
          <Panel variant="raised" className="bg-[#f0f2f5] p-5" contentClassName="flex flex-wrap gap-4 items-end w-full">
            <div className="flex-grow min-w-[220px]">
              <Input
                id="school-input-rapor"
                label="Nama Sekolah"
                value={schoolName}
                onChange={(e) => handleSchoolChange(e.target.value)}
              />
            </div>
            <div className="w-28">
              <Input
                id="semester-input"
                label="Semester"
                value={semesterVal}
                onChange={(e) => handleSemesterChange(e.target.value)}
              />
            </div>
            <div className="w-24">
              <Input
                id="class-input-rapor"
                label="Kelas"
                value={classNameVal}
                onChange={(e) => handleClassChange(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Input
                id="subject-input-rapor"
                label="Mata Pelajaran"
                value={subjectName}
                onChange={(e) => handleSubjectChange(e.target.value)}
              />
            </div>
            <div className="w-24">
              <Input
                id="kkm-input"
                label="KKM"
                value={kkmVal}
                onChange={(e) => handleKkmChange(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Input
                id="tp-input"
                label="Tahun Pelajaran"
                value={tpVal}
                onChange={(e) => handleTpChange(e.target.value)}
              />
            </div>
          </Panel>
        </div>
      )}

      {/* Mapel Settings panel */}
      {(template === "simple" || template === "mapel") && (
        <div className="max-w-7xl w-full mx-auto mb-6">
          <Panel variant="raised" className="bg-[#f0f2f5] p-5" contentClassName="flex flex-wrap gap-4 items-center justify-between w-full">
            <div className="flex-1 min-w-[220px]">
              <Input
                id="school-input"
                label="Nama Sekolah"
                value={schoolName}
                onChange={(e) => handleSchoolChange(e.target.value)}
              />
            </div>
            <div className="w-36">
              <Input
                id="class-input"
                label="Kelas"
                value={classNameVal}
                onChange={(e) => handleClassChange(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Input
                id="subject-input"
                label="Mata Pelajaran"
                value={subjectName}
                onChange={(e) => handleSubjectChange(e.target.value)}
              />
            </div>
          </Panel>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Form (cols 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">

          {/* Custom Column Builder (Template Kosong) */}
          {template === "kosong" && (
            <Panel variant="raised" className="bg-[#f0f2f5]" contentClassName="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2 border-b border-[#babecc]/40 pb-2">
                <Settings className="w-4 h-4 text-[#3b82f6]" />
                <h3 className="font-extrabold text-xs uppercase text-[#2d3436]">Buat Kolom Kustom</h3>
              </div>

              <form onSubmit={handleAddCustomColumn} className="flex gap-2">
                <Input
                  id="new-col-name"
                  placeholder="Nama kolom..."
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                />
                <Button type="submit" variant="accent" className="shrink-0">
                  Tambah
                </Button>
              </form>

              {customColumns.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {customColumns.map((col) => (
                    <span
                      key={col}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#d1d9e6]/40 text-xs font-semibold border border-[#babecc]/50 shadow-sm"
                    >
                      {col}
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomColumn(col)}
                        className="text-red-500 hover:text-red-700 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-[#4a5568]/60 italic">Belum ada kolom kustom dibuat.</span>
              )}
            </Panel>
          )}

          {/* Katalog Subject Builder */}
          {template === "katalog" && (
            <Panel variant="raised" className="bg-[#f0f2f5]" contentClassName="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2 border-b border-[#babecc]/40 pb-2">
                <Settings className="w-4 h-4 text-[#3b82f6]" />
                <h3 className="font-extrabold text-xs uppercase text-[#2d3436]">Kelola Mata Pelajaran</h3>
              </div>

              <form onSubmit={handleAddKatalogSubject} className="flex gap-2">
                <Input
                  id="new-subject-name"
                  placeholder="Nama mata pelajaran baru..."
                  value={newSubjectInput}
                  onChange={(e) => setNewSubjectInput(e.target.value)}
                />
                <Button type="submit" variant="accent" className="shrink-0">
                  Tambah
                </Button>
              </form>

              {katalogSubjects.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {katalogSubjects.map((subj) => (
                    <span
                      key={subj}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#d1d9e6]/40 text-xs font-semibold border border-[#babecc]/50 shadow-sm"
                    >
                      {subj}
                      <button
                        type="button"
                        onClick={() => handleDeleteKatalogSubject(subj)}
                        className="text-red-500 hover:text-red-700 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-[#4a5568]/60 italic">Belum ada mata pelajaran. Tambah di atas.</span>
              )}
            </Panel>
          )}

          {/* Form Entry */}
          <Panel variant="raised" className="bg-[#f0f2f5]" contentClassName="flex flex-col gap-5 w-full">
            <div className="flex items-center justify-between border-b border-[#babecc]/40 pb-3">
              <h2 className="font-extrabold text-sm uppercase text-[#2d3436]">Input Nilai Manual</h2>
              <Link href={`/app/scan?template=${template}`}>
                <Button variant="secondary" className="text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  Scan OCR
                </Button>
              </Link>
            </div>

            <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
              <Input
                id="student-name"
                label="Nama Siswa"
                placeholder="Nama lengkap siswa..."
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />



              {template === "rapor" && (
                <>
                  <span className="text-xs font-extrabold uppercase text-[#4a5568] -mb-1 block">Nilai Harian</span>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="harian-1"
                      placeholder="Harian 1"
                      type="number"
                      min="0"
                      max="100"
                      value={harian1}
                      onChange={(e) => setHarian1(e.target.value)}
                      required
                    />
                    <Input
                      id="harian-2"
                      placeholder="Harian 2"
                      type="number"
                      min="0"
                      max="100"
                      value={harian2}
                      onChange={(e) => setHarian2(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="harian-3"
                      placeholder="Harian 3"
                      type="number"
                      min="0"
                      max="100"
                      value={harian3}
                      onChange={(e) => setHarian3(e.target.value)}
                      required
                    />
                    <Input
                      id="harian-4"
                      placeholder="Harian 4"
                      type="number"
                      min="0"
                      max="100"
                      value={harian4}
                      onChange={(e) => setHarian4(e.target.value)}
                      required
                    />
                  </div>
                  <span className="text-xs font-extrabold uppercase text-[#4a5568] -mb-1 mt-1 block">Ujian</span>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="uts-grade"
                      placeholder="UTS"
                      type="number"
                      min="0"
                      max="100"
                      value={utsGrade}
                      onChange={(e) => setUtsGrade(e.target.value)}
                      required
                    />
                    <Input
                      id="uas-grade"
                      placeholder="UAS"
                      type="number"
                      min="0"
                      max="100"
                      value={uasGrade}
                      onChange={(e) => setUasGrade(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {(template === "simple" || template === "mapel") && (
                <>
                  <span className="text-xs font-extrabold uppercase text-[#4a5568] -mb-1 block">Nilai {subjectName}</span>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      id="mapel-1"
                      placeholder="1"
                      type="number"
                      min="0"
                      max="100"
                      value={harian1}
                      onChange={(e) => setHarian1(e.target.value)}
                      required
                    />
                    <Input
                      id="mapel-2"
                      placeholder="2"
                      type="number"
                      min="0"
                      max="100"
                      value={harian2}
                      onChange={(e) => setHarian2(e.target.value)}
                      required
                    />
                    <Input
                      id="mapel-3"
                      placeholder="3"
                      type="number"
                      min="0"
                      max="100"
                      value={harian3}
                      onChange={(e) => setHarian3(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {template === "kosong" && customColumns.map((col) => (
                <Input
                  key={col}
                  id={`custom-${col}`}
                  label={`Nilai ${col}`}
                  placeholder="e.g. 80"
                  type="number"
                  min="0"
                  max="100"
                  value={customValues[col] || ""}
                  onChange={(e) => setCustomValues({
                    ...customValues,
                    [col]: e.target.value
                  })}
                  required
                />
              ))}

              {template === "katalog" && katalogSubjects.map((subj) => (
                <div key={subj} className="space-y-1">
                  <span className="text-xs font-extrabold uppercase text-[#4a5568] -mb-1 block">Nilai {subj}</span>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      id={`katalog-${subj}-1`}
                      placeholder="1"
                      type="number"
                      min="0"
                      max="100"
                      value={customValues[subj]?.n1 || ""}
                      onChange={(e) => setCustomValues({
                        ...customValues,
                        [subj]: {
                          ...(customValues[subj] || {}),
                          n1: e.target.value
                        }
                      })}
                      required
                    />
                    <Input
                      id={`katalog-${subj}-2`}
                      placeholder="2"
                      type="number"
                      min="0"
                      max="100"
                      value={customValues[subj]?.n2 || ""}
                      onChange={(e) => setCustomValues({
                        ...customValues,
                        [subj]: {
                          ...(customValues[subj] || {}),
                          n2: e.target.value
                        }
                      })}
                      required
                    />
                    <Input
                      id={`katalog-${subj}-3`}
                      placeholder="3"
                      type="number"
                      min="0"
                      max="100"
                      value={customValues[subj]?.n3 || ""}
                      onChange={(e) => setCustomValues({
                        ...customValues,
                        [subj]: {
                          ...(customValues[subj] || {}),
                          n3: e.target.value
                        }
                      })}
                      required
                    />
                  </div>
                </div>
              ))}

              <Button type="submit" variant="accent" className="w-full py-3 mt-2 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Tambah Data
              </Button>
            </form>
          </Panel>

          {/* Quick Metrics */}
          <Panel variant="sunken" className="bg-[#e0e5ec]/40 p-4" contentClassName="flex flex-row items-center justify-between w-full">
            <div>
              <span className="text-[10px] font-bold text-[#4a5568] block uppercase">Jumlah Siswa</span>
              <span className="text-2xl font-black text-[#2d3436]">{filteredGrades.length} Siswa</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#4a5568] block uppercase">Rata-Rata Kelas</span>
              <span className="text-2xl font-black text-[#3b82f6]">{meanScore}</span>
            </div>
          </Panel>
        </div>

        {/* Right Table (cols 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          <Card hasScrews={false} liftOnHover={false} className="bg-[#f0f2f5] border border-[#babecc]/50 h-full flex flex-col justify-between font-sans">
            <div className="space-y-6">

              {/* Visual Spreadsheet Header for Rapor Template */}
              {template === "rapor" && (
                <div className="font-sans space-y-2 select-none border border-[#babecc]/35 bg-[#e0e5ec]/10 p-5 rounded-lg mb-6 shadow-inner">
                  <div className="text-center">
                    <h3 className="text-xs font-black uppercase text-[#2d3436] tracking-wider">Daftar Nilai</h3>
                    <h4 className="text-sm font-extrabold text-[#4a5568] uppercase">{schoolName}</h4>
                    <h5 className="text-[10px] font-bold text-[#4a5568]/80">T.P {tpVal}</h5>
                  </div>

                  <div className="grid grid-cols-2 text-xs font-semibold text-[#4a5568] pt-2 border-t border-[#babecc]/20">
                    <div className="space-y-1">
                      <div>Semester : <span className="text-[#2d3436] font-bold">{semesterVal}</span></div>
                      <div>Kelas : <span className="text-[#2d3436] font-bold">{classNameVal}</span></div>
                    </div>
                    <div className="space-y-1 text-right sm:text-left sm:pl-20">
                      <div>Mata Pelajaran : <span className="text-[#3b82f6] font-bold uppercase">{subjectName}</span></div>
                      <div>KKM : <span className="text-[#ef4444] font-bold">{kkmVal}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Visual Spreadsheet Header for Mapel Template */}
              {(template === "simple" || template === "mapel") && (
                <div className="text-center font-sans space-y-1 select-none border border-[#babecc]/35 bg-[#e0e5ec]/10 p-4 rounded-lg mb-6 shadow-inner">
                  <h3 className="text-xs font-black uppercase text-[#2d3436] tracking-wider">Daftar Nilai</h3>
                  <h4 className="text-sm font-extrabold text-[#4a5568] uppercase">{schoolName}</h4>
                  <div className="flex justify-center gap-8 text-xs font-semibold text-[#4a5568] pt-1">
                    <span>Kelas : <span className="text-[#2d3436] font-bold">{classNameVal}</span></span>
                    <span>Mata Pelajaran : <span className="text-[#3b82f6] font-bold uppercase">{subjectName}</span></span>
                  </div>
                </div>
              )}

              {/* Visual Spreadsheet Header for Katalog Template */}
              {template === "katalog" && (
                <div className="text-center font-sans space-y-1 select-none border border-[#babecc]/35 bg-[#e0e5ec]/10 p-4 rounded-lg mb-6 shadow-inner">
                  <h3 className="text-xs font-black uppercase text-[#2d3436] tracking-wider">DAFTAR NILAI KATALOG (LEGER)</h3>
                  <h4 className="text-sm font-extrabold text-[#4a5568] uppercase">{schoolName}</h4>
                  <div className="flex flex-col sm:flex-row justify-center sm:gap-8 text-xs font-semibold text-[#4a5568] pt-1">
                    <span>Kelas : <span className="text-[#2d3436] font-bold">{classNameVal}</span></span>
                    <span className="max-w-[400px] truncate" title={katalogSubjects.join(", ")}>
                      Mata Pelajaran : <span className="text-[#3b82f6] font-bold uppercase">{katalogSubjects.length > 0 ? katalogSubjects.join(", ") : "Belum ada"}</span>
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between border-b border-[#babecc]/40 pb-4 gap-4">
                <div>
                  <h2 className="font-extrabold text-md uppercase text-[#2d3436] tracking-wide">Daftar Nilai Siswa</h2>
                  <span className="text-[9px] text-[#4a5568] uppercase font-bold tracking-wider">
                    {template === "simple"
                      ? "Data Diurutkan Berdasarkan Waktu Pembuatan"
                      : "Peringkat Diurutkan Berdasarkan Nilai Rata-rata/Rapor Tertinggi"}
                  </span>
                </div>

                <Button
                  variant="accent"
                  onClick={handleExportExcel}
                  disabled={filteredGrades.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs shadow-none"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Ekspor Excel
                </Button>
              </div>

              {filteredGrades.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-[#babecc]/60 bg-white/40 shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]">
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      {template === "rapor" && (
                        <>
                          <tr className="border-b border-[#babecc]/50 bg-[#f0f2f5] text-[10px] font-bold uppercase text-[#4a5568] tracking-wider select-none">
                            <th className="py-2.5 px-3 text-center w-12" rowSpan={2}>No</th>
                            <th className="py-2.5 px-4" rowSpan={2}>Nama Lengkap Siswa</th>
                            <th className="py-1 px-2 text-center border-l border-r border-[#babecc]/40 bg-[#e0e5ec]/30" colSpan={5}>Nilai Harian</th>
                            <th className="py-1 px-2 text-center border-r border-[#babecc]/40 bg-[#e0e5ec]/30" colSpan={3}>Ujian</th>
                            <th className="py-2.5 px-3 text-right w-20 font-black" rowSpan={2}>Nilai Rapor (NR)</th>
                            <th className="py-2.5 px-4 text-left w-28" rowSpan={2}>Deskripsi</th>
                            <th className="py-2.5 px-3 text-center w-16" rowSpan={2}>Aksi</th>
                          </tr>
                          <tr className="border-b border-[#babecc]/50 bg-[#f0f2f5] text-[9px] font-bold uppercase text-[#4a5568] tracking-wider select-none text-right">
                            <th className="py-1 px-2 border-l border-[#babecc]/30 w-10 text-center">1</th>
                            <th className="py-1 px-2 text-center w-10">2</th>
                            <th className="py-1 px-2 text-center w-10">3</th>
                            <th className="py-1 px-2 text-center w-10">4</th>
                            <th className="py-1 px-2 font-extrabold border-r border-[#babecc]/30 bg-[#e0e5ec]/20 text-center w-12">RT</th>
                            <th className="py-1 px-2 text-center w-12">UTS</th>
                            <th className="py-1 px-2 text-center w-12">UAS</th>
                            <th className="py-1 px-2 font-extrabold border-r border-[#babecc]/30 bg-[#e0e5ec]/20 text-center w-12">RT</th>
                          </tr>
                        </>
                      )}

                      {template === "simple" && (
                        <>
                          <tr className="border-b border-[#babecc]/50 bg-[#f0f2f5] text-[10px] font-bold uppercase text-[#4a5568] tracking-wider select-none">
                            <th className="py-2.5 px-3 text-center w-12" rowSpan={2}>No</th>
                            <th className="py-2.5 px-4" rowSpan={2}>Nama</th>
                            <th className="py-1 px-2 text-center border-l border-r border-[#babecc]/40 bg-[#e0e5ec]/30" colSpan={3}>
                              {subjectName || "Mata Pelajaran"}
                            </th>
                            <th className="py-2.5 px-3 text-center w-16" rowSpan={2}>Aksi</th>
                          </tr>
                          <tr className="border-b border-[#babecc]/50 bg-[#f0f2f5] text-[9px] font-bold uppercase text-[#4a5568] tracking-wider select-none text-right">
                            <th className="py-1 px-2 border-l border-[#babecc]/30 w-12 text-center">1</th>
                            <th className="py-1 px-2 text-center w-12">2</th>
                            <th className="py-1 px-2 border-r border-[#babecc]/30 text-center w-12">3</th>
                          </tr>
                        </>
                      )}

                      {template === "mapel" && (
                        <>
                          <tr className="border-b border-[#babecc]/50 bg-[#f0f2f5] text-[10px] font-bold uppercase text-[#4a5568] tracking-wider select-none">
                            <th className="py-2.5 px-3 text-center w-12" rowSpan={2}>No</th>
                            <th className="py-2.5 px-4" rowSpan={2}>Nama</th>
                            <th className="py-1 px-2 text-center border-l border-r border-[#babecc]/40 bg-[#e0e5ec]/30" colSpan={3}>
                              {subjectName || "Mata Pelajaran"}
                            </th>
                            <th className="py-2.5 px-3 text-right w-20" rowSpan={2}>Rata-rata</th>
                            <th className="py-2.5 px-3 text-right w-20" rowSpan={2}>Jumlah</th>
                            <th className="py-2.5 px-3 text-center w-20 font-black" rowSpan={2}>Ranking</th>
                            <th className="py-2.5 px-3 text-center w-16" rowSpan={2}>Aksi</th>
                          </tr>
                          <tr className="border-b border-[#babecc]/50 bg-[#f0f2f5] text-[9px] font-bold uppercase text-[#4a5568] tracking-wider select-none text-right">
                            <th className="py-1 px-2 border-l border-[#babecc]/30 w-12 text-center">1</th>
                            <th className="py-1 px-2 text-center w-12">2</th>
                            <th className="py-1 px-2 border-r border-[#babecc]/30 text-center w-12">3</th>
                          </tr>
                        </>
                      )}

                      {template === "katalog" && (
                        <>
                          <tr className="border-b border-[#babecc]/50 bg-[#f0f2f5] text-[10px] font-bold uppercase text-[#4a5568] tracking-wider select-none">
                            <th className="py-2.5 px-3 text-center w-12" rowSpan={2}>No</th>
                            <th className="py-2.5 px-4" rowSpan={2}>Nama Lengkap</th>
                            {katalogSubjects.map((subj) => (
                              <th key={subj} className="py-1 px-2 text-center border-l border-r border-[#babecc]/40 bg-[#e0e5ec]/30" colSpan={3}>
                                {subj}
                              </th>
                            ))}
                            <th className="py-2.5 px-3 text-right w-20" rowSpan={2}>Rata-rata</th>
                            <th className="py-2.5 px-3 text-right w-20" rowSpan={2}>Jumlah</th>
                            <th className="py-2.5 px-3 text-center w-20 font-black" rowSpan={2}>Ranking</th>
                            <th className="py-2.5 px-3 text-center w-16" rowSpan={2}>Aksi</th>
                          </tr>
                          <tr className="border-b border-[#babecc]/50 bg-[#f0f2f5] text-[9px] font-bold uppercase text-[#4a5568] tracking-wider select-none text-right text-[#4a5568]/80">
                            {katalogSubjects.map((subj) => (
                              <React.Fragment key={subj}>
                                <th className="py-1 px-2 border-l border-[#babecc]/30 w-10 text-center">1</th>
                                <th className="py-1 px-2 text-center w-10">2</th>
                                <th className="py-1 px-2 border-r border-[#babecc]/30 text-center w-10">3</th>
                              </React.Fragment>
                            ))}
                          </tr>
                        </>
                      )}

                      {template !== "rapor" && template !== "simple" && template !== "mapel" && template !== "katalog" && (
                        <tr className="border-b border-[#babecc]/50 bg-[#f0f2f5] text-[10px] font-bold uppercase text-[#4a5568] tracking-wider select-none">
                          <th className="py-3 px-4 text-center w-12">No</th>
                          <th className="py-3 px-4">Nama Lengkap Siswa</th>
                          {template === "kosong" && (
                            <>
                              {customColumns.map((col) => (
                                <th key={col} className="py-3 px-4 text-right">{col}</th>
                              ))}
                              <th className="py-3 px-4 text-right">Rata-Rata</th>
                            </>
                          )}
                          <th className="py-3 px-4 text-center w-16">Aksi</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {rankedGrades.map((item, index) => {
                        const rank = index + 1;
                        let simpleVals = {};
                        let raporVals = {};
                        let mapelVals = {};
                        let customItemVals = {};

                        if (template === "simple" && item.nilai) {
                          try {
                            simpleVals = JSON.parse(item.nilai);
                          } catch {
                            simpleVals = { n1: parseFloat(item.nilai) || 0, n2: 0, n3: 0 };
                          }
                        } else if (template === "rapor" && item.nilai) {
                          try {
                            raporVals = JSON.parse(item.nilai);
                          } catch {
                            raporVals = {};
                          }
                        } else if (template === "mapel" && item.nilai) {
                          try {
                            mapelVals = JSON.parse(item.nilai);
                          } catch {
                            mapelVals = {};
                          }
                        } else if ((template === "kosong" || template === "katalog") && item.nilai) {
                          try {
                            customItemVals = JSON.parse(item.nilai);
                          } catch {
                            customItemVals = {};
                          }
                        }

                        return (
                          <tr
                            key={item.id}
                            className={`
                              border-b border-[#babecc]/30 text-xs text-[#2d3436] hover:bg-[#e0e5ec]/25 transition-colors
                              ${rank === 1 ? "bg-blue-50/15" : ""}
                            `}
                          >
                            {/* Number Row */}
                            <td className="py-3 px-3 text-center font-bold">
                              <span className={`
                                inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold
                                ${rank === 1 ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-[#d1d9e6]/40 text-[#4a5568]"}
                              `}>
                                {rank}
                              </span>
                            </td>

                            {/* Name Row */}
                            <td className="py-3 px-4 font-semibold uppercase">
                              <input
                                type="text"
                                className="w-full bg-transparent border-b border-transparent hover:border-[#babecc]/60 focus:border-[#3b82f6] outline-none px-1 py-0.5 rounded transition-all uppercase font-semibold text-[#2d3436]"
                                defaultValue={item.nama}
                                onBlur={async (e) => {
                                  const newNama = e.target.value.trim().toUpperCase();
                                  if (newNama && newNama !== item.nama) {
                                    try {
                                      await gradesHelper.updateGrade(user.id, item.id, { nama: newNama });
                                      const updatedGrades = grades.map((g) => g.id === item.id ? { ...g, nama: newNama } : g);
                                      setGrades(updatedGrades);
                                      showToast("Nama siswa berhasil diperbarui!", "success");
                                    } catch (err) {
                                      showToast("Gagal memperbarui nama: " + err.message, "error");
                                    }
                                  }
                                }}
                              />
                            </td>

                            {/* Simple Template cells */}
                            {template === "simple" && (
                              <>
                                <td className="py-3 px-2 text-center text-[#4a5568]">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-12 bg-transparent text-center border-b border-transparent hover:border-[#babecc]/60 focus:border-[#3b82f6] outline-none rounded py-0.5 text-xs text-[#4a5568] focus:text-[#2d3436]"
                                    defaultValue={simpleVals.n1 !== undefined ? simpleVals.n1 : 0}
                                    onBlur={async (e) => {
                                      const newVal = parseInt(e.target.value) || 0;
                                      if (newVal !== simpleVals.n1) {
                                        const updatedNilai = {
                                          ...simpleVals,
                                          n1: newVal,
                                          jumlah: newVal + (simpleVals.n2 || 0) + (simpleVals.n3 || 0)
                                        };
                                        const updatedRata = parseFloat((updatedNilai.jumlah / 3).toFixed(1));
                                        try {
                                          await gradesHelper.updateGrade(user.id, item.id, {
                                            nilai: JSON.stringify(updatedNilai),
                                            rata: updatedRata
                                          });
                                          const updatedGrades = grades.map((g) => g.id === item.id ? { ...g, nilai: JSON.stringify(updatedNilai), rata: updatedRata } : g);
                                          setGrades(updatedGrades);
                                          showToast("Nilai 1 berhasil diperbarui!", "success");
                                        } catch (err) {
                                          showToast("Gagal memperbarui nilai: " + err.message, "error");
                                        }
                                      }
                                    }}
                                  />
                                </td>
                                <td className="py-3 px-2 text-center text-[#4a5568]">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-12 bg-transparent text-center border-b border-transparent hover:border-[#babecc]/60 focus:border-[#3b82f6] outline-none rounded py-0.5 text-xs text-[#4a5568] focus:text-[#2d3436]"
                                    defaultValue={simpleVals.n2 !== undefined ? simpleVals.n2 : 0}
                                    onBlur={async (e) => {
                                      const newVal = parseInt(e.target.value) || 0;
                                      if (newVal !== simpleVals.n2) {
                                        const updatedNilai = {
                                          ...simpleVals,
                                          n2: newVal,
                                          jumlah: (simpleVals.n1 || 0) + newVal + (simpleVals.n3 || 0)
                                        };
                                        const updatedRata = parseFloat((updatedNilai.jumlah / 3).toFixed(1));
                                        try {
                                          await gradesHelper.updateGrade(user.id, item.id, {
                                            nilai: JSON.stringify(updatedNilai),
                                            rata: updatedRata
                                          });
                                          const updatedGrades = grades.map((g) => g.id === item.id ? { ...g, nilai: JSON.stringify(updatedNilai), rata: updatedRata } : g);
                                          setGrades(updatedGrades);
                                          showToast("Nilai 2 berhasil diperbarui!", "success");
                                        } catch (err) {
                                          showToast("Gagal memperbarui nilai: " + err.message, "error");
                                        }
                                      }
                                    }}
                                  />
                                </td>
                                <td className="py-3 px-2 text-center text-[#4a5568]">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-12 bg-transparent text-center border-b border-transparent hover:border-[#babecc]/60 focus:border-[#3b82f6] outline-none rounded py-0.5 text-xs text-[#4a5568] focus:text-[#2d3436]"
                                    defaultValue={simpleVals.n3 !== undefined ? simpleVals.n3 : 0}
                                    onBlur={async (e) => {
                                      const newVal = parseInt(e.target.value) || 0;
                                      if (newVal !== simpleVals.n3) {
                                        const updatedNilai = {
                                          ...simpleVals,
                                          n3: newVal,
                                          jumlah: (simpleVals.n1 || 0) + (simpleVals.n2 || 0) + newVal
                                        };
                                        const updatedRata = parseFloat((updatedNilai.jumlah / 3).toFixed(1));
                                        try {
                                          await gradesHelper.updateGrade(user.id, item.id, {
                                            nilai: JSON.stringify(updatedNilai),
                                            rata: updatedRata
                                          });
                                          const updatedGrades = grades.map((g) => g.id === item.id ? { ...g, nilai: JSON.stringify(updatedNilai), rata: updatedRata } : g);
                                          setGrades(updatedGrades);
                                          showToast("Nilai 3 berhasil diperbarui!", "success");
                                        } catch (err) {
                                          showToast("Gagal memperbarui nilai: " + err.message, "error");
                                        }
                                      }
                                    }}
                                  />
                                </td>
                              </>
                            )}

                            {/* Rapor Template cells */}
                            {template === "rapor" && (
                              <>
                                <td className="py-3 px-2 text-center text-[#4a5568]">{raporVals.h1 || 0}</td>
                                <td className="py-3 px-2 text-center text-[#4a5568]">{raporVals.h2 || 0}</td>
                                <td className="py-3 px-2 text-center text-[#4a5568]">{raporVals.h3 || 0}</td>
                                <td className="py-3 px-2 text-center text-[#4a5568]">{raporVals.h4 || 0}</td>
                                <td className="py-3 px-2 text-center font-bold text-[#4a5568] bg-[#e0e5ec]/15">{raporVals.rtHarian || 0}</td>
                                <td className="py-3 px-2 text-center text-[#4a5568]">{raporVals.uts || 0}</td>
                                <td className="py-3 px-2 text-center text-[#4a5568]">{raporVals.uas || 0}</td>
                                <td className="py-3 px-2 text-center font-bold text-[#4a5568] bg-[#e0e5ec]/15">{raporVals.rtUjian || 0}</td>
                                <td className="py-3 px-2 text-right font-black text-[#3b82f6] pr-4 bg-blue-50/10">{item.rata}</td>
                                <td className={`py-3 px-4 text-left font-semibold text-[10px] max-w-[120px] truncate ${item.rata >= parseFloat(kkmVal) ? 'text-green-700' : 'text-red-500'}`} title={raporVals.deskripsi || "Kurang"}>
                                  {raporVals.deskripsi || "Kurang"} {item.rata < parseFloat(kkmVal) && "(Remedial)"}
                                </td>
                              </>
                            )}

                            {/* Mapel Template cells */}
                            {template === "mapel" && (
                              <>
                                <td className="py-3 px-2 text-center text-[#4a5568]">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-12 bg-transparent text-center border-b border-transparent hover:border-[#babecc]/60 focus:border-[#3b82f6] outline-none rounded py-0.5 text-xs text-[#4a5568] focus:text-[#2d3436]"
                                    defaultValue={mapelVals.n1 !== undefined ? mapelVals.n1 : 0}
                                    onBlur={async (e) => {
                                      const newVal = parseInt(e.target.value) || 0;
                                      if (newVal !== mapelVals.n1) {
                                        const updatedNilai = {
                                          ...mapelVals,
                                          n1: newVal,
                                          jumlah: newVal + (mapelVals.n2 || 0) + (mapelVals.n3 || 0)
                                        };
                                        const updatedRata = parseFloat((updatedNilai.jumlah / 3).toFixed(1));
                                        try {
                                          await gradesHelper.updateGrade(user.id, item.id, {
                                            nilai: JSON.stringify(updatedNilai),
                                            rata: updatedRata
                                          });
                                          const updatedGrades = grades.map((g) => g.id === item.id ? { ...g, nilai: JSON.stringify(updatedNilai), rata: updatedRata } : g);
                                          setGrades(updatedGrades);
                                          showToast("Nilai 1 berhasil diperbarui!", "success");
                                        } catch (err) {
                                          showToast("Gagal memperbarui nilai: " + err.message, "error");
                                        }
                                      }
                                    }}
                                  />
                                </td>
                                <td className="py-3 px-2 text-center text-[#4a5568]">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-12 bg-transparent text-center border-b border-transparent hover:border-[#babecc]/60 focus:border-[#3b82f6] outline-none rounded py-0.5 text-xs text-[#4a5568] focus:text-[#2d3436]"
                                    defaultValue={mapelVals.n2 !== undefined ? mapelVals.n2 : 0}
                                    onBlur={async (e) => {
                                      const newVal = parseInt(e.target.value) || 0;
                                      if (newVal !== mapelVals.n2) {
                                        const updatedNilai = {
                                          ...mapelVals,
                                          n2: newVal,
                                          jumlah: (mapelVals.n1 || 0) + newVal + (mapelVals.n3 || 0)
                                        };
                                        const updatedRata = parseFloat((updatedNilai.jumlah / 3).toFixed(1));
                                        try {
                                          await gradesHelper.updateGrade(user.id, item.id, {
                                            nilai: JSON.stringify(updatedNilai),
                                            rata: updatedRata
                                          });
                                          const updatedGrades = grades.map((g) => g.id === item.id ? { ...g, nilai: JSON.stringify(updatedNilai), rata: updatedRata } : g);
                                          setGrades(updatedGrades);
                                          showToast("Nilai 2 berhasil diperbarui!", "success");
                                        } catch (err) {
                                          showToast("Gagal memperbarui nilai: " + err.message, "error");
                                        }
                                      }
                                    }}
                                  />
                                </td>
                                <td className="py-3 px-2 text-center text-[#4a5568]">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-12 bg-transparent text-center border-b border-transparent hover:border-[#babecc]/60 focus:border-[#3b82f6] outline-none rounded py-0.5 text-xs text-[#4a5568] focus:text-[#2d3436]"
                                    defaultValue={mapelVals.n3 !== undefined ? mapelVals.n3 : 0}
                                    onBlur={async (e) => {
                                      const newVal = parseInt(e.target.value) || 0;
                                      if (newVal !== mapelVals.n3) {
                                        const updatedNilai = {
                                          ...mapelVals,
                                          n3: newVal,
                                          jumlah: (mapelVals.n1 || 0) + (mapelVals.n2 || 0) + newVal
                                        };
                                        const updatedRata = parseFloat((updatedNilai.jumlah / 3).toFixed(1));
                                        try {
                                          await gradesHelper.updateGrade(user.id, item.id, {
                                            nilai: JSON.stringify(updatedNilai),
                                            rata: updatedRata
                                          });
                                          const updatedGrades = grades.map((g) => g.id === item.id ? { ...g, nilai: JSON.stringify(updatedNilai), rata: updatedRata } : g);
                                          setGrades(updatedGrades);
                                          showToast("Nilai 3 berhasil diperbarui!", "success");
                                        } catch (err) {
                                          showToast("Gagal memperbarui nilai: " + err.message, "error");
                                        }
                                      }
                                    }}
                                  />
                                </td>
                                <td className="py-3 px-2 text-right font-bold text-[#4a5568] bg-[#e0e5ec]/15">{item.rata}</td>
                                <td className="py-3 px-2 text-right font-black text-[#2d3436] pr-4 bg-[#e0e5ec]/15">{mapelVals.jumlah || 0}</td>
                                <td className="py-3 px-2 text-center font-bold">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#d1d9e6]/40 text-[#4a5568] text-[10px] font-bold">
                                    {rank}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* Custom Template cells */}
                            {template === "kosong" && (
                              <>
                                {customColumns.map((col) => (
                                  <td key={col} className="py-3.5 px-4 text-right font-medium text-[#4a5568]">
                                    {customItemVals[col] !== undefined ? customItemVals[col] : 0}
                                  </td>
                                ))}
                                <td className="py-3.5 px-4 text-right font-bold text-sm text-[#3b82f6]">{item.rata}</td>
                              </>
                            )}

                            {/* Katalog Template cells */}
                            {template === "katalog" && (
                              <>
                                {katalogSubjects.map((subj) => {
                                  let subjVals = customItemVals[subj];
                                  if (typeof subjVals !== "object" || subjVals === null) {
                                    const oldVal = parseFloat(subjVals) || 0;
                                    subjVals = { n1: oldVal, n2: 0, n3: 0 };
                                  }
                                  return (
                                    <React.Fragment key={subj}>
                                      <td className="py-3 px-2 text-center text-[#4a5568] border-l border-[#babecc]/10">
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          className="w-10 bg-transparent text-center border-b border-transparent hover:border-[#babecc]/60 focus:border-[#3b82f6] outline-none rounded py-0.5 text-xs text-[#4a5568] focus:text-[#2d3436]"
                                          defaultValue={subjVals.n1 !== undefined ? subjVals.n1 : 0}
                                          onBlur={async (e) => {
                                            const newVal = parseInt(e.target.value) || 0;
                                            if (newVal !== subjVals.n1) {
                                              const updatedSubjVals = { ...subjVals, n1: newVal };
                                              const updatedNilai = {
                                                ...customItemVals,
                                                [subj]: updatedSubjVals
                                              };
                                              let totalSum = 0;
                                              katalogSubjects.forEach((s) => {
                                                let sVals = updatedNilai[s];
                                                if (typeof sVals !== "object" || sVals === null) {
                                                  sVals = { n1: parseFloat(sVals) || 0, n2: 0, n3: 0 };
                                                }
                                                totalSum += ((sVals.n1 || 0) + (sVals.n2 || 0) + (sVals.n3 || 0)) / 3;
                                              });
                                              const finalRata = katalogSubjects.length > 0 ? parseFloat((totalSum / katalogSubjects.length).toFixed(1)) : 0;
                                              try {
                                                await gradesHelper.updateGrade(user.id, item.id, {
                                                  nilai: JSON.stringify(updatedNilai),
                                                  rata: finalRata
                                                });
                                                const updatedGrades = grades.map((g) => g.id === item.id ? { ...g, nilai: JSON.stringify(updatedNilai), rata: finalRata } : g);
                                                setGrades(updatedGrades);
                                                showToast(`Nilai 1 ${subj} berhasil diperbarui!`, "success");
                                              } catch (err) {
                                                showToast("Gagal memperbarui nilai: " + err.message, "error");
                                              }
                                            }
                                          }}
                                        />
                                      </td>
                                      <td className="py-3 px-2 text-center text-[#4a5568]">
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          className="w-10 bg-transparent text-center border-b border-transparent hover:border-[#babecc]/60 focus:border-[#3b82f6] outline-none rounded py-0.5 text-xs text-[#4a5568] focus:text-[#2d3436]"
                                          defaultValue={subjVals.n2 !== undefined ? subjVals.n2 : 0}
                                          onBlur={async (e) => {
                                            const newVal = parseInt(e.target.value) || 0;
                                            if (newVal !== subjVals.n2) {
                                              const updatedSubjVals = { ...subjVals, n2: newVal };
                                              const updatedNilai = {
                                                ...customItemVals,
                                                [subj]: updatedSubjVals
                                              };
                                              let totalSum = 0;
                                              katalogSubjects.forEach((s) => {
                                                let sVals = updatedNilai[s];
                                                if (typeof sVals !== "object" || sVals === null) {
                                                  sVals = { n1: parseFloat(sVals) || 0, n2: 0, n3: 0 };
                                                }
                                                totalSum += ((sVals.n1 || 0) + (sVals.n2 || 0) + (sVals.n3 || 0)) / 3;
                                              });
                                              const finalRata = katalogSubjects.length > 0 ? parseFloat((totalSum / katalogSubjects.length).toFixed(1)) : 0;
                                              try {
                                                await gradesHelper.updateGrade(user.id, item.id, {
                                                  nilai: JSON.stringify(updatedNilai),
                                                  rata: finalRata
                                                });
                                                const updatedGrades = grades.map((g) => g.id === item.id ? { ...g, nilai: JSON.stringify(updatedNilai), rata: finalRata } : g);
                                                setGrades(updatedGrades);
                                                showToast(`Nilai 2 ${subj} berhasil diperbarui!`, "success");
                                              } catch (err) {
                                                showToast("Gagal memperbarui nilai: " + err.message, "error");
                                              }
                                            }
                                          }}
                                        />
                                      </td>
                                      <td className="py-3 px-2 text-center text-[#4a5568] border-r border-[#babecc]/10">
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          className="w-10 bg-transparent text-center border-b border-transparent hover:border-[#babecc]/60 focus:border-[#3b82f6] outline-none rounded py-0.5 text-xs text-[#4a5568] focus:text-[#2d3436]"
                                          defaultValue={subjVals.n3 !== undefined ? subjVals.n3 : 0}
                                          onBlur={async (e) => {
                                            const newVal = parseInt(e.target.value) || 0;
                                            if (newVal !== subjVals.n3) {
                                              const updatedSubjVals = { ...subjVals, n3: newVal };
                                              const updatedNilai = {
                                                ...customItemVals,
                                                [subj]: updatedSubjVals
                                              };
                                              let totalSum = 0;
                                              katalogSubjects.forEach((s) => {
                                                let sVals = updatedNilai[s];
                                                if (typeof sVals !== "object" || sVals === null) {
                                                  sVals = { n1: parseFloat(sVals) || 0, n2: 0, n3: 0 };
                                                }
                                                totalSum += ((sVals.n1 || 0) + (sVals.n2 || 0) + (sVals.n3 || 0)) / 3;
                                              });
                                              const finalRata = katalogSubjects.length > 0 ? parseFloat((totalSum / katalogSubjects.length).toFixed(1)) : 0;
                                              try {
                                                await gradesHelper.updateGrade(user.id, item.id, {
                                                  nilai: JSON.stringify(updatedNilai),
                                                  rata: finalRata
                                                });
                                                const updatedGrades = grades.map((g) => g.id === item.id ? { ...g, nilai: JSON.stringify(updatedNilai), rata: finalRata } : g);
                                                setGrades(updatedGrades);
                                                showToast(`Nilai 3 ${subj} berhasil diperbarui!`, "success");
                                              } catch (err) {
                                                showToast("Gagal memperbarui nilai: " + err.message, "error");
                                              }
                                            }
                                          }}
                                        />
                                      </td>
                                    </React.Fragment>
                                  );
                                })}
                                <td className="py-3 px-2 text-right font-bold text-[#4a5568] bg-[#e0e5ec]/15">{item.rata}</td>
                                <td className="py-3 px-2 text-right font-black text-[#2d3436] pr-4 bg-[#e0e5ec]/15">
                                  {(() => {
                                    let totalSum = 0;
                                    katalogSubjects.forEach((s) => {
                                      let sVals = customItemVals[s];
                                      if (typeof sVals !== "object" || sVals === null) {
                                        sVals = { n1: parseFloat(sVals) || 0, n2: 0, n3: 0 };
                                      }
                                      totalSum += ((sVals.n1 || 0) + (sVals.n2 || 0) + (sVals.n3 || 0)) / 3;
                                    });
                                    return parseFloat(totalSum.toFixed(1));
                                  })()}
                                </td>
                                <td className="py-3 px-2 text-center font-bold">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#d1d9e6]/40 text-[#4a5568] text-[10px] font-bold">
                                    {rank}
                                  </span>
                                </td>
                              </>
                            )}

                            {/* Action cell */}
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => handleDeleteStudent(item.id)}
                                className="p-1.5 rounded hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                                title="Hapus Siswa"
                              >
                                <Trash2 className="w-4 h-4 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 px-6 border border-dashed border-[#babecc]/80 rounded-xl bg-white/10">
                  <AlertCircle className="w-8 h-8 text-[#4a5568]/40 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#4a5568]">Belum ada data siswa terdaftar.</p>
                  <p className="text-xs text-[#4a5568]/60 mt-1">Masukkan data melalui form input di kiri atau scan lembar nilai kertas Anda.</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-[#babecc]/30 text-xs text-[#4a5568] font-medium flex flex-wrap justify-between gap-2">
              <span>SISTEM PENILAIAN OTOMATIS</span>
              <span>NILAIAAP v1.0.0</span>
            </div>
          </Card>
        </div>

      </div>

      {/* Tactile Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
          <Panel
            variant="raised"
            className="border border-[#babecc]/80 bg-[#f0f2f5] p-4 pr-10 shadow-floating flex items-center gap-3 max-w-sm"
            contentClassName="flex items-center gap-3 w-full"
          >
            <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${toast.type === "success" ? "led-green" : toast.type === "error" ? "led-red" : "led-yellow"
              }`} />
            <div>
              <span className="text-[9px] font-bold text-[#4a5568] block uppercase tracking-wider">
                {toast.type === "success" ? "BERHASIL" : toast.type === "error" ? "ERROR" : "PEMBERITAHUAN"}
              </span>
              <p className="text-xs font-semibold text-[#2d3436] mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="absolute top-2.5 right-2.5 text-md text-gray-400 hover:text-gray-600 font-bold px-1.5 focus:outline-none"
            >
              ×
            </button>
          </Panel>
        </div>
      )}
    </div>
  );
}
