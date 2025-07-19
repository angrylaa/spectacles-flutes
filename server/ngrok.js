import ngrok from "ngrok";

async function startNgrok() {
  try {
    await ngrok.connect({ authtoken: process.env.NGROK_AUTH_TOKEN });
    console.log("Ngrok connected successfully");
    const url = await ngrok.connect({
      addr: 3000,
    });
    console.log("Ngrok URL:", url);
  } catch (error) {
    console.error("Error starting Ngrok:", error);
  }
}

startNgrok();
