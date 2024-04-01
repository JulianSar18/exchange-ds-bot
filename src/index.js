import * as dotenv from "dotenv";
dotenv.config();
import Discord, { EmbedBuilder, GatewayIntentBits } from "discord.js";
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
import cron from "node-cron";
import { chromium } from "playwright";
let usd = "0";

export function start(){
  client.on("ready", () => {
    console.log("conectado")
  });
  client.on("messageCreate", async (message) => {
    cron.schedule(
      "35 15 * * 1-6", scrapping,
      { scheduled: true, timezone: "America/Bogota"}
    );
    if (!message.content.startsWith("$$") || message.author.bot) return;
    const args = message.content.slice(2).trim().split(" ");
    const command = args.shift().toLowerCase();
    if (command === `change`) {
      try {      
        const usdTRM = usd==0?await scrapping(): usd;
        const resultContent = (
          parseFloat(usdTRM.replace(/,/g, "")) * parseFloat(args[0].replace(/,/g, ""))
        ).toLocaleString("en-EN");      
        const exampleEmbed = new EmbedBuilder()
          .setColor(0x93c54b)
          .setTitle(`Conversión Realizada`)
          .setAuthor({
            name: "TRM-BOT",
            iconURL:
              "http://images3.memedroid.com/images/UPLOADED222/62ccc99499c9b.jpeg",
          })
          .setDescription(
            `Segun mis calculos **${args[0]}** USD son **${resultContent}** COP`
          )
          .setImage(
            "https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy-downsized.gif"
          );
        message.channel.send({
          content: `<@${message.author.id}>`,
          embeds: [exampleEmbed],
        });
      } catch (error) {
        console.log(error)
      }
    }
  });
}



async function scrapping () {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.superfinanciera.gov.co/CargaDriver/index.jsp"
  );

  const content = await page
    .locator("body > table > tbody > tr.filaPub4 > td:nth-child(3)")
    .textContent();
  let testmsg = client.channels.cache.get(process.env.CHANNEL);
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x93c54b)
    .setTitle("💵 💵 💵 💵 TRM 👀 👀 👀 👀")
    .setAuthor({
      name: "TRM-BOT",
      iconURL:
        "http://images3.memedroid.com/images/UPLOADED222/62ccc99499c9b.jpeg",
      url: "https://discord.js.org",
    })
    .setDescription(
      "@everyone Para mi es un placer informarles de las mejores fuentes lo siguiente:"
    )
    .setThumbnail(
      "https://pbs.twimg.com/media/Fe3Zl22WAAESPtl?format=jpg&name=small"
    )
    .addFields(
      {
        name: "TRM para el dia de HOY",
        value: `El TRM para **${
          year + "-" + month + "-" + date
        }** es de **${content}** COP`,
      },
      { name: "\u200B", value: "\u200B" }
    )
    .setImage(
      "https://gustavopetro.co/wp-content/uploads/2022/04/valla2-1.png"
    )
    .setTimestamp()
    .setFooter({
      text: "Con el auspicio de los cigarrillos que dan risa 🍁🍁🍁🍁🍁",
      iconURL:
        "http://images3.memedroid.com/images/UPLOADED222/62ccc99499c9b.jpeg",
    });
  testmsg.send({ embeds: [exampleEmbed] });
  usd = content;
  await browser.close();
  return usd;
};
client.login(process.env.DISCORD);

