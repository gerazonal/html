// server.js
// npm i express cors node-fetch
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.static(".")); // index.html 같은 정적 파일 서빙용

const SERVICE_KEY = process.env.SERVICE_KEY || "4d95e6487613dd61cdbf4aca7879a923109ade5a0f092666c68c1c19563c99ed";
const API_BASE = "https://apis.data.go.kr/1471000/DayMaxDosgQyByIngdService/getDayMaxDosgQyByIngdInq";

app.get("/api/daymax", async (req, res) => {
  try {
    const name = String(req.query.name || "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });

    const url = new URL(API_BASE);
    url.searchParams.set("serviceKey", SERVICE_KEY);
    url.searchParams.set("type", "json");
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("numOfRows", "30");
    url.searchParams.set("INGD_NM", name);

    const r = await fetch(url.toString());
    const text = await r.text();

    // 응답이 JSON인데도 text로 오는 케이스가 있어 그대로 전달 후 프론트에서 json() 처리 가능
    res.status(r.status).type("application/json").send(text);
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

app.listen(5173, () => {
  console.log("✅ http://localhost:5173");
  console.log("프론트 index.html에서 USE_PROXY=true로 바꾸면 /api/daymax 사용");
});
