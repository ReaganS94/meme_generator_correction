import { useState, useEffect, useRef } from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [memes, setMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState(97);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  async function getMemes() {
    try {
      const res = await fetch("https://api.imgflip.com/get_memes");
      const data = await res.json();
      // console.log(data.data.memes);
      setMemes(data.data.memes);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getMemes();
  }, []);

  const saveImage = () => {
    domtoimage.toBlob(document.getElementById("my-node")).then(function (blob) {
      window.saveAs(blob, "my-node.png");
    });
  };

  const nextMeme = () => {
    setCurrentMeme((prev) => {
      if (prev === memes.length - 1) {
        return 0;
      } else {
        return prev + 1;
      }
    });
    setTopText("");
    setBottomText("");
  };

  const prevMeme = () => {
    setCurrentMeme((prev) => {
      if (prev === 0) {
        return memes.length - 1;
      } else {
        return prev - 1;
      }
    });
    setTopText("");
    setBottomText("");
  };

  const reset = () => {
    setTopText("");
    setBottomText("");
    setUploadedImage(null);
  };

  return (
    <div className="App">
      <h1>Meme Generator</h1>
      <h2>{!uploadedImage && memes[currentMeme]?.name}</h2>
      <div className="container">
        {uploadedImage ? (
          <>
            <div id="my-node">
              <img
                className="picture"
                src={URL.createObjectURL(uploadedImage)}
                alt="not found"
              />
              <h3 className="text-top">{topText}</h3>
              <h3 className="text-bottom">{bottomText}</h3>
            </div>

            <br />
            <button onClick={() => setUploadedImage(null)}>
              delete uploaded image
            </button>
          </>
        ) : (
          <div id="my-node">
            <img
              className="picture"
              src={memes[currentMeme]?.url}
              alt={memes[currentMeme]?.name}
            />
            <h3 className="text-top">{topText}</h3>
            <h3 className="text-bottom">{bottomText}</h3>
          </div>
        )}
      </div>
      <br />
      <button onClick={prevMeme}>Prev</button>
      <button onClick={nextMeme}>Next</button>
      <br />
      <br />
      <input
        ref={topRef}
        type="text"
        value={topText}
        onChange={(e) => setTopText(e.target.value)}
        placeholder="top text"
      />
      <input
        ref={bottomRef}
        type="text"
        value={bottomText}
        onChange={(e) => setBottomText(e.target.value)}
        placeholder="bottom text"
      />
      <br />
      <br />
      <input
        ref={fileRef}
        type="file"
        onChange={(e) => setUploadedImage(e.target.files[0])}
      />

      <button onClick={saveImage}>Save meme</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}

export default App;
