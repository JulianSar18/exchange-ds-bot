import express from 'express';
import * as dotenv from "dotenv";
dotenv.config();
import Discord, { EmbedBuilder, GatewayIntentBits} from "discord.js";
const client = new Discord.Client({intents: [
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildBans,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
import cron from "node-cron";
import { chromium } from "playwright";
let usd = '0';
const app = express()
app.get('/', (req, res) => {
  res.send('CronJob Corriendo')
})
const port = process.env.PORT || 4000
client.on("ready", () => { 
  cron.schedule('25 5 * * 1-6', function () {    
    (async () => {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto(
        "https://www.superfinanciera.gov.co/inicio/informes-y-cifras/cifras/establecimientos-de-credito/informacion-periodica/diaria/tasa-de-cambio-representativa-del-mercado-trm-60819"
      );
      const frame = await page.frameLocator(
        "#form1 > div.pub > p:nth-child(1) > iframe"
      );
      const content = await frame
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
	.setColor(0x93C54B)
	.setTitle('💵 💵 💵 💵 TRM 👀 👀 👀 👀')
	.setAuthor({ name: 'TRM-BOT', iconURL: 'http://images3.memedroid.com/images/UPLOADED222/62ccc99499c9b.jpeg', url: 'https://discord.js.org' })
	.setDescription('@everyone Para mi es un placer informarles de las mejores fuentes lo siguiente:')
	.setThumbnail('https://pbs.twimg.com/media/Fe3Zl22WAAESPtl?format=jpg&name=small')
	.addFields(
		{ name: 'TRM para el dia de HOY', value: `El TRM para **${year + "-" + month + "-" + date}** es de **${content}** COP` },
		{ name: '\u200B', value: '\u200B' },
	)
	.setImage('https://gustavopetro.co/wp-content/uploads/2022/04/valla2-1.png')
	.setTimestamp()
	.setFooter({ text: "Con el auspicio de los cigarrillos que dan risa 🍁🍁🍁🍁🍁", iconURL: 'http://images3.memedroid.com/images/UPLOADED222/62ccc99499c9b.jpeg' });
      testmsg.send({embeds:[exampleEmbed]});
      await browser.close();
      usd = content
    })();
  });
});
client.on('messageCreate', async (message)=> { 
  if (!message.content.startsWith('$$') || message.author.bot) return;
  const args = message.content.slice(2).trim().split(' ');
  const command = args.shift().toLowerCase();
        if (command === `change`) {                
          const usdTRM = usd
          const resultContent = ((parseFloat(usdTRM.replace(/,/g, ''))) * args[0]).toLocaleString('en-EN');
          const exampleEmbed = new EmbedBuilder()
          .setColor(0x93C54B)
          .setTitle(`Conversión Realizada`)
          .setAuthor({ name: 'TRM-BOT', iconURL: 'http://images3.memedroid.com/images/UPLOADED222/62ccc99499c9b.jpeg'})
          .setDescription(`Segun mis calculos **${args[0]}** USD son **${resultContent}** COP`)
          .setImage('https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy-downsized.gif')
          message.channel.send({content:`<@${message.author.id}>`, embeds:[exampleEmbed]});
        }
})
client.login(process.env.DISCORD);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})