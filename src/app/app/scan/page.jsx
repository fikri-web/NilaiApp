"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Camera, 
  ArrowLeft, 
  Upload, 
  Check, 
  Trash2, 
  Sparkles,
  Info
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Panel from "@/components/ui/Panel";
import { authHelper } from "@/lib/auth";
import { gradesHelper } from "@/lib/grades";
import Tesseract from "tesseract.js";

export default function OcrScanPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [template, setTemplate] = useState("simple");
  const [customColumns, setCustomColumns] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => curr?.message === message ? null : curr);
    }, 4500);
  };

  useEffect(() => {
    authHelper.getSessionUser().then((sessionUser) => {
      if (!sessionUser) {
        router.push("/login");
      } else {
        setUser(sessionUser);
        
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const temp = params.get("template") || localStorage.getItem("nilai_selected_template") || "simple";
          setTemplate(temp);

          const savedCustomCols = localStorage.getItem("nilai_custom_columns");
          if (savedCustomCols) {
            try {
              setCustomColumns(JSON.parse(savedCustomCols));
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    });
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setRawText("");
      setParsedData([]);
    }
  };

  const handleProcessOcr = async () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);
    setStatusText("Menginisialisasi modul OCR...");

    try {
      const result = await Tesseract.recognize(
        image,
        "eng+ind",
        {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
              setStatusText(`Membaca Karakter: ${Math.round(m.progress * 100)}%`);
            } else {
              setStatusText(
                m.status === "loading tesseract api" 
                  ? "Memuat engine kecerdasan buatan..." 
                  : "Mempersiapkan pemindai..."
              );
            }
          },
        }
      );

      const text = result.data.text;
      setRawText(text);
      parseTextToGrades(text);
    } catch (err) {
      showToast("Gagal membaca teks dari gambar: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const parseTextToGrades = (text) => {
    const lines = text.split(/\r?\n|\r/);
    const parsed = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const words = trimmed.split(/\s+/);
      
      // Filter out trailing noise tokens (like dashes, asterisks, brackets, etc.)
      while (words.length > 0) {
        const lastWord = words[words.length - 1].trim();
        if (/^[^a-zA-Z0-9]+$/.test(lastWord) || lastWord === "") {
          words.pop();
        } else {
          break;
        }
      }

      const numericTokens = [];
      let nameWords = [];

      let i = words.length - 1;
      while (i >= 0) {
        const word = words[i];
        // Clean up punctuation around the word
        let cleanWord = word.replace(/[.,;:|/\\[\]()'\"]+$/, "").replace(/^[.,;:|/\\[\]()'\"]+/, "");
        
        // Repair common OCR digit/letter typos if the word is mostly numeric-like
        if (/^[0-9OiIlSsBb]+$/.test(cleanWord) && cleanWord.length > 0) {
          cleanWord = cleanWord
            .replace(/[Oo]/g, "0")
            .replace(/[Ii|l]/g, "1")
            .replace(/[Ss]/g, "5")
            .replace(/[Bb]/g, "8");
        }

        if (/^\d+(\.\d+)?$/.test(cleanWord)) {
          numericTokens.unshift(parseFloat(cleanWord));
          i--;
        } else {
          break;
        }
      }

      if (numericTokens.length === 0) return;

      nameWords = words.slice(0, i + 1);
      
      // Remove leading list numbers like "1.", "2)", "3-"
      if (nameWords.length > 0 && /^\d+[.)\-]?$/.test(nameWords[0])) {
        nameWords.shift();
      }

      const name = nameWords.join(" ").replace(/[:\-=\s]+$/, "").trim().toUpperCase();

      if (name) {
        const id = Math.random().toString();
        const itemValues = {};

        if (template === "simple") {
          itemValues.nilai = numericTokens[0] !== undefined ? numericTokens[0] : 0;
        } else if (template === "rapor") {
          itemValues.h1 = numericTokens[0] !== undefined ? numericTokens[0] : 0;
          itemValues.h2 = numericTokens[1] !== undefined ? numericTokens[1] : 0;
          itemValues.h3 = numericTokens[2] !== undefined ? numericTokens[2] : 0;
          itemValues.h4 = numericTokens[3] !== undefined ? numericTokens[3] : 0;
          itemValues.uts = numericTokens[4] !== undefined ? numericTokens[4] : 0;
          itemValues.uas = numericTokens[5] !== undefined ? numericTokens[5] : 0;
        } else if (template === "mapel") {
          itemValues.n1 = numericTokens[0] !== undefined ? numericTokens[0] : 0;
          itemValues.n2 = numericTokens[1] !== undefined ? numericTokens[1] : 0;
          itemValues.n3 = numericTokens[2] !== undefined ? numericTokens[2] : 0;
        } else if (template === "kosong") {
          customColumns.forEach((col, idx) => {
            itemValues[col] = numericTokens[idx] !== undefined ? numericTokens[idx] : 0;
          });
        }

        parsed.push({ id, name, values: itemValues });
      }
    });

    setParsedData(parsed);
  };

  const handleEditParsedName = (id, newName) => {
    setParsedData(parsedData.map((item) => item.id === id ? { ...item, name: newName } : item));
  };

  const handleEditParsedValue = (id, fieldName, newVal) => {
    setParsedData(parsedData.map((item) => 
      item.id === id 
        ? { 
            ...item, 
            values: { 
              ...item.values, 
              [fieldName]: parseFloat(newVal) || 0 
            } 
          } 
        : item
    ));
  };

  const handleDeleteRow = (id) => {
    setParsedData(parsedData.filter((item) => item.id !== id));
  };

  const handleSaveToDatabase = async () => {
    if (parsedData.length === 0) return;
    
    try {
      for (const item of parsedData) {
        let gradeEntry = {
          nama: item.name,
          template_type: template,
        };

        if (template === "simple") {
          const val = item.values.nilai || 0;
          gradeEntry.nilai = val;
          gradeEntry.rata = val;
        } else if (template === "rapor") {
          const h1 = item.values.h1 || 0;
          const h2 = item.values.h2 || 0;
          const h3 = item.values.h3 || 0;
          const h4 = item.values.h4 || 0;
          const utsVal = item.values.uts || 0;
          const uasVal = item.values.uas || 0;
          
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
          const val1 = item.values.n1 || 0;
          const val2 = item.values.n2 || 0;
          const val3 = item.values.n3 || 0;
          
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
        } else {
          const valuesArray = Object.values(item.values).map((v) => parseFloat(v) || 0);
          const sum = valuesArray.reduce((acc, curr) => acc + curr, 0);
          const avg = valuesArray.length > 0 ? parseFloat((sum / valuesArray.length).toFixed(1)) : 0;
          
          gradeEntry.nilai = JSON.stringify(item.values);
          gradeEntry.rata = avg;
        }

        await gradesHelper.addGrade(user.id, gradeEntry);
      }
      localStorage.setItem("nilai_toast_message", `Berhasil menyimpan ${parsedData.length} data nilai siswa!`);
      localStorage.setItem("nilai_toast_type", "success");
      router.push("/app");
    } catch (err) {
      showToast("Gagal menyimpan data: " + err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] flex flex-col font-sans p-6">
      
      {/* Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center gap-4 border-b border-[#babecc]/50 pb-6 mb-8">
        <Link href="/app">
          <Button variant="secondary" className="px-3.5 py-2 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#4a5568] uppercase">DIGITALISASI PENILAIAN</span>
          <h1 className="text-xl md:text-2xl font-black text-[#2d3436] uppercase">Scan Nilai Kertas (OCR)</h1>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
        
        {/* Left Upload (cols 1) */}
        <div className="flex flex-col gap-6 w-full">
          <Panel variant="raised" className="bg-[#f0f2f5] p-6" contentClassName="flex flex-col gap-5 w-full">
            <h2 className="font-extrabold text-sm uppercase text-[#2d3436] border-b border-[#babecc]/40 pb-2">
              1. Pilih Foto Catatan
            </h2>

            {/* Drop Zone Box */}
            <div className="relative border-2 border-dashed border-[#babecc] rounded-xl p-8 text-center bg-[#d1d9e6]/10 hover:bg-[#d1d9e6]/20 transition-colors flex flex-col items-center justify-center min-h-48 cursor-pointer overflow-hidden group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              />
              
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Review" 
                  className="max-h-64 object-contain rounded-lg border border-[#babecc] shadow-md relative z-0" 
                />
              ) : (
                <div className="flex flex-col items-center gap-3 relative z-0">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-white/60 shadow-card">
                    <Upload className="w-6 h-6 text-[#3b82f6]" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#2d3436] block">Pilih / Seret Foto Gambar</span>
                    <span className="text-[10px] text-[#4a5568] block mt-0.5">Mendukung JPEG, PNG, WEBP</span>
                  </div>
                </div>
              )}
            </div>

            {/* OCR Execution Button */}
            {image && (
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#4a5568]">
                      <span>{statusText}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-4 rounded-full bg-[#d1d9e6]/30 border border-[#babecc]/50 shadow-inner overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                      <span className="absolute inset-0 rounded-full border border-t-[#babecc]/50 border-l-[#babecc]/30 pointer-events-none" />
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="accent" 
                    onClick={handleProcessOcr} 
                    className="w-full py-3.5 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Mulai Scan Gambar
                  </Button>
                )}
              </div>
            )}
          </Panel>

          {/* Guide Panel */}
          <Panel variant="sunken" className="bg-[#e0e5ec]/40 p-4 text-xs text-[#4a5568]" contentClassName="flex gap-3 w-full">
            <Info className="w-5 h-5 text-[#3b82f6] shrink-0" />
            <div>
              <span className="font-bold block uppercase mb-1">Panduan Format Tulis Tangan</span>
              <p className="leading-relaxed">
                Tulis nama siswa diikuti dengan nilai-nilainya secara berurutan sesuai kolom template yang aktif, dipisahkan spasi.
              </p>
              <div className="bg-[#f0f2f5] p-2.5 rounded-lg border border-[#babecc]/40 mt-2 font-mono text-[10px] space-y-1.5 text-[#2d3436]">
                <div className="font-bold text-[#3b82f6] uppercase border-b border-[#babecc]/30 pb-0.5 mb-1">
                  Format Aktif: Template {template === "simple" ? "Sederhana" : template === "rapor" ? "Rapor" : template === "mapel" ? "Mapel" : "Kustom"}
                </div>
                {template === "simple" && (
                  <>
                    <div>Format: [Nama] [Nilai]</div>
                    <div className="text-gray-500 italic">Contoh: ABDI SANJAYA 85</div>
                  </>
                )}
                {template === "rapor" && (
                  <>
                    <div>Format: [Nama] [H1] [H2] [H3] [H4] [UTS] [UAS]</div>
                    <div className="text-gray-500 italic">Contoh: ABDI SANJAYA 80 85 78 82 85 88</div>
                  </>
                )}
                {template === "mapel" && (
                  <>
                    <div>Format: [Nama] [N1] [N2] [N3]</div>
                    <div className="text-gray-500 italic">Contoh: ABDI SANJAYA 85 90 80</div>
                  </>
                )}
                {template === "kosong" && (
                  <>
                    <div>Format: [Nama] {customColumns.map(col => `[${col}]`).join(" ")}</div>
                    <div className="text-gray-500 italic">
                      Contoh: ABDI SANJAYA {customColumns.map((_, idx) => 80 + idx).join(" ")}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Output Table (cols 1) */}
        <div className="flex flex-col gap-6 w-full">
          <Card liftOnHover={false} className="bg-[#f0f2f5] border border-[#babecc]/50 h-full flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#babecc]/40 pb-4">
                <h2 className="font-extrabold text-sm uppercase text-[#2d3436]">
                  2. Hasil Ekstraksi & Edit
                </h2>
                
                {parsedData.length > 0 && (
                  <span className="text-xs font-mono font-bold text-[#4a5568] px-2 py-1 bg-background border border-[#babecc]/40 shadow-inner rounded">
                    TERDETEKSI: {parsedData.length}
                  </span>
                )}
              </div>

              {parsedData.length > 0 ? (
                <div className="space-y-4">
                  
                  {/* Preview Table */}
                  <div className="overflow-x-auto rounded-lg border border-[#babecc]/60 bg-white/40 shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead>
                        <tr className="border-b border-[#babecc]/50 bg-[#f0f2f5] text-[10px] font-bold uppercase text-[#4a5568] tracking-wider select-none">
                          <th className="py-2.5 px-4">Nama Siswa</th>
                          {template === "simple" && (
                            <th className="py-2.5 px-4 text-center w-24">Nilai</th>
                          )}
                          {template === "rapor" && (
                            <>
                              <th className="py-2.5 px-2 text-center w-12">H1</th>
                              <th className="py-2.5 px-2 text-center w-12">H2</th>
                              <th className="py-2.5 px-2 text-center w-12">H3</th>
                              <th className="py-2.5 px-2 text-center w-12">H4</th>
                              <th className="py-2.5 px-2 text-center w-12">UTS</th>
                              <th className="py-2.5 px-2 text-center w-12">UAS</th>
                            </>
                          )}
                          {template === "mapel" && (
                            <>
                              <th className="py-2.5 px-2 text-center w-14">N1</th>
                              <th className="py-2.5 px-2 text-center w-14">N2</th>
                              <th className="py-2.5 px-2 text-center w-14">N3</th>
                            </>
                          )}
                          {template === "kosong" && customColumns.map((col) => (
                            <th key={col} className="py-2.5 px-2 text-center w-14">{col}</th>
                          ))}
                          <th className="py-2.5 px-4 text-center w-16">Hapus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.map((item) => (
                          <tr key={item.id} className="border-b border-[#babecc]/20 text-xs text-[#2d3436]">
                            <td className="py-2 px-3">
                              <input 
                                type="text"
                                value={item.name}
                                onChange={(e) => handleEditParsedName(item.id, e.target.value)}
                                className="w-full px-2 py-1 bg-transparent hover:bg-white/50 focus:bg-white border border-transparent focus:border-[#3b82f6]/30 focus:ring-1 focus:ring-[#3b82f6]/30 focus:shadow-inner rounded outline-none font-bold uppercase"
                              />
                            </td>
                            {template === "simple" && (
                              <td className="py-2 px-3 text-center">
                                <input 
                                  type="number"
                                  value={item.values.nilai}
                                  onChange={(e) => handleEditParsedValue(item.id, "nilai", e.target.value)}
                                  className="w-16 px-2 py-1 bg-transparent hover:bg-white/50 focus:bg-white border border-transparent focus:border-[#3b82f6]/30 focus:ring-1 focus:ring-[#3b82f6]/30 focus:shadow-inner rounded outline-none text-center font-bold text-[#3b82f6]"
                                />
                              </td>
                            )}
                            {template === "rapor" && (
                              <>
                                {["h1", "h2", "h3", "h4", "uts", "uas"].map((fld) => (
                                  <td key={fld} className="py-2 px-1 text-center">
                                    <input 
                                      type="number"
                                      value={item.values[fld]}
                                      onChange={(e) => handleEditParsedValue(item.id, fld, e.target.value)}
                                      className="w-12 px-1 py-1 bg-transparent hover:bg-white/50 focus:bg-white border border-transparent focus:border-[#3b82f6]/30 focus:ring-1 focus:ring-[#3b82f6]/30 focus:shadow-inner rounded outline-none text-center font-bold text-[#3b82f6]"
                                    />
                                  </td>
                                ))}
                              </>
                            )}
                            {template === "mapel" && (
                              <>
                                {["n1", "n2", "n3"].map((fld) => (
                                  <td key={fld} className="py-2 px-1 text-center">
                                    <input 
                                      type="number"
                                      value={item.values[fld]}
                                      onChange={(e) => handleEditParsedValue(item.id, fld, e.target.value)}
                                      className="w-14 px-1 py-1 bg-transparent hover:bg-white/50 focus:bg-white border border-transparent focus:border-[#3b82f6]/30 focus:ring-1 focus:ring-[#3b82f6]/30 focus:shadow-inner rounded outline-none text-center font-bold text-[#3b82f6]"
                                    />
                                  </td>
                                ))}
                              </>
                            )}
                            {template === "kosong" && customColumns.map((col) => (
                              <td key={col} className="py-2 px-1 text-center">
                                <input 
                                  type="number"
                                  value={item.values[col] || 0}
                                  onChange={(e) => handleEditParsedValue(item.id, col, e.target.value)}
                                  className="w-14 px-1 py-1 bg-transparent hover:bg-white/50 focus:bg-white border border-transparent focus:border-[#3b82f6]/30 focus:ring-1 focus:ring-[#3b82f6]/30 focus:shadow-inner rounded outline-none text-center font-bold text-[#3b82f6]"
                                />
                              </td>
                            ))}
                            <td className="py-2 px-3 text-center">
                              <button 
                                onClick={() => handleDeleteRow(item.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-4 h-4 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Button 
                    variant="accent" 
                    onClick={handleSaveToDatabase}
                    className="w-full py-3.5 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Simpan Nilai ke Lembar Utama
                  </Button>
                </div>
              ) : (
                <div className="text-center py-16 px-6 border border-dashed border-[#babecc]/80 rounded-xl bg-white/10 select-none">
                  <Camera className="w-8 h-8 text-[#4a5568]/30 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[#4a5568]">Belum ada hasil pemindaian.</p>
                  <p className="text-xs text-[#4a5568]/60 mt-1">Pilih gambar catatan nilai di kolom kiri lalu tekan "Mulai Scan Gambar".</p>
                </div>
              )}

              {rawText && (
                <div className="pt-4 border-t border-[#babecc]/40 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[#4a5568]">Hasil Scan Mentah Teks:</span>
                  <pre className="p-3 bg-[#e0e5ec] rounded-lg border border-[#babecc]/40 font-mono text-[10px] leading-tight text-[#2d3436] overflow-x-auto whitespace-pre-wrap max-h-36">
                    {rawText}
                  </pre>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t border-[#babecc]/30 text-xs text-[#4a5568] font-medium flex justify-between">
              <span>SCANNER ENGINE: TESSERACT.JS</span>
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
            <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${
              toast.type === "success" ? "led-green" : toast.type === "error" ? "led-red" : "led-yellow"
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
