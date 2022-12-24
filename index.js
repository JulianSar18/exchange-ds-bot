import * as dotenv from "dotenv";
dotenv.config();
import Discord, { EmbedBuilder } from "discord.js";
const client = new Discord.Client({ intents: 32727 });
//import {jobStart} from './cronjob.js';
import cron from "node-cron";
import { chromium } from "playwright";

client.on("ready", () => {
  console.log("Estoy listo!");
  //testmsg.send('test');
  cron.schedule("0 8 * * *", function () {
    console.log("running a task every minute");
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
      console.log(content);
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
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'TRM-BOT', iconURL: 'http://images3.memedroid.com/images/UPLOADED222/62ccc99499c9b.jpeg', url: 'https://discord.js.org' })
	.setDescription('@everyone Tengo el gusto de informar la TRM para el dia de HOY')
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
    })();
  });
});
client.login(process.env.DISCORD);
