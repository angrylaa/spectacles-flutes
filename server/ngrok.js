import "dotenv/config";
import ngrok from "ngrok";

async function startNgrok() {
  try {
    console.log(process.env.NGROK_AUTH_TOKEN);
    const url = await ngrok.connect({
      authtoken: process.env.NGROK_AUTH_TOKEN,
      addr: 3000,
    });

    console.log("Ngrok URL:", url);
  } catch (error) {
    console.error("Error starting Ngrok:", error);
  }
}

startNgrok();
