require("dotenv").config(); // .env 파일에서 환경 변수 불러오기
const express = require("express");
const pool = require("./database/database"); // database.js에서 pool 불러오기
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // cookie-parser 추가
const authenticateToken = require("./middleware/authenticateToken"); // 인증 미들웨어 불러오기

const app = express();
const port = 8001;

app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 처리
app.use(bodyParser.json()); // JSON 요청을 처리하도록 body-parser 설정
app.use(cookieParser()); // cookie-parser 미들웨어 추가

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// 인증 미들웨어 추가 (토큰을 쿠키에서 가져오기)
app.use("/middleware-token", authenticateToken, (req, res) => {
  res.send("미들웨어 토큰 연결");
});

app.get("/car_info", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM car_info");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching data from PostgreSQL", err);
    res.status(500).send("Error fetching data");
  }
});

app.use(require("./routes/admin/adminRoutes"));
app.use(require("./routes/user/userRoutes"));
app.use(require("./routes/dealer/dealerRoutes"));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
