import Express from "express";
import fs from "fs";
const app = Express();

// ======================================================
const getVideo = (req, res) => {
  try {
    const path =
      "./2 min COUNTDOWN TIMER ( v 638 ) TIMER with sound  music 4k-G0lYgEuHrgc.mp4";
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };
      console.log("sent chunk: ", chunkSize);
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      console.log(fileSize);
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
      res.end();
    }
  } catch (error) {
    console.log(error);
    res.json({ message: `Error happened` });
    res.end();
  }
};
// ======================================================
app.get("/", (req, res) => {
  res.json({
    message: "Testing node server! it is working fine bro :)",
  });
});

app.get("/video", getVideo);
app.listen(8000, () => {
  console.log("Running on port 8000");
});
